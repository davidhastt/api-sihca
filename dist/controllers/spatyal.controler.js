"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPL = exports.getCapitales = void 0;
const database_1 = require("../database");
const getCapitales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query = 'SELECT cve_agee, nom_agee, capital, pobtot, altitud,  ST_X(geom) AS x, ST_Y(geom) AS y FROM capitales;';
    try {
        const response = yield database_1.pool.query(query);
        console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ "error": [`NodeJS dice ${e}`] });
    }
});
exports.getCapitales = getCapitales;
const getPL = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cve_loc = req.body.cve_loc;
    let query = "SELECT json_build_object(" +
        "'type', 'FeatureCollection', " +
        "'features', json_agg( " +
        "json_build_object( " +
        "'type', 'Feature', " +
        "'geometry', ST_AsGeoJSON(wkb_geometry)::json, " +
        "'properties', json_build_object( " +
        "'cve_loc', cve_loc,  " +
        "'nomloc', nomloc,  " +
        "'anio', anio " +
        ") " +
        ") " +
        ") " +
        ") AS poligonosLocalidad " +
        "FROM pl " +
        "WHERE cve_loc ='" + cve_loc + "';";
    try {
        const response = yield database_1.pool.query(query);
        console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ "error": [`NodeJS dice ${e}`] });
    }
});
exports.getPL = getPL;
