const bcrypt = require('bcrypt');
const Customer = require('../models/customerSchema.js');
const { createNewToken } = require('../utils/token.js');

const customerRegister = async (req, res) => {
    try {
        console.log('Registration request body:', req.body);

        // Validate required fields
        if (!req.body.email || !req.body.password || !req.body.name) {
            console.log('Missing required fields:', req.body);
            return res.status(400).json({ 
                message: 'Missing required fields',
                received: req.body 
            });
        }

        // Check if email exists first
        const existingcustomerByEmail = await Customer.findOne({ email: req.body.email });
        console.log('Existing customer check:', existingcustomerByEmail);

        if (existingcustomerByEmail) {
            console.log('Email already exists:', req.body.email);
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        // Create new customer
        const customer = new Customer({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
            role: "Customer"
        });

        console.log('Attempting to save customer:', customer);

        // Save customer
        let result = await customer.save();
        console.log('Customer saved successfully:', result);

        // Remove password from response
        result.password = undefined;
        
        // Create token
        const token = createNewToken(result._id);

        // Prepare response
        result = {
            ...result._doc,
            token: token
        };

        console.log('Sending success response');
        res.status(201).json(result);
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            message: 'Registration failed',
            error: err.message 
        });
    }
};

const customerLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let customer = await Customer.findOne({ email: req.body.email });
        if (customer) {
            const validated = await bcrypt.compare(req.body.password, customer.password);
            if (validated) {
                customer.password = undefined;

                const token = createNewToken(customer._id)

                customer = {
                    ...customer._doc,
                    token: token
                };

                res.send(customer);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getCartDetail = async (req, res) => {
    try {
        let customer = await Customer.findById(req.params.id)
        if (customer) {
            res.send(customer.cartDetails);
        }
        else {
            res.send({ message: "No customer found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const cartUpdate = async (req, res) => {
    try {

        let customer = await Customer.findByIdAndUpdate(req.params.id, req.body,
            { new: true })

        return res.send(customer.cartDetails);

    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    customerRegister,
    customerLogIn,
    getCartDetail,
    cartUpdate,
};
