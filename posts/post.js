const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router

router.use(bodyParser.json())

const db = require('../db')

router.post('/createPost/:userId/:groupeId', (req, res) => {
    let post = {

    }
})