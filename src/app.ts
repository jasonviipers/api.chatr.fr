import http from 'http';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import Router from './services/router.services';
import PeerServer from './services/peer.services';
import SocketServer from './services/socket.services';
import { client } from './utils/redis.utils';

const app = express();
const server = http.createServer(app);

// CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Redis connection
(async () => {
    await client.connect();
})();

// Routes
new Router(app).initialize();
new PeerServer(server, app).initialize();
new SocketServer(server).initialize();

// Server listen on port
server.listen(process.env.PORT);

export default app;
