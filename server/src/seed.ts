import pool from './db';
import { PLAYERS_DATA } from './playersData';

async function seedPlayers() {
    try {
        console.log('🌱 Starting player seeding...');

        // Check if players already exist
        const existingPlayers = await pool.query('SELECT COUNT(*) FROM players');

        if (parseInt(existingPlayers.rows[0].count) > 0) {
            console.log('✅ Players already seeded. Skipping...');
            return;
        }

        // Insert all players from constants
        for (const player of PLAYERS_DATA) {
            await pool.query(
                `INSERT INTO players (name, role, category, country, base_price, image_url, stats)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    player.name,
                    player.role,
                    player.category || null,
                    player.country,
                    player.basePrice,
                    player.image,
                    JSON.stringify(player.stats)
                ]
            );
        }

        console.log(`✅ Successfully seeded ${PLAYERS_DATA.length} players!`);
    } catch (error) {
        console.error('❌ Error seeding players:', error);
        throw error;
    }
}

// Run seeding if this file is executed directly
if (require.main === module) {
    seedPlayers()
        .then(() => {
            console.log('✅ Seeding complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        });
}

export default seedPlayers;
