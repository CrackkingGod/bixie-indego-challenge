import { Sequelize } from 'sequelize';

export const db = new Sequelize(process.env.URI, {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: true,
    dialect: 'postgres',
    host: process.env.DB_HOST,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    }
});

// Sequelize settings for working without DB URI
// export const db = new Sequelize(
//     `${config.development.database}`,
//     `${config.development.username}`,
//     `${config.development.password}`,
//     sequelizeOptions,
// );