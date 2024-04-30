import dotenv from 'dotenv';

dotenv.config();

const config = {
    JWT_SECRET: process.env.JWT_SECRET || '',
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_HOST: process.env.DB_HOST || '',
    DB_NAME: process.env.DB_NAME || '',
    HOST_MAIL: process.env.HOST_MAIL || '',
    COMPANY_EMAIL: process.env.COMPANY_EMAIL || '',
    COMPANY_PASS: process.env.COMPANY_PASS || '',
    BACK_URL: process.env.BACK_URL||'',
    FRONT_URL: process.env.FRONT_URL || '',
    DB_PORT: parseInt(process.env.DB_PORT || '0', 10),
};

export default config;