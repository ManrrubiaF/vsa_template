import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User';
import { Product } from './models/Product';
import { Booking } from './models/Booking';
import { Data } from './models/Data';
import { ProductDetail } from './models/ProductDetail';
import { BlackListToken } from './models/BlackListToken';
import config from './lib/config'


const sequelize = new Sequelize({
  dialect: 'postgres',
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  username: config.DB_USER,
  host: config.DB_HOST,
  port: config.DB_PORT,
  models: [__dirname + '/models'],
  logging: false,
  /*dialectOptions: {
    ssl: {
      sslmode: 'require'
    },
    connectionTimeout: 100000
  },*/
});

export {
  sequelize,
  User,
  Product,
  Booking,
  Data,
  ProductDetail,
  BlackListToken
};
