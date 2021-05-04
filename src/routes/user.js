import express, {response} from 'express';
import database from "../core/database.js";
import identifyPlantType from "../core/plants-info/PlantsIdentifier.js"
import saveImage from "../middlewares/save-image.js";
import generateRandomHex from "../core/lib/generate-random-hex.js"

const router = express.Router();

router.get('/', async (req, res) => {
    let user = await database.getUserById(req.user);
    if (!user) {
        user = await database.addUser(req.user);
        res.send(JSON.stringify({user, isNew: true}));
    } else {
        res.send(JSON.stringify({user, isNew: false}));
    }
})

router.post('/add-plant', saveImage, async (req, res) => {
    const plantId = await identifyPlantType(`${process.cwd()}/public/img/${req.imageFileName}`);
    const userPlant = {
        _id: generateRandomHex(),
        plantId,
        plantName: "",
        picture: req.imageFileName,
        note: "",
        notifications: false
    }
    await database.addPlantToUser(req.user, userPlant);
    res.send(userPlant);
})

router.post('/add-plant-info', async (req, res) => {
    const {plantObjectId, plantName, note, notifications} = req.body;
    const vkId = req.user;
    const operations = [];
    if (plantName) {
        operations.push(database.setPlantProperty(vkId, plantObjectId, 'plantName', plantName ));
    }
    if (note) {
        operations.push(database.setPlantProperty(vkId, plantObjectId, 'note', note ));
    }
    if (notifications != undefined) {
        operations.push(database.setPlantProperty(vkId, plantObjectId, 'notifications', notifications ));
    }
    await Promise.all(operations);
    const user = await database.getUserById(vkId);
    res.send(user);
})

export default router;
