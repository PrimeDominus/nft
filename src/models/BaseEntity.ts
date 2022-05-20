import { PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
// import { ObjectCriteriaNode } from '@mikro-orm/postgresql';

export abstract class BaseEntity {

  @PrimaryKey()
  id!: number;

  // @SerializedPrimaryKey()
  // id!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

}
