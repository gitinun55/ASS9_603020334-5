var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
  
  
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'Test Student Web API' })
});
// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lab_connect_mysql'
});
  
// connect to database
dbConn.connect(); 

// Retrieve all students 
app.get('/allstd', function (req, res) {
    dbConn.query('SELECT * FROM student', function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});



// Add a new Student 
app.post('/std', function (req, res) {
  
    var std = req.body
      
    if (!std ) {
        return res.status(400).send({ error:true, message: 'Please provide student ' });
    }
  
    dbConn.query("INSERT INTO student SET ? ", std , function (error, results, fields) { 
        if (error) throw error;
        return res.send(results);
    });
});

// Retrieve student with std_id 
app.get('/std/:id', function (req, res) {
  
    let std_id = req.params.id;
  
    if (!std_id) {
        return res.status(400).send({ error: true, message: 'Please provide std_id' });
    }
  
    dbConn.query('SELECT * FROM student where std_id=?', std_id , function (error, results, fields) {
        if (error) throw error;
        return res.send(results[0]);
    });
  
});

//  Update student with id
app.put('/std/:id', function (req, res) {
  
    let std_id = req.params.id;
    let std = req.body;
  
    if (!std_id || !std ) {   
        return res.status(400).send({ error: user, message: 'Please provide student data and student_id' });    
    }
  
        dbConn.query("UPDATE student SET ? WHERE std_id = ?", [std, std_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Student has been updated successfully.' });
    });
});

//  Delete student 
app.delete('/std/:id', function (req, res) {
  
    let std_id = req.params.id;
  
    if (!std_id) {
        return res.status(400).send({ error: true, message: 'Please provide std_id' });
    }
    dbConn.query('DELETE FROM student WHERE std_id = ?', std_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Student has been deleted successfully.' });
    });
}); 

// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;