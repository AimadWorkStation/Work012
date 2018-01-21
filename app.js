const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');



mongoose.connect(config.database, { useMongoClient: true });
let db = mongoose.connection;

//check connection
db.once('open', ()=>{
	console.log('connected');
});


//check for db errors
db.on('error',(err) => {
	console.log(err);
});

//init app
const app = express();


// body parser middleare
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//set public folder (static files)
app.use(express.static(path.join(__dirname,'public')));

//Middleware Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

//Express messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator middleware
//app.use(expressValidator(middlewareOptions));
app.use(expressValidator({
	errorFormatter : function(param,msg,value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;
		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));

//passport config
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//bring in models
let Article = require('./models/articles');

//load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');



//Home root
//set a route get request to home page
app.get('/',(req,res) => {
	Article.find({},(err,articles) =>{
		if(err){
			console.log(err);
		}else{
			res.render('index',{
				title : 'list Articles',
				articles : articles
			});
		}
		
	});
});

// router file
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles',articles);
app.use('/users',users);

//set local server to port 3001
app.listen(3001, () => {
	console.log('Server started on port 3001...');
});