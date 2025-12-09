// Player data for seeding database
export const PLAYERS_DATA = [
    // MARQUEE PLAYERS
    { id: 'pm1', name: 'Virat Kohli', role: 'Batsman', category: 'Marquee', country: 'India', basePrice: 200, image: 'https://picsum.photos/id/1005/300/300', stats: { matches: 237, runs: 7263, average: 37.25, strikeRate: 130.02 } },
    { id: 'pm2', name: 'MS Dhoni', role: 'Wicket Keeper', category: 'Marquee', country: 'India', basePrice: 200, image: 'https://picsum.photos/id/1074/300/300', stats: { matches: 250, runs: 5082, average: 38.79, strikeRate: 135.92 } },
    { id: 'pm3', name: 'Jasprit Bumrah', role: 'Bowler', category: 'Marquee', country: 'India', basePrice: 200, image: 'https://picsum.photos/id/1011/300/300', stats: { matches: 120, wickets: 145, average: 23.30, strikeRate: 18.2 } },
    { id: 'pm4', name: 'Ben Stokes', role: 'All-Rounder', category: 'Marquee', country: 'England', basePrice: 200, image: 'https://picsum.photos/id/1025/300/300', stats: { matches: 43, runs: 920, wickets: 28, strikeRate: 134.5 } },
    { id: 'pm5', name: 'David Warner', role: 'Batsman', category: 'Marquee', country: 'Australia', basePrice: 200, image: 'https://picsum.photos/id/177/300/300', stats: { matches: 176, runs: 6397, average: 41.53, strikeRate: 139.91 } },
    { id: 'pm6', name: 'Pat Cummins', role: 'Bowler', category: 'Marquee', country: 'Australia', basePrice: 200, image: 'https://picsum.photos/id/453/300/300', stats: { matches: 42, wickets: 45, runs: 379 } },
    { id: 'pm7', name: 'Rohit Sharma', role: 'Batsman', category: 'Marquee', country: 'India', basePrice: 200, image: 'https://picsum.photos/id/495/300/300', stats: { matches: 219, runs: 6520, average: 36.24, strikeRate: 131.25 } },
    { id: 'pm8', name: 'Jos Buttler', role: 'Wicket Keeper', category: 'Marquee', country: 'England', basePrice: 200, image: 'https://picsum.photos/id/1084/300/300', stats: { matches: 96, runs: 3223, strikeRate: 148.32 } },
    { id: 'pm9', name: 'Babar Azam', role: 'Batsman', category: 'Marquee', country: 'Pakistan', basePrice: 200, image: 'https://picsum.photos/id/52/300/300', stats: { matches: 96, runs: 3400, average: 48.57, strikeRate: 136.17 } },
    { id: 'pm10', name: 'Steve Smith', role: 'Batsman', category: 'Marquee', country: 'Australia', basePrice: 200, image: 'https://picsum.photos/id/542/300/300', stats: { matches: 74, runs: 2768, average: 40.24, strikeRate: 149.54 } },

    // BATSMEN
    { id: 'p1', name: 'Shubman Gill', role: 'Batsman', country: 'India', basePrice: 100, image: 'https://picsum.photos/id/447/300/300', stats: { matches: 91, runs: 2790, average: 37.70 } },
    { id: 'p2', name: 'Faf du Plessis', role: 'Batsman', country: 'South Africa', basePrice: 150, image: 'https://picsum.photos/id/523/300/300', stats: { matches: 130, runs: 4133, average: 36.90 } },
    { id: 'p3', name: 'Ishan Kishan', role: 'Batsman', country: 'India', basePrice: 120, image: 'https://picsum.photos/id/267/300/300', stats: { matches: 64, runs: 1752, average: 32.82, strikeRate: 142.65 } },
    { id: 'p4', name: 'Devin Conway', role: 'Batsman', country: 'New Zealand', basePrice: 100, image: 'https://picsum.photos/id/289/300/300', stats: { matches: 35, runs: 1298, average: 39.33, strikeRate: 148.29 } },
    { id: 'p5', name: 'Harry Brook', role: 'Batsman', country: 'England', basePrice: 120, image: 'https://picsum.photos/id/354/300/300', stats: { matches: 28, runs: 1090, average: 41.15, strikeRate: 157.42 } },

    // BOWLERS
    { id: 'p6', name: 'Rashid Khan', role: 'Bowler', country: 'Afghanistan', basePrice: 200, image: 'https://picsum.photos/id/1027/300/300', stats: { matches: 109, wickets: 139, average: 20.76, strikeRate: 19.1 } },
    { id: 'p7', name: 'Trent Boult', role: 'Bowler', country: 'New Zealand', basePrice: 150, image: 'https://picsum.photos/id/338/300/300', stats: { matches: 88, wickets: 105, average: 26.54 } },
    { id: 'p8', name: 'Kagiso Rabada', role: 'Bowler', country: 'South Africa', basePrice: 200, image: 'https://picsum.photos/id/395/300/300', stats: { matches: 69, wickets: 106, average: 20.73 } },
    { id: 'p9', name: 'Jofra Archer', role: 'Bowler', country: 'England', basePrice: 150, image: 'https://picsum.photos/id/604/300/300', stats: { matches: 40, wickets: 48, average: 24.39 } },
    { id: 'p10', name: 'Yuzvendra Chahal', role: 'Bowler', country: 'India', basePrice: 120, image: 'https://picsum.photos/id/89/300/300', stats: { matches: 84, wickets: 114, average: 21.05, strikeRate: 20.2 } },

    // ALL-ROUNDERS
    { id: 'p11', name: 'Glenn Maxwell', role: 'All-Rounder', country: 'Australia', basePrice: 200, image: 'https://picsum.photos/id/1062/300/300', stats: { matches: 124, runs: 2719, strikeRate: 157.62 } },
    { id: 'p12', name: 'Andre Russell', role: 'All-Rounder', country: 'West Indies', basePrice: 200, image: 'https://picsum.photos/id/237/300/300', stats: { matches: 112, runs: 2262, wickets: 96, strikeRate: 174.00 } },
    { id: 'p13', name: 'Hardik Pandya', role: 'All-Rounder', country: 'India', basePrice: 150, image: 'https://picsum.photos/id/582/300/300', stats: { matches: 123, runs: 2309, wickets: 53 } },
    { id: 'p14', name: 'Sunil Narine', role: 'All-Rounder', country: 'West Indies', basePrice: 100, image: 'https://picsum.photos/id/203/300/300', stats: { matches: 162, wickets: 163, runs: 1046, strikeRate: 159.69 } },
    { id: 'p15', name: 'Sam Curran', role: 'All-Rounder', country: 'England', basePrice: 130, image: 'https://picsum.photos/id/312/300/300', stats: { matches: 66, runs: 1253, wickets: 68, strikeRate: 145.32 } },

    // WICKET KEEPERS
    { id: 'p16', name: 'Sanju Samson', role: 'Wicket Keeper', country: 'India', basePrice: 150, image: 'https://picsum.photos/id/26/300/300', stats: { matches: 152, runs: 3888, strikeRate: 137.19 } },
    { id: 'p17', name: 'Rishabh Pant', role: 'Wicket Keeper', country: 'India', basePrice: 150, image: 'https://picsum.photos/id/65/300/300', stats: { matches: 98, runs: 2838, strikeRate: 147.96 } },
    { id: 'p18', name: 'Nicholas Pooran', role: 'Wicket Keeper', country: 'West Indies', basePrice: 150, image: 'https://picsum.photos/id/486/300/300', stats: { matches: 62, runs: 1270, strikeRate: 156.79 } },
    { id: 'p19', name: 'Aiden Markram', role: 'Wicket Keeper', country: 'South Africa', basePrice: 120, image: 'https://picsum.photos/id/398/300/300', stats: { matches: 71, runs: 1940, average: 28.52, strikeRate: 133.97 } },
    { id: 'p20', name: 'Wriddhiman Saha', role: 'Wicket Keeper', country: 'India', basePrice: 100, image: 'https://picsum.photos/id/461/300/300', stats: { matches: 94, runs: 1906, average: 22.19, strikeRate: 112.54 } },
];
