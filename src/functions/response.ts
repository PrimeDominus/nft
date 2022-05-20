import { Request, Response, NextFunction } from "express";
/**
 * @description error 404 
 * @param {Object} res Just pass the res object.
 * @param {String} msg pass any message you want to show in api.
 * @param {Object} err pass the error object or error string.
 */
export const error400 = (res: Response, msg: string = 'Some Api config error.', err: any = null) => {
    return res.status(400).send({
        error: true,
        message: msg,
        errors: err
    });
}


/**
 * @description error 401
 * @param {Object} res Just pass the res object.
 * @param {String} msg pass any message you want to show in api.
 * @param {Object} err pass the error object or error string.
 */
export const error401 = (res: Response, msg: string = 'Permission Deny.', err: any = null) => {
    return res.status(401).send({
        error: true,
        message: msg,
        errors: err
    });
}


/**
 * @description error 422
 * @param {Object} res Just pass the res object.
 * @param {String} msg pass any message you want to show in api.
 * @param {Object} err pass the error object or error string.
 */
export const error422 = (res: Response, msg: string = 'Some Api config error.', err: any = null) => {
    return res.status(422).send({
        error: true,
        message: msg,
        errors: err
    });
}

/**
 * @description error 501 
 * @param {Object} res Just pass the res object.
 * @param {String} msg pass any message you want to show in api.
 * @param {Object} err pass the error object or error string.
 */
export const error501 = (res: Response, msg: string = 'Internal DB Error.', err: any = null) => {
    return res.status(501).send({
        error: true,
        message: msg,
        errors: err
    });
}

/**
 * @description success 200 
 * @param {Object} res Just pass the res object.
 * @param {String} msg pass any message you want to show in api.
 * @param {Object} data pass the returnable object.
 */
export const success = (res: Response, msg: string = 'All good', data: any = null) => {
    return res.status(200).json({
        error: false,
        message: msg,
        data: data
    });
}
