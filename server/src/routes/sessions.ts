import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all auction sessions
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT s.*, u.username as creator_name,
       (SELECT COUNT(*) FROM session_participants WHERE session_id = s.id) as participant_count
       FROM auction_sessions s
       LEFT JOIN users u ON s.created_by = u.id
       ORDER BY s.created_at DESC`
        );

        res.json({ sessions: result.rows });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

// Create new auction session
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Session name is required' });
        }

        const result = await pool.query(
            `INSERT INTO auction_sessions (name, created_by, status)
       VALUES ($1, $2, 'waiting')
       RETURNING *`,
            [name, req.userId]
        );

        res.status(201).json({ session: result.rows[0] });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

// Get session details
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const sessionResult = await pool.query(
            'SELECT * FROM auction_sessions WHERE id = $1',
            [id]
        );

        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const participantsResult = await pool.query(
            `SELECT sp.*, u.username
       FROM session_participants sp
       JOIN users u ON sp.user_id = u.id
       WHERE sp.session_id = $1`,
            [id]
        );

        res.json({
            session: sessionResult.rows[0],
            participants: participantsResult.rows
        });
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

// Join a session with a team (or change team if already joined)
router.post('/:id/join', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { teamId } = req.body;

        if (!teamId) {
            return res.status(400).json({ error: 'Team ID is required' });
        }

        // Check if session exists and is waiting
        const sessionResult = await pool.query(
            'SELECT status FROM auction_sessions WHERE id = $1',
            [id]
        );

        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (sessionResult.rows[0].status !== 'waiting') {
            return res.status(400).json({ error: 'Session has already started' });
        }

        // Check if user already joined
        const existingParticipant = await pool.query(
            'SELECT id, team_id FROM session_participants WHERE session_id = $1 AND user_id = $2',
            [id, req.userId]
        );

        // Check if team is already taken by ANOTHER user
        const teamTaken = await pool.query(
            'SELECT id, user_id FROM session_participants WHERE session_id = $1 AND team_id = $2',
            [id, teamId]
        );

        if (teamTaken.rows.length > 0 && teamTaken.rows[0].user_id !== req.userId) {
            return res.status(400).json({ error: 'This team is already taken' });
        }

        let result;

        if (existingParticipant.rows.length > 0) {
            // User already joined - UPDATE their team
            result = await pool.query(
                `UPDATE session_participants 
                 SET team_id = $1 
                 WHERE session_id = $2 AND user_id = $3
                 RETURNING *`,
                [teamId, id, req.userId]
            );
        } else {
            // New participant - INSERT
            result = await pool.query(
                `INSERT INTO session_participants (session_id, user_id, team_id, purse_remaining)
                 VALUES ($1, $2, $3, 10000)
                 RETURNING *`,
                [id, req.userId, teamId]
            );
        }

        res.status(201).json({ participant: result.rows[0] });
    } catch (error) {
        console.error('Join session error:', error);
        res.status(500).json({ error: 'Failed to join session' });
    }
});

// Start auction (host only)
router.post('/:id/start', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Check if user is the creator
        const sessionResult = await pool.query(
            'SELECT created_by, status FROM auction_sessions WHERE id = $1',
            [id]
        );

        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (sessionResult.rows[0].created_by !== req.userId) {
            return res.status(403).json({ error: 'Only the host can start the auction' });
        }

        if (sessionResult.rows[0].status !== 'waiting') {
            return res.status(400).json({ error: 'Session has already started' });
        }

        // Update session status
        await pool.query(
            `UPDATE auction_sessions
       SET status = 'active', started_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
            [id]
        );

        res.json({ message: 'Auction started successfully' });
    } catch (error) {
        console.error('Start session error:', error);
        res.status(500).json({ error: 'Failed to start session' });
    }
});

// Get session results
router.get('/:id/results', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const results = await pool.query(
            `SELECT pr.*, p.name, p.role, p.country, p.base_price,
       sp.team_id, u.username as buyer_username
       FROM player_results pr
       JOIN players p ON pr.player_id = p.id
       LEFT JOIN session_participants sp ON pr.sold_to_participant_id = sp.id
       LEFT JOIN users u ON sp.user_id = u.id
       WHERE pr.session_id = $1
       ORDER BY pr.resolved_at`,
            [id]
        );

        res.json({ results: results.rows });
    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

export default router;
