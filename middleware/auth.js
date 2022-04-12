const { success, error401 } = require('../function/response')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const config = require('../config/index')

exports.apiAuth = async (req,res,next) => {
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
