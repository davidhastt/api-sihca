import {Router} from 'express';
const router = Router();

import {getCapitales, getPL, getNombresEntidades, getNombresMunByEnt, getEntidadPolygon, getMunicipioPolygon, getCapital, getPLbyEntAndCut, getRiosByEnt, getCLbyEnt, GetManzanasByEntAndCut, GetVialidadesByEntAndCut,
    GetRasgosByEntAndCut, getConceptosCutAndEnt
} from "../controllers/spatyal.controler";
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
router.get('/spatyal/GetRasgosByEntAndCut/:id_capital/:id_anio/', GetRasgosByEntAndCut);
router.get('/spatyal/getConceptosCutAndEnt/:id_capital/:id_anio/', getConceptosCutAndEnt);



export default router;