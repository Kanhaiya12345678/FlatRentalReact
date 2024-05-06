const mongoose =require('mongoose')

const FeedSchema = new mongoose.Schema({
    description: String,
    apartmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

const FeedModel = mongoose.model("Feed", FeedSchema)
module.exports = FeedModel