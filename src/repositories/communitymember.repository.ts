import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../database';

export default class CommunityMemberRepository {
    private prisma: DatabaseClient;

    constructor() {
        this.prisma = DatabaseClient.getInstance();
    }

    async createCommunityMember(data: Prisma.CommunityMemberUncheckedCreateInput) {
        return await this.prisma.communityMember.create({
            data,
        });
    }

    async joinCommunity(data: Prisma.CommunityMemberUncheckedCreateInput) {
        return await this.prisma.communityMember.create({
            data,
        });
    }

    async getAllCommunityMembers() {
        return await this.prisma.communityMember.findMany();
    }

    async getCommunityMember(
        where: Partial<Prisma.CommunityMemberWhereUniqueInput>,
        select?: Prisma.CommunityMemberSelect,
    ) {
        return await this.prisma.communityMember.findFirst({
            where,
            select,
        });
    }

    async getCommunityMemberById(where: Prisma.CommunityMemberWhereUniqueInput, select?: Prisma.CommunityMemberSelect) {
        return await this.prisma.communityMember.findUnique({
            where,
            select,
        });
    }

    async updateCommunityMember(
        where: Prisma.CommunityMemberWhereUniqueInput,
        data: Prisma.CommunityMemberUpdateInput,
        select?: Prisma.CommunityMemberSelect,
    ) {
        return await this.prisma.communityMember.update({
            where,
            data,
            select,
        });
    }

    async deleteCommunityMember(where: Prisma.CommunityMemberWhereUniqueInput) {
        return await this.prisma.communityMember.delete({
            where,
        });
    }
}
