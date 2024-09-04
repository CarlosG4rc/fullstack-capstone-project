//Step 1 - Task 2: Import necessary packages

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
        
        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }

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

router.put('/update', async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            logger.error('Validation error in update request ', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
    try {
        const email = req.headers.email;

        if (!email) {
            logger.error('Email not found in headers');
            return res.status(400).json({ error: 'Email not found in headers' });
        }
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const existingUser = await collection.findOne({ email: email });

        existingUser.firstName = req.body.name;
        existingUser.updatedAt = await collection.findOne({ email })

        if (!existingUser) {
            logger.error('User not found');
            return res.status(404).json({ error: "User not found" });
        }

        // Task 6: update user credentials in database
        const updater = await collection.findOneAndUpdate(
            { email: email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );
        // Task 7: create JWT authentication using secret key from .env file
        const payload = {
            user: {
                id: updater._id,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User updated successfully');

        res.json({ authtoken });
    } catch (e) {
        logger.error(error);
        return res.status(500).send('Internal server error');

    }
});

module.exports = router;