import { Request, Response, NextFunction } from 'express';
import MessageRepository from '../repositories/message.repository';
import UserRepository from '../repositories/user.repository';
import { HttpStatusCodes } from '../utils/httpStatusCodes.utils';
import { LoggerUtils } from '../utils/logger.utils';
import { createMessageSchema } from '../schema/message.schema';
import { Message, MessageStatus } from '@prisma/client';

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

    private async updateStatusForReceivedMessages(messages: Message[], senderId: string): Promise<void> {
        const updatePromises = messages
            .filter((message) => message.receiverId === senderId)
            .map(async (message) => {
                try {
                    await this.messageRepo.updateMessage({ id: message.id }, { status: MessageStatus.READ });
                } catch (error) {
                    LoggerUtils.error(`Error updating message status: ${error}`);
                    // Handle the error, log it, or take appropriate action
                }
            });

        await Promise.all(updatePromises);
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
                receiverId: validatedInput.receiverId,
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

    async getMessagesBySenderId() {
        try {
            // Get the senderId from the request params
            const senderId = this.request.params.senderId;

            // Check if the sender exists
            const sender = await this.userRepo.getUserById({ id: senderId });
            if (!sender) {
                return this.response.status(HttpStatusCodes.NOT_FOUND).json({
                    message: 'Sender not found.',
                });
            }

            // Get the messages
            const messages = await this.messageRepo.getMessagesBySenderId({ senderId });

            //if the messages is received by the sender then update the status to read
            await this.updateStatusForReceivedMessages(messages, senderId);

            // Return the messages
            return this.response.status(HttpStatusCodes.OK).json({
                message: 'Messages retrieved.',
                data: messages,
            });
        } catch (error) {
            return this.handleErrors('getMessagesBySenderId', error as Error);
        }
    }
}
