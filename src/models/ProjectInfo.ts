import { Entity, Property, OneToOne, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from './BaseEntity';

@Entity()
export class ProjectInfo extends BaseEntity {

  @Property({ nullable: true })
  account_address: string;

  // @Property()
  // alchemy_key: string;

  // @Property()
  // etherscan_api_key: string;

  @Property()
  project_id: string;
  
  @Property({ nullable: true })
  image_cid: string;

  @Property({ nullable: true })
  meta_cid: string;


  constructor(
    account_address: string, 
    // alchemy_key: string,
    // etherscan_api_key: string,
    project_id: string,
    image_cid: string,
    meta_cid: string,
  ) {
    super();
    this.account_address = account_address;
    // this.alchemy_key = alchemy_key;
    // this.etherscan_api_key = etherscan_api_key;
    this.project_id = project_id;
    this.image_cid = image_cid;
    this.meta_cid = meta_cid;
  }

}