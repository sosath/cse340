import db from './db.js';

const getAllCategories = async () => {
  const query = 'SELECT category_id, name FROM public.category ORDER BY name ASC;';
  const result = await db.query(query);
  return result.rows;
};

const getCategoryDetails = async (categoryId) => {
  const query = `
      SELECT
        category_id,
        name
      FROM public.category
      WHERE category_id = $1;
    `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByCategory = async (categoryId) => {
  const query = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.location,
        p.date
      FROM public.project p
      INNER JOIN public.project_category pc ON p.project_id = pc.project_id
      WHERE pc.category_id = $1
      ORDER BY p.date;
    `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
  const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

  await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
  await db.query(deleteQuery, [projectId]);

  if (!categoryIds || categoryIds.length === 0) {
    return;
  }

  for (const categoryId of categoryIds) {
    await assignCategoryToProject(categoryId, projectId);
  }
};

// Export all needed model functions
export { getAllCategories, getCategoryDetails, getProjectsByCategory, updateCategoryAssignments };