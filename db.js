const express = require("express")

var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'viatores'
})

let conn = async () => {
    let con = await connection.connect()
}

conn()


module.exports = connection;