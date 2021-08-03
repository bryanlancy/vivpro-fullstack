const express = require('express')

const { apiRouter } = require('./routes')

const app = express()
const port = 5000

app.use('/api', apiRouter)

app.use((_req, _res, next) => {
    res.status = 500
    res.json({
        title: 'Server Error',
        message: err.message,
        error: "The requested resource couldn't be found.",
    })

})

app.listen(port, () => { console.log(`Listening on port ${port}`) })
