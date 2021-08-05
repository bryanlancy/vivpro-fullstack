const LOAD_SONGS = 'songs/LOAD_SONGS'
const UPDATE_SONG = 'songs/UPDATE_SONG'

const loadSongs = (payload) => {
    return {
        type: LOAD_SONGS,
        payload
    }
}
const updateSong = (payload) => {
    return {
        type: UPDATE_SONG,
        payload
    }
}

export const loadSongsThunk = () => async dispatch => {
    const res = await fetch(`/api/playlist`)
    if (res.ok) {
        const { playlist } = await res.json()
        if (playlist) dispatch(loadSongs(playlist))
        return playlist //subtract for 0-index pagination
    }
}

export const updateSongThunk = (id, body) => async dispatch => {
    const res = await fetch(`/api/songs/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(body)
    })
    if (res.ok) {
        const data = await res.json()
        dispatch(updateSong({ id, data }))
        return { song: data }
    }
    else return null
}
export default function reducer(state = {}, action) {
    switch (action.type) {
        case LOAD_SONGS:
            return { ...state, ...action.payload }
        case UPDATE_SONG:
            const { id, data } = action.payload
            return {
                ...state,
                [id]: data
            }
        default:
            return state
    }
}
