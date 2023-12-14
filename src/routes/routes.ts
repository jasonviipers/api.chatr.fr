import { NextFunction, Request, Response } from 'express';
import AuthController from '../controllers/auth.controllers';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import MessageController from '../controllers/message.controllers';
import CommunityController from '../controllers/community.controllers';

export default [
    // Auth
    {
        method: 'post',
        path: '/auth/login',
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new AuthController(req, res, next).login();
        },
    },
    {
        method: 'post',
        path: '/auth/register',
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new AuthController(req, res, next).register();
        },
    },
    {
        method: 'get',
        path: '/auth/verify-email/:verifyToken',
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new AuthController(req, res, next).verifyEmail();
        },
    },
    {
        method: 'post',
        path: '/auth/forgot-password',
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new AuthController(req, res, next).forgotPassword();
        },
    },
    {
        method: 'post',
        path: '/auth/reset-password/:resetToken',
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new AuthController(req, res, next).resetPassword();
        },
    },

    // Messages
    // {
    //     method: 'get',
    //     path: '/messages',
    //     controller: (req: Request, res: Response, next: NextFunction) => {
    //         return new MessageController(req, res, next).getAllMessages();
    //     },
    // },
    // {
    //     method: 'get',
    //     path: '/messages/:id',
    //     controller: (req: Request, res: Response, next: NextFunction) => {
    //         return new MessageController(req, res, next).getMessageById();
    //     },
    // },
    {
        method: 'post',
        path: '/messages',
        middleware: [AuthMiddleware.authenticate],
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MessageController(req, res, next).createMessage();
        },
    },
    // {
    //     method: 'patch',
    //     path: '/messages/:id',
    //     middleware: [AuthMiddleware.authenticate],
    //     controller: (req: Request, res: Response, next: NextFunction) => {
    //         return new MessageController(req, res, next).updateMessage();
    //     },
    // },
    // {
    //     method: 'delete',
    //     path: '/messages/:id',
    //     middleware: [AuthMiddleware.authenticate],
    //     controller: (req: Request, res: Response, next: NextFunction) => {
    //         return new MessageController(req, res, next).deleteMessage();
    //     },
    // }

    // Communities routes
    // {
    //     method: 'get',
    //     path: '/communities',
    //     controller: (req: Request, res: Response, next: NextFunction) => {
    //         return new MessageController(req, res, next).getAllCommunities();
    //     },
    // },
    // {
    //     method: 'get',
    //     path: '/communities/:id',
    //     controller: (req: Request, res: Response, next: NextFunction) => {
    //         return new MessageController(req, res, next).getCommunityById();
    //     },
    // },
    {
        method: 'post',
        path: '/communities',
        middleware: [AuthMiddleware.authenticate, AuthMiddleware.authorize(['USER', 'MODERATOR'])],
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new CommunityController(req, res, next).createCommunity();
        },
    },
    // {
    //     method: 'patch',
    //     path: '/communities/:id',
    //     middleware: [AuthMiddleware.authenticate],
    //     controller: (req: Request, res: Response, next: NextFunction) => {
    //         return new MessageController(req, res, next).updateCommunity();
    //     },
    // },
    // {
    //     method: 'delete',
    //     path: '/communities/:id',
    //     middleware: [AuthMiddleware.authenticate],
    //     controller: (req: Request, res: Response, next: NextFunction) => {
    //         return new MessageController(req, res, next).deleteCommunity();
    //     },
    // }
];
