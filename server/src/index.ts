import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3002',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import database connection
import './db';

// Import routes
import authRoutes from './routes/auth';
import sessionRoutes from './routes/sessions';
import playerRoutes from './routes/players';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/players', playerRoutes);

// Root endpoint - API info
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'IPL Auction API Server',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: 'GET /health',
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                me: 'GET /api/auth/me (requires auth)'
            },
            sessions: {
                list: 'GET /api/sessions (requires auth)',
                create: 'POST /api/sessions (requires auth)',
                details: 'GET /api/sessions/:id (requires auth)',
                join: 'POST /api/sessions/:id/join (requires auth)',
                start: 'POST /api/sessions/:id/start (requires auth)',
                results: 'GET /api/sessions/:id/results (requires auth)'
            },
            players: {
                list: 'GET /api/players',
                details: 'GET /api/players/:id'
            }
        }
    });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'IPL Auction Server is running' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start server
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io ready for connections`);
    console.log(`🌐 Network: http://192.168.1.4:${PORT}`);
});

export { app, io };
