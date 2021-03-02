import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import plantsInfo from './routes/plant-info.js';

dotenv.config();
const __dirname = process.cwd();

const app = express();

app.use(fileUpload({
    limits: {
        fileSize: 15 * 1024 * 1024
    },
    abortOnLimit: true
}));
app.use(cors({credentials: true}));
app.use(bodyParser.json());

app.use('/img', express.static(__dirname + '/public/img'));

plantsInfo(app);

app.get('/', (req, res) => {
    res.sendFile('src/index.html', {root: __dirname })
})

const port = process.env.NODE_ENV === 'production' ? 80 : 3000;

app.listen(port, () => console.log(`Server start on ${port} port`));