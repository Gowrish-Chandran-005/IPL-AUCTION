const http = require('http');

const port = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok', message: 'Simple Server is Running!' }));
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Simple Server running on port ${port}`);
});
