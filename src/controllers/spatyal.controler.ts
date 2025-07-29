import { Request, Response } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";
import { Municipio } from "../interfaces/municipio.interface";
import { Concepto } from "../interfaces/concepto.interface";
import { Acontecimiento } from "../interfaces/acontecimiento.interface";
import { Anio } from "../interfaces/anios.interface";
import { Rasgo } from "../interfaces/rasgo.interface";


export const insertRasgo=async (req:Request, res:Response): Promise<Response>=>{

    try{               
        let newRasgo:Rasgo= req.body;        

        let response: QueryResult = await pool.query('INSERT INTO public.rasgos(id_persona, id_tema, id_subtema, id_concepto, id_capital) VALUES ($1, $2, $3, $4, $5) RETURNING public.rasgos.id_rasgo;',[newRasgo.id_persona, newRasgo.id_tema, newRasgo.id_subtema, newRasgo.id_concepto, newRasgo.id_capital]);
        
         newRasgo.id_rasgo= response.rows[0].id_rasgo; //obtenemos el ultimo id insertado
        
        
        response = await pool.query('INSERT INTO public.nombres_rasgos(id_rasgo, nombre, id_anio) VALUES ($1, $2, $3);',[newRasgo.id_rasgo, newRasgo.nombre, newRasgo.id_anio]);


        response = await pool.query('INSERT INTO public.direcciones(id_rasgo, direccion, geom, id_anio) VALUES ($1, $2, ST_GeomFromText($3, 4326), $4);',[newRasgo.id_rasgo, newRasgo.direccion, 'POINT('+ newRasgo.coordinates[0]+' '+ newRasgo.coordinates[1]+')', newRasgo.id_anio]);



        return res.json({
            message: 'El rasgo se creo satisfactoriamente',
            body:{
                acontecimiento:{
                    newRasgo                    
                }
            }
        })
    }
    catch(e){
        console.log(e);    
        return res.status(500).json({"error": ["Ocurrió un error en el servidor."]});
    }    

}



export const getAnios=async (req:Request, res:Response): Promise<Response>=>{// con esta consulta sabemos cuantos conceptos de rasgos existen
    //console.log(req.params.id);
    //res.send('recived');
    try{

        const id_capital=req.params.id_capital;

        const response: QueryResult= await pool.query('SELECT * FROM public.anios WHERE id_capital=$1', [id_capital]);    

        if (response.rowCount > 0){

            const anios: Anio[]= response.rows;

            //const muns: Municipio[] = response.rows;            
            return res.status(200).json({
                "message":"Anios encontrados",
                "status":200,
                "Respuesta": anios
            });             
        }
        else{
            return res.status(200).json({
                "message":"No se encontro ningun año",
                "status":200,
                "Respuesta": []
            }); 
        }
            
    }
    catch{
        return res.status(500).json({
            "message":"Error en el servidor",
            "status":500
        });
    }
}



export const insertAcontecimiento=async (req:Request, res:Response): Promise<Response>=>{//falta quitar el password de la respuesta

    try{        
        let newAconte:Acontecimiento= req.body;        
        const response: QueryResult = await pool.query('INSERT INTO public.acontecimientos(id_rasgo, fecha, acontecimiento) VALUES ($1, $2, $3);',[newAconte.id_rasgo, newAconte.fecha, newAconte.acontecimiento]);
        
        return res.json({
            message: 'El acontecimiento se creo satisfactoriamente',
            body:{
                acontecimiento:{
                    newAconte                    
                }
            }
        })
    }
    catch(e){
        console.log(e);    
        return res.status(500).json({"error": ["Ocurrió un error en el servidor."]});
    }    

}




export const updateAcontecimiento=async (req:Request, res:Response): Promise<Response>=>{
    try{
        const aconte:Acontecimiento= req.body;
        aconte.id_acontecimiento=parseInt(req.params.id_acontecimiento);

        await pool.query('UPDATE public.acontecimientos	SET  fecha=$1, acontecimiento=$2 WHERE id_acontecimiento=$3', [aconte.fecha, aconte.acontecimiento, aconte.id_acontecimiento]);

        //console.log(`El acontecimiento con id_acontecimiento =  ${aconte.id_acontecimiento} fue actualizada`);
        return res.status(200).json({
            "message":"El acontecimiento fue actualizado",
            "status":200
        });
            
        }
        catch(e){
            console.log(e);    
            return res.status(500).json({
                "message":"Error en el servidor",
                "status":500
            });
        }
}


export const getAcontecimientosByRasgo=async (req:Request, res:Response): Promise<Response>=>{// con esta consulta sabemos cuantos conceptos de rasgos existen
    //console.log(req.params.id);
    //res.send('recived');
    try{
        const id_rasgo = req.params.id_rasgo;
        
        //console.log(cve_agee);
        const response: QueryResult= await pool.query(`SELECT id_acontecimiento, id_rasgo, fecha, acontecimiento FROM public.acontecimientos WHERE id_rasgo=$1 ORDER BY fecha;`, [id_rasgo]);


        if (response.rowCount > 0){
            const aconts: Acontecimiento[]= response.rows;        
            return res.status(200).json({
                "message":"Acontecimientos encontrados",
                "status":200,
                "Respuesta": aconts
            });             
        }
        else{
            return res.status(200).json({
                "message":"Rasgo no encontrado",
                "status":200,
                "Respuesta": []
            }); 
        }
    }
    catch{
        return res.status(500).json({
            "message":"Error en el servidor",
            "status":500
        });
    }
}


export const getConceptosCutAndEnt=async (req:Request, res:Response): Promise<Response>=>{// con esta consulta sabemos cuantos conceptos de rasgos existen
    //console.log(req.params.id);
    //res.send('recived');
    try{
        const id_anio = req.params.id_anio;
        const id_capital = req.params.id_capital;
        //console.log(cve_agee);
        const response: QueryResult= await pool.query(
            'SELECT DISTINCT conceptos.id_concepto, conceptos.nom_concepto FROM direcciones LEFT JOIN rasgos ON direcciones.id_rasgo = rasgos.id_rasgo '+
            'LEFT JOIN conceptos ON rasgos.id_concepto = conceptos.id_concepto WHERE direcciones.id_anio = $1 AND rasgos.id_capital=$2 '+
            'ORDER BY conceptos.id_concepto;', [id_anio, id_capital]);

        //console.log(response.rows[0]);

        if (response.rowCount > 0){

            const conceps: Concepto[]= response.rows;

            //const muns: Municipio[] = response.rows;            
            return res.status(200).json({
                "message":"Conceptos encontrados encontrados",
                "status":200,
                "Respuesta": conceps
            });             
        }
        else{
            return res.status(200).json({
                "message":"Persona encontrada",
                "status":200,
                "Respuesta": []
            }); 
        }
    }
    catch{
        return res.status(500).json({
            "message":"Error en el servidor",
            "status":500
        });
    }
}




export const GetRasgosByEntAndCut= async(req:Request, res:Response): Promise<Response>=>{
    //const cve_loc =req.body.cve_loc;
    const id_capital =req.params.id_capital;
	const id_anio =req.params.id_anio;    
    const id_concepto=req.params.id_concepto;
    
    //console.log(id_anio, id_capital);
    //convertir en geojson		
		
    let query:string=
    `SELECT json_build_object(
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
	
    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":["Error interno en el servidor"]});
    }
  
}



export const GetVialidadesByEntAndCut= async(req:Request, res:Response): Promise<Response>=>{
    //const cve_loc =req.body.cve_loc;
    
	const id_anio =req.params.id_anio;
    const id_capital =req.params.id_capital;
    

    //console.log(id_anio, id_capital);
    //convertir en geojson
	let query:string=
	"SELECT json_build_object("+
		"'type', 'FeatureCollection',"+
		"'features', json_agg("+
			"json_build_object("+
			"'type', 'Feature',"+
			"'geometry', ST_AsGeoJSON(geom)::json,"+
			"'properties', json_build_object("+
				"'id_capital', id_capital,"+
				"'id_anio', id_anio"+
			")"+
			")"+
		")"+
		") AS geojson "+
		"FROM "+
		"vialidades "+
		"WHERE "+
		"id_anio = "+id_anio+" AND id_capital ="+id_capital+";";

    //console.log(query);
	
    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":["Error interno en el servidor"]});
    }
  
}



export const GetManzanasByEntAndCut= async(req:Request, res:Response): Promise<Response>=>{
    //const cve_loc =req.body.cve_loc;
    
	const id_anio =req.params.id_anio;
    const id_capital =req.params.id_capital;
    

    //console.log(id_anio, id_capital);
    //convertir en geojson
	let query:string=
	"SELECT json_build_object("+
		"'type', 'FeatureCollection',"+
		"'features', json_agg("+
			"json_build_object("+
			"'type', 'Feature',"+
			"'geometry', ST_AsGeoJSON(geom)::json,"+
			"'properties', json_build_object("+
				"'id_capital', id_capital,"+
				"'id_anio', id_anio"+
			")"+
			")"+
		")"+
		") AS geojson "+
		"FROM "+
		"manzanas "+
		"WHERE "+
		"id_anio = "+id_anio+" AND id_capital ="+id_capital+";";

    //console.log(query);
	
    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":["Error interno en el servidor"]});
    }
  
}


export const getCLbyEnt= async(req:Request, res:Response): Promise<Response>=>{
    
    const cve_agee =req.params.cve_agee;    

    //console.log(cve_agee);
    //convertir en geojson
    let query:string=
        "SELECT json_build_object("+
                "'type', 'FeatureCollection',"+
                "'features', json_agg("+
                    "json_build_object("+
                    "'type', 'Feature',"+
                    "'geometry', ST_AsGeoJSON(geom)::json,"+
                    "'properties', json_build_object("+
                        "'altura', altura"+
                    ")"+
                    ")"+
                ")"+
                ") AS geojson "+
                "FROM "+
                "curvas "+
                "WHERE "+
                "cve_agee ='"+cve_agee+"'";
    //console.log(query);

    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":["Error interno en el servidor"]});
    }
  
}


export const getRiosByEnt= async(req:Request, res:Response): Promise<Response>=>{
    //const cve_loc =req.body.cve_loc;
    
    const cve_agee =req.params.cve_agee;
    const cut =req.params.cut;

    //console.log(cve_agee);
    //convertir en geojson
    let query:string=
        "SELECT json_build_object("+
                "'type', 'FeatureCollection',"+
                "'features', json_agg("+
                    "json_build_object("+
                    "'type', 'Feature',"+
                    "'geometry', ST_AsGeoJSON(geom)::json,"+
                    "'properties', json_build_object("+
                        "'cve_agee', cve_agee,"+
                        "'descripcion', descripcion"+
                    ")"+
                    ")"+
                ")"+
                ") AS geojson "+
                "FROM "+
                "rios "+
                "WHERE "+
                "cve_agee ='15'";
    //console.log(query);

    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":["Error interno en el servidor"]});
    }
  
}



export const getPLbyEntAndCut= async(req:Request, res:Response): Promise<Response>=>{
    //const cve_loc =req.body.cve_loc;
    
	const id_anio =req.params.id_anio;
    const id_capital =req.params.id_capital;
    

    //console.log(id_anio, id_capital);
    //convertir en geojson
	let query:string=
	"SELECT json_build_object("+
		"'type', 'FeatureCollection',"+
		"'features', json_agg("+
			"json_build_object("+
			"'type', 'Feature',"+
			"'geometry', ST_AsGeoJSON(geom)::json,"+
			"'properties', json_build_object("+
				"'id_capital', id_capital,"+
				"'id_anio', id_anio"+
			")"+
			")"+
		")"+
		") AS geojson "+
		"FROM "+
		"pl "+
		"WHERE "+
		"id_anio = "+id_anio+" AND id_capital ="+id_capital+";";

    //console.log(query);
	
    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":["Error interno en el servidor"]});
    }
  
}


export const getCapital= async(req:Request, res:Response): Promise<Response>=>{
    //const cve_loc =req.body.cve_loc;
    
    const cve_agee =req.params.cve_agee;

    //console.log(cve_agee);

    //convertir en geojson
    let query:string=
        "SELECT json_build_object("+
                "'type', 'FeatureCollection',"+
                "'features', json_agg("+
                    "json_build_object("+
                    "'type', 'Feature',"+
                    "'geometry', ST_AsGeoJSON(geom)::json,"+
                    "'properties', json_build_object("+
                        "'cve_agee', cve_agee,"+
                        "'nom_agee', nom_agee,"+
                        "'capital', capital"+                        
                    ")"+
                    ")"+
                ")"+
                ") AS geojson "+
                "FROM "+
                "capitales "+
                "WHERE cve_agee ='"+cve_agee+"'";
    //console.log(query);

    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":["Error interno en el servidor"]});
    }
   
}



export const getMunicipioPolygon= async(req:Request, res:Response): Promise<Response>=>{
    //const cve_loc =req.body.cve_loc;
    
    const cvegeo =req.params.cvegeo;

    //console.log(cve_agee);

    //convertir en geojson
    let query:string=
        "SELECT json_build_object("+
        "'type', 'FeatureCollection',"+
        "'features', json_agg("+
            "json_build_object("+
            "'type', 'Feature',"+
            "'geometry', ST_AsGeoJSON(geom)::json,"+
            "'properties', json_build_object("+
                "'cve_agee', cve_agee,"+
                "'nomgeo', nomgeo,"+
                "'X', ST_X(ST_Centroid(geom)),"+
                "'Y', ST_Y(ST_Centroid(geom))"+
            ")"+
            ")"+
        ")"+
        ") AS geojson "+
        "FROM "+
        "municipios "+
        "WHERE cvegeo ='"+cvegeo+"';";
    //console.log(query);

    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":["Error interno en el servidor"]});
    }
   
}



export const getEntidadPolygon= async(req:Request, res:Response): Promise<Response>=>{
    //const cve_loc =req.body.cve_loc;
    
    const cve_agee =req.params.cve_agee;

    //console.log(cve_agee);

    //convertir en geojson
    let query:string=
        "SELECT json_build_object("+
        "'type', 'FeatureCollection',"+
        "'features', json_agg("+
            "json_build_object("+
            "'type', 'Feature',"+
            "'geometry', ST_AsGeoJSON(geom)::json,"+
            "'properties', json_build_object("+
                "'cve_agee', cve_agee,"+
                "'nomgeo', nomgeo,"+
                "'X', ST_X(ST_Centroid(geom)),"+
                "'Y', ST_Y(ST_Centroid(geom))"+
            ")"+
            ")"+
        ")"+
        ") AS geojson "+
        "FROM "+
        "entidades "+
        "WHERE cve_agee ='"+cve_agee+"';";
    //console.log(query);

    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":["Error interno en el servidor"]});
    }
   
}


export const getNombresMunByEnt=async (req:Request, res:Response): Promise<Response>=>{
    //console.log(req.params.id);
    //res.send('recived');
    try{
        const cve_agee = req.params.cve_agee;
        //console.log(cve_agee);
        const response: QueryResult= await pool.query('SELECT id_municipio, cvegeo, nomgeo, ST_X(ST_Centroid(geom)) AS X, ST_Y(ST_Centroid(geom)) AS Y  FROM public.municipios WHERE cve_agee = $1', [cve_agee]);
        //console.log(response.rows[0]);

        if (response.rowCount > 0){

            const muns: Municipio[] = response.rows;            
            return res.status(200).json({
                "message":"Municipios encontrados",
                "status":200,
                "Respuesta": [muns]
            });             
        }
        else{
            return res.status(200).json({
                "message":"Persona encontrada",
                "status":200,
                "Respuesta": []
            }); 
        }
    }
    catch{
        return res.status(500).json({
            "message":"Error en el servidor",
            "status":500
        });
    }
}






export const getNombresEntidades= async(req:Request, res:Response): Promise<Response>=>{
    //const cve_loc =req.body.cve_loc;


    let query:string ='SELECT id_entidad, cve_agee, nomgeo, ST_X(ST_Centroid(geom)) AS X, ST_Y(ST_Centroid(geom)) AS Y FROM entidades;'

    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":[`NodeJS dice ${e}`]});
    }
   
}






export const getCapitales= async(req:Request, res:Response): Promise<Response>=>{

    let query:string ='SELECT cve_agee, nom_agee, capital, pobtot, altitud,  ST_X(geom) AS x, ST_Y(geom) AS y FROM capitales ORDER BY capital;';

    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":[`NodeJS dice ${e}`]});
    }
   
}



export const getPL= async(req:Request, res:Response): Promise<Response>=>{
    //const cve_loc =req.body.cve_loc;
    
    const cve_agee =req.params.cve_agee;

    //console.log(cve_agee);

    //convertir en geojson
    let query:string=
        "SELECT json_build_object("+
            "'type', 'FeatureCollection', "+
            "'features', json_agg( "+
                "json_build_object( "+
                    "'type', 'Feature', "+
                    "'geometry', ST_AsGeoJSON(wkb_geometry)::json, "+
                    "'properties', json_build_object( "+
                        "'cve_loc', cve_loc,  "+
                        "'nomloc', nomloc,  "+
                        "'anio', anio "+
                    ") "+
                ") "+
            ") "+
        ") AS poligonosLocalidad "+
        "FROM pl "+
        "WHERE cve_agee ='"+cve_agee+"';";


    try{
        const response: QueryResult= await pool.query(query);
        //console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":["Error interno en el servidor"]});
    }
   
}