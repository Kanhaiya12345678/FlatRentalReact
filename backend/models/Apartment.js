const mongoose =require('mongoose')

const ApartmentSchema = new mongoose.Schema({
    name: String,
    address: String,
    city: String,
    state: String,
    furnish: String,
    atype: String,
    ebill: String,
    extra: String,
    gender: String,
    rent: String,
    pic1: String,
    pic2: String,
    pic3: String,
    pic4: String,
    active: {
        type: Boolean,
        default: true,
    },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner'
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

const ApartmentModel = mongoose.model("Apartment", ApartmentSchema)
module.exports = ApartmentModel