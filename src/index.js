import express from 'express';
import 'dotenv/config';
import connect from './connections/db.js';
import router from './routes/index.js';
import cors from 'cors';
import morgan from 'morgan';
const app = express();
const PORT = process.env.PORT;

//HTTP request logger
app.use(morgan('combined'));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//connect to db
connect();

app.use(cors());

app.use(router);
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
