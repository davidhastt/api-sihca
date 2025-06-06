"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const spatyal_controler_1 = require("../controllers/spatyal.controler");
//inicio
router.get('/spatyal/getCapitales', spatyal_controler_1.getCapitales);
router.get('/spatyal/getpl/:cve_loc', spatyal_controler_1.getPL);
exports.default = router;
