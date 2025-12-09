const http = require('http');

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] REQUEST: ${req.method} ${req.url}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Standalone Server Running!' }));
});

server.listen(port, '0.0.0.0', () => {
    console.log(`STANDALONE SERVER LISTENING ON PORT ${port}`);
});
