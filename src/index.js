import express from 'express';
import 'dotenv/config';
import connect from './connections/db.js';
import router from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import keys from './config/key.js';

import tls from 'tls';
tls.DEFAULT_MIN_VERSION = 'TLSv1.2';

const app = express();
const PORT = process.env.PORT;

const { clientURL } = keys.app;

app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connect();

console.log('CORS Middleware: Allowed Client URL from env:', clientURL);
const corsOptions = {
    origin: `${clientURL}`,
    credentials: true,
};
app.use(cors(corsOptions));
app.use(router);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
