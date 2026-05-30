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

export { getAllCategories, getCategoryDetails, getProjectsByCategory };