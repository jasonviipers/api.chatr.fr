import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../database';

export default class UserRepository {
    private prisma: DatabaseClient;

    constructor() {
        this.prisma = DatabaseClient.getInstance();
    }

    async createUser(data: Prisma.UserCreateInput) {
        return await this.prisma.user.create({
            data,
        });
    }

    async getAllUsers() {
        let { search, limit, offset } = { search: '', limit: 10, offset: 0 };
        return await this.prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: search } },
                    { name: { contains: search } },
                    { email: { contains: search } },
                ],
                NOT: [],
            },
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            skip: offset,
            include: { 
                // posts: true,
                // comments: true,
                // likes: true,
                // followers: true,
                // following: true,
                // rooms: true,
                // messages: true,
                MessageSent: true,
            },
        });
    }

    async getUser(where: Partial<Prisma.UserWhereUniqueInput>, select?: Prisma.UserSelect) {
        return await this.prisma.user.findFirst({
            where,
            select,
        });
    }

    async getUserByIdentifier(identifier: string) {
        return await this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: identifier,
                    },
                    {
                        username: identifier,
                    },
                ],
            },
        });
    }

    async getUserByResetToken(where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect) {
        return await this.prisma.user.findUnique({
            where,
            select,
        });
    }

    async getUserById(where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect) {
        return await this.prisma.user.findUnique({
            where,
            select,
        });
    }

    async getUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async getUserByUsername(username: string) {
        return await this.prisma.user.findUnique({
            where: {
                username,
            },
        });
    }

    async getUserByVerifyToken(where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect) {
        return await this.prisma.user.findUnique({
            where,
            select,
        });
    }

    async updateUser(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput, select?: Prisma.UserSelect) {
        return await this.prisma.user.update({
            where,
            data,
            select,
        });
    }

    async deleteUserById(where: Prisma.UserWhereUniqueInput) {
        return await this.prisma.user.delete({
            where,
        });
    }

    async updateUserToken(id: string, data: { resetToken?: string | null; resetExpires?: Date | null }) {
        return await this.prisma.user.update({
            where: { id },
            data,
        });
    }
}
