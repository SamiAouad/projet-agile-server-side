const express = require('express')


const router = express.Router()
let multer = require('multer');
let upload = multer();


const db = require('../db.js')
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
router.get('/getVoyages/:groupeId/:userId', upload.fields([]), async (req, res) => {
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

router.post('/createVoyage/:adminId/:groupeId', upload.fields([]), (req, res) => {

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
