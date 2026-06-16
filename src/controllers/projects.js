// Import any needed model functions
import { getUpcomingProjects, getProjectDetails, getCategoriesForProject, createProject, updateProject, isUserVolunteering, addVolunteerToProject, removeVolunteerFromProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects, pageTitle: title });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getCategoriesForProject(projectId);
    const title = 'Project Details';

    let isVolunteering = false;
    if (req.session && req.session.user) {
        isVolunteering = await isUserVolunteering(projectId, req.session.user.user_id);
    }

    res.render('project', {
        title,
        projectDetails,
        categories,
        pageTitle: title,
        isVolunteering
    });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations, pageTitle: title });
};

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    try {
        const projectDetails = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();
        const title = 'Edit Service Project';

        if (!projectDetails) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        res.render('edit-project', {
            title,
            projectDetails,
            organizations,
            pageTitle: title
        });
    } catch (error) {
        console.error('Error fetching data for edit project:', error);
        req.flash('error', 'Error loading edit form.');
        res.redirect('/projects');
    }
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

const processVolunteerRegistration = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await addVolunteerToProject(projectId, userId);
        req.flash('success', 'Thank you for volunteering for this service project!');
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'Could not sign you up as a volunteer.');
    }
    res.redirect(`/project/${projectId}`);
};

const processCancelVolunteering = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    const redirectTarget = req.query.source === 'dashboard' ? '/dashboard' : `/project/${projectId}`;

    try {
        await removeVolunteerFromProject(projectId, userId);
        req.flash('success', 'You have been removed as a volunteer from this project.');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'Could not cancel your volunteer spot.');
    }
    res.redirect(redirectTarget);
};

// Export any controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation,
    processVolunteerRegistration,
    processCancelVolunteering
};