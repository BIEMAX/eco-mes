import * as mongoose from 'mongoose';

import InvalidDatabaseConnection from '../exceptions/invalid-database.exception';

async function connectMongo () {
  try {
    if (!process.env.MONGO_DB_URL || !process.env.MONGO_DB_NAME) throw new InvalidDatabaseConnection();
    const uri = `${process.env.MONGO_DB_URL}/${process.env.MONGO_DB_NAME}`
    const con = await mongoose.connect(uri)
    return con
  }
  catch (error: any) {
    throw error
  }
}

export {
  connectMongo
}