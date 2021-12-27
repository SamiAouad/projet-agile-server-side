const express = require("express")

var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1453',
  database: 'viatores'
})

let conn = async () => {
    let con = await connection.connect()
}

conn()


module.exports = connection;