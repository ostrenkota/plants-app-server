const dotenv = require('dotenv');
const formatAndSendNotification = require('./notifier.cjs');

dotenv.config();

async function main() {
    const idsAndPlantsNames = [
        {
            id: 11901566,
            plantName: 'Кактус'
        },
        {
            id: 46457048,
            plantName: 'Лимон'
        }
    ]
    formatAndSendNotification(idsAndPlantsNames);
}

main();
