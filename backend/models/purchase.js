const mongoose = require('mongoose');
const Joi = require('joi');

const purchaseSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tickets: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

function validatePurchase(purchase) {
    const schema = Joi.object({
        eventId: Joi.string().required(),
        userId: Joi.string().required(),
        tickets: Joi.number().min(1).required(),
        purchaseDate: Joi.date()
    });

    return schema.validate(purchase);
}

exports.Purchase = Purchase;
exports.validate = validatePurchase;
