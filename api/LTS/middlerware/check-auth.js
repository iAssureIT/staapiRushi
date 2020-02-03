const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
	// console.log('token ',token);
	try{
		const token = req.headers.authorization.split(" ")[1];
		console.log('token ',token);
		const decode = jwt.verfy(token, process.env.JWT_KEY)
		req.userData = decoded;
		console.log('userData ',decoded);
		next();
	} catch(error){
		return res.status(401).json({
			message: 'Auth failed'
		});
	}
	next();
};