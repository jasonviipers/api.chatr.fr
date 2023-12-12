import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../database';

export default class MeetingService {
    private prisma: DatabaseClient;

    constructor() {
        this.prisma = DatabaseClient.getInstance();
    }

    async createMeeting(data: Prisma.MeetingCreateInput & { hostId: string }) {
        const { hostId, ...otherData } = data;

        return this.prisma.meeting.create({
            data: {
                ...otherData,
                host: {
                    connect: {
                        id: hostId,
                    },
                },
            },
        });
    }

    async getAllMeetings(where?: Prisma.MeetingWhereInput, select?: Prisma.MeetingSelect) {
        return this.prisma.meeting.findMany({
            where,
            select,
        });
    }

    async getMeetingById(where: Prisma.MeetingWhereUniqueInput, select?: Prisma.MeetingSelect) {
        return this.prisma.meeting.findUnique({
            where,
            select,
        });
    }

    async getMeetingByUserId(where: Prisma.MeetingWhereUniqueInput, select?: Prisma.MeetingSelect) {
        return this.prisma.meeting.findUnique({
            where,
            select,
        });
    }

    async updateMeeting(
        where: Prisma.MeetingWhereUniqueInput,
        data: Prisma.MeetingUpdateInput,
        select?: Prisma.MeetingSelect,
    ) {
        return this.prisma.meeting.update({
            where,
            data,
            select,
        });
    }

    async deleteMeetingById(where: Prisma.MeetingWhereUniqueInput) {
        return this.prisma.meeting.delete({
            where,
        });
    }
}
