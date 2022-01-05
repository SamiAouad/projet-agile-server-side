const express = require('express'), bodyParser = require('body-parser')
const multer = require('multer')


const router = express.Router()
router.use(bodyParser.json())


// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended: true}));
// serving static files

let upload = multer();


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

router.post('/createGroupe/:userId', upload.single('file'), (req, res) => {
    let groupe = req.body
    // req.body containing the groupe title, description
    let userId = req.params.userId
    let groupeId
    groupe['image'] = req.file
    db.query('insert into groupes set ?', groupe, (err, result) => {
        if (err) throw err;
        groupeId = result.insertId.toString()
        db.query("insert into groupemembers set ?", [groupeId, userId, 'admin'], (err, result) => {
            if (err) return err;
            res.send(result.insertId.toString())
        })
    })
})


router.post('/accept/:userId/:groupeId', (req, res) => {
    let id = req.params.id
     db.query('insert into groupeMembers set ?', membre, (err, result) => {
            if (err) throw err
        })
        db.query('delete from demandeGroupes where id = ?', id, function(err, result){
            if (err) throw err;
            res.send('true')
        })
    db.query('select userId, groupeId from demandeGroupes where id = ?', id, (err, result) => {
        if (err) throw err;
        let userId = result[0].userId
        let groupeId = result[0].groupeId
        let membre = {
            "groupeId": groupeId,
            "userId": userId,
            "groupeRole": "membre"
        }
       
    })
})

router.delete('/refuse/:userId/:groupeId', (req, res) => {
    let {userId, groupeId} = req.params
    db.query(`delete from demandeGroupes where userId = ? and groupeId = ?`, [userId, groupeId], function(err, result){
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

