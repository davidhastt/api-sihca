import { Request, Response } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";



export const getCapitales= async(req:Request, res:Response): Promise<Response>=>{

    let query:string ='SELECT cve_agee, nom_agee, capital, pobtot, altitud,  ST_X(geom) AS x, ST_Y(geom) AS y FROM capitales;'

    try{
        const response: QueryResult= await pool.query(query);
        console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":[`NodeJS dice ${e}`]});
    }
   
}



export const getPL= async(req:Request, res:Response): Promise<Response>=>{
    //const cve_loc =req.body.cve_loc;
    
    const cve_loc =req.params.cve_loc;

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
        "WHERE cve_loc ='"+cve_loc+"';";


    try{
        const response: QueryResult= await pool.query(query);
        console.log(response.rows);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({"error":["Error interno en el servidor"]});
    }
   
}