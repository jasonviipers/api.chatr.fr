import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../database';

export default class MessageService {
    private prisma: DatabaseClient;

    constructor() {
        this.prisma = DatabaseClient.getInstance();
    }

    async createMessage(data: Prisma.MessageCreateInput) {
        return this.prisma.message.create({
            data,
        });
    }

    async getAllMessages(where?: Prisma.MessageWhereInput, select?: Prisma.MessageSelect) {
        return this.prisma.message.findMany({
            where,
            select,
        });
    }

    async getMessageById(where: Prisma.MessageWhereUniqueInput, select?: Prisma.MessageSelect) {
        return this.prisma.message.findUnique({
            where,
            select,
        });
    }

    async getMessageByUserId(where: Prisma.MessageWhereUniqueInput, select?: Prisma.MessageSelect) {
        return this.prisma.message.findUnique({
            where,
            select,
        });
    }

    async updateMessage(
        where: Prisma.MessageWhereUniqueInput,
        data: Prisma.MessageUpdateInput,
        select?: Prisma.MessageSelect,
    ) {
        return this.prisma.message.update({
            where,
            data,
            select,
        });
    }

    async deleteMessageById(where: Prisma.MessageWhereUniqueInput) {
        return this.prisma.message.delete({
            where,
        });
    }
}
