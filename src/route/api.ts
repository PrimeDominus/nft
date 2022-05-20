import express, {Application} from "express";
const api = express.Router();
const app:Application = express();

//controllers
import { SETUP } from "../controller/api/setup.controller"
import { INSATLL } from "../controller/api/install.controller"


module.exports = (app:Application) => {
    app.use('/api', api);

    //create nft routes
    api.post('/make-project-setup', SETUP.makeProjectSetup);
    api.post('/install-project-setup', INSATLL.installSetup);
    //end of create nft routes
}
