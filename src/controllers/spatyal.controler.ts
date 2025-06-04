import { Request, Response } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";



export const getCapitales= async(req:Request, res:Response): Promise<Response>=>{

    let query:string ='SELECT capital, pobtot, altitud,  ST_X(geom) AS x, ST_Y(geom) AS y FROM capitales;'

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