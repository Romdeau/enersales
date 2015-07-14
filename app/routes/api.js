var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Sale			 = require('../models/sale');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// super secret for creating tokens
var superSecret = config.secret;

var transporter = nodemailer.createTransport(smtpTransport({
	host: config.emailServer,
	port: config.emailPort
}));

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('name username password').exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({
	      	success: false,
	      	message: 'Authentication failed. User not found.'
	    	});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({
	        	success: false,
	        	message: 'Authentication failed. Wrong password.'
	      	});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username
	        }, superSecret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }

	    }

	  });
	});

	apiRouter.post('/create', function(req, res) {
		var user = new User();		// create a new instance of the User model
		user.name = req.body.name;  // set the users name (comes from the request)
		user.email = req.body.email;  // set the users name (comes from the request)
		user.username = req.body.username;  // set the users username (comes from the request)
		user.password = req.body.password;  // set the users password (comes from the request)

		user.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000)
					return res.json({ success: false, message: 'A user with that username / email already exists. '});
				else
					return res.send({ success: false, message: err });
			}

			// return a message
			res.json({ success: true, message: 'User created!' });
		});
	})

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Verifying Token');

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {

	      if (err) {
	        res.status(403).send({
	        	success: false,
	        	message: 'Failed to authenticate token.'
	    	});
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;

	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });

	  } else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({
   	 		success: false,
   	 		message: 'No token provided.'
   	 	});

	  }
	});

	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});

	// USER ROUTES ===================================================

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {

			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.email = req.body.email;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'A user with that username / email already exists. '});
					else
						return res.send({ success: false, message: err });
				}

				// return a message
				res.json({ success: true, message: 'User created!' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.email) user.email = req.body.email;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				if (req.body.role) user.role = req.body.role;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	// LOCAL USER ROUTES ====================================

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	//api call to return current users ID
	apiRouter.get('/current_user', function(req, res) {
	  User.findOne({
	    username: req.decoded.username
	  }).select('_id name username role').exec(function(err, user) {
			if (err) {
				return res.json(err);
			} else {
				return res.json(user);
			};
		});
	});

	// SALES ROUTES===========================================

	// on routes that end in /sales

	apiRouter.route('/sales')

		// create a sale (accessed at POST http://localhost:8080/sales)
		.post(function(req, res) {

			var sale = new Sale();		// create a new instance of the Sale model
			sale.poNumber = req.body.poNumber; // set the sale attributes (comes from the request)
			sale.customer = req.body.customer;
			sale.value = req.body.value;
			sale.salesman = req.body.salesman;
			sale.description = req.body.description;
			sale.quoteNumber = req.body.quoteNumber;
			sale.meetingDate = req.body.meetingDate;
			sale.projectManager = req.body.projectManager;

			sale.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'This PO Number already exists. '});
					else
						return res.send(err);
				}

				// return a message
				res.json({ message: 'Sale created!' });
			});

		})

		.get(function(req, res) {
			Sale.find({}, function(err, sales) {
				if (err) res.send(err);

				// return the saless
				res.json(sales);
			});
		})

	//on routes that end in /sales/:sale_id

	apiRouter.route('/sales/:sale_id')

		// get the sale with that id
		.get(function(req, res) {
			Sale.findById(req.params.sale_id, function(err, sale) {
				if (err) res.send(err);
				// return that sale
				res.json(sale);
			});
		})

		// update the sale with this id
		.put(function(req, res) {
			Sale.findById(req.params.sale_id, function(err, sale) {

				if (err) res.send(err);

				// set the new sale information if it exists in the request
				if (req.body.poNumber) sale.poNumber = req.body.poNumber;
				if (req.body.customer) sale.customer = req.body.customer;
				if (req.body.value) sale.value = req.body.value;
				if (req.body.salesman) sale.salesman = req.body.salesman;
				if (req.body.quoteNumber) sale.quoteNumber = req.body.quoteNumber;
				if (req.body.meetingDate) sale.meetingDate = req.body.meetingDate;
				if (req.body.projectManager) sale.projectManager = req.body.projectManager;
				if (req.body.description) sale.description = req.body.description;
				if (req.body.accountsManager) sale.accountsManager = req.body.accountsManager
				if (req.body.handoverComplete) sale.handoverComplete = req.body.handoverComplete;
				if (req.body.accountsEntered) sale.accountsEntered = req.body.accountsEntered;

				// save the sale
				sale.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Sale updated!' });
				});

			});
		})

		// delete the sale with this id
		.delete(function(req, res) {
			Sale.remove({
				_id: req.params.sale_id
			}, function(err, sale) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	//on routes that end in /sales/salesman/:salesman_id
	apiRouter.route('/sales/salesman/:salesman_id')
		.get(function(req,res){
			Sale.find({ "salesman._id": req.params.salesman_id }, function(err, sales) {
				if (err) res.send(err);
				// return the sales
				res.json(sales);
			});
		});

	//on routes that end in /sales/projectmanager/:salesman_id
	apiRouter.route('/sales/projectmanager/:salesman_id')
		.get(function(req,res){
			Sale.find({ "projectManager._id": req.params.salesman_id }, function(err, sales) {
				if (err) res.send(err);
				// return the sales
				res.json(sales);
			});
		});

		//on routes that end in /sales/accounts/:salesman_id
		apiRouter.route('/sales/accounts/:salesman_id')
			.get(function(req,res){
				Sale.find({ "accountsManager._id": req.params.salesman_id }, function(err, sales) {
					if (err) res.send(err);
					// return the sales
					res.json(sales);
				});
			});


	//routes that end in /email================================================
	apiRouter.route('/email')
		//post route for sending email
		.post(function(req, res){
			var data = req.body;

			transporter.sendMail({
				from: data.fromEmail,
				to: data.toEmail,
				subject: data.subject,
				text: data.text,
				html: data.html,
				cc: data.cc
			});

			res.json({ message: 'Successfully emailed' });
		});

	return apiRouter;
};
