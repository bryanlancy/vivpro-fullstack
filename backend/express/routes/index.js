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

router.get('/playlist', (req, res) => {
    //page is 0-index
    const { songs_per_page, page } = req.query
    const response = {}
    if (songs_per_page) {
        const start = page * songs_per_page || 0
        for (let i = start; i < start + parseInt(songs_per_page); i++) {
            response[i] = { ...normal[i] }
        }
    }
    else response = normal
    res.json(response)
})


module.exports = { apiRouter: router }
