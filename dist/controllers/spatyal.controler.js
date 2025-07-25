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
exports.getPL = exports.getCapitales = exports.getNombresEntidades = exports.getNombresMunByEnt = exports.getEntidadPolygon = exports.getMunicipioPolygon = exports.getCapital = exports.getPLbyEntAndCut = exports.getRiosByEnt = exports.getCLbyEnt = exports.GetManzanasByEntAndCut = exports.GetVialidadesByEntAndCut = exports.GetRasgosByEntAndCut = exports.getConceptosCutAndEnt = exports.getAcontecimientosByRasgo = void 0;
const database_1 = require("../database");
const getAcontecimientosByRasgo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.params.id);
    //res.send('recived');
    try {
        const id_rasgo = req.params.id_rasgo;
        //console.log(cve_agee);
        const response = yield database_1.pool.query(`SELECT id_acontecimiento, id_rasgo, fecha, acontecimiento FROM public.acontecimientos WHERE id_rasgo=$1;`, [id_rasgo]);
        if (response.rowCount > 0) {
            const aconts = response.rows;
            return res.status(200).json({
                "message": "Acontecimientos encontrados",
                "status": 200,
                "Respuesta": aconts
            });
        }
        else {
            return res.status(200).json({
                "message": "Rasgo no encontrado",
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
exports.getAcontecimientosByRasgo = getAcontecimientosByRasgo;
const getConceptosCutAndEnt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.params.id);
    //res.send('recived');
    try {
        const id_anio = req.params.id_anio;
        const id_capital = req.params.id_capital;
        //console.log(cve_agee);
        const response = yield database_1.pool.query('SELECT DISTINCT conceptos.id_concepto, conceptos.nom_concepto FROM direcciones LEFT JOIN rasgos ON direcciones.id_rasgo = rasgos.id_rasgo ' +
            'LEFT JOIN conceptos ON rasgos.id_concepto = conceptos.id_concepto WHERE direcciones.id_anio = $1 AND rasgos.id_capital=$2 ' +
            'ORDER BY conceptos.id_concepto;', [id_anio, id_capital]);
        //console.log(response.rows[0]);
        if (response.rowCount > 0) {
            const conceps = response.rows;
            //const muns: Municipio[] = response.rows;            
            return res.status(200).json({
                "message": "Conceptos encontrados encontrados",
                "status": 200,
                "Respuesta": conceps
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
    catch (_b) {
        return res.status(500).json({
            "message": "Error en el servidor",
            "status": 500
        });
    }
});
exports.getConceptosCutAndEnt = getConceptosCutAndEnt;
const GetRasgosByEntAndCut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const cve_loc =req.body.cve_loc;
    const id_capital = req.params.id_capital;
    const id_anio = req.params.id_anio;
    const id_concepto = req.params.id_concepto;
    //console.log(id_anio, id_capital);
    //convertir en geojson		
    let query = `SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(
                json_build_object(
                'type', 'Feature',
                'geometry', ST_AsGeoJSON(direcciones.geom)::json,
                'properties', json_build_object(            
                    'id_rasgo', nombres_rasgos.id_rasgo,
                    'id_concepto', rasgos.id_concepto,
                    'nom_concepto', conceptos.nom_concepto,
                    'nom_rasgo', nombres_rasgos.nombre, 
                    'direccion', direcciones.direccion	
                )
                )
            )
            ) AS geojson 
            FROM 
            conceptos 
            LEFT JOIN rasgos ON conceptos.id_concepto = rasgos.id_concepto
            LEFT JOIN nombres_rasgos ON rasgos.id_rasgo = nombres_rasgos.id_rasgo
            LEFT JOIN direcciones ON rasgos.id_rasgo = direcciones.id_rasgo
            WHERE 
            conceptos.id_concepto=${id_concepto} AND rasgos.id_capital=${id_capital} AND nombres_rasgos.id_anio = ${id_anio} AND direcciones.id_anio = ${id_anio};`;
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
exports.GetRasgosByEntAndCut = GetRasgosByEntAndCut;
const GetVialidadesByEntAndCut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const cve_loc =req.body.cve_loc;
    const id_anio = req.params.id_anio;
    const id_capital = req.params.id_capital;
    //console.log(id_anio, id_capital);
    //convertir en geojson
    let query = "SELECT json_build_object(" +
        "'type', 'FeatureCollection'," +
        "'features', json_agg(" +
        "json_build_object(" +
        "'type', 'Feature'," +
        "'geometry', ST_AsGeoJSON(geom)::json," +
        "'properties', json_build_object(" +
        "'id_capital', id_capital," +
        "'id_anio', id_anio" +
        ")" +
        ")" +
        ")" +
        ") AS geojson " +
        "FROM " +
        "vialidades " +
        "WHERE " +
        "id_anio = " + id_anio + " AND id_capital =" + id_capital + ";";
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
exports.GetVialidadesByEntAndCut = GetVialidadesByEntAndCut;
const GetManzanasByEntAndCut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const cve_loc =req.body.cve_loc;
    const id_anio = req.params.id_anio;
    const id_capital = req.params.id_capital;
    //console.log(id_anio, id_capital);
    //convertir en geojson
    let query = "SELECT json_build_object(" +
        "'type', 'FeatureCollection'," +
        "'features', json_agg(" +
        "json_build_object(" +
        "'type', 'Feature'," +
        "'geometry', ST_AsGeoJSON(geom)::json," +
        "'properties', json_build_object(" +
        "'id_capital', id_capital," +
        "'id_anio', id_anio" +
        ")" +
        ")" +
        ")" +
        ") AS geojson " +
        "FROM " +
        "manzanas " +
        "WHERE " +
        "id_anio = " + id_anio + " AND id_capital =" + id_capital + ";";
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
exports.GetManzanasByEntAndCut = GetManzanasByEntAndCut;
const getCLbyEnt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        "'altura', altura" +
        ")" +
        ")" +
        ")" +
        ") AS geojson " +
        "FROM " +
        "curvas " +
        "WHERE " +
        "cve_agee ='" + cve_agee + "'";
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
exports.getCLbyEnt = getCLbyEnt;
const getRiosByEnt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        "'descripcion', descripcion" +
        ")" +
        ")" +
        ")" +
        ") AS geojson " +
        "FROM " +
        "rios " +
        "WHERE " +
        "cve_agee ='15'";
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
exports.getRiosByEnt = getRiosByEnt;
const getPLbyEntAndCut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const cve_loc =req.body.cve_loc;
    const id_anio = req.params.id_anio;
    const id_capital = req.params.id_capital;
    //console.log(id_anio, id_capital);
    //convertir en geojson
    let query = "SELECT json_build_object(" +
        "'type', 'FeatureCollection'," +
        "'features', json_agg(" +
        "json_build_object(" +
        "'type', 'Feature'," +
        "'geometry', ST_AsGeoJSON(geom)::json," +
        "'properties', json_build_object(" +
        "'id_capital', id_capital," +
        "'id_anio', id_anio" +
        ")" +
        ")" +
        ")" +
        ") AS geojson " +
        "FROM " +
        "pl " +
        "WHERE " +
        "id_anio = " + id_anio + " AND id_capital =" + id_capital + ";";
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
    catch (_c) {
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
        //console.log(response.rows);
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
    //console.log(cve_agee);
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
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ "error": ["Error interno en el servidor"] });
    }
});
exports.getPL = getPL;
