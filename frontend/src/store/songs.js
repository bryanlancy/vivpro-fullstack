const LOAD_SONGS = 'songs/LOAD_SONGS'


const loadSongs = (payload) => {
    return {
        type: LOAD_SONGS,
        payload
    }
}
export const loadSongsThunk = () => async dispatch => {
    const res = await fetch('/api/playlist')
    if (res.ok) {
        const { playlist, totalPages } = await res.json()
        if (playlist) dispatch(loadSongs(playlist))
        return totalPages
    }
}

export default function reducer(state = {}, action) {
    switch (action.type) {
        case LOAD_SONGS:
            return { ...state, ...action.payload }
        default:
            return state
    }
}
