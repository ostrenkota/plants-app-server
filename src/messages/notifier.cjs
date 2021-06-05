const axios = require('axios');

async function sendNotification(userVkIds, message) {
    const params = {
        user_ids: userVkIds,
        message,
        sending_mode: 'immediately',
        access_token: process.env.SERVICE_KEY,
        v: 5.131
    };

    const response = await axios.get('https://api.vk.com/method/notifications.sendMessage', { params });
    return response.data?.response?.status;
}

function formatAndSendNotification(idsAndPlantsNames) {
    const formatMessage = plantName => `Растение ${plantName} ожидает полива!`
    const promises = idsAndPlantsNames.map(idAndPlantName =>
        sendNotification(idAndPlantName.id, formatMessage(idAndPlantName.plantName))
    );

    return  Promise.allSettled(promises);

}

module.exports = formatAndSendNotification;
