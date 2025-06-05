import express from 'express';
import 'dotenv/config';
import connect from './connections/db.js';
import router from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const tls = require('tls');
tls.DEFAULT_MIN_VERSION = 'TLSv1.2';

const app = express();
const PORT = process.env.PORT;

app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connect();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(router);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
