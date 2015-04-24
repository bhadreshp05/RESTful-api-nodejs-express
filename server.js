// server.js

// BASE SETUP
// ==============================================

// call the packages we need
var express 	= require('express');      	// call express
var app 		= express(); 				// define our app using express 
var bodyParser 	= require('body-parser');
var morgan 		= require('morgan');
var mongoose	= require('mongoose');
var port = process.env.PORT || 3000;  		// set our port

// connect to our database
mongoose.connect('mongodb://bear:bear@ds041238.mongolab.com:41238/bear');

// Bear model
var Bear = require('./app/models/bear');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); 					// log every request to the console



// ROUTES FOR OUR API
// ==============================================
var router = express.Router();				// get an instance of the express router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do loggin
	console.log('someting is happening');
	next(); // make sure we go to next routes and dont stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api'});
});

// on routes that end in /bears
router.route('/bears')
	
	// create a bear (accessed at POST http://localhost:3000/api/bears)
	.post(function(req, res) {
		
		var bear = new Bear(); // create a new instance of the Bear model
		bear.name = req.body.name; // set the bears name (comes from the request)

		// save the bear and check for errors
		bear.save(function(err) {
			if (err) {
				res.send(err);
			} else {
				res.json({ message: 'Bear created' });
			}
		});
	})

	// get all the bears (accessed at GET http://localhost:3000/api/bears)
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err) {
				res.send(err);
			} else {
				res.json(bears);
			}
		});
	});

// on routes that end in /bears/:bear_id
router.route('/bears/:bear_id')
	
	// get the bear with that id (accessed at GET http://localhost:3000/bears/:bear_id)
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err) {
				res.send(err);
			} else {
				res.json(bear);
			}
		});
	})

	// update the bear with this id (accessed at PUT http://localhost:3000/bears/:bear_id)
	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err) {
				res.send(err);
			} else {
				bear.name = req.body.name; // update the bears info
			}

			// save the bear
			bear.save(function(err) {
				if (err) {
					res.send(err);
				} else {
					res.json({ message: 'Bear updated!' });
				}
			});
		});
	})

	// delete the bear with that id (accessed at Delete http://localhost:3000/bears/:bear_id)
	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err) {
				res.send(err);
			} else {
				res.json({ message: 'Successfully deleted' });
			}
		});
	});


// REGISTER OUR ROUTES
// ==============================================
app.use('/api', router);

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Server running on port ' + port);