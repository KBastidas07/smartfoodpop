import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Configurar rutas para que dotenv encuentre el archivo .env correctamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//// Cargar variables de entorno desde .env
dotenv.config({ path: join(__dirname, "..", "..", "..", ".env"), quiet: true });

const { Pool } = pg;

const database = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 5432),
  max: 10,
});

// Probar la conexión a la base de datos
const testConnection = async () => {
  try {
    const connection = await database.connect();
    console.log("Conexión a la base de datos establecida correctamente");
    connection.release();
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

// Ejecutar la comprobación una vez al importar este módulo
testConnection();

export default database;
