import { Request, Response } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";
import { Municipio } from "../interfaces/municipio.interface";

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
                        "'anio', anio"+
                    ")"+
                    ")"+
                ")"+
                ") AS geojson "+
                "FROM "+
                "pl "+
                "WHERE "+ 
                "anio < "+cut+" AND cve_agee ='"+cve_agee+"'";
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