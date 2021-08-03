const fs = require('fs')
const router = require('express').Router()
const playlist = require('../files/playlist.json')

const normal = {}
for (const prop in playlist) {
    for (const song in playlist[prop]) {
        const value = playlist[prop][song]
        normal[song] ? normal[song][prop] = value : normal[song] = { [prop]: value }
    }
}
c
router.get('/playlist', (req, res) => {
    res.json(normal)
})



module.exports = { apiRouter: router }
