import winston, { Logger } from 'winston';
import 'dotenv/config';

export class LoggerUtils {
    private static loggerInstance?: Logger;

    private static createLogger(): Logger {
        const logger = winston.createLogger({
            level: 'info',
            transports: [
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/combined.log' }),
            ],
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.json(),
            ),
        });

        if (process.env.NODE_ENV !== 'production') {
            logger.add(
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
                }),
            );
        }
        return logger;
    }

    private static get logger(): Logger {
        if (!LoggerUtils.loggerInstance) {
            LoggerUtils.loggerInstance = LoggerUtils.createLogger();
        }
        return LoggerUtils.loggerInstance;
    }

    public static info(message: string, error?: Error): void {
        this.log('info', message, error);
    }

    public static error(message: string, error?: Error): void {
        this.log('error', message, error);
    }

    public static warn(message: string, error?: Error): void {
        this.log('warn', message, error);
    }

    public static debug(message: string, error?: Error): void {
        this.log('debug', message, error);
    }

    private static log(level: string, message: string, error?: Error): void {
        const logMessage = error ? `${message} - ${error.message}` : message;
        const logMeta = error ? { stack: error.stack } : {};
        this.logger.log({
            level,
            message: logMessage,
            ...logMeta,
        });
    }
}
