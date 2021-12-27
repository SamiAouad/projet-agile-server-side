const express = require('express'), bodyParser = require('body-parser')


const router = express.Router()
router.use(bodyParser.json())


const db = require('../db.js')


router.post('/createVoyage/:userId', (req, res) => {
    let voyage = {
        'adminId': req.params.userId,
        'price': req.body.price,
        'dateStart': req.body.dateStart,
        'dateEnd': req.body.dateEnd,
        'capacite': req.body.capacite,
        'descriptionVoyage': req.body.descriptionVoyage
    }
    db.query('insert into voyages set ?', voyage, function(err, result){
        if (err) throw err;
        res.send('insert successful')
    })
})

module.exports = router
