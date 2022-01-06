const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()

const db = require('../db')
router.use(bodyParser.urlencoded({extended: true}));

router.post('/createPoste/:userId/:groupeId', async (req, res) => {
    console.log(req.body)
    let post = {
        userId: req.params.userId,
        groupeId: req.params.groupeId,
        title: req.body.title,
        content: req.body.content
    }
    await db.query("insert into postes set ?", post, function (err, result){
        if (err) {
            console.log(err.message)
            res.send(false)
        }
        else res.send(true)
    })
})

router.get('/getPostes/:id', async (req, res) => {
    let id = req.params.id;
    db.query('select * from postes where groupeId = ?', id, function(err, result){
        if (err){
            console.log(err.message)
            res.send(null)
        }
        else res.send(result)
    })
})

router.get('/getPostesCommentaire/:id', async (req, res) => {
    let id = req.params.id;
    db.query('select * from postes where groupeId = ?', id, function(err, result){
        if (err){
            console.log(err.message)
            res.send(null)
        }
        else {
            res.send(result)
        }
    })
})


module.exports = router