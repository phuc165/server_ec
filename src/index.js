import express from 'express';
import 'dotenv/config';
import connect from './connections/db.js';
import router from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import tls from 'tls';
tls.DEFAULT_MIN_VERSION = 'TLSv1.2';

const app = express();
const PORT = process.env.PORT;

app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connect();

const corsOptions = {
    origin: 'https://ecommerce-client-f9vo.onrender.com',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(router);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
console.log('Environment Variables:', {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
});
