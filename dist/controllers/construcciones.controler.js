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
exports.construccionesInfo = exports.nueva = exports.getConstrucciones = exports.getConstruccionesByAGEE = exports.getCortesByAGEE = void 0;
const database_1 = require("../database");
const getCortesByAGEE = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.body);
    //console.log(req.params.id);
    //res.send('recived');
    try {
        const cve_agee = parseInt(req.params.cve_agee);
        //const response: QueryResult= await pool.query('SELECT public.construcciones.cve_agee, public.construcciones.id_construccion, public.construcciones.concepto, public.nombres_edificios.nombre, ARRAY[ST_X(public.construcciones.geom), ST_Y(public.construcciones.geom)] AS coordinates FROM public.construcciones INNER JOIN public.nombres_edificios ON public.construcciones.id_construccion = public.nombres_edificios.id_construccion WHERE public.construcciones.cve_agee = $1 ORDER BY id_construccion ASC;', [cve_agee]);
        const response = yield database_1.pool.query('SELECT DISTINCT cortes.año as cortes, entidades.cve_agee FROM public.construcciones INNER JOIN cortes ON construcciones.id_construccion = cortes.id_construccion INNER JOIN entidades ON  construcciones.cve_agee=entidades.cve_agee WHERE entidades.cve_agee = $1', [cve_agee]);
        //console.log(response.rows[0]);
        if (response.rowCount > 0) {
            const cortes = response.rows;
            return res.status(200).json({
                "message": "Cortes encontrados exitosamente",
                "status": 200,
                "Respuesta": cortes
            });
        }
        else {
            return res.status(200).json({
                "message": "No hay informacion para esta entidad",
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
exports.getCortesByAGEE = getCortesByAGEE;
const getConstruccionesByAGEE = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.params.id);
    //res.send('recived');
    try {
        const cve_agee = parseInt(req.params.cve_agee);
        const response = yield database_1.pool.query('SELECT public.construcciones.cve_agee, public.construcciones.id_construccion, public.construcciones.concepto, public.nombres_edificios.nombre, ARRAY[ST_X(public.construcciones.geom), ST_Y(public.construcciones.geom)] AS coordinates FROM public.construcciones INNER JOIN public.nombres_edificios ON public.construcciones.id_construccion = public.nombres_edificios.id_construccion WHERE public.construcciones.cve_agee = $1 ORDER BY id_construccion ASC;', [cve_agee]);
        //console.log(response.rows[0]);
        if (response.rowCount > 0) {
            const construcciones = response.rows;
            return res.status(200).json({
                "message": "Construcciones encontradas exitosamente",
                "status": 200,
                "Respuesta": [construcciones]
            });
        }
        else {
            return res.status(200).json({
                "message": "Construcciones encontradas exitosamente",
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
exports.getConstruccionesByAGEE = getConstruccionesByAGEE;
const getConstrucciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT construcciones.id_construccion, public.construcciones.concepto, public.nombres_edificios.nombre, ARRAY[ST_X(public.construcciones.geom), ST_Y(public.construcciones.geom)] AS coordinates FROM public.construcciones INNER JOIN public.nombres_edificios ON public.construcciones.id_construccion = public.nombres_edificios.id_construccion ORDER BY id_construccion ASC;');
        const construcciones = response.rows;
        console.log(construcciones);
        return res.status(200).json({
            "message": "Construcciones encontradas",
            "status": 200,
            "Respuesta": construcciones
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            "message": "Error en el servidor",
            "status": 500
        });
    }
});
exports.getConstrucciones = getConstrucciones;
const nueva = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newConstruccion = req.body;
    try {
        //insertamos la construccion    
        let respuesta = yield database_1.pool.query('INSERT INTO public.construcciones (id_persona, tema, subtema, concepto, geom, cve_agee) VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326), $6) RETURNING public.construcciones.id_construccion', [newConstruccion.id_persona, newConstruccion.tema, newConstruccion.subtema, newConstruccion.concepto, 'POINT(' + newConstruccion.coordinates[0] + ' ' + newConstruccion.coordinates[1] + ')', newConstruccion.cve_agee]);
        //insertamos el nombre de edificio
        const id_construccion = respuesta.rows[0].id_construccion; //obtenemos el ultimo id insertado
        respuesta = yield database_1.pool.query('INSERT INTO public.nombres_edificios (id_construccion, nombre) VALUES ($1, $2)', [id_construccion, newConstruccion.nombre]);
        for (const direccion of newConstruccion.direcciones) {
            respuesta = yield database_1.pool.query('INSERT INTO public.direcciones (id_construccion, direccion) VALUES ($1, $2)', [id_construccion, direccion]);
        }
        for (const corte of newConstruccion.años) {
            respuesta = yield database_1.pool.query('INSERT INTO public.cortes (id_construccion, año) VALUES ($1, $2)', [id_construccion, corte]);
        }
        return res.json({
            message: 'La construccion se creo satisfactoriamente',
            body: {
                construccion: {
                    newConstruccion
                }
            }
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ "error": [e] });
    }
});
exports.nueva = nueva;
const construccionesInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let url = req.protocol + '://' + req.get('host') + req.originalUrl;
    //esto es lo que sale en la pagina web en formato json
    return res.status(200).json({
        "mensaje": "Bienvenido; a la sección de endpoints para personas, que son los siguientes:",
        "status": 200,
        "endpoints": [
            { "Crear una construcción": `${url}/nueva` }
        ]
    });
});
exports.construccionesInfo = construccionesInfo;
