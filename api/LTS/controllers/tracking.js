const mongoose	= require("mongoose");

const Tracking = require('../models/tracking');
var ObjectId = require('mongodb').ObjectID;


exports.start_location_details = (req,res,next)=>{
	const tracking = new Tracking({
        _id                 : new mongoose.Types.ObjectId(),                    
        startDateAndTime    : req.body.startDateTime,
        startLocation       :   {
                                    latitude   : req.body.startLocation.latitude,
                                    longitude    : req.body.startLocation.longitude,
                                },
        userId              : req.body.userId,
        createdAt           : new Date()
    });
    tracking.save()
        .then(data=>{
            res.status(200).json("Start Details Added");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.get_location_details = (req,res,next)=>{
    Tracking.findOne({userId:req.params.userId})
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.update_routeCoordinates = (req,res,next)=>{
    Tracking.updateOne(
        { "userId" : ObjectId(req.body.userId)},
        {
            $push : {
                "routeCoordinates" : req.body.routeCoordinates,
            },
            $set : {
                "distanceTravelled"    : req.body.distanceTravelled
            }
        })
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.end_location_details = (req,res,next)=>{
    console.log("re body=>",req.body)
    Tracking.aggregate([
            { 
                $match :  
                { 
                    "userId" : ObjectId(req.body.userId)
                } 
            },
            {
                $project: 
                    {
                        totalTime: 
                            {
                                $subtract: [  new Date(req.body.endDateAndTime) ,"$startDateAndTime"]
                            }, 
                    } 
            },

        ])

    .then(data=>{
        console.log("data",data[0].totalTime)
        Tracking.updateOne(
        { "userId" : ObjectId(req.body.userId)},
        {
            $set : {
                "totalTime"      : data[0].totalTime,
                "endDateAndTime" : req.body.endDateAndTime
            }
        })
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    })
    .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
  
};



exports.get_daywise_location_details = (req,res,next)=>{
    Tracking.findOne({userId:req.params.userId,createdAt:req.params.date})
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};