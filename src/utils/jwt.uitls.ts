import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import 'dotenv/config';
import { LoggerUtils } from './logger.utils'; // Ensure this import is correct.

interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export default class JwtUtils {
    static sign(payload: JwtPayload, options?: SignOptions): string {
        const secretKey = process.env.JWT_SECRET_KEY || '';
        const expiresIn = process.env.JWT_EXPIRES_IN || '1d'; // Default expiration set to 1 day

        if (!secretKey) {
            LoggerUtils.error('JWT_SECRET_KEY is not defined'); // Log error message
            process.exit(1); // Exit process with a failure code
        }

        return jwt.sign(payload, secretKey, { expiresIn, ...options });
    }

    static verify(token: string): JwtPayload {
        const secretKey = process.env.JWT_SECRET_KEY || '';

        if (!secretKey) {
            LoggerUtils.error('JWT_SECRET_KEY is not defined'); // Log error message
            throw new Error('JWT_SECRET_KEY is not defined');
        }

        try {
            return jwt.verify(token, secretKey) as JwtPayload;
        } catch (error) {
            LoggerUtils.error('JWT verification failed!'); // Log error message and error object
            throw error;
        }
    }
}
