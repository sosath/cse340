import express from 'express';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm, projectValidation } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, requireRole } from './controllers/users.js';

const router = express.Router();

// Public General Routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Organizations Management (ADMIN ONLY)
// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Projects Management (ADMIN ONLY)
// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Route to display the edit project form
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);

// Route to handle the edit project form submission
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// Categories Management (ADMIN ONLY)
// Routes for creating categories
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

// Routes for category editing
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// User Authentication & Dashboard
// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route (Requires regular login)
router.get('/dashboard', requireLogin, showDashboard);

// Dynamic Details Routes (Public)
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);

// Error Handling Routes
router.get('/test-error', testErrorPage);

export default router;