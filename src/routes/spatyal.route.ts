import {Router} from 'express';
const router = Router();

import {getCapitales, getPL, getNombresEntidades, getNombresMunByEnt, getEntidadPolygon, getMunicipioPolygon, getCapital, getPLbyEntAndCut, getRiosByEnt, getCLbyEnt, GetManzanasByEntAndCut, GetVialidadesByEntAndCut,
    GetRasgosByEntAndCut, getConceptosCutAndEnt, getAcontecimientosByRasgo, updateAcontecimiento, insertAcontecimiento, getAnios, insertRasgo, getFotos
} from "../controllers/spatyal.controler";
import { authMiddleware } from '../middlewares/auth.middlewares';
//inicio
router.get('/spatyal/getCapitales', getCapitales);
router.get('/spatyal/getpl/:cve_agee', getPL);
router.get('/spatyal/getNombresEntidades/', getNombresEntidades);
router.get('/spatyal/getNombresMunByEnt/:cve_agee', getNombresMunByEnt);
router.get('/spatyal/getEntidadPolygon/:cve_agee', getEntidadPolygon);
router.get('/spatyal/getMunicipioPolygon/:cvegeo', getMunicipioPolygon);
router.get('/spatyal/getCapital/:cve_agee', getCapital);
router.get('/spatyal/getPLbyEntAndCut/:id_capital/:id_anio/', getPLbyEntAndCut);
router.get('/spatyal/getRiosByEnt/:cve_agee', getRiosByEnt);
router.get('/spatyal/getCLbyEnt/:cve_agee', getCLbyEnt);
router.get('/spatyal/GetManzanasByEntAndCut/:id_capital/:id_anio/', GetManzanasByEntAndCut);
router.get('/spatyal/GetVialidadesByEntAndCut/:id_capital/:id_anio/', GetVialidadesByEntAndCut);
router.get('/spatyal/GetRasgosByEntAndCut/:id_capital/:id_anio/:id_concepto', GetRasgosByEntAndCut);
router.get('/spatyal/getConceptosCutAndEnt/:id_capital/:id_anio/', getConceptosCutAndEnt);
router.get('/spatyal/getAcontecimientosByRasgo/:id_rasgo/', getAcontecimientosByRasgo);
router.put('/spatyal/updateAcontecimiento/:id_acontecimiento', authMiddleware, updateAcontecimiento);
router.post('/spatyal/insertAcontecimiento', authMiddleware, insertAcontecimiento);
router.get('/spatyal/getAnios/:id_capital', getAnios);
router.post('/spatyal/rasgo/crear', authMiddleware, insertRasgo);
router.get('/spatyal/getFotos/:id_rasgo/:id_anio', getFotos);

export default router;