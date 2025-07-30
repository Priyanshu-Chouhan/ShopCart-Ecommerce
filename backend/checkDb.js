require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/customerSchema');

async function checkAndClearDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        // Find all customers
        const customers = await Customer.find({});
        console.log('Existing customers:', customers);

        // Clear all customers
        await Customer.deleteMany({});
        console.log('Database cleared');

        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error:', error);
    }
}

checkAndClearDB(); 