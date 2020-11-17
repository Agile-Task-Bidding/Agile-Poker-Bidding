const http = require('http');
const https = require('https');
const fs = require('fs');

module.exports = (expressApp) => {
    // Run HTTPS server if in production
    if (process.env.NODE_ENV === 'production') {
        const credentials = {
            key: fs.readFileSync(process.env.CERT_KEY_PATH, 'utf8'),
            cert: fs.readFileSync(process.env.CERT_PATH, 'utf8'),
            ca: fs.readFileSync(process.env.CERT_AUTHORITY_PATH, 'utf8')
        };

        const server = https.createServer(credentials, expressApp);
        const port = process.env.WEBSITE_PORT || 443;
        server.listen(port, () => {
            console.log(`HTTPS Server running on port ${port}`);
        });
        return server;
    }

    // HTTP otherwise
    const server = http.createServer(expressApp);
    const port = process.env.WEBSITE_PORT || 80;
    server.listen(port, () => {
        console.log(`HTTP Server running on port ${port}`);
    });
    return server;
}
