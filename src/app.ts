import http from 'http';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
// import swaggerUi from 'swagger-ui-express';
import Router from './services/router.services';
import PeerServer from './services/peer.services';
import SocketServer from './services/socket.services';
// import specs from './utils/swaggerConfig.utils';
import Redis from './utils/redis.utils';

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

// Connect to Redis
Redis.getInstance().connect();

// Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
new Router(app).initialize();
new PeerServer(server, app).initialize();
new SocketServer(server).initialize();

// Server listen on port
server.listen(process.env.PORT);

export default app;