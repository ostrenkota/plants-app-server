import FormData from "form-data";
import fs from "fs";
import axios from "axios";
import database from "../database.js";

async function identifyPlantType(imgPath) {
    const apiKey = process.env.API_KEY;
    let form = new FormData();

    form.append('organs', 'leaf');
    form.append('images', fs.createReadStream(imgPath));

    try {
        const { status, data } = await axios.post(
            `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`,
            form, {
                headers: form.getHeaders()
            }
        );
        console.log(JSON.stringify(data));
        if (status !== 200) {
            console.error('unexpected status', status);
            throw new Error('unexpected status ' + status);
        }

        const result = await database.getPlantByApiId(data.results[0]?.gbif?.id);

        return result?._id;
    } catch (error) {
        console.error('error', error);
    }
}


export default identifyPlantType;
