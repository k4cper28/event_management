const router = require("express").Router();
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { Purchase } = require('../models/purchase')


router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id; // Assuming the authenticated user's ID is available in req.user.id
        console.log(userId);
        const purchases = await Purchase.find({ userId });
        console.log(purchases)
        if (!purchases.length) return res.status(404).send({ message: "Tickets not found" });
        res.status(200).send(purchases);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId);
    const purchases = await Purchase.find({ userId: req.params.id });
    if (!purchases) return res.status(404).send({ message: "Tickets not found" });
        res.status(200).send(purchases);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const ticketId = req.params.id;
        await Purchase.findByIdAndDelete(ticketId);
        res.status(200).send('Bilet został pomyślnie usunięty.');
    } catch (error) {
        console.error('Błąd podczas usuwania biletu:', error);
        res.status(500).send('Wystąpił błąd podczas usuwania biletu.');
    }
});

module.exports = router;