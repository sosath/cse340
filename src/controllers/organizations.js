// Import any needed model functions
import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define any controller functions
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations, pageTitle: title });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id; // Capturamos el parámetro de ruta ':id'
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', { title, organizationDetails, projects, pageTitle: title });
};

// Export any controller functions
export { showOrganizationsPage, showOrganizationDetailsPage };