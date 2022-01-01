const express = require('express'), bodyParser = require('body-parser')


const router = express.Router()
router.use(bodyParser.json())



const db = require('../db.js')



router.get('/', (req, res) => {
    res.send("user")
})

router.post('/signup', (req, res) => {
    let user = req.body
    db.query('insert into users set ?', user, function(err, result){
        if (err) throw err;
        res.send(true)
    })
})

router.post('/signin', (req, res) => {
    let user = req.body
    if (req.body == null) 
        return res.send(false)
    db.query("select * from users where username = ?", user.username,  function(err, result){
        if (err) 
            throw err;
        if (result.length === 0) 
            return res.send(false)
        if (result[0].passwordHash === user.password)
            res.send(result[0])
        else
            res.send(false)
    })
})




router.get('/isMember/:userId', (req, res) => {
    let userId = req.params.userId
    db.query('select groupeId from groupeMembers where userId = ?', userId, function(err, result){
        if (err) throw err;
        if(result.length > 0)
            res.send(result)
        else
            res.send(false)
    })
})

router.get('/demandeExist/:userId', (req, res) => {
    let userId = req.params.userId
    db.query('select groupeId from demandeGroupes where userId = ?', userId, function(err, result){
        if (err) throw err;
        if(result.length > 0)
            res.send(result)
        else
            res.send(false)
    })
})

module.exports = router
