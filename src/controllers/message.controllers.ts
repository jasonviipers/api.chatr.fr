import { Request, Response, NextFunction } from 'express';
import MessageRepository from '../repositories/message.repository';
import UserRepository from '../repositories/user.repository';
import { HttpStatusCodes } from '../utils/httpStatusCodes.utils';
import { LoggerUtils } from '../utils/logger.utils';
import { createMessageSchema } from '../schema/message.schema';

export default class MessageController {
    protected request: Request;
    protected response: Response;
    protected next: NextFunction;
    protected messageRepo: MessageRepository;
    protected userRepo: UserRepository;

    constructor(request: Request, response: Response, next: NextFunction) {
        this.request = request;
        this.response = response;
        this.next = next;
        this.messageRepo = new MessageRepository();
        this.userRepo = new UserRepository();
    }

    private async handleErrors(methodName: string, error: Error): Promise<Response> {
        LoggerUtils.error(`Error during ${methodName}: ${error.message}`);
        return this.response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: `An error occurred during ${methodName}.`,
        });
    }

    async createMessage() {
        try {
            // Validate Input
            const validatedInput = await createMessageSchema.validateSync(this.request.body);

            // Check if the sender exists
            const sender = await this.userRepo.getUserById({ id: validatedInput.senderId });
            if (!sender) {
                return this.response.status(HttpStatusCodes.NOT_FOUND).json({
                    message: 'Sender not found.',
                });
            }

            // Create the message without specifying a community
            const message = await this.messageRepo.createMessage({
                body: validatedInput.body,
                senderId: validatedInput.senderId,
            });

            // Return the message
            return this.response.status(HttpStatusCodes.CREATED).json({
                message: 'Message created.',
                data: message,
            });
        } catch (error) {
            return this.handleErrors('createMessage', error as Error);
        }
    }
}
