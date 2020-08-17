const express = require('express');
const app = express();
const mysql = require('mysql');

const cors = require('cors')
const bodyparser = require('body-parser')
app.use(cors())
app.use(bodyparser.json())

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });

//TODO: FORM VALIDATION IN NODEJS?


const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "123qwa",
    database : "personal_website"
})

//root
app.get("", (req, resp) => {
    resp.status(200).json("Nothing to send")
})

//root
app.post("", (req, resp) => {
    resp.status(200).json("Nothing to send")
})

//get feedback or project by specific id
app.get("/:page/:id", (req, resp) => {
    const connection = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "123qwa",
        database : "personal_website"
    })
    const query = "SELECT * FROM " + req.params.page + " WHERE id = " + req.params.id
    connection.query(query, (err, rows, fields) => {
        if(err){
            resp.sendStatus(500)
            resp.end()
            return
        }else{
            resp.sendStatus(200)
            resp.json(rows)
            resp.end()
        }
        
    })
})
//get the entire feedback or projects database
app.get("/:page", (req, resp) => {
    const query = "SELECT * FROM " + req.params.page 
    connection.query(query, (err, rows, fields) => {
        if(err){
            resp.status(500).json("Error getting the page")
            resp.end()
        }else{
            resp.status(200).json(rows)
            resp.end()
        }
        
    })
})

//insert a project to projects
app.post("/projects", (req, resp) => {
    console.log("Here4")
    const query = "INSERT INTO projects (title, description, information, url) VALUES ( '" + req.body.project_title + "' , '" + req.body.project_description + "' , '" + req.body.project_information + "' , '" + req.body.project_url + "' )"
    console.log(query)
    connection.query(query, (err, rows, fields) => {
        if(err){
            resp.status(500).json("error with the post")
            resp.end()
        }else{
            resp.status(200).json("Successfully entered the data to projects")
            resp.end()
            console.log("Successfully entered the data to projects")
        }
    })
})

//insert a value for feedback to feedback
app.post("/feedback", (req, resp) => {
    console.log("Here5")
    var name = req.body
    console.log(name)
    const query = "INSERT INTO feedback (name, email, message)  VALUES ( '" + req.body.feedback_name + "' , '" + req.body.feedback_email + "' , '" + req.body.feedback_message + "' )"
    connection.query(query, (err, rows, fields) => {
        if(err){
            console.log("There was an error with the insert")
            resp.status(500).json("There was an error with the insert")
            resp.end()
        }else{
            console.log("Successfully entered the data to db: feedback")
            resp.status(200).json("Successfully entered the data to feedback")
            resp.end()
        }
        //resp.redirect('/')
    })
})
//delete a value from a database 
app.delete(("/:page/:id"), (req, resp) => {
    console.log("Here6")
    var db = req.params.page
    var id = req.params.id
    console.log("This is the db "+ db + " and the id "+ id)
    var query  = "DELETE FROM " + db + " WHERE id = '" + id + "'"
    connection.query(query, (err, results, fields) => {
        if(err){
            resp.status(500).json("There was an error with the delete")
            console.log("There was an error with the delete")
            resp.end()
        }else{
            console.log("Successfully deleted")
            resp.status(200).json("Successfully deleted")
            resp.end()
        }
    })

})

//validate a password
app.post(("/login"),(req, resp) => {
    var query = "SELECT * FROM passwords WHERE username='sigilai'"
    console.log(req.body.password)
    connection.query(query, (error, results, fields) => {
        if(error){
            resp.status(500).json("There was a password error")
            console.log("There was a password error")
            resp.end()
        }else{
            //if the passwords match
            console.log(JSON.stringify(results) +  " and " + req.body.password)

            if(req.body.password == results[0].password){
                resp.status(200).json({outcome : 'match'})
                resp.end()
            }
            else{
                resp.status(200).json({outcome : "no match"})
                resp.end()
            }
        }
    })

})


app.listen(3002, () => {})