import { Request, Response } from "express";
import { QueryResult } from "pg";
import { pool } from "../database";
import argon2 from 'argon2';
import jwt, { Secret } from 'jsonwebtoken';
import { Persona } from "../interfaces/persona.interface";
//import Persona from "../interfaces/persona.interface"
//no olvides ponerles try, catch


export const login= async (req:Request, res:Response): Promise<Response>=>{
    
    const { correo, password } = req.body; 

    try {
        const userResult = await pool.query('SELECT nombre, correo, password FROM personas WHERE correo = $1', [correo]);
        // Resto del código...
        //sino existe el usuario



        if (userResult.rows.length === 0) {
            return res.status(404).json({
                "message":"Usuario no encontrado",
                "status":404
            });
        }

        const user:Persona = userResult.rows[0];
        const isPasswordCorrect = await argon2.verify(user.password, password);


        // si el password es incorrecto
        if (!isPasswordCorrect) {
            return res.status(401).json({
                "message":"Password incorrecto",
                "status":401
            });
        }
        
        const payload = {
            "correo": user.correo,
            "nombre": user.nombre,
          };
          // Secret key
        const jwt_secret:  undefined | null | jwt.Secret  | jwt.PrivateKey = process.env.JWT_SECRET;        
    
        if (!jwt_secret) {
            return res.status(500).json({
              "message": "Error interno del servidor, clave secreta no definida.",
              "status": 500,
            });
        }
          
        // Sign the token
        const token = jwt.sign(payload, jwt_secret, {expiresIn: '3h'},);
    
        return res.status(200).json({
            "message":"Usuario aceptado en el sistema por 3 horas",
            "status":200,
            "JWT": token
        });        


      } catch (e) {
        console.log(e);
        return res.status(500).json({
          "message": "Error interno del servidor",
          "status": 500,
          "error":"Error en el servidor"
        });
      }
}






export const createUser=async (req:Request, res:Response): Promise<Response>=>{//falta quitar el password de la respuesta

    let newPerson:Persona= req.body;
    newPerson.password = await argon2.hash(newPerson.password);

    try{

        const response: QueryResult = await pool.query(
            'INSERT INTO public.personas (tipo, nombre, apaterno, amaterno, fechaNac, telefono, correo, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [newPerson.tipo, newPerson.nombre, newPerson.apaterno, newPerson.amaterno, newPerson.fechaNac, newPerson.telefono, newPerson.correo, newPerson.password]
        );
        newPerson.password="Nada"
        return res.json({
            message: 'El usario se creo satisfactoriamente',
            body:{
                user:{
                    newPerson                    
                }
            }
        })
    }
    catch(e){
        console.log(e);    
        return res.status(500).json({"error": ["Ocurrió un error en el servidor."]});
    }    

}



export const deleteUser=async (req:Request, res:Response): Promise<Response>=>{
    const id_persona = parseInt(req.params.id_persona);

    try{
    await pool.query('DELETE FROM public.personas WHERE id_persona=$1', [id_persona]);
    //return res.json({"Mensaje": `La persona con id_perona =  ${id_persona} fue eliminado`});
    console.log(`La persona con id_persona = ${id_persona} fue eliminada`)
    return res.status(200).json({
        "message":"La persona con fue eliminada",
        "status":200
    }); 
    }
    catch(e){
        console.log(e);    
        return res.status(500).json({"error": ["Ocurrió un error en el servidor."]});
    } 
    //console.log(req.params.id);
    //res.send('deleting');
}

export const updateUser=async (req:Request, res:Response): Promise<Response>=>{
//falta validar que la persona con el id recibido exista
    const person:Persona= req.body;
    person.id_persona=parseInt(req.params.id_persona);
    
        try{
            await pool.query('UPDATE public.personas SET tipo = $1, nombre = $2, apaterno = $3, amaterno = $4, fechaNac = $5, telefono = $6, correo= $7 WHERE id_persona = $8', [person.tipo, person.nombre, person.apaterno, person.amaterno, person.fechaNac, person.telefono, person.correo, person.id_persona]);
            console.log(`La persona con id_perona =  ${person.id_persona} fue actualizada`);
            return res.status(200).json({
                "message":"La persona fue actualizada",
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


export const getUserById=async (req:Request, res:Response): Promise<Response>=>{
    //console.log(req.params.id);
    //res.send('recived');
    try{
        const id_persona = parseInt(req.params.id_persona);
        const response: QueryResult= await pool.query('SELECT id_persona, tipo, nombre, apaterno, amaterno, fechaNac, telefono, correo  FROM public.personas WHERE id_persona = $1', [id_persona]);
        //console.log(response.rows[0]);

        if (response.rowCount > 0){
            const person:Persona=response.rows[0];
            return res.status(200).json({
                "message":"Persona encontrada",
                "status":200,
                "Respuesta": [person]
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


export const getUsers= async(req:Request, res:Response): Promise<Response>=>{
    try{
        const response: QueryResult= await pool.query('SELECT id_persona, tipo, nombre, apaterno, amaterno, fechaNac, telefono, correo FROM public.personas WHERE tipo > 0');        
        const personas:Persona[]=response.rows;
        console.log(personas);
        return res.status(200).json({
            "message":"Personas encontrada",
            "status":200,
            "Respuesta": personas
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



export const personasInfo=async(req:Request, res:Response):Promise<Response>=>{//no es necesario actualizar esta funcion

    let url = req.protocol + '://' + req.get('host') + req.originalUrl;
        //esto es lo que sale en la pagina web en formato json
        return res.status(200).json({
            "mensaje":"Bienvenido; a la sección de endpoints para personas, que son los siguientes:",
            "status":200,
            "endpoints":[
                {"mostrar todas las personas":`${url}all`},
                {"mostrar una persona por ID":`${url}id_persona`},
                {"Crear una persona":`${url}crear`},
                {"borrar una persona":`${url}id_persona`},
                {"actualizar una persona":`${url}id_persona`}
            ]
        });
}




