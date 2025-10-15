
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app build directory
const frontendRoot = path.join(__dirname, '..');

// Express middleware
app.use(express.json());
app.use(express.static(frontendRoot));
app.use(express.static(path.join(frontendRoot, 'public')));


// API routes can go here
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
