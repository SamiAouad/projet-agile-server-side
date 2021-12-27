const express = require("express")
const cors = require('cors');



const app = express()

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke
}

app.use(cors(corsOptions));

const user = require('./user/user.js')
const voyage = require('./voyage/voyage.js')


app.use('/user', user, cors(corsOptions))
app.use('/voyage', voyage)

app.listen(5000)

