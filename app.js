const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');



mongoose.connect('mongodb://localhost/mystore', { useMongoClient: true });
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

//Add root (add article)
app.get('/articles/add',(req,res) => {
	res.render('add_article',{
		title : 'Add Article'
	});
});

//get single article
app.get('/article/:id',(req,res) =>{
	Article.findById(req.params.id,(err,article) => {
		if(err){
			console.log(err);
		}else{
			res.render('article',{
				article : article
			});
		}
	});
});

//add submit post
app.post('/articles/add',(req , res) => {
	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save((err) =>{
		if(err){
			req.flash('danger','Article Probleme');
			console.log(err);
			//return;
		}else{
			req.flash('success','Article Added');
			res.redirect('/');
		}
	})
})



//Load edit article
app.get('/article/edit/:id',(req,res) =>{
	Article.findById(req.params.id,(err,article) => {
		if(err){
			console.log(err);
		}else{
			req.flash("success","Article Added");
			res.render('edit_article',{
				title : 'Edit Article',
				article : article
			});
		}
	});
});

//update submit post
app.post('/articles/edit/:id',(req , res) => {
	let article = {};
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	let query = {_id:req.params.id}
	//Article is model not object acticle
	Article.update(query,article,(err) =>{
		if(err){
			console.log(err);
			//return;
		}else{
			req.flash('success','Article Added');
			res.redirect('/');
		}
	});
});

app.delete('/article/:id',(req,res)=>{
	let query = {_id:req.params.id}
	Article.remove(query,(err)=>{
		if(err){
			console.log(err);
		}else{
			res.send('Delete Success');
		}
		
	});
});

//set local server to port 3001
app.listen(3001, () => {
	console.log('Server started on port 3001...');
});