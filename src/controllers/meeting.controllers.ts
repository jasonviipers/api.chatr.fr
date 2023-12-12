import { Request, Response, NextFunction } from 'express';
import MeetingService from '../repositories/meeting.services';
import ParticipantService from '../repositories/participant.services';
import { Prisma } from '@prisma/client';
import { HttpStatusCodes } from '../utils/httpStatusCodes.utils';
import { LoggerUtils } from '../utils/logger.utils';
import { createMeetingSchema } from '../utils/validate.utils';
import { z } from 'zod';

export default class MeetingController {
    protected request: Request;
    protected response: Response;
    protected next: NextFunction;
    protected meetingService: MeetingService;
    protected participantService: ParticipantService;

    constructor(request: Request, response: Response, next: NextFunction) {
        this.request = request;
        this.response = response;
        this.next = next;
        this.meetingService = new MeetingService();
        this.participantService = new ParticipantService();
    }

    private async handleErrors(methodName: string, error: Error): Promise<Response> {
        LoggerUtils.error(`Error during ${methodName}: ${error.message}`);
        return this.response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: `An error occurred during ${methodName}.`,
        });
    }

    async getAllMeetings() {
        try {
            const meetings = await this.meetingService.getAllMeetings();
            return this.response.status(HttpStatusCodes.OK).json(meetings);
        } catch (error) {
            return this.handleErrors('fetching all meetings', error as Error);
        }
    }

    async getMeetingById() {
        try {
            const meetingId = this.request.params.id;
            const meeting = await this.meetingService.getMeetingById({ id: meetingId });
            if (!meeting) {
                return this.response.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Meeting not found.' });
            }
            return this.response.status(HttpStatusCodes.OK).json(meeting);
        } catch (error) {
            return this.handleErrors('fetching meeting by id', error as Error);
        }
    }

    async createMeeting() {
        try {
            const validatedData = createMeetingSchema.parse(this.request.body);
            const meeting = await this.meetingService.createMeeting({
                ...validatedData,
                host: {
                    connect: { id: validatedData.hostId }, // assuming hostId is part of the request
                },
            });
            return this.response.status(HttpStatusCodes.CREATED).json(meeting);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.response.status(HttpStatusCodes.BAD_REQUEST).json({ errors: error.errors });
            } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                // Handle unique constraint error (adjust error code and message as necessary)
                return this.response.status(HttpStatusCodes.BAD_REQUEST).json({ message: error.message });
            }
            return this.handleErrors('creating meeting', error as Error);
        }
    }

    async updateMeeting() {
        try {
            const meetingId = this.request.params.id;
            const meetingData = this.request.body;
            const updatedMeeting = await this.meetingService.updateMeeting({ id: meetingId }, meetingData);
            return this.response.status(HttpStatusCodes.OK).json(updatedMeeting);
        } catch (error) {
            return this.handleErrors('updating meeting', error as Error);
        }
    }

    async deleteMeeting() {
        try {
            const meetingId = this.request.params.id;
            const deletedMeeting = await this.meetingService.deleteMeetingById({ id: meetingId });
            return this.response.status(HttpStatusCodes.OK).json(deletedMeeting);
        } catch (error) {
            return this.handleErrors('deleting meeting', error as Error);
        }
    }

    async joinMeeting() {
        try {
            const validate = z.object({
                id: z.string(),
            });
            const validatedData = validate.parse(this.request.params);

            const meetingId = validatedData.id;
            const userId = this.request.user.id;

            // Check if the meeting exists
            const meeting = await this.meetingService.getMeetingById({ id: meetingId });

            if (!meeting) {
                return this.response.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Meeting not found.' });
            }

            // Check if the user is already a participant
            const isParticipant = await this.participantService.isParticipant({ userId, meetingId });
            if (isParticipant) {
                return this.response.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Already a participant.' });
            }

            // Add participant to the meeting
            const participant = await this.participantService.addParticipant({
                userId,
                joinedAt: new Date(),
                meeting: { connect: { id: meetingId } },
            });

            // Send response
            return this.response.status(HttpStatusCodes.CREATED).json(participant);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
                return this.response
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .json({ message: 'Invalid user or meeting ID.' });
            }

            return this.response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred during joining the meeting.',
            });
        }
    }
}
