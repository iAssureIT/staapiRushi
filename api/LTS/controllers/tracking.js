const mongoose	= require("mongoose");
var moment              = require('moment');
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
        createdAt           : new Date(),
        createdAtStr        : moment(new Date()).format("YYYY-MM-DD"),
    });
    tracking.save()
        .then(data=>{
            res.status(200).json({"tracking_id"    : data._id});
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.get_location_details = (req,res,next)=>{
    console.log("req.params.tracking_id",req.params.tracking_id);
    Tracking.findOne({_id:req.params.tracking_id})
        .exec()
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
    console.log("re body=>",req.body)

    main();
    async function main(){
        var totalDistanceTravelled   = await totalDistance(req.body.tracking_id,req.body.distanceTravelled);
        console.log("totalDistanceTravelled=>",totalDistanceTravelled)
        Tracking.updateOne(
            { _id : ObjectId(req.body.tracking_id)},
            {
                $push : {
                    "routeCoordinates" : req.body.routeCoordinates,
                },
                $set : {
                    "totalDistanceTravelled" : totalDistanceTravelled
                }
            })
            .exec()
            .then(data=>{
                res.status(200).json(data);
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
      }      
};


function totalDistance(tracking_id,newDistance){
    return new Promise(function(resolve,reject){
            Tracking.aggregate([
                { 
                    $match :  
                        { 
                            "_id" : ObjectId(tracking_id)
                        } 
                },
                { $unwind: "$routeCoordinates" },
                {
                    $group: {
                      _id: null,
                      distance: { $sum: "$routeCoordinates.distanceTravelled" }
                    }
              }
            ])
            .then(distanceTravelled=>{
                var totalDistanceTravelled = distanceTravelled[0].distance + newDistance;
                console.log("totalDistanceTravelled",totalDistanceTravelled);
                resolve(totalDistanceTravelled);
             })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });
};

exports.end_location_details = (req,res,next)=>{
    console.log("re body=>",req.body)
    Tracking.aggregate([
            { 
                $match :  
                { 
                    "_id" : ObjectId(req.body.tracking_id)
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
    .exec()
    .then(data=>{
        console.log("data",data[0].totalTime)
        Tracking.updateOne(
        { "_id" : ObjectId(req.body.tracking_id)},
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
    Tracking
        .find({"userId":req.params.userId})
        .sort({createdAt : -1})
        .exec()
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