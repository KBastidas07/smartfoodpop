import database from '../conf/smartfoodpop.js';

class Usuario {
  static async findByCorreoOrCelular(correo, celular) {
    const [rows] = await database.query(
      'SELECT * FROM usuarios WHERE correo = ? OR celular = ?',
      [correo, celular]
    );
    return rows;
  }

  static async findByCorreo(correo) {
    const [rows] = await database.query(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo]
    );
    return rows[0];
  }

  static async create({ nombre, correo, celular, contraseña }) {
    const [result] = await database.query(
      'INSERT INTO usuarios (nombre, correo, celular, contraseña) VALUES (?, ?, ?, ?)',
      [nombre, correo, celular, contraseña]
    );
    return result.insertId;
  }
}

export default Usuario;