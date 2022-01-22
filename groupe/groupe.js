const express = require('express'), bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs');
const router = express.Router()
router.use(bodyParser.json())

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended: true}));
// serving static files

let storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({
    storage: storage
});


const db = require('../db.js')
const path = require("path");




router.post('/joinGroupe',upload.fields([]), (req, res) => {
    let demandeGroupe = {
        'userId': req.body.userId,
        'groupeId': req.body.groupeId,
        'motivation': req.body.motivation
    }
    db.query('insert into demandeGroupes set ?', demandeGroupe, function(err, result){
        if (err) throw err;
        res.send(true)
    })
})

router.get('/getVoyages/:groupeId', (req, res) => {
    db.query('select * from voyages where groupeId = ?', req.params.groupeId, function(err, result) {
        if (err) {
            console.log(err.message)
            res.send(null)
        }
        res.send(result)
    })
})

router.post('/createGroupe/:userId', upload.single('file'), (req, res) => {

    let groupe = req.body
    // req.body containing the groupe title, description

    let userId = req.params.userId
    const contents = fs.readFileSync('./public/images/' + req.file.filename, {encoding: 'base64'});
    groupe['image'] = contents
    db.query('insert into groupes set ?', groupe, (err, result) => {
        if (err) throw err;
        groupeId = result.insertId.toString()
        console.log(groupeId)
        let member = {
            groupeId: groupeId,
            userId: userId,
            groupeRole: 'admin'
        }
        db.query("insert into groupemembers set ?", member, (err, result) => {
            if (err) return err;
        })
        res.send(groupeId)
    })
})


router.post('/accept/', upload.fields([]), (req, res) => {
    let membre = {
        'userId': req.body.userId,
        'groupeId': req.body.groupeId,
        'groupeRole': 'membre'
    }
     db.query('insert into groupeMembers set ?', membre, (err, result) => {
            if (err) {
                console.log(err.message)
            }
        })
    db.query('delete from demandeGroupes where id = ?', req.body.id, function(err, result){
        if (err) {
            console.log(err.message)
            res.send(false)
        }
        else res.send(true)
    })
})

router.delete('/refuse/:demandeId',upload.fields([]), (req, res) => {
    console.log(req.demandeId)
    db.query(`delete from demandeGroupes where id = ?`, req.params.demandeId, function(err, result){
        if (err){
            console.log(err.message)
            res.send(false)
        }
        else res.send(true)
    })
})

router.delete('/refuse/:userId/:groupeId',upload.fields([]), (req, res) => {
    console.log(req.demandeId)
    db.query(`delete from demandeGroupes where userId = ? and groupeId = ?`, [req.params.userId, req.params.groupeId], function(err, result){
        if (err){
            console.log(err.message)
            res.send(false)
        }
        else res.send(true)
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

router.get('/getUsers/:groupeId', (req, res) => {
    const groupeId = req.params.groupeId;
    db.query('select users.id, users.username, users.image, users.firstname, users.lastname, groupemembers.groupeRole from users, groupemembers where users.id = groupemembers.userId and groupemembers.groupeId = ?;', groupeId, function (err, result)  {
        if (err){
            console.log(err.message);
            res.send(null);
        }else{
            res.send(result)
        }
    })
})

router.delete('/deleteUser/:groupeId/:userId',upload.fields([]), (req, res) => {
    db.query('delete from groupemembers where userId = ? and groupeId = ?', [req.params.userId, req.params.groupeId], function(err, result) {
        if (err){
            console.log(err.message)
            res.send(false)
        }
        else {
            res.send(true)
        }
    })
})

router.post('/promoteAdmin', upload.fields([]), (req, res) => {
    console.log(req.body)
    const groupeId = req.body.groupeId
    const userId = req.body.userId
    db.query("update groupemembers set groupeRole = 'admin' where groupeId = ? and userId = ?", [groupeId, userId], function(err, result){
        if (err){
            console.log(err.message)
            res.send(false)
        }
        else res.send(true)
    })
})

router.get('/getDemandes/:groupeId', (req, res) => {
    db.query('select users.id as userId, users.image, users.username, users.email, users.firstname, users.lastname, demandegroupes.id, demandegroupes.groupeId' +
        ' ,demandegroupes.motivation from demandegroupes, users where userId = users.id and groupeId = ?', req.params.groupeId, (err, result) => {
        if (err){
            console.log(err.message)
            res.send(null)
        }
        else
        {
            res.send(result)
        }
    })
} )



module.exports = router

