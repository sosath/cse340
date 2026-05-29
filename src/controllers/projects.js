// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects'; // Título actualizado

    res.render('projects', { title, projects, pageTitle: title });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const title = 'Project Details';

    res.render('project', { title, projectDetails, pageTitle: title });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };