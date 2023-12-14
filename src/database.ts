import { PrismaClient } from '@prisma/client';

export class DatabaseClient {
    private static instance: PrismaClient;

    private constructor() {
        // Prevent instantiation
    }

    static {
        // Initialize the instance when the class is loaded
        DatabaseClient.instance = new PrismaClient();
    }

    public static getInstance(): PrismaClient {
        return DatabaseClient.instance;
    }

    public user = DatabaseClient.getInstance().user;
    public message = DatabaseClient.getInstance().message;
    public community = DatabaseClient.getInstance().community;
    public communityMember = DatabaseClient.getInstance().communityMember;
}
