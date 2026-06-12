import db from './db.js';
import bcrypt from 'bcrypt';

/**
 * Inserta un nuevo usuario en la base de datos asignándole el rol predeterminado 'user'.
 * @param {string} name - Nombre completo del usuario
 * @param {string} email - Correo electrónico (servirá como username)
 * @param {string} passwordHash - Contraseña ya triturada con bcrypt
 * @returns {Promise<number>} El ID del usuario creado
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
 * Busca un usuario en la base de datos a través de su correo electrónico.
 * @param {string} email - Correo electrónico a buscar.
 * @returns {Promise<Object|null>} El objeto del usuario si existe, o null si no se encuentra.
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role_id 
        FROM public.users 
        WHERE email = $1
    `;
    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // Usuario no encontrado
    }

    return result.rows[0];
};

/**
 * Compara una contraseña en texto plano con el hash seguro almacenado en la base de datos.
 * @param {string} password - Contraseña ingresada en el formulario de login.
 * @param {string} passwordHash - Hash seguro de la base de datos.
 * @returns {Promise<boolean>} True si coinciden, false si no.
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Autentica a un usuario verificando sus credenciales.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object|null>} El objeto del usuario sin el hash de la contraseña, o null si falla.
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

export { createUser, authenticateUser };