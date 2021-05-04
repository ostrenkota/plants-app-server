import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import database from "./core/database.js";
import extractUser from "./middlewares/extractUser.js";
import http from "http";
import https from "https";
import fs from "fs";
import plantsRouter from "./routes/plants.js";
import userRouter from './routes/user.js';

dotenv.config();
const __dirname = process.cwd();

const privateKey  = fs.readFileSync(__dirname + '/ssl/selfsigned.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '/ssl/selfsigned.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};

main();

async function main() {
    await database.init();

    const app = express();

    app.use(fileUpload({
        limits: {
            fileSize: 15 * 1024 * 1024
        },
        abortOnLimit: true
    }));
    app.use(cors({credentials: true}));
    app.use(bodyParser.json());
    app.use('/api/user', extractUser);

    app.use('/img', express.static(__dirname + '/public/img'));

    app.get('/', (req, res) => {
        res.sendFile('src/index.html', {root: __dirname })
    })

    app.use('/api/user', userRouter);
    app.use('/api/plants', plantsRouter);

    const port = process.env.NODE_ENV === 'production' ? 80 : 8080;

   /* app.listen(port, async () => {
        console.log(`Server start on ${port} port`);
        const result = await database.getPlantById("7282182");
        console.log(JSON.stringify(result));
    });*/

    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(8888);
    httpsServer.listen(8443);
}
