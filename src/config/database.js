const mongoose = require('mongoose');

const connectToDataBase = async() => {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_URI)
}

module.exports = connectToDataBase;