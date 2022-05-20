import { Request, Response, NextFunction } from "express";
import { error401 } from './../functions/response';
import bcrypt from "bcryptjs";
const config = require('./../../config');

const salt = bcrypt.genSaltSync(config.SALT);


export const apiAuth = async (req:Request, res:Response, next:NextFunction) => {
    const header = req.header('x-access-token');

    // console.log('api access client key : ',bcrypt.hashSync(config.API_SECRET_KEY, salt));

    if(!header) {
        error401(res)
        return false
    }
    
    let compare = false
    try {
        compare = await bcrypt.compareSync(config.API_SECRET_KEY, header)
    } catch (e) {
        error401(res)
        return false
    }

    if(!compare) {
        error401(res)
        return false 
    }
    else {
        next()
    }
}

