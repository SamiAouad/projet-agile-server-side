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
        "select voyageId from demandevoyages where userId = ? and demandeStatus = true;" +
        "select voyageId from demandevoyages where userId = ? and demandeStatus = false;"
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

router.delete('/deleteVoyages/:idVoyage', function(req, res){
    console.log(req.params)
    db.query('delete from voyages where id = ?', req.params.idVoyage, function(err, result) {
        if (err){
            console.log(err.message)
            return res.send(false)
        }
        return res.send(true)
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

module.exports = router
