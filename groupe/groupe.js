const express = require('express'), bodyParser = require('body-parser')


const router = express.Router()
router.use(bodyParser.json())


const db = require('../db.js')

router.post('/joinGroupe/:userId/:groupeId', (req, res) => {
    let demandeGroupe = {
        'userId': req.params.userId,
        'groupeId': req.params.groupeId,
        'motivation': req.body.motivation
    }
    db.query('insert into demandeGroupes set ?', demandeGroupe, function(err, result){
        if (err) throw err;
        res.send(true)
    })
})

router.post('/createGroupe', (req, res) => {
    let groupe = req.body
    db.query('insert into groupes set ?', groupe, function(err, result){
        if (err) throw err;
        res.send(true)
    })
})


router.post('/accept/:id', (req, res) => {
    let id = req.params.id
    db.query('select userId, groupeId from demandeGroupes where id = ?', id, (err, result) => {
        if (err) throw err;
        let userId = result[0].userId
        let groupeId = result[0].groupeId
        let membre = {
            "groupeId": groupeId,
            "userId": userId,
            "groupeRole": "membre"
        }
        db.query('insert into groupeMembers set ?', membre, (err, result) => {
            if (err) throw err
        })
        db.query('delete from demandeGroupes where id = ?', id, function(err, result){
            if (err) throw err;
            res.send('true')
        })
    })
})

router.delete('/refuse/:id', (req, res) => {
    let id = req.params.id
    db.query('delete from demandeGroupes where id = ?', id, function(err, result){
        if (err) throw err;
        res.send('true')
    })
})

router.get('/getGroupes', (req, res) => {
    db.query('select * from groupes', (err, result) => {
        if (err) throw err;
        if (result.length > 0)
            return res.send(result)
        return res.send(false)
    })
})

router.post('/createVoyageGroupe', (req, res) => {
    let voyage = req.body
    
})
module.exports = router

