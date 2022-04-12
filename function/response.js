/**
 * @description error 404 
 * @param {Object} res Just pass the res object.
 * @param {String} msg pass any message you want to show in api.
 * @param {Object} err pass the error object or error string.
 */
const error400 = (res, msg = 'Some Api config error.', err= null) => {
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
const error401 = (res, msg = 'Permission Deny.', err= null) => {
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
const error422 = (res, msg = 'Some Api config error.', err=null) => {
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
const error501 = (res, msg = 'Internal DB Error.', err=null) => {
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
const success = (res, msg = 'All good', data = null) => {
    return res.status(200).json({
        error: false,
        message: msg,
        data: data
    });
}

module.exports = {
    error400,
    error401,
    error422,
    error501,
    success,
}