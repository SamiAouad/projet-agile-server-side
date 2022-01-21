const express = require('express')
const db = require('../db.js')
const path = require('path')
const fs = require('fs')

const router = express.Router()
let multer = require('multer');
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



router.post('/createPoste/:groupeId',upload.single('file'),  async (req, res) => {
    //let buff = new Buffer(req.file[0]);
    //let base64data = buff.toString('base64');
    const contents = fs.readFileSync('./public/images/' + req.file.filename, {encoding: 'base64'});

    let post = {
        username: req.body.username,
        groupeId: req.params.groupeId,
        title: req.body.title,
        content: req.body.content,
        image: contents
    }
    await db.query("insert into postes set ?", post, function (err, result){
        if (err) {
            console.log(err.message)
            res.send(false)
        }
        else res.send(true)
    })
})

router.get('/getPostes/:id', async (req, res) => {
    let id = req.params.id;
    db.query('select * from postes where groupeId = ?', id, function(err, result){
        if (err){
            console.log(err.message)
            res.send(null)
        }
        else res.send(result)
    })
})

router.get('/getPostesCommentaire/:id', async (req, res) => {
    let id = req.params.id;
    db.query('select * from commentaires where posteId = ?', id, function(err, result){
        if (err){
            console.log(err.message)
            res.send(null)
        }
        else {
            res.send(result)
        }
    })
})

router.get('/getPoste/:id', async (req, res) => {
    let id = req.params.id;
    db.query('select * from postes where id = ?', id, function(err, result){
        if (err){
            console.log(err.message)
            res.send(null)
        }
        else{
            res.send(result[0])
        }
    })
})

router.post('/createCommentaire',upload.fields([]), async function(req, res){
    console.log(req.body)
    let commentaire = {
        username: req.body.username,
        posteId: req.body.posteId,
        contenu: req.body.contenu
    }
    db.query('insert into commentaires set ?', req.body, function(err, result) {
        if (err){
            console.log(err.message)
            return res.send(false)
        }
        return res.send(true)
    })
})
router.get('/getUserPostes/:userId', async (req, res) => {
    let userId = req.params.userId;
    let endResult = []
    await db.query('select groupeId from groupemembers where userId = ?', userId, async function(err, result){
        if (err){
            console.log(err.message)
            res.send(null)
        }
        else {
            await result.map(async groupe => {
                await db.query('select * from postes where groupeId = ?', groupe.groupeId, function(err, result){
                    if (result != []){
                        endResult.push(result)
                    }
                })
            })
            res.send(endResult)
        }
    })
})

router.get('/getAll', (req, res) => {
    db.query('select * from postes', function(err, result){
        if (err){
            console.log(err.message)
            return res.send(false)
        }
        return res.send(result)
    })
})

router.delete('/deletePost/:posteId', upload.fields([]), (req, res) => {
    const posteId = req.params.posteId
    db.query('delete from commentaires where posteId = ?;delete from postes where id = ?', [posteId, posteId] , function(err, result){
        if (err){
            console.log(err.message)
            return res.send(false)
        }
        return res.send(true)
    })
})

module.exports = router