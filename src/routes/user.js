import express, {response} from 'express';
import database from "../core/database.js";
import identifyPlantType from "../core/plants-info/PlantsIdentifier.js"
import saveImage from "../middlewares/save-image.js";
import generateRandomHex from "../core/lib/generate-random-hex.js"
import MongoClient from "mongodb";

const router = express.Router();

router.get('/', async (req, res) => {
    let user = await database.getUserById(req.user);
    if (!user) {
        user = await database.addUser(req.user);
        res.send(JSON.stringify({userData: user, isNew: true}));
    } else {
        const plantsPromises = user.plants.map(plant =>
            new Promise(async resolve => {
                const plantInfo = await database.getPlantById(plant.plantId);
                resolve(
                    {
                        ...plant,
                        description: plantInfo?.description || '',
                        label: plantInfo?.label || ''
                    }
                )
            })
        );
        user.plants = await Promise.all(plantsPromises);
        res.send(JSON.stringify({userData: user, isNew: false}));
    }
})

router.post('/', async (req, res) => {
    const { camera, notifications } = req.body;
    const vkId = req.user;
    const operations = [];
    if (camera) {
        operations.push(database.setUserProperty(vkId, 'camera', camera ));
    }
    if (notifications) {
        operations.push(database.setUserProperty(vkId, 'notifications', notifications ));
    }
    await Promise.all(operations);
    const user = await database.getUserById(vkId);
    res.send(user);
})

router.post('/plants', saveImage, async (req, res) => {
    const plantId = await identifyPlantType(`${process.cwd()}/public/img/${req.imageFileName}`);
    if (plantId) {
        const userPlant = {
            _id: generateRandomHex(),
            plantId,
            plantName: "",
            picture: req.imageFileName,
            note: "",
            notifications: false
        }
        await database.addPlantToUser(req.user, userPlant);
        const plantInfo = await database.getPlantById(plantId);
        res.send({ ...userPlant, label: plantInfo.label});
    } else {
        res.send({errorCode: 1001, message: 'plant not found'})
    }

})

router.put('/plants/:id', async (req, res) => {
    const plantObjectId = req.params.id;
    const { plantName, note, notifications} = req.body;
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

router.delete('/plants/:id', async (req,res) => {
    const id = req.params.id;
    await database.deleteUserPlant(req.user, id);
    res.send();
})

export default router;
