import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../database';

export default class ParticipantService {
    private prisma: DatabaseClient;

    constructor() {
        this.prisma = DatabaseClient.getInstance();
    }

    async addParticipant(input: Prisma.ParticipantCreateInput) {
        return this.prisma.participant.create({
            data: input,
        });
    }

    async isParticipant(where: Prisma.ParticipantWhereInput, select?: Prisma.ParticipantSelect) {
        return this.prisma.participant.findFirst({
            where,
            select,
        });
    }

    async getAllParticipants(where?: Prisma.ParticipantWhereInput, select?: Prisma.ParticipantSelect) {
        return this.prisma.participant.findMany({
            where,
            select,
        });
    }

    async getParticipantById(where: Prisma.ParticipantWhereUniqueInput, select?: Prisma.ParticipantSelect) {
        return this.prisma.participant.findUnique({
            where,
            select,
        });
    }

    async getParticipantByUserId(where: Prisma.ParticipantWhereUniqueInput, select?: Prisma.ParticipantSelect) {
        return this.prisma.participant.findUnique({
            where,
            select,
        });
    }

    async updateParticipant(
        where: Prisma.ParticipantWhereUniqueInput,
        data: Prisma.ParticipantUpdateInput,
        select?: Prisma.ParticipantSelect,
    ) {
        return this.prisma.participant.update({
            where,
            data,
            select,
        });
    }

    async deleteParticipantById(where: Prisma.ParticipantWhereUniqueInput) {
        return this.prisma.participant.delete({
            where,
        });
    }
}
