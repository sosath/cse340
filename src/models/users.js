import db from './db.js';

/**
 * Inserta un nuevo usuario en la base de datos asignándole el rol predeterminado 'user'.
 * @param {string} name - Nombre completo del usuario
 * @param {string} email - Correo electrónico (servirá como username)
 * @param {string} passwordHash - Contraseña ya triturada con bcrypt
 * @returns {Promise<number>} El ID del usuario creado
 */
const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';

    // Esta consulta usa una subconsulta (SELECT) para buscar dinámicamente el id del rol 'user'
    const query = `
        INSERT INTO public.users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM public.roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

export { createUser };