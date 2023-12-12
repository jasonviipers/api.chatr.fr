import { Express, Request, Response, NextFunction } from 'express';
import { map } from 'lodash';
import routes from '../routes';
import { LoggerUtils } from '../utils/logger.utils';

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
}
export interface Route {
    method: HttpMethod;
    path: string;
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void | Promise<void>>;
    controller: (req: Request, res: Response) => void | Promise<void>;
}

export default class Router {
    protected app: Express;

    constructor(app: Express) {
        this.app = app;
    }

    initialize(): void {
        map(routes, (route: Route) => {
            const { method, path, middleware, controller } = route;

            const controllerWrapper = async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await controller(req, res);
                } catch (error) {
                    if (error instanceof Error) {
                        LoggerUtils.error(error.message);
                        res.status(500).json({ error: error.message });
                    } else {
                        LoggerUtils.error(`Unknown error on route ${path}`);
                        res.status(500).json({ error: 'Unknown error' });
                    }
                    next(error);
                }
            };

            // Register the routes in the Express app
            if (middleware && middleware.length) {
                this.app[method](path, ...middleware, controllerWrapper);
            } else {
                this.app[method](path, controllerWrapper);
            }

            LoggerUtils.info(`Route registered: [${method.toUpperCase()}] ${path}`);
        });
    }
}
