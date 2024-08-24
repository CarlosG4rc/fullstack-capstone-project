//Step 1 - Task 2: Import necessary packages
const e = require('express');
const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');

const logger = pino();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingEmail = await collection.findOne({ email: req.body.email });

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');
        res.json({authtoken,email});
    } catch (e) {
        return res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const theUser = await collection.findOne({ email: req.body.email });
        if(theUser){
            let isMatch = await bcryptjs.compare(req.body.password, theUser.password);
            if(!isMatch){
                return res.status(404).json({error: "Invalid credentials"});
            }
        }
        const userName = theUser.firstName;
        const userEmail = theUser.email;

        let payload ={
            user: {
                id: theUser._id.toString(),
            },
        };
        jwt.sign(user._id, JWT_SECRET)
        
    } catch (e) {
        logger.error('Not Found');
        return res.status(404).json({error: "User not found"});
    }
});

module.exports = router;