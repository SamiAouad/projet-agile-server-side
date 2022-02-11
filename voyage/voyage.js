const express = require('express')
const multer = require('multer')
const db = require('../db.js')
const fs = require("fs");
const path = require("path");


const router = express.Router()
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


/*
router.get('/getVoyages/:groupeId', upload.fields([]), (req, res) => {
    const groupeId = req.params.groupeId
    console.log(groupeId)
    db.query('select * from voyages where groupeId = ?', groupeId, function (err, result){
        if (err){
            console.log(err.message)
            return res.send(null)
        }
        return res.send(result)
    })
})*/
router.get('/getVoyages/:groupeId/:userId', upload.single('file'), async (req, res) => {
    const groupeId = req.params.groupeId
    const userId = req.params.userId
    const sql = "select * from voyages where groupeId = ?;" +
        "select voyageId from voyagemembers where userId = ?;" +
        "select voyageId from demandevoyages where userId = ?;"
    await db.query(sql, [groupeId, userId, userId], function (err, result){
        if (err){
            console.log(err.message)
            throw err
        }
        res.send(result)
    })
})

router.post('/createVoyage/:userId/:groupeId', upload.single('file'), (req, res) => {
    let userId = req.params.userId
    let groupeId = req.params.groupeId
    const contents = fs.readFileSync('./public/images/' + req.file.filename, {encoding: 'base64'});
    let voyage = {
        'adminId': userId,
        'groupeId': groupeId,
        'price': req.body.price,
        'dateStart': req.body.dateStart,
        'dateEnd': req.body.dateEnd,
        'capacite': req.body.capacite,
        'descriptionVoyage': req.body.voyageDescription,
        'destination': req.body.destination,
        'image': contents
    }
    db.query('insert into voyages set ?', voyage, (err, result) => {
        if (err) throw err;
        voyageId = result.insertId.toString()
        console.log(voyageId)
        let member = {
            voyageId: voyageId,
            userId: userId,
            voyageRole: 'admin'
        }
        db.query("insert into voyagemembers set ?", member, (err, result) => {
            if (err) return err;
        })
        res.send(voyageId)
    })
})

router.delete('/deleteVoyage/:idVoyage', function(req, res){
    console.log(req.params)
    db.query('delete from demandevoyages where voyageId = ?;' +
        ' delete from voyagemembers where voyageId = ?;' +
        'delete from voyages where id = ?;', [req.params.idVoyage, req.params.idVoyage, req.params.idVoyage], function(err, result){
        if (err){
            console.log(err.message)
            res.send(false)
        }
        else res.send(true)
    })

})

router.delete('/deleteDemandeVoyages/:voyageId/:userId', function(req, res){
    db.query('delete from demandeVoyages where voyageId = ? and userId = ?', [req.params.voyageId, req.params.userId], function(err, result) {
        if (err){
            console.log(err.message)
            return res.send(false)
        }
        return res.send(true)
    })
})

router.post('/ajouterDemandeVoyages', upload.fields([]), function(req, res){
    db.query('insert into demandevoyages set ?', req.body, function(err, result){
        if (err){
            console.log(err.message)
            return res.send(false)
        }
        return res.send(true)
    })
})

router.get('/getVoyage/:voyageId', (req, res) => {
    db.query('select * from voyages where id = ?', req.params.voyageId, (err, result) => {
        if (err){
            console.log(err.message)
            res.send(null)
        }else{
            res.send(result)
        }
    })
})


router.post('/updateVoyage/:voyageId', upload.fields([]), (req, res) => {
    const price = req.body.price
    const dateStart = req.body.dateStart
    const dateEnd = req.body.dateEnd
    const capacite = req.body.capacite

    db.query('update voyages set price = ?, dateStart = ?, dateEnd = ?, capacite = ? where id = ?', [price, dateStart, dateEnd, capacite,
        req.params.voyageId], (err, result) => {
        if (err){
            console.log(err.message)
            res.send(false)
        }
        else{
            res.send(true)
        }
    })
})

router.post('/accept/', upload.fields([]), (req, res) => {
    let membre = {
        'userId': req.body.userId,
        'voyageId': req.body.voyageId,
        'voyageRole': 'membre'
    }
    db.query('insert into voyageMembers set ?', membre, (err, result) => {
        if (err) {
            console.log(err.message)
        }
    })
    db.query('delete from demandeVoyages where id = ?', req.body.id, function(err, result){
        if (err) {
            console.log(err.message)
            res.send(false)
        }
        else res.send(true)
    })
})

router.get('/getDemandes/:voyageId', (req, res) => {
    db.query('select users.id as userId, users.image, users.username, users.email, users.firstname, users.lastname, demandevoyages.id, demandevoyages.voyageId' +
        '  from demandevoyages, users where userId = users.id and voyageId = ?', req.params.voyageId, (err, result) => {
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

router.delete('/deleteVoyageMember/:userId/:voyageId', function(req, res){
    db.query('delete from voyagemembers where voyageId = ? and userId = ?', [req.params.voyageId, req.params.userId], function(err, result) {
        if (err){
            console.log(err.message)
            return res.send(false)
        }
        return res.send(true)
    })
})
module.exports = router
