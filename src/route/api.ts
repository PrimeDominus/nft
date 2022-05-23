import express, {Application} from "express";
const api = express.Router();
const app:Application = express();

//controllers
import { SETUP } from "../controller/api/setup.controller"
import { INSATLL } from "../controller/api/install.controller"
import { METADATA } from "../controller/api/metadata.controller"
import { IPFS } from "../controller/api/ipfs.controller"
import { DEPLOY } from "../controller/api/deploy.controller";


module.exports = (app:Application) => {
    app.use('/api', api);

    //create nft routes
    api.post('/make-project-setup', SETUP.makeProjectSetup);
    api.post('/install-project-setup', INSATLL.installSetup);
    api.post('/metadata/upload-image', METADATA.uploadMetaImages);
    api.post('/ipfs/create-car-image', IPFS.createIpfsCarImage);
    api.post('/metadata/upload-json', METADATA.uploadMetaJsonFiles);
    api.post('/ipfs/create-car-meta', IPFS.createIpfsCarMeta); 
    api.post('/ipfs/upload-file-to-ipfs', IPFS.uploadCarFiletoIpfs)
    api.post('/deploy/deploy-nft', DEPLOY.deployNFT)
    //end of create nft routes
}
