const mongoose =require('mongoose')

const PaymentSchema = new mongoose.Schema({
    apid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment'
    },
    cardno: String,
    remark: {
        type: String,
        default: 'Booking Amount',
    },
    nameoncard: String,
    amount: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Booked',
    },
    bookingdate: {
        type: Date,
        default: Date.now,
    },
})

const PaymentModel = mongoose.model("Payment", PaymentSchema)
module.exports = PaymentModel