import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import MessageService from '../repositories/message.services';
import { HttpStatusCodes } from '../utils/httpStatusCodes.utils';
import { LoggerUtils } from '../utils/logger.utils';
import { createMessageSchema } from '../utils/validate.utils';

export default class MessageController {
    protected request: Request;
    protected response: Response;
    protected next: NextFunction;
    protected messageService: MessageService;

    constructor(request: Request, response: Response, next: NextFunction) {
        this.request = request;
        this.response = response;
        this.next = next;
        this.messageService = new MessageService();
    }

    private async handleErrors(methodName: string, error: Error): Promise<Response> {
        LoggerUtils.error(`Error during ${methodName}: ${error.message}`);
        return this.response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: `An error occurred during ${methodName}.`,
        });
    }

    async getAllMessages() {
        try {
            const messages = await this.messageService.getAllMessages();
            return this.response.status(HttpStatusCodes.OK).json(messages);
        } catch (error) {
            return this.handleErrors('fetching all messages', error as Error);
        }
    }

    async getMessageById() {
        try {
            const messageId = this.request.params.id;
            const message = await this.messageService.getMessageById({ id: messageId });
            if (!message) {
                return this.response.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Message not found.' });
            }
            return this.response.status(HttpStatusCodes.OK).json(message);
        } catch (error) {
            return this.handleErrors('fetching message by id', error as Error);
        }
    }

    async createMessage() {
        try {
            const { content, meetingId, userId } = createMessageSchema.parse(this.request.body);

            const message = await this.messageService.createMessage({
                content,
                userId,
                meeting: { connect: { id: meetingId } },
            });

            return this.response.status(HttpStatusCodes.CREATED).json(message);
        } catch (error) {
            // Handle validation errors
            if (error instanceof z.ZodError) {
                return this.response.status(HttpStatusCodes.BAD_REQUEST).json({
                    message: error.errors.map((err) => err.message),
                });
            }

            // Handle known database errors
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Example: Unique constraint violation
                if (error.code === 'P2002') {
                    return this.response.status(HttpStatusCodes.BAD_REQUEST).json({
                        message: 'A message with the same content already exists.',
                    });
                }
            }

            return this.response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred during message creation.',
            });
        }
    }

    async updateMessage() {
        try {
            const messageId = this.request.params.id;
            const messageData = this.request.body;
            const message = await this.messageService.updateMessage({ id: messageId }, messageData);
            return this.response.status(HttpStatusCodes.OK).json(message);
        } catch (error) {
            return this.handleErrors('updating message', error as Error);
        }
    }

    async deleteMessage() {
        try {
            const messageId = this.request.params.id;
            const deletedMessage = await this.messageService.deleteMessageById({ id: messageId });
            return this.response.status(HttpStatusCodes.OK).json(deletedMessage);
        } catch (error) {
            return this.handleErrors('deleting message', error as Error);
        }
    }
}
