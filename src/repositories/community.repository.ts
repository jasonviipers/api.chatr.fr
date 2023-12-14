import { Prisma } from "@prisma/client";
import { DatabaseClient } from "../database";

export default class CommunityRepository {
    private prisma: DatabaseClient;

    constructor() {
        this.prisma = DatabaseClient.getInstance();
    }

    async createCommunity(data: Prisma.CommunityCreateInput) {
        return await this.prisma.community.create({
            data,
        });
    }

    async getAllCommunities() {
        return await this.prisma.community.findMany();
    }

    async getCommunity(where: Partial<Prisma.CommunityWhereUniqueInput>, select?: Prisma.CommunitySelect) {
        return this.prisma.community.findFirst({
            where,
            select,
        });
    }

    async getCommunityById(where: Prisma.CommunityWhereUniqueInput, select?: Prisma.CommunitySelect) {
        return await this.prisma.community.findUnique({
            where,
            select,
        });
    }

    async updateCommunity(where: Prisma.CommunityWhereUniqueInput, data: Prisma.CommunityUpdateInput, select?: Prisma.CommunitySelect) {
        return await this.prisma.community.update({
            where,
            data,
            select,
        });
    }

    async deleteCommunity(where: Prisma.CommunityWhereUniqueInput) {
        return await this.prisma.community.delete({
            where,
        });
    }
}