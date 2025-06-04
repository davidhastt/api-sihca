import {Router} from 'express';
const router = Router();

import {getCapitales} from "../controllers/spatyal.controler";
//inicio
router.get('/spatyal/getCapitales', getCapitales);


export default router;