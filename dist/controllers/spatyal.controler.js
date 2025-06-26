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
exports.getPL = exports.getCapitales = exports.getNombresEntidades = exports.getNombresMunByEnt = exports.getEntidadPolygon = exports.getMunicipioPolygon = exports.getCapital = exports.getPLbyEntAndCut = void 0;
const database_1 = require("../database");
const getPLbyEntAndCut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const cve_loc =req.body.cve_loc;
    const cve_agee = req.params.cve_agee;
    const cut = req.params.cut;
    //console.log(cve_agee);
    //convertir en geojson
    let query = "SELECT json_build_object(" +
        "'type', 'FeatureCollection'," +
        "'features', json_agg(" +
        "json_build_object(" +
        "'type', 'Feature'," +
        "'geometry', ST_AsGeoJSON(geom)::json," +
        "'properties', json_build_object(" +
        "'cve_agee', cve_agee," +
        "'anio', anio" +
        ")" +
        ")" +
        ")" +
        ") AS geojson " +
        "FROM " +
        "pl " +
        "WHERE " +
        "anio < 2000 AND cve_agee ='15'";
    //console.log(query);
    try {
        const response = yield database_1.pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ "error": ["Error interno en el servidor"] });
    }
});
exports.getPLbyEntAndCut = getPLbyEntAndCut;
const getCapital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const cve_loc =req.body.cve_loc;
    const cve_agee = req.params.cve_agee;
    console.log(cve_agee);
    //convertir en geojson
    let query = "SELECT json_build_object(" +
        "'type', 'FeatureCollection'," +
        "'features', json_agg(" +
        "json_build_object(" +
        "'type', 'Feature'," +
        "'geometry', ST_AsGeoJSON(geom)::json," +
        "'properties', json_build_object(" +
        "'cve_agee', cve_agee," +
        "'nom_agee', nom_agee," +
        "'capital', capital" +
        ")" +
        ")" +
        ")" +
        ") AS geojson " +
        "FROM " +
        "capitales " +
        "WHERE cve_agee ='" + cve_agee + "'";
    //console.log(query);
    try {
        const response = yield database_1.pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ "error": ["Error interno en el servidor"] });
    }
});
exports.getCapital = getCapital;
const getMunicipioPolygon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const cve_loc =req.body.cve_loc;
    const cvegeo = req.params.cvegeo;
    //console.log(cve_agee);
    //convertir en geojson
    let query = "SELECT json_build_object(" +
        "'type', 'FeatureCollection'," +
        "'features', json_agg(" +
        "json_build_object(" +
        "'type', 'Feature'," +
        "'geometry', ST_AsGeoJSON(geom)::json," +
        "'properties', json_build_object(" +
        "'cve_agee', cve_agee," +
        "'nomgeo', nomgeo," +
        "'X', ST_X(ST_Centroid(geom))," +
        "'Y', ST_Y(ST_Centroid(geom))" +
        ")" +
        ")" +
        ")" +
        ") AS geojson " +
        "FROM " +
        "municipios " +
        "WHERE cvegeo ='" + cvegeo + "';";
    //console.log(query);
    try {
        const response = yield database_1.pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ "error": ["Error interno en el servidor"] });
    }
});
exports.getMunicipioPolygon = getMunicipioPolygon;
const getEntidadPolygon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const cve_loc =req.body.cve_loc;
    const cve_agee = req.params.cve_agee;
    //console.log(cve_agee);
    //convertir en geojson
    let query = "SELECT json_build_object(" +
        "'type', 'FeatureCollection'," +
        "'features', json_agg(" +
        "json_build_object(" +
        "'type', 'Feature'," +
        "'geometry', ST_AsGeoJSON(geom)::json," +
        "'properties', json_build_object(" +
        "'cve_agee', cve_agee," +
        "'nomgeo', nomgeo," +
        "'X', ST_X(ST_Centroid(geom))," +
        "'Y', ST_Y(ST_Centroid(geom))" +
        ")" +
        ")" +
        ")" +
        ") AS geojson " +
        "FROM " +
        "entidades " +
        "WHERE cve_agee ='" + cve_agee + "';";
    //console.log(query);
    try {
        const response = yield database_1.pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ "error": ["Error interno en el servidor"] });
    }
});
exports.getEntidadPolygon = getEntidadPolygon;
const getNombresMunByEnt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.params.id);
    //res.send('recived');
    try {
        const cve_agee = req.params.cve_agee;
        //console.log(cve_agee);
        const response = yield database_1.pool.query('SELECT id_municipio, cvegeo, nomgeo, ST_X(ST_Centroid(geom)) AS X, ST_Y(ST_Centroid(geom)) AS Y  FROM public.municipios WHERE cve_agee = $1', [cve_agee]);
        //console.log(response.rows[0]);
        if (response.rowCount > 0) {
            const muns = response.rows;
            return res.status(200).json({
                "message": "Municipios encontrados",
                "status": 200,
                "Respuesta": [muns]
            });
        }
        else {
            return res.status(200).json({
                "message": "Persona encontrada",
                "status": 200,
                "Respuesta": []
            });
        }
    }
    catch (_a) {
        return res.status(500).json({
            "message": "Error en el servidor",
            "status": 500
        });
    }
});
exports.getNombresMunByEnt = getNombresMunByEnt;
const getNombresEntidades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const cve_loc =req.body.cve_loc;
    let query = 'SELECT id_entidad, cve_agee, nomgeo, ST_X(ST_Centroid(geom)) AS X, ST_Y(ST_Centroid(geom)) AS Y FROM entidades;';
    try {
        const response = yield database_1.pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ "error": [`NodeJS dice ${e}`] });
    }
});
exports.getNombresEntidades = getNombresEntidades;
const getCapitales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query = 'SELECT cve_agee, nom_agee, capital, pobtot, altitud,  ST_X(geom) AS x, ST_Y(geom) AS y FROM capitales ORDER BY capital;';
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
    //const cve_loc =req.body.cve_loc;
    const cve_agee = req.params.cve_agee;
    console.log(cve_agee);
    //convertir en geojson
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
        "WHERE cve_agee ='" + cve_agee + "';";
    try {
        const response = yield database_1.pool.query(query);
        console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ "error": ["Error interno en el servidor"] });
    }
});
exports.getPL = getPL;
