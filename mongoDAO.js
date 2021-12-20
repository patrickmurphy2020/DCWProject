const { MongoClient } = require('mongodb');

var coll

MongoClient.connect('mongodb://localhost:27017')
    .then((client) => {
        db = client.db('lecturersDB')
        coll = db.collection('lecturers')
    })
    .catch((error) => {
        console.log(error.message)
    })

function listLecturers() {
    return new Promise((resolve, reject) => {
        var cursor = coll.find()
        cursor.toArray()
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function addLecturers(lecturer){
    return new Promise((resolve,reject)=>{
        coll.insertOne(lecturer)
        .then((data)=>{
            console.log(data)
            resolve(data)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

module.exports = { addLecturers,listLecturers}