var pmysql = require('promise-mysql')

var pool;
var coll

pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'collegedb'
})
    .then(p => {
        pool = p
    })
    .catch(e => {
        console.log("pool error:" + e)
    })

function getModules() {
    return new Promise((resolve, reject) => {
        pool.query('select * from module;')
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

function updateModule(mid, mName, credits) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: "update module set name = ?,credits= ? where mid= ?;",
            values: [mName, credits, mid]
        }

        pool.query(myQuery)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

function studentModule(mid) {
    return new Promise((resolve, reject) => {
        var myQuery = { 
            sql: "select s.sid, s.name, s.gpa from student s left join student_module sm on s.sid = sm.sid where sm.mid = ?",
            values: [mid]
        }
        pool.query(myQuery)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

function getStudents() {
    return new Promise((resolve, reject) => {
        pool.query('select * from student;')
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

function addStudents(sid,sName,gpa) {
    return new Promise((resolve, reject) => {

        var myQuery = {
            sql: "insert into student values (?,?,?);",
            values:[sid,sName,gpa]
        }

        pool.query(myQuery)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

function deleteStudent(sid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: "delete from student where sid = ?;",
            values: [sid]
        }
        pool.query(myQuery)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}
module.exports = { getModules, updateModule, getStudents, addStudents, deleteStudent, studentModule }