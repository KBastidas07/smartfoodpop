import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/inicioSesionModel.js';

export const register = async (req, res) => {
  try {
    const { nombre, correo, celular, contraseña } = req.body;

    if (!nombre || !correo || !celular || !contraseña) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son obligatorios'
      });
    }

    const existentes = await UserModel.findByCorreoOrCelular(correo, celular);

    if (existentes.length > 0) {
      const correoRepetido = existentes.some(u => u.correo === correo);
      const celularRepetido = existentes.some(u => u.celular === celular);

      return res.status(409).json({
        status: 'error',
        message: correoRepetido && celularRepetido
          ? 'El correo y el celular ya están registrados'
          : correoRepetido
            ? 'El correo ya está registrado'
            : 'El celular ya está registrado'
      });
    }

    const contraseñaHasheada = await bcrypt.hash(contraseña, 10);

    const idUsuario = await UserModel.create({
      nombre,
      correo,
      celular,
      contraseña: contraseñaHasheada
    });

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado exitosamente',
      id_usuario: idUsuario
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error del servidor al registrar usuario'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({
        status: 'error',
        message: 'Correo y contraseña son obligatorios'
      });
    }

    const usuario = await UserModel.findByCorreo(correo);

    if (!usuario) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    const coincide = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!coincide) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error del servidor al iniciar sesión'
    });
  }
};