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
        res.send('insert successful')
    })
})

module.exports = router

