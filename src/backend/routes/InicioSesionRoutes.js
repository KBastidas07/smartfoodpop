import express from 'express';
import {
  register,
  login
} from '../controllers/inicioSesionController.js';

const router = express.Router();

// Registrar un nuevo usuario
router.post('/registrarUsuario', register);

// Iniciar sesión
router.post('/iniciarSesion', login);

export default router;