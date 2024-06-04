require('dotenv').config()
const connection = require('./db')
connection()


const express = require('express')

const app = express()
const cors = require('cors')
//middleware
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))