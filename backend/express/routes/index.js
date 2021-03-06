const router = require('express').Router()
const playlist = require('../files/playlist.json')

const normal = {}
const searchDict = {}
for (const prop in playlist) {
    for (const song in playlist[prop]) {
        const value = playlist[prop][song]
        normal[song] ? normal[song][prop] = value : normal[song] = { [prop]: value }
        normal[song].index = song
        if (prop == 'title') {
            searchDict[value] = song
        }
    }
}
for (const song in normal) {
    normal[song].rating = 0
}
router.get('/playlist', (req, res) => {
    //page is 0-index
    const { songs_per_page, page } = req.query
    let playlist = {}
    if (songs_per_page && page) {
        const start = page * songs_per_page || 0
        for (let i = start; i < start + parseInt(songs_per_page); i++) {
            playlist[i] = { ...normal[i] }
        }
    }
    else playlist = normal
    res.status(200).json({ playlist })
})

router.get('/search', (req, res) => {
    const { title } = req.query
    const song = normal[searchDict[title]]
    res.json({ song })
})

router.put('/songs/:id', (req, res) => {
    const { id } = req.params
    const body = req.body

    let response
    if (normal[id] && body) {
        normal[id] = {
            ...normal[id],
            ...body
        }
        response = normal[id]
    }
    else response = "Song not found."
    res.json(response)
})

module.exports = { apiRouter: router }
