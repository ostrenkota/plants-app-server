import MongoClient from "mongodb";

const database = {
    async init() {
        const client = await MongoClient.connect(process.env.MONGO_LINK, { useUnifiedTopology: true });
        this.db = client.db(process.env.DB_NAME);
        this.plantsCollection = this.db.collection(process.env.PLANTS_COLLECTION);
        this.usersCollection = this.db.collection(process.env.USERS_COLLECTION)
    },
    async getPlantByApiId(plantApiId) {
        const result = await this.plantsCollection.find({plantApiId}).toArray();
        return result[0];
    },
    async getPlantById(_id) {
        const result = await this.plantsCollection.find({_id}).toArray();
        return result[0];
    },
    async getUserById(vkId) {
       const result = await this.usersCollection.find({vkId}).toArray();
       return result[0];
    },
    async addUser(vkId) {
        const userData = {
            vkId,
            plants: [],
            permissions: {
                camera: false,
                notifications: false
            }
        }
        await this.usersCollection.insertOne(userData);
        return this.getUserById(vkId);
    },
    async addPlantToUser(vkId, plant) {
        this.usersCollection.findOneAndUpdate(
            {vkId: vkId},
            {$push: { plants: plant }}
        );
    },
    async setPlantProperty(vkId, plantObjectId, property, value ) {
        return this.usersCollection.findOneAndUpdate(
            {vkId , "plants._id" : plantObjectId},
            {$set : {[`plants.$.${property}`] : value}}
        )
    },
    async deleteUserPlant(vkId, plantObjectId) {
        return this.usersCollection.update(
            {vkId},
            {$pull : {'plants': {_id: plantObjectId}}}
        )
    },
    async setUserProperty(vkId, property, value ) {
        return this.usersCollection.findOneAndUpdate(
            { vkId },
            { $set : {[`permissions.${property}`] : value}}
        )
    }
}

export default database;
