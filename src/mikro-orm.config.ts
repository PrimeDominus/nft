import { Options } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { ProjectInfo } from './models';
const config = require("./../config")
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
// import { TSMigrationGenerator } from '@mikro-orm/migrations';

const options: Options = {
    type: 'postgresql',
    entities: [ProjectInfo],
    dbName: 'nftMachine',
    user: 'root',
    password: 'root',
    host: 'localhost',
    port: 5432,
    metadataProvider: TsMorphMetadataProvider,
    migrations: {
        path: './migrations',
        tableName: 'migrations',
        transactional: true,
    },
    debug: true,
    // clientUrl: config.POSTGRES_URL
};

export default options;
