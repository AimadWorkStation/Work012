const express = require('express');
const path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

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
			console.log(err);
			//return;
		}else{
			res.redirect('/');
		}
	})
})

//set local server to port 3001
app.listen(3001, () => {
	console.log('Server started on port 3001...');
});