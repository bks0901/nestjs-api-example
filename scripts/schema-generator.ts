import { MikroORM } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { InquiryEntity } from '@models/inquiry/inquiry.entity';
import * as dotenv from 'dotenv';
import loadConfig from '@config/configuration';

async function main() {
  dotenv.config({ path: '.env.development' });
  const config = loadConfig();
  const dbname = (config.db as { name: string }).name;

  const orm = await MikroORM.init({
    dbName: dbname,
    driver: SqliteDriver,
    entities: [InquiryEntity],
  });
  try {
    const generator = orm.getSchemaGenerator();
    const dropDump = await generator.getDropSchemaSQL();
    console.log(dropDump);
    const createDump = await generator.getCreateSchemaSQL();
    console.log(createDump);
    await generator.dropSchema();
    await generator.createSchema();
  } finally {
    await orm.close(true);
  }
}

main();
