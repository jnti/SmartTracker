const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./queries')
const app = express()
const port = 3000

app.use(cors())

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/dates', db.getDates)
app.get('/cases', db.getCases)
app.get('/daily-cases', db.getDailyCases)
app.get('/complete-data', db.getCompleteData)
app.get('/complete-data/:data_date', db.getCompleteDataByDate)
app.post('/complete-data', db.addCompleteData)
app.post('/daily-cases', db.addDailyCases)
app.delete('/complete-data/:data_date', db.deleteCompleteDataByDate)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})