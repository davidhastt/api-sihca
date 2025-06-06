import {Router} from 'express';
const router = Router();

import {getCapitales, getPL} from "../controllers/spatyal.controler";
//inicio
router.get('/spatyal/getCapitales', getCapitales);
router.get('/spatyal/getpl/:cve_loc', getPL);


export default router;