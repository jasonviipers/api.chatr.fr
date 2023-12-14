import { Request, Response, NextFunction } from 'express';
import { LoggerUtils } from '../utils/logger.utils';
import JwtUtils, { JwtPayload } from '../utils/jwt.uitls';

export default class AuthMiddleware {
    static authenticate(req: Request, res: Response, next: NextFunction): void {
        try {
            const authorizationHeader = req.headers['authorization'];
            if (!authorizationHeader) throw new Error('No authorization header');

            const token = authorizationHeader.split(' ')[1]; // Bearer [token]
            if (!token) throw new Error('No token provided');

            const userPayload = JwtUtils.verify(token) as JwtPayload ; // Verifies token and gets user payload
            req.user = userPayload; // Append user payload to request object

            next(); // Pass control to the next middleware
        } catch (error) {
            LoggerUtils.error('Authentication failed!');
            res.status(401).json({ error: 'Unauthorized' });
        }
    }

    static authorize(roles: string[]) {
        return (req: Request, res: Response, next: NextFunction): void => {
            try {
                const user = (req as any).user;
                if (!user) throw new Error('No user found');

                if (!roles.includes(user.role)) throw new Error('Unauthorized');

                next();
            } catch (error) {
                LoggerUtils.error('Authorization failed!');
                res.status(401).json({ error: 'Unauthorized' });
            }
        };
    }
}
