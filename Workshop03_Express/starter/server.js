const express = require('express');
const path = require('path');

// ========================================
// TODO: Task 1 - Create Express App
// ========================================
// Step 1: Create an Express application instance
const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// TODO: Task 2 - Serve Static Files
// ========================================
// Configure Express to serve static files from the 'public' directory
// This middleware automatically serves HTML, CSS, images, etc.
app.use(express.static(path.join(__dirname, 'public')));

// ========================================
// BONUS: Custom Request Logging Middleware
// ========================================
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ========================================
// TODO: Task 3 - Add Route Handlers
// ========================================

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// About page route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Contact page route
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// ========================================
// TODO: Task 4 - Create API Endpoint
// ========================================
// Create a JSON API endpoint that returns current date/time

const apiRouter = express.Router();

apiRouter.get('/time', (req, res) => {
    const now = new Date();
    res.json({
        datetime: now.toISOString(),
        timestamp: now.getTime()
    });
});

apiRouter.get('/info', (req, res) => {
    res.json({
        name: 'Workshop03 Express Server',
        version: '1.0.0',
        nodeVersion: process.version
    });
});

app.use('/api', apiRouter);

// ========================================
// TODO: Task 5 - Error Handling Middleware
// ========================================

// 404 Handler - Must be placed AFTER all other routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'), (err) => {
        if (err) {
            console.error('Error sending 404 page:', err);
            res.status(404).send('<h1>404 - Page Not Found</h1>');
        }
    });
});

// 500 Error Handler - Must be placed LAST
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).sendFile(path.join(__dirname, 'public', '500.html'), (sendErr) => {
        if (sendErr) {
            res.status(500).send('<h1>500 - Internal Server Error</h1>');
        }
    });
});

// ========================================
// Start the Server
// ========================================
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log('\n📍 Available routes:');
    console.log('  GET /              -> Home page');
    console.log('  GET /about         -> About page');
    console.log('  GET /contact       -> Contact page');
    console.log('  GET /api/time      -> Current date/time API');
    console.log('  GET /api/info      -> Server information API');
    console.log('\n⏹️  Press Ctrl+C to stop the server\n');
});