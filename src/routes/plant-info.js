import saveImage from '../middlewares/save-image.js';
import axios from "axios";
import FormData from 'form-data';
import fs from 'fs';

export default app => {
    app.post('/plants-info', saveImage, (req, res) => {
    //    res.send(`http://localhost:3000/img/${req.imageFileName}`)
        identifyPlantType(`${process.cwd()}/public/img/${req.imageFileName}`)
            .then(result => res.send(result))
    })
}

async function identifyPlantType(imgPath) {
    const apiKey = process.env.API_KEY;
    let form = new FormData();

/*    form.append('organs', 'flower');
    form.append('images', fs.createReadStream(image_1));*/

    form.append('organs', 'leaf');
    form.append('images', fs.createReadStream(imgPath));

    try {
        const { status, data } = await axios.post(
            `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`,
            form, {
                headers: form.getHeaders()
            }
        );
        console.log(data);
        if (status !== 200) {
            console.error('unexpected status', status);
            throw new Error('unexpected status ' + status);
        }
        return data.results[0]?.species?.scientificNameWithoutAuthor;
    } catch (error) {
        console.error('error', error);
    }
}