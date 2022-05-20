import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
const config = require('../config.json');
import { apiAuth } from "./middleware/auth";
import http from 'http';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';
import { Migration } from '@mikro-orm/migrations'

//db connection
import { ProjectInfo } from './models';

export const DI = {} as {
    server: http.Server;
    orm: MikroORM,
    em: EntityManager,
    ProjectInfoRepository: EntityRepository<ProjectInfo>,
};

const DBConnection = async () => {
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.ProjectInfoRepository = DI.orm.em.getRepository(ProjectInfo);
    
    //migration
    // const migrator = DI.orm.getMigrator();
    // await migrator.createMigration();
    // await migrator.up()
    // await DI.orm.close(true);
    
    if (config.DB_SYNC) {
        await DI.orm.getMigrator().up;
        const generator = DI.orm.getSchemaGenerator();
        await generator.updateSchema();
    }
    // end of migration
}
DBConnection();

//db connection end

const app: Application = express();
const port: number = config?.PORT ? config.PORT : 3000;
// console.log(apiAuth());

// Body Parser Middliware
app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
// app.use(apiAuth());
app.use(cors());
app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }));
app.use(express.json());

const apiRoute = require('./route/api');
apiRoute(app)

app.get('/', (req, res) => {
    res.send('Invalid endpoint!');
});

app.listen(port, () => {
    console.log('Listen : ' + port);
});

