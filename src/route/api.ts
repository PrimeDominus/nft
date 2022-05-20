import express, {Application} from "express";
const api = express.Router();
const app:Application = express();

//controllers
import { SETUP } from "../controller/api/setup.controller"


module.exports = (app:Application) => {
    app.use('/api', api);

    // api.post('/insert', SETUP.insert);

}
