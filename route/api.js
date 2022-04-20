const api = require('express').Router();
const { auth } = require('../middleware/auth')

//controllers
const SetupCont = require('../controller/api/setupController')
const InstallCont = require('../controller/api/installController')
const MetaDataCont = require('../controller/api/metaDataController')
const IpfsCont = require('../controller/api/ipfsController')


module.exports = (app) => {
    app.use('/api', api);

    api.get('/', (req,res) => {
        res.send('Invalid endpoint!')
    })

    api.post('/setup/create-setup', SetupCont.createNFTStructure)
    api.post('/install/install-setup', InstallCont.installSetup)
    api.post('/metadata/upload-image', MetaDataCont.uploadMetaImages)
    api.post('/ipfs/create-car-image', IpfsCont.createIpfsCarImage)
    api.post('/metadata/upload-json', MetaDataCont.uploadMetaJsonFiles)
    api.post('/ipfs/create-car-meta', IpfsCont.createIpfsCarMeta)
    api.post('/ipfs/upload-file-to-ipfs', IpfsCont.uploadCarFiletoIpfs)
}