import express from 'express';
import database from './conf/smartfoodpop.js';
import inicioSesionRoutes from './routes/InicioSesionRoutes.js';


const app = express();

//Middleware para leer JSON
app.use(express.json());

//Ruta de prueba
app.get("/api/testdb", async (req, res) => {
  try {
    const [rows] = await database.query("SELECT 1 + 1 AS result");
    res.json({
      status: "success",
      message: "Conexión a la base de datos exitosa",
      results: rows,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error en la consulta a la base de datos",
      error: error.message,
    });
  }
});




//Configuración de rutas
app.use('/api/inicioSesion', inicioSesionRoutes);






export default app;