"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const spatyal_controler_1 = require("../controllers/spatyal.controler");
//inicio
router.get('/spatyal/getCapitales', spatyal_controler_1.getCapitales);
router.get('/spatyal/getpl/:cve_agee', spatyal_controler_1.getPL);
router.get('/spatyal/getNombresEntidades/', spatyal_controler_1.getNombresEntidades);
router.get('/spatyal/getNombresMunByEnt/:cve_agee', spatyal_controler_1.getNombresMunByEnt);
router.get('/spatyal/getEntidadPolygon/:cve_agee', spatyal_controler_1.getEntidadPolygon);
router.get('/spatyal/getMunicipioPolygon/:cvegeo', spatyal_controler_1.getMunicipioPolygon);
exports.default = router;
