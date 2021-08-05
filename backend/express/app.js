const express = require('express')

const { apiRouter } = require('./routes')

const app = express()
const port = 5000
app.use(express.json())
app.use('/api', apiRouter)

app.use((_req, _res, next) => {
    _res.status = 500
    _res.json({
        title: 'Server Error',
        error: "The requested resource couldn't be found.",
    })
})

app.listen(port, () => { console.log(`Listening on port ${port}`) })
