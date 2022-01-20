const express = require('express'), bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

const router = express.Router()
router.use(bodyParser.json())



const db = require('../db.js')
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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



router.get('/', (req, res) => {
    res.send("user")
})

router.post('/signup', upload.single('file'), async (req, res) => {
    let user = req.body
    const contents = fs.readFileSync('./public/images/' + req.file.filename, {encoding: 'base64'});
    user['image'] = contents
    const salt = bcrypt.genSaltSync(10);
    user['passwordHash'] = bcrypt.hashSync(req.body.passwordHash, salt);
    db.query('insert into users set ?', user, function(err, result){
        if (err) throw err;
        res.send(true)
    })
})

router.post('/signin', (req, res) => {
    let user = req.body
    if (req.body == null) 
        return res.send(false)
    db.query("select * from users where username = ?", user.username,  function(err, result){
        if (err) 
            throw err;
        if (result.length === 0) 
            return res.send(false)
        if (bcrypt.compareSync(user.password, result[0].passwordHash))
            res.send(result[0])
        else
            res.send(false)
    })
})




router.get('/isMember/:userId', (req, res) => {
    let userId = req.params.userId
    db.query('select groupeId from groupeMembers where userId = ?', userId, function(err, result){
        if (err) throw err;
        if(result.length > 0)
            res.send(result)
        else
            res.send(false)
    })
})

router.get('/demandeExist/:userId', (req, res) => {
    let userId = req.params.userId
    db.query('select groupeId from demandeGroupes where userId = ?', userId, function(err, result){
        if (err) throw err;
        if(result.length > 0)
            res.send(result)
        else
            res.send(false)
    })
})

router.get('/isAdmin/:userId/:groupeId', async (req, res) => {
    let userId =  req.params.userId
    let groupeId =  req.params.groupeId
    let result = await db.query("select * from groupemembers where userId = ? and groupeId = ? and groupeRole = 'admin'",[userId, groupeId], function(err, result){
        if (err) console.log(err.message);
        if (result.length > 0) return res.send(true);
        else res.send(false)
    })
    return result
})

router.get('/isVoyageur/:userId/:voyageId', (req, res) => {
    let userId =  req.params.userId
    let voyageId =  req.params.voyageId
    db.query("select * from demandevoyages where userId = ? and voyageId = ?",[userId, voyageId], function(err, result){
        if (err) console.log(err.message);
        if (result.length > 0) {
            if (result[0].demandeStatus === 0)
                return res.send(false)
            return res.send(true)
        }
        else {
            res.send(null)
        }
    })
})



module.exports = router
