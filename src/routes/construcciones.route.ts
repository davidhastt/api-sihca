import {Router} from 'express';
import {authMiddleware} from '../middlewares/auth.middlewares';
import {construccionesInfo, nueva, getConstrucciones, getConstruccionesByAGEE, getCortesByAGEE} from "../controllers/construcciones.controler";

const router = Router();
//inicio
router.get('/construcciones', construccionesInfo);
router.get('/construcciones/all', getConstrucciones);
router.post('/construcciones/nueva', authMiddleware, nueva);
router.get('/construcciones/:cve_agee', getConstruccionesByAGEE);
router.get('/construcciones/cortes/:cve_agee', getCortesByAGEE);




export default router;