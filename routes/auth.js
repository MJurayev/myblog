const { User } = require('../models/User.model');
const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const router = express.Router();
const _ = require('lodash');


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ login: req.body.login });
    if (!user)
        return res.status(400).send('Email yoki parol noto\'g\'ri');

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword)
        return res.status(400).send('Email yoki parol noto\'g\'ri');

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(true);
});

function validate(req) {
    const schema = Joi.object({
        login: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
}

module.exports = router; 