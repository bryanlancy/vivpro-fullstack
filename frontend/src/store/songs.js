const LOAD_SONGS = 'songs/LOAD_SONGS'


const loadSongs = (payload) => {
    return {
        type: LOAD_SONGS,
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

export default function reducer(state = {}, action) {
    switch (action.type) {
        case LOAD_SONGS:
            return { ...state, ...action.payload }
        default:
            return state
    }
}
