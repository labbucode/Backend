const mongoose = require('mongoose')

async function connectDB() {
    console.log('connecting');
    try {
        await mongoose.connect('mongodb+srv://techprime:techprime@techprime.zdedisd.mongodb.net/?retryWrites=true&w=majority')
        console.log('connected');

    } catch (err) {
        console.log(err)
    }

}

module.exports = connectDB