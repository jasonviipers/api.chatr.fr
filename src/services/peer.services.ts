import { Server as HttpServer } from 'http';
import { ExpressPeerServer } from 'peer';
import { Express } from 'express';

export default class PeerServer {
    protected server: HttpServer;
    protected app: Express;
    protected config = {
        path: '/peer', //adjusting path as per for the app's routing
        generateClientId: () => (Math.random() * 1000).toString(),
    };

    constructor(server: HttpServer, app: Express) {
        this.server = server;
        this.app = app;
    }

    public initialize(): void {
        const peerServer = ExpressPeerServer(this.server, this.config);
        this.app.use(this.config.path, peerServer);
    }
}
