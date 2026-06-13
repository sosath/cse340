import db from './db.js';
import bcrypt from 'bcrypt';

/**
 * Inserta un nuevo usuario en la base de datos asignándole el rol predeterminado 'user'.
 */
const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';

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

/**
 * Busca un usuario en la base de datos a través de su correo electrónico,
 * incluyendo el nombre de su rol mediante un JOIN con la tabla roles.
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM public.users u
        JOIN public.roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // Usuario no encontrado
    }

    return result.rows[0];
};

/**
 * Obtiene todos los usuarios registrados en el sistema ordenados por nombre.
 * @returns {Promise<Array>} Lista de usuarios con id, nombre, email y nombre de rol.
 */
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name 
        FROM public.users u
        JOIN public.roles r ON u.role_id = r.role_id
        ORDER BY u.name ASC
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Compara una contraseña en texto plano con el hash seguro almacenado en la base de datos.
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Autentica a un usuario verificando sus credenciales.
 */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return null; // Usuario no encontrado
    }

    const isPasswordCorrect = await verifyPassword(password, user.password_hash);
    if (!isPasswordCorrect) {
        return null; // Contraseña incorrecta
    }

    delete user.password_hash;

    return user;
};

export { createUser, authenticateUser, getAllUsers };