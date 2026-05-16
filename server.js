import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
  * Configure Express middleware
  */

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

/**
  * Routes
  */
const routes = [
  { path: '/', view: 'home', title: 'Home' },
  { path: '/organizations', view: 'organizations', title: 'Organizations' },
  { path: '/projects', view: 'projects', title: 'Service Projects' },
  { path: '/categories', view: 'categories', title: 'Categories' }
];

routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.render(route.view, { pageTitle: route.title });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});