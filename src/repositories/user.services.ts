import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../database';

export default class UserService {
    private prisma: DatabaseClient;

    constructor() {
        this.prisma = DatabaseClient.getInstance();
    }

    async createUser(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({
            data,
        });
    }

    async getAllUsers() {
        return this.prisma.user.findMany();
    }

    async getUserById(where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect) {
        return this.prisma.user.findUnique({
            where,
            select,
        });
    }

    async getUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async getUserByVerifyToken(where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect) {
        return this.prisma.user.findUnique({
            where,
            select,
        });
    }

    async getUserByResetToken(where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect) {
        return this.prisma.user.findUnique({
            where,
            select,
        });
    }

    async updateUser(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput, select?: Prisma.UserSelect) {
        return this.prisma.user.update({
            where,
            data,
            select,
        });
    }

    async deleteUserById(where: Prisma.UserWhereUniqueInput) {
        return this.prisma.user.delete({
            where,
        });
    }

    async getUserByToken(token: string, type: 'verify' | 'reset') {
        if (type === 'verify') {
            return this.prisma.user.findUnique({
                where: {
                    verifyToken: token,
                },
            });
        } else {
            return this.prisma.user.findUnique({
                where: {
                    resetToken: token,
                },
            });
        }
    }
    
    async updateUserToken(id: string, data: { resetToken?: string | null, resetExpires?: Date | null }) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
}
