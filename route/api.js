const api = require('express').Router();
const { auth } = require('../middleware/auth')

//controllers
const SetupCont = require('../controller/api/setupController')


module.exports = (app) => {
    app.use('/api', api);

    api.get('/', (req,res) => {
        res.send('Invalid endpoint!')
    })

    api.post('/setup/create-setup', SetupCont.createNFTStructure)
}