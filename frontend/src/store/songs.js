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
        const { playlist } = await res.json()
        if (playlist) dispatch(loadSongs(playlist))
    }
}


const initialState = {}
export default function reducer(state = initialState, action) {
    let newState = { ...state }
    switch (action.type) {
        case LOAD_SONGS:
            return { ...action.payload }
        default:
            return state
            break;
    }
}
