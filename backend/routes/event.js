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

router.get('/', authMiddleware, async (req, res) => {


    try {
    const events = await Event.find()
    res.status(200).send(events);
    } catch (error) {
        res.status.send({ message: "Internal Server Error" })
    }


})


// Update an event
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!event) return res.status(404).send({ message: "Event not found" });

        res.status(200).send({ message: "Event updated successfully", event });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// Delete an event
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).send({ message: "Event not found" });

        res.status(200).send({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;