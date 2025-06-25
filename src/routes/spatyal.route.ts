import {Router} from 'express';
const router = Router();

import {getCapitales, getPL, getNombresEntidades, getNombresMunByEnt, getEntidadPolygon, getMunicipioPolygon, getCapital} from "../controllers/spatyal.controler";
//inicio
router.get('/spatyal/getCapitales', getCapitales);
router.get('/spatyal/getpl/:cve_agee', getPL);
router.get('/spatyal/getNombresEntidades/', getNombresEntidades);
router.get('/spatyal/getNombresMunByEnt/:cve_agee', getNombresMunByEnt);
router.get('/spatyal/getEntidadPolygon/:cve_agee', getEntidadPolygon);
router.get('/spatyal/getMunicipioPolygon/:cvegeo', getMunicipioPolygon);
router.get('/spatyal/getCapital/:cve_agee', getCapital);


export default router;