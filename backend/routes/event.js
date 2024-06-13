const router = require("express").Router();
const {Event, validate} = require("../models/event");
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { Purchase } = require('../models/purchase')

router.post('/', authMiddleware, async (req, res) =>{

    console.log(req.user._id);

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
            createdAt: req.body.createdAt,
            userId: req.user._id
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

router.get('/event-by-id/:id', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send({ message: "Event not found" });
        res.status(200).send(event);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get('/page', authMiddleware, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    try {
        // Pobierz eventy z bazy danych
        const events = await Event.find().skip(startIndex).limit(pageSize);
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an event
router.patch('/edit/:id', authMiddleware, async (req, res) => {
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

// Endpoint zakupu biletów
router.patch('/buy/:id', authMiddleware, async (req, res) => {
    const { tickets } = req.body;
    const userId = req.user._id;  // Zakładam, że ID użytkownika jest w tokenie JWT

    try {
        // Znajdź wydarzenie po ID
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).send({ message: "Event not found" });
        }

        // Sprawdź, czy użytkownik próbuje kupić bilet na swoje własne wydarzenie
        if (event.userId.equals(userId)) {
            return res.status(400).send({ message: "You cannot buy tickets for your own event" });
        }

        // Sprawdź, czy wystarczy dostępnych biletów
        if (event.availableTickets < tickets) {
            return res.status(400).send({ message: "Not enough tickets available" });
        }

        // Zaktualizuj liczbę dostępnych biletów
        event.availableTickets -= tickets;
        await event.save();

        
        // Zapisz dane o zakupie w bazie danych
        const purchase = new Purchase({
            eventId: event._id,
            userId: userId,
            tickets: tickets
        });

        await purchase.save();

        res.status(200).send({ message: "Purchase successful", event, purchase });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.put('/return/:id/:tickets', async (req, res) => {
    try {
        const eventId = req.params.id;
        const tickets = req.params.tickets
        await Event.findByIdAndUpdate(eventId, { $inc: { availableTickets: tickets } });
        res.status(200).send('Liczba dostępnych biletów dla wydarzenia została zaktualizowana.');
    } catch (error) {
        console.error('Błąd podczas aktualizowania liczby dostępnych biletów dla wydarzenia:', error);
        res.status(500).send('Wystąpił błąd podczas aktualizowania liczby dostępnych biletów dla wydarzenia.');
    }
});

router.get('/userEvent', authMiddleware, async (req, res) => {
    console.log(req.user._id);

    try {
        const events = await Event.find({ userId: req.user._id });
        res.status(200).send(events);
    } catch (error) {
        console.error('Błąd podczas aktualizowania eventow:', error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


router.get('/elo/elo', authMiddleware, async (req, res) => {
    try {   
        const event = await Event.findById({ userId: req.user._id });
        if (!event) return res.status(404).send({ message: "Event not found" });
        res.status(200).send(event);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;