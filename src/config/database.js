import 'dotenv/config';

const databaseConfig = {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
    define: {
        timestamps: true,
        underscored: false,
        underscoredAll: false,
        freezeTableName: true,
    }
};

export default databaseConfig;