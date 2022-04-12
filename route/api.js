const api = require('express').Router();
const { auth } = require('../middleware/auth')

//controllers
const testCont = require('../controller/api/test')


module.exports = (app) => {
    app.use('/api', api);

    api.get('/', (req,res) => {
        res.send('Invalid endpoint!')
    })

    api.get('/test', testCont.test)
}