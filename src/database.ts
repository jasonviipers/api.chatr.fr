import { PrismaClient } from '@prisma/client';

export class DatabaseClient {
    private static instance: PrismaClient;

    private constructor() {}

    public static getInstance(): PrismaClient {
        if (!DatabaseClient.instance) {
            DatabaseClient.instance = new PrismaClient();
        }
        return DatabaseClient.instance;
    }

    public user = DatabaseClient.getInstance().user;
    public meeting = DatabaseClient.getInstance().meeting;
    public participant = DatabaseClient.getInstance().participant;
    public message = DatabaseClient.getInstance().message;
}
