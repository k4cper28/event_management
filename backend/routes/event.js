const router = require("express").Router();
const {Event, validate} = require("../models/event");
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) =>{

    try {
        const { error } = validate(req.body);

        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const event = new Event({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location,
            totalTickets: req.body.totalTickets,
            availableTickets: req.body.availableTickets,
            price: req.body.price,
            createdAt: req.body.createdAt
        });
        
        await event.save();
        res.status(201).send({ message: "Event created successfully" })

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
})

module.exports = router;