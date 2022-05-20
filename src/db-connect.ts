const mikroORMConfig  = require("./mikro-orm.config");
const allEntities = require("./models");
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
// console.log(allEntities[0].Test);


module.exports.initializeORM = async (MikroORM:any) => {
  const DI:any = {};
  DI.orm = await MikroORM.init(mikroORMConfig);
  // console.log(DI.orm.em);
  
  DI.em = DI.orm.em;
  
  for (const entityInstance of allEntities) {
    if (entityInstance.label === "BaseEntity") {
      continue;
    }
    DI[entityInstance.label] = await DI.orm.em.getRepository(
      entityInstance.entity
    );
    
    
  }
  
  
  return DI;
};