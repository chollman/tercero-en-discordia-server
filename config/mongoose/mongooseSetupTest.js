const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

exports.mongooseConnect = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
    console.log("Test DB Connected");
};

exports.mongooseDisconnect = async () => {
    await mongoose.connection.close();
    console.log(mongoServer);
    await mongoServer.stop();
};
