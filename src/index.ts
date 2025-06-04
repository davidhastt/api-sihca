import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import info from './routes/info.route';
import infoPersonas from './routes/personas.route';
import infoConstrucciones from './routes/construcciones.route';
import spatyalInfo from './routes/spatyal.route';


// Carga las variables desde el archivo .env
dotenv.config()


const app = express();
//middlewares
app.use(express.json());//convertir datos en objetos json
app.use(express.urlencoded({extended:false}));//convertir datos de formularios html en objetos json
//Quitar la politica de cors para permitir solicitudes de cualquier origen
app.use(cors());
//Habilitar rutas
app.use(info);
app.use(infoPersonas);
app.use(infoConstrucciones);
app.use(spatyalInfo);


const puerto=process.env.PORT

app.listen(puerto);
console.log(`NodeJS esta corriendo en el puerto ${puerto}`);



