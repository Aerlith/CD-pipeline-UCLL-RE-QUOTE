import express from 'express';
import * as hpm from 'http-proxy-middleware';
import path, { join } from 'path';
// import livereload from 'livereload';
// import connectLiveReload from 'connect-livereload';
import __dirname from './modules/__dirname.js';

// Load dotenv only if not in production
if (!process.env.ENVIRONMENT) {
    console.warn('NO DOTENV environment found, trying to load dotenv file...')
    const dotenv = await import('dotenv');
    dotenv.config();
}

const PORT = process.env.PORT || 2025;
const APP = express();

// Enable live reload only if ENVIRONMENT is dev
if (process.env.ENVIRONMENT === 'dev') {
    const livereload = await import('livereload');
    const connectLiveReload = (await import('connect-livereload')).default;

    const livereloadServer = livereload.createServer();
    livereloadServer.watch(join(__dirname, '..', 'client'));
    livereloadServer.server.once('connection', () => {
        setTimeout(() => {
            livereloadServer.refresh("/");
        }, 100);
    });

    APP.use(connectLiveReload()); // Must be before static
}

// Serve static files from the current directory
APP.use(express.static(join(__dirname, '..', 'client'), {
    setHeaders: (res) => {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
    }
}));

// Proxy middleware for all unknown routes
APP.use("/", hpm.createProxyMiddleware({
    target: `http://localhost:${PORT}?`,
    changeOrigin: true,
    ws: true
}));

APP.listen(PORT, () => {
    console.log(`App running @ http://localhost:${PORT}`);
});
