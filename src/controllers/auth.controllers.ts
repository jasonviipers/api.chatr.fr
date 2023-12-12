import { NextFunction, Request, Response } from 'express';
import * as crypto from 'crypto';
import { HashServices } from '../services/hash.services';
import JwtUtils from '../utils/jwt.uitls';
import { LoggerUtils } from '../utils/logger.utils';
import { forgotPasswordSchema, loginSchema, passwordLessLoginSchema, registerSchema } from '../utils/validate.utils';
import MailerUtils from '../utils/mailer.utils';
import { HttpStatusCodes } from '../utils/httpStatusCodes.utils';
import UserService from '../repositories/user.services';

export default class AuthController {
    protected request: Request;
    protected response: Response;
    protected next: NextFunction;
    protected userService: UserService;
    protected mailerService: MailerUtils;

    constructor(request: Request, response: Response, next: NextFunction) {
        this.request = request;
        this.response = response;
        this.next = next;
        this.userService = new UserService();
        this.mailerService = new MailerUtils();
    }

    private async handleErrors(methodName: string, error: Error): Promise<Response> {
        LoggerUtils.error(`Error during ${methodName}: ${error.message}`);
        return this.response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: `An error occurred during ${methodName}.`,
        });
    }

    async register() {
        try {
            // Validate user input
            const validateData = registerSchema.parse(this.request.body);

            // Check if the user already exists
            const existingUser = await this.userService.getUserByEmail(validateData.email);
            if (existingUser) {
                return this.response
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .json({ message: 'User with this email already exists.' });
            }

            // Hash the password
            const hashService = new HashServices(validateData.password);
            const hashedPassword = await hashService.hash();

            // Generate token for email verification
            const code = crypto.randomBytes(10).toString('hex');
            const verifyToken = crypto.createHash('sha256').update(code).digest('hex');
            const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

            // Create the user
            const { confirmPassword, ...userData } = validateData;
            const user = await this.userService.createUser({
                ...userData,
                password: hashedPassword,
                verifyToken,
                verifyExpires: expiresIn,
            });

            // Send verification email
            await this.mailerService.sendEmailVerification(user.email, verifyToken);

            // Send response
            return this.response.status(HttpStatusCodes.OK).json({ message: 'User registered successfully.' });
        } catch (error) {
            return this.handleErrors('registration', error as Error);
        }
    }

    async login() {
        try {
            // Validate user input
            const validateData = loginSchema.parse(this.request.body);

            // Retrieve the user from the database
            const user = await this.userService.getUserByEmail(validateData.email);
            if (!user) {
                return this.response
                    .status(HttpStatusCodes.UNAUTHORIZED)
                    .json({ message: 'Invalid email or password.' });
            }

            // Check the password
            const hashService = new HashServices(validateData.password);
            if (!hashService.compare(user.password)) {
                return this.response
                    .status(HttpStatusCodes.UNAUTHORIZED)
                    .json({ message: 'Invalid email or password.' });
            }

            // check if the user is verified
            if (!user.verified) {
                return this.response
                    .status(HttpStatusCodes.UNAUTHORIZED)
                    .json({ message: 'Please verify your email.' });
            }

            // Generate access token
            const token = JwtUtils.sign({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });

            // Send response
            return this.response.status(HttpStatusCodes.OK).json({ message: 'User logged in successfully.', token });
        } catch (error) {
            return this.handleErrors('login', error as Error);
        }
    }

    async verifyEmail() {
        try {
            // Get the token from the request
            const token = this.request.params.verifyToken;

            // Validate token
            if (!token) {
                return this.response
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .json({ message: 'Verification token is required.' });
            }

            // Retrieve the user by token
            const user = await this.userService.getUserByVerifyToken({ verifyToken: token });

            if (!user) {
                return this.response.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Invalid token.' });
            }

            // Update user verification status
            const updatedUser = await this.userService.updateUser({ id: user.id }, { verified: true });

            if (!updatedUser) {
                return this.response
                    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: 'An error occurred during email verification.' });
            }

            // Send welcome email
            await this.mailerService.sendWelcomeEmail(user.email, user.name);

            // Send response
            return this.response.status(HttpStatusCodes.OK).json({ message: 'Email verified successfully.' });
        } catch (error) {
            return this.handleErrors('email verification', error as Error);
        }
    }

    async resendEmailVerification() {
        try {
            // Get the email from the request
            const email = this.request.body.email;

            // Retrieve the user from the database
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                return this.response
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .json({ message: 'User with this email does not exist.' });
            }

            // Send welcome email
            await this.mailerService.sendEmailVerification(user.email, user.name);

            // Send response
            return this.response.status(HttpStatusCodes.OK).json({ message: 'Email sent successfully.' });
        } catch (error) {
            return this.handleErrors('email verification', error as Error);
        }
    }

    async forgotPassword() {
        try {
            //Validate user input
            const validateData = forgotPasswordSchema.parse(this.request.body);

            // Retrieve the user from the database
            const user = await this.userService.getUserByEmail(validateData.email);
            if (!user) {
                return this.response
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .json({ message: 'User with this email does not exist.' });
            }

            // Generate token for password reset
            const code = crypto.randomBytes(10).toString('hex');
            const resetToken = crypto.createHash('sha256').update(code).digest('hex');

            // Update user reset token
            const updatedUser = await this.userService.updateUser({ id: user.id }, { resetToken });

            if (!updatedUser) {
                return this.response
                    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: 'An error occurred during password reset.' });
            }

            // Send password reset email
            await this.mailerService.sendPasswordResetEmail(user.email, resetToken);

            // Send response
            return this.response.status(HttpStatusCodes.OK).json({ message: 'Email sent successfully.' });
        } catch (error) {
            return this.handleErrors('forgot password', error as Error);
        }
    }

    async resetPassword() {
        try {
            // Get the token from the request
            const token = this.request.params.resetToken;

            // Validate token
            if (!token) {
                return this.response.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Reset token is required.' });
            }

            // Retrieve the user by token
            const user = await this.userService.getUserByResetToken({ resetToken: token });

            if (!user) {
                return this.response.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Invalid token.' });
            }

            // Hash the password
            const hashService = new HashServices(this.request.body.password);
            const hashedPassword = await hashService.hash();

            // Update user password
            const updatedUser = await this.userService.updateUser({ id: user.id }, { password: hashedPassword });

            if (!updatedUser) {
                return this.response
                    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: 'An error occurred during password reset.' });
            }

            // Send password change notification
            await this.mailerService.sendPasswordChangeNotification(user.email);

            // Send response
            return this.response.status(HttpStatusCodes.OK).json({ message: 'Password reset successfully.' });
        } catch (error) {
            return this.handleErrors('password reset', error as Error);
        }
    }

    //    passwordLess authentication
    async passwordLessLogin() {
        try {
            // Validate user input
            const validateData = passwordLessLoginSchema.parse(this.request.body);

            // Retrieve the user from the database
            const user = await this.userService.getUserByEmail(validateData.email);
            if (!user) {
                return this.response
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .json({ message: 'User with this email does not exist.' });
            }

            // Generate token for passwordless login
            const code = crypto.randomBytes(10).toString('hex');
            const resetToken = crypto.createHash('sha256').update(code).digest('hex');
            const expiresIn = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes

            // Update user reset token
            const updatedUser = await this.userService.updateUserToken(user.id, {
                resetToken,
                resetExpires: expiresIn,
            });

            if(!updatedUser) {
                return this.response
                    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: 'An error occurred during passwordless login.' });
            }

            // Send login link (or code) via email
            await this.mailerService.sendPasswordlessLoginLink(user.email, resetToken);

            // Send response
            return this.response.status(HttpStatusCodes.OK).json({ message: 'Email sent successfully.' });
        } catch (error) {
            return this.handleErrors('passwordlessLogin', error as Error);
        }
    }
}
