const api = require('express').Router();
const { auth } = require('../middleware/auth')

//controllers
const SetupCont = require('../controller/api/setupController')
const InstallCont = require('../controller/api/installController')


module.exports = (app) => {
    app.use('/api', api);

    api.get('/', (req,res) => {
        res.send('Invalid endpoint!')
    })

    api.post('/setup/create-setup', SetupCont.createNFTStructure)
    api.post('/install/install-setup', InstallCont.installSetup)
}