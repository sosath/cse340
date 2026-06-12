import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';

/**
 * Renderiza la vista del formulario de registro.
 */
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register', pageTitle: 'Register' });
};

/**
 * Procesa los datos del formulario, aplica hashing a la contraseña y guarda al usuario.
 */
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Genera el "Salt" y tritura la contraseña con 10 rondas de procesamiento
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Envía los datos limpios (con el hash) al modelo para guardarlo en Postgres
        const userId = await createUser(name, email, passwordHash);

        // Mensaje flash de éxito y redirección a la página principal
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

export { showUserRegistrationForm, processUserRegistrationForm };