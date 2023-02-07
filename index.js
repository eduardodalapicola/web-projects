require('dotenv').config()
const http = require('http')
const url = require('url')
const routes = require('./src/routes')

const {hostname, port} = url.parse(process.env.APP_URL || 'http://localhost:80')

function startServer(port, host) {
    const server = http.createServer(routes.listener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}


startServer(port, hostname)
