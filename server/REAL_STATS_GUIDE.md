# How to Get Real Cricket Stats

## Option 1: Use a Cricket Stats API (Recommended)

### 1. **CricAPI** (Paid but reliable)
- Website: https://www.cricapi.com/
- Cost: ~$10-50/month
- Features: Real-time IPL stats, player profiles, match data
- Setup:
  ```bash
  npm install axios
  ```
  ```typescript
  const response = await axios.get(
    'https://api.cricapi.com/v1/players_info',
    { params: { apikey: 'YOUR_API_KEY', id: 'player_id' } }
  );
  ```

### 2. **RapidAPI Cricket APIs** (Free tier available)
- Website: https://rapidapi.com/
- Search for "Cricket Live Scores" or "IPL API"
- Many have free tiers (100-500 requests/month)
- Example APIs:
  - "Cricket Live Scores" by Sportmonks
  - "IPL API" by various providers

### 3. **Cricsheet** (Free but manual)
- Website: https://cricsheet.org/
- Download CSV files with ball-by-ball data
- Process the data yourself
- Best for historical data

## Option 2: Web Scraping ESPN Cricinfo

### Using Puppeteer (Browser automation)

```bash
npm install puppeteer cheerio
```

```typescript
import puppeteer from 'puppeteer';

async function scrapePlayerStats(playerUrl: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(playerUrl);
  
  // Extract stats from the page
  const stats = await page.evaluate(() => {
    const matches = document.querySelector('.stat-matches')?.textContent;
    const runs = document.querySelector('.stat-runs')?.textContent;
    return { matches, runs };
  });
  
  await browser.close();
  return stats;
}

// Example
scrapePlayerStats('https://www.espncricinfo.com/player/virat-kohli-253802');
```

## Option 3: Manual Entry with Real Stats

I've created a file with **real IPL 2024 stats** for top players. You can:

1. Copy from ESPN Cricinfo manually
2. Use the data I provided in `statsFetcher.ts`
3. Update `playersData.ts` with real numbers

### Where to Find Real Stats:

**ESPN Cricinfo Player Pages:**
- Virat Kohli: https://www.espncricinfo.com/player/virat-kohli-253802
- Rohit Sharma: https://www.espncricinfo.com/player/rohit-sharma-34102
- Jasprit Bumrah: https://www.espncricinfo.com/player/jasprit-bumrah-625383

**IPL Official Stats:**
- https://www.iplt20.com/stats

## Quick Implementation

### Step 1: Install axios
```bash
cd server
npm install axios
```

### Step 2: Create an API route to add players

```typescript
// server/src/routes/players.ts
router.post('/admin/add', async (req, res) => {
  const { name, role, country, basePrice, stats } = req.body;
  
  await pool.query(
    'INSERT INTO players (name, role, country, base_price, stats) VALUES ($1, $2, $3, $4, $5)',
    [name, role, country, basePrice, JSON.stringify(stats)]
  );
  
  res.json({ message: 'Player added!' });
});
```

### Step 3: Use it from frontend or Postman

```bash
curl -X POST http://localhost:5000/api/players/admin/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "KL Rahul",
    "role": "Wicket Keeper",
    "country": "India",
    "basePrice": 150,
    "stats": {
      "matches": 132,
      "runs": 4163,
      "average": 37.52,
      "strikeRate": 135.38
    }
  }'
```

## Recommendation

For your project, I recommend:

1. **Start**: Use the manual data I provided (already has 30 players)
2. **Improve**: Add more players manually from ESPN Cricinfo
3. **Scale**: Later, integrate with RapidAPI (free tier) for automatic updates
4. **Production**: Consider CricAPI if you need real-time data

Would you like me to:
1. Add an admin route to easily add new players?
2. Create a script to bulk import from a CSV file?
3. Set up a RapidAPI integration?
