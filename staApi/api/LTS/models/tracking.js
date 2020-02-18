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
    routeCoordinates        : [],
    totalDistanceTravelled  : Number,
    totalTime               : String,
    createdAt               : Date,
    createdAtStr            : String,
});

module.exports = mongoose.model('tracking',trackingSchema);

