import database from '../conf/smartfoodpop.js';

class Usuario {
  static async findByCorreoOrCelular(correo, celular) {
    const { rows } = await database.query(
      'SELECT * FROM usuarios WHERE correo = $1 OR celular = $2',
      [correo, celular]
    );
    return rows;
  }

  static async findByCorreo(correo) {
    const { rows } = await database.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );
    return rows[0];
  }

  static async create({ nombre, correo, celular, contraseña }) {
    const { rows } = await database.query(
      'INSERT INTO usuarios (nombre, correo, celular, contraseña) VALUES ($1, $2, $3, $4) RETURNING id_usuario',
      [nombre, correo, celular, contraseña]
    );
    return rows[0].id_usuario;
  }
}

export default Usuario;