import { Router, Response } from 'express';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all players
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM players ORDER BY category DESC, role, name'
        );

        res.json({ players: result.rows });
    } catch (error) {
        console.error('Get players error:', error);
        res.status(500).json({ error: 'Failed to fetch players' });
    }
});

// Get single player
router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM players WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json({ player: result.rows[0] });
    } catch (error) {
        console.error('Get player error:', error);
        res.status(500).json({ error: 'Failed to fetch player' });
    }
});

export default router;
