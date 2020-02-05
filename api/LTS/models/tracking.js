const mongoose = require('mongoose');

const trackingSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
	userId                  : mongoose.Schema.Types.ObjectId,
    startDateAndTime        : Date,
    endDateAndTime          : Date,
    startLocation           : {
    							longitude	: Number,
    							latitude	: Number
    },
    routeCoordinates        : Array,
    distanceTravelled       : Number,
    totalTime               : String,
    createdAt               : String,
});

module.exports = mongoose.model('tracking',trackingSchema);

