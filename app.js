//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/WikiDB')
  .then(() => console.log('Connected! To mongodb'));

  const articleSchema = {
    title: String,
    content: String
  };

  const Article = mongoose.model("Article", articleSchema);


// /////////////////Requests For Trgeting All Articles///////////////////////

  app.route("/articles")
  .get((req, res)=>{
    Article.find()
    .then(foundArticles=>{
      res.status(200).json(foundArticles);
})
    .catch(err =>{
      console.log(err);
      res.send(err);
    });
  })
  .post( (req, res)=>{
  
    const newArticle = new Article({
     title: req.body.title,
    content: req.body.content
    });
    newArticle.save()
              .then(newArticle =>{
                res.status(200).json(newArticle);
              // console.log(newArticle);
              })
              .catch(err =>{
                console.log(err);
              res.send(err);
              });
  })
  .delete(
    (req, res)=>{
      Article.deleteMany()
              .then(Article=>{
                res.status(200).send(Article);
              })
              .catch(err =>{
                console.log(err);
                res.status(401).send(err);
    
              });
    });

    // /////////////////Requests For Trgeting A specific Article///////////////////////

    app.route("/articles/:id")
    .get((req, res)=>{
      const id = req.params.id;
      Article.fin(id)
              .then(Articles =>{
                res.status(200).send(Articles);
              })
              .catch(err =>{
                console.log(err);
                res.status(401).send(err);
              });
    })

    .put((req, res)=>{
      const id = req.params.id;
      const title= req.body;
      const content = req.body;
     Article.findByIdAndUpdate(id, title, {new: true})
              .then(newArticle =>{
                res.status(200).send(newArticle);
                console.log(newArticle);
              })
              .catch(err =>{
                console.log(err);
                res.status(401).send(err);
              });
    })

    .delete((req, res)=>{
      const id = req.params.id;
      Article.findByIdAndDelete(id)
              .then(Article =>{
                res.status(200).send(Article);
              })
              .catch(err =>{
                res.status(401).send(Article);
              });
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});