import database from "../core/database.js";
import express from "express";
import MongoClient from 'mongodb';

const router = express.Router();

router.get('/:plantId', async (req, res) => {
    const { plantId } = req.params;
    const plant = await database.getPlantById(MongoClient.ObjectId(plantId));
    res.send(plant);
});

export default router;
