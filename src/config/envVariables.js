import dotenv from 'dotenv';
dotenv.config()

// cambio mongo url 

export default {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    PERSISTENCE: process.env.PERSISTENCE,
    ENVIRONMENT: process.env.ENVIRONMENT,
    MAILING_EMAIL: process.env.EMAIL,
    MAILING_PASS: process.env.EMAIL_PASS
}

