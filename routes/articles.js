const express = require('express');
const router = express.Router();

//bring in article model
let Article = require('../models/articles');

//Add root (add article)
router.get('/add',(req,res) => {
	res.render('add_article',{
		title : 'Add Article'
	});
});

//get single article
router.get('/:id',(req,res) =>{
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
router.post('/add',(req , res) => {
	req.checkBody('title','Title is required').notEmpty();
	req.checkBody('author','Author is required').notEmpty();
	req.checkBody('body','Body is required').notEmpty();

	//Errors
	let errors = req.validationErrors();
	if(errors){
		res.render('add_article',{
			title : 'Add Article',
			errors:errors
		});

	}else{
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
		});
	}
	
})



//Load edit article
router.get('/edit/:id',(req,res) =>{
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
router.post('/edit/:id',(req , res) => {
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
			req.flash('success','Article updated');
			res.redirect('/');
		}
	});
});

//delete function
router.delete('/:id',(req,res)=>{
	let query = {_id:req.params.id}
	Article.remove(query,(err)=>{
		if(err){
			console.log(err);
		}else{
			req.flash('warning','Article Deleted');
			res.send('Delete Success');
		}
		
	});
});

module.exports = router;