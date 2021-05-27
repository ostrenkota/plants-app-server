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

const privateKey  = fs.readFileSync(__dirname + '/ssl/private.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '/ssl/certificate.crt', 'utf8');
const caBundle = fs.readFileSync(__dirname + '/ssl/ca_bundle.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate, ca: [caBundle]};

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
    app.use('/', express.static(__dirname + '/public'));


    app.get('/test', (req, res) => {
        res.sendFile('src/index.html', {root: __dirname })
    })

    app.use('/api/user', userRouter);
    app.use('/api/plants', plantsRouter);

    const port = process.env.PORT || 8881;
    const sslPort = process.env.SSL_PORT || 8443;

    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(Number(port));
    httpsServer.listen(Number(sslPort));
}
