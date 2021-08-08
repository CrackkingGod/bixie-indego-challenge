import { Sequelize, DataTypes } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env` });

const config = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    },
    production: {
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_CONNECTION_URL,
        dialect: 'postgres',
        logging: false
    }
};

const sequelizeOptions: any = {
    ssl: true,
    dialect: 'postgres',
    host: config.development.host,
    logging: false,
    define: {
        freezeTableName: "true",
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    }
};

// export const db = new Sequelize(
//     `${config.development.database}`,
//     `${config.development.username}`,
//     `${config.development.password}`,
//     sequelizeOptions,
// );

// `${config.development.database}`,
// `${config.development.username}`,
// `${config.development.password}`,

export const db = new Sequelize(process.env.URI, {
    database: `${config.development.database}`,
    username: `${config.development.username}`,
    password: `${config.development.password}`,
    ssl: true,
    dialect: 'postgres',
    host: config.development.host,
    logging: false,
    dialectOptions: {
        ssl: true,
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    }
});