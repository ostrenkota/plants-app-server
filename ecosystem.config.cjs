module.exports = {
    apps: [
        {
            name: 'backend',
            script: 'src/app.js',
            autorestart: true
        },
        {
            name: 'messages daemon',
            script: "src/messages/daemon.cjs",
            cron_restart: "*/1 * * * *",
            watch: false,
            autorestart: false
        }
    ]
};
