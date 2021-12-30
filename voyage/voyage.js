const express = require('express'), bodyParser = require('body-parser')


const router = express.Router()
router.use(bodyParser.json())


const db = require('../db.js')


router.post('/createVoyage/:adminId', (req, res) => {
    let voyage = {
        'adminId': req.params.adminId,
        'price': req.body.price,
        'dateStart': req.body.dateStart,
        'dateEnd': req.body.dateEnd,
        'capacite': req.body.capacite,
        'descriptionVoyage': req.body.description
    }
    db.query('insert into voyages set ?', voyage, function(err, result){
        if (err) throw err;
        res.send(true)
    })
})

module.exports = router
