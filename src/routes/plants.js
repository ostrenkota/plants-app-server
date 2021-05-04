import database from "../core/database.js";
import express from "express";

const router = express.Router();

router.get('/:plantApiId', async (req, res) => {
    const { plantApiId } = req.params;
    const plant = await database.getPlantById(plantApiId);
    res.send(plant);
});

export default router;
