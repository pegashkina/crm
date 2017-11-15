module.exports = (mongoose, config) => {
    const database = mongoose.connection;
    mongoose.Promise = Promise;

    mongoose.connect(config.database, {
        useMongoClient: true,
        promiseLibrary: global.Promise
    });

    database.on('error', error => console.log(`Connection to AugustCRM database failed: ${error}`));
    database.on('connected', () => console.log('Connected to AugustCRM database'));
    database.on('disconnected', () => console.log('Disconnected from AugustCRM database'));

    process.on('SIGINT', () => {
        database.close(() => {
            console.log('AugustCRM terminated, connection closed');
            process.exit(0);
        })
    });
};