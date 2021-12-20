var express = require('express')
var app = express()
var mysql = require('mysql')
var mongoDAO = require('./mongoDAO')
var mySqlDao = require('./mySQLDAO')
let ejs = require('ejs')
var bodyParser = require('body-parser')
const { redirect, render } = require('express/lib/response')
const { name } = require('ejs')
const res = require('express/lib/response')
const { signal } = require('nodemon/lib/config/defaults')
const {body, validationResult, check} = require('express-validator')


app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: false}))

app.get('/',(req,res)=>{
    res.render('home')
})

//displays the list of the modules
app.get('/listModules',(req,res)=>{
    mySqlDao.getModules(req.params.mid)
    .then((data) => {
        let module = data[0]
        res.render('listModules', {modules: data,errors:undefined})
    })
    .catch((error) => {
        res.send(error)
    })
})
//displays the values in editModules.ejs
app.get('/module/edit/:mid',(req,res)=>{
    res.render('editModules',{errors:undefined})
})

//checks to make sure the conditions are met for the users input
//if no errors invokes the updateModule function and displays the results
app.post('/module/edit/:mid',
[check('mName').isLength({min:5}).withMessage("The module name should be minimum of 5 characters")],
[check('credita').equals(5,10,15).withMessage("The credit should be 5, 10 or 15")]
,(req,res)=>{
    var errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        res.render('editModules', {errors: errors.errors})
    }
    else {
        mySqlDao.updateModule(req.body.mid,req.body.mName,req.body.credits)
        res.redirect('/listModules')
    }
    
})
//invokes studentModule function to get the list of ever student on each module
app.get('/module/students/:mid',(req,res)=>{
    mySqlDao.studentModule(req.params.mid)
    .then((data)=>{
        res.render('studentModule', {students: data})
    })
    .catch((error)=>{
        res.send(error)
    })

})
//displays the list of students
app.get('/listStudents',(req,res)=>{
    mySqlDao.getStudents()
    .then((data)=>{
        res.render('listStudents', {students: data,errors:undefined})
    })
    .catch((error)=>{
        res.send(error)
    })
})
//displays contents in addStudents.ejs
app.get('/addStudent',(req,res)=>{
    res.render('addStudent',{errors:undefined})
})
//checks for issus with user input
//add a student to the list and then displays the new list
app.post('/addStudent',
[check('sid').isLength({min:4,max:4}).withMessage("Student ID must be 4 characters")],
[check('sName').isLength({min:5}).withMessage("Student name must be at least 5 characters")],
[check('gpa').isFloat({min:0.0,max:4.0}).withMessage("GPA must be between 0.0 & 4.")]
,(req,res)=>{
    var errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        res.render('addStudent', {errors: errors.errors})
    }
    else {
        mySqlDao.addStudents(req.body.sid,req.body.sName,req.body.gpa)
        .then((data) => {
            res.redirect("/listStudents")
        })
    }
})
//checks to see if student exist and has no associated modules. If both are true student deleted for the table
app.get('/students/delete/:sid',(req,res)=>{
    mySqlDao.deleteStudent(req.params.sid)
    .then((data) => {
        console.log(data)
        if (data.affectedRows == 0){
            res.send('<h1> Student: </h1> <br/> <h4> ' + req.params.sid + ' doesnt exist</h4>')
        }
        else{
            res.send('<h1> Student: </h1> <br/> <h4> ' + req.params.sid + ' has been deleted</h4>')
        }
    })
    .catch((error) => {
        if(error.errno == 1451){
            res.send("<h1>Error: </h1> <br/> <h3> "+ req.params.sid + "has associated moduule he/she cannot be deleted </h3> <br/>")
        }
        res.send(error)
    })
    
})
//displays a list of lecturers
app.get('/listLecturers',(req,res)=>{
    mongoDAO.listLecturers()
    .then((data)=>{
        console.log(data)
        res.render('listLecturers', {allData: data})
    })
    .catch((error)=>{
        res.send(error)
    })
})

app.get('/addLecturer',(req,res)=>{
    res.render('addLecturer',{IDError: undefined})
})
//adds lecturers to the databases
app.post('/addLecturer',(req,res)=>{
    mongoDAO.addLecturers(req.body)
    .then((data)=>{
        res.redirect('/listLecturers')
    })
    .catch((error)=>{
        res.render('addLecturer', {IDError: "ID already exists", _id: req.body._id, name:req.body.name, title:req.body.title, salary:req.body.salary})
    })
})

app.listen(3000, ()=>{
    console.log('listenning on port 3000')
})