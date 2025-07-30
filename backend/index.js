const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express()
const Routes = require("./routes/route.js")

const PORT = process.env.PORT || 5000

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(cors())

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to MongoDB successfully");
        console.log("Database URL:", process.env.MONGO_URL);
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Routes
app.use('/', Routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: err.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});