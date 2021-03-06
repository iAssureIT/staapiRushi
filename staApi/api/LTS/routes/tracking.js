const express 	= require("express");
const router 	= express.Router();
const TrackingController = require('../controllers/tracking');

router.post('/post/startDetails',TrackingController.start_location_details);

router.get('/get/startDetails/:tracking_id',TrackingController.get_location_details);

router.get('/get/daywiseLocationDetails/:userId',TrackingController.get_daywise_location_details);

router.patch('/patch/routeCoordinates',TrackingController.update_routeCoordinates);

router.patch('/patch/endDetails',TrackingController.end_location_details);

module.exports = router;