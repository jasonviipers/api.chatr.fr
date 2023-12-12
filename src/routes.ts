import { NextFunction, Request, Response } from 'express';
import AuthController from './controllers/auth.controllers';
import MeetingController from './controllers/meeting.controllers';
import MessageController from './controllers/message.controllers';
import AuthMiddleware from './middlewares/AuthMiddleware';

export default [
    {
        method: 'get',
        path: '/',
        controller: (req: Request, res: Response) => {
            res.send('Hello World!');
        },
    },

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

    // Meetings
    {
        method: 'get',
        path: '/meetings',
        middleware: [AuthMiddleware.authenticate],
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MeetingController(req, res, next).getAllMeetings();
        },
    },
    {
        method: 'get',
        path: '/meetings/:id',
        middleware: [AuthMiddleware.authenticate, AuthMiddleware.authorize(['ADMIN'])],
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MeetingController(req, res, next).getMeetingById();
        },
    },
    {
        method: 'post',
        path: '/meetings',
        middleware: [AuthMiddleware.authenticate],
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MeetingController(req, res, next).createMeeting();
        },
    },
    {
        method: 'patch',
        path: '/meetings/:id',
        middleware: [AuthMiddleware.authenticate, AuthMiddleware.authorize(['ADMIN'])],
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MeetingController(req, res, next).updateMeeting();
        },
    },
    {
        method: 'delete',
        path: '/meetings/:id',
        middleware: [AuthMiddleware.authenticate, AuthMiddleware.authorize(['ADMIN'])],
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MeetingController(req, res, next).deleteMeeting();
        },
    },
    //Join Meeting
    {
        method: 'post',
        path: '/meetings/:id/join',
        middleware: [AuthMiddleware.authenticate],
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MeetingController(req, res, next).joinMeeting();
        },
    },
    // Messages
    {
        method: 'get',
        path: '/messages',
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MessageController(req, res, next).getAllMessages();
        },
    },
    {
        method: 'get',
        path: '/messages/:id',
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MessageController(req, res, next).getMessageById();
        },
    },
    {
        method: 'post',
        path: '/messages',
        middleware: [AuthMiddleware.authenticate],
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MessageController(req, res, next).createMessage();
        },
    },
    {
        method: 'patch',
        path: '/messages/:id',
        middleware: [AuthMiddleware.authenticate],
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MessageController(req, res, next).updateMessage();
        },
    },
    {
        method: 'delete',
        path: '/messages/:id',
        middleware: [AuthMiddleware.authenticate],
        controller: (req: Request, res: Response, next: NextFunction) => {
            return new MessageController(req, res, next).deleteMessage();
        },
    },
];
