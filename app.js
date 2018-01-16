const express = require('express');
const path = require('path');
var mongoose = require('mongoose');

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

//set local server to port 3001
app.listen(3001, () => {
	console.log('Server started on port 3001...');
});