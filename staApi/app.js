	const express 						= require ('express');
	const app 							= express();
	const morgan 						= require('morgan');// morgan call next function if problem occure
	const bodyParser 					= require('body-parser');// this package use to formate json data 
	const mongoose 						= require ('mongoose');
	var nodeMailer   					= require('nodemailer');
	const globalVariable 				= require('./nodemon.js');

	mongoose.connect('mongodb://localhost/'+globalVariable.dbname,{
		useNewUrlParser: true,
	})
	mongoose.promise = global.Promise;

	app.use(morgan("dev"));
	app.use('/uploads', express.static('uploads'));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
		if (req.method === "OPTIONS") {
			res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
			return res.status(200).json({});
		}
		next();
	});


    const trackingurl             	= require("./api/LTS/routes/tracking");
	
	app.use("/api/tracking",trackingurl);

	app.use((req, res, next) => {
		const error = new Error("Not found");
		error.status = 404;
		next(error);
	});

	app.use((error, req, res, next) => {
		res.status(error.status || 500);
		res.json({
				error: {
				message: error.message
				}
			});
	});

	module.exports = app;