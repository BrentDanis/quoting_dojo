const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

// start process
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// mongoose start process
const url = 'mongodb://localhost/question_dojo'
mongoose.connect(url);



var QuestionSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2
    },
    question: {
        type: String,
        minlength: 10
    }
   },
   {timestamps: true}
)
   mongoose.model('Question', QuestionSchema); // We are setting this Schema in our Models as 'User'

   var Question = mongoose.model('Question') // We are retrieving this Schema from our Models, named 'User'

   app.get('/',function(req, res){
    console.log('we hit the post route')
    res.render('index');
})



app.get('/questions', function(req, res) {
    Question.find({}, function(err, questions) {
      // This is the method that finds all of the users from the database
      // Notice how the first parameter is the options for what to find and the second is the
      //   callback function that has an error (if any) and all of the users
      // Keep in mind that everything you want to do AFTER you get the users from the database must
      //   happen inside of this callback for it to be synchronous
      // Make sure you handle the case when there is an error, as well as the case when there is no error
      if(err)
        {
            console.log(err);
        }
        else
        {
            res.render('questions', {questions: questions});
        }
    })
  })

  app.post('/process', function(req, res) {
    console.log("POST DATA", req.body);
    // create a new User with the name and age corresponding to those from req.body
    var question = new Question({name: req.body.name, age: req.body.question});
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    question.save(function(err) {
      // if there is an error console.log that something went wrong!
      if(err) {
        console.log('something went wrong');
        console.log(err);
      } else { // else console.log that we did well and then redirect to the root route
        console.log('successfully added a user!');
        res.redirect('/questions');
      }
    })
  })



app.listen(8000, function() {
    console.log("A More Beautiful Question")
})
