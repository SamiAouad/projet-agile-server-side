const express = require('express'), bodyParser = require('body-parser')
const multer = require('multer')


const router = express.Router()
router.use(bodyParser.json())


// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended: true}));
// serving static files

var upload = multer();


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

router.post('/getVoyages/:groupeId', (req, res) => {
    db.query('select * from voyages where groupeId = ?', req.params.groupeId, function(err, result) {
        if (err) throw err
        res.send(result)
    })
})

router.post('/createGroupe', upload.single('file'), (req, res) => {
    let groupe = req.body
    groupe['image'] = req.file
    db.query('insert into groupes set ?', groupe, function(err, result){
        if (err) throw err;
        res.send(result.insertId.toString())
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
        if (err) res.send(false);
        if (result.length > 0){
            res.send(result)
        }
        else
            res.send(false)
    })
})

router.post('/createVoyageGroupe', (req, res) => {
    let voyage = req.body
    
})


module.exports = router

