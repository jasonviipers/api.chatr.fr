import { createClient, RedisClientType } from 'redis';
import 'dotenv/config';
import { promisify } from 'util';
import { LoggerUtils } from './logger.utils';

export default class Redis {
    private static instance: Redis;
    private static client: RedisClientType;

    private constructor() {
        Redis.client = createClient({ url:process.env.REDIS_URL});
    }

    static getInstance(): Redis {
        if (!Redis.instance) {
            Redis.instance = new Redis();
        }
        return Redis.instance;
    }

    async connect(): Promise<void> {
        try {
            await Redis.client.connect();
            LoggerUtils.info('🚀 Redis connected');
        } catch (error) {
            LoggerUtils.error(`Redis connection error: ${error}`);
        }
    }

    async get(key: string): Promise<string | null> {
        return await promisify(Redis.client.get).bind(Redis.client)(key);
    }

    async set(key: string, value: string): Promise<void> {
        await promisify(Redis.client.set).bind(Redis.client)(key, value);
    }

    async del(key: string): Promise<void> {
        await promisify(Redis.client.del).bind(Redis.client)(key);
    }

}


