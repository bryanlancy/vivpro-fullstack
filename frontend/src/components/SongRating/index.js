import { useEffect, useState } from "react"

import { useSelector, useDispatch } from "react-redux"
import { updateSongThunk } from "../../store/songs"

export default function SongRating({ id }) {

    const dispatch = useDispatch()

    const { [id]: song } = useSelector(state => state.songs)


    const [hovered, setHovered] = useState(0)
    const [rating, setRating] = useState(0)


    useEffect(() => {
        setRating(song.rating)
    }, [song])



    function starHover(num) {
        setHovered(num)
    }
    async function updateRating(num) {
        const res = await dispatch(updateSongThunk(id, { rating: num }))
        if (res) {
            const { song: updated } = res
            const { rating: newRating } = updated
            setRating(newRating)
        }
    }


    if (!song) return null

    return (
        <div className="song__rating">
            {[1, 2, 3, 4, 5].map(num => {
                return <i
                    key={`star-${id}-${num}`}
                    className={`${(num <= hovered || num <= rating) ? 'fas' : 'far'} fa-star`}
                    style={{ color: num <= rating ? '#d09c00' : num <= hovered ? '#FFD919' : '', filter: `brightness(${num <= hovered ? '.7' : '1'})` }}
                    onClick={() => updateRating(num)}
                    onMouseEnter={() => starHover(num)}
                    onMouseLeave={() => starHover(0)}>
                </i>
            })}

        </div >


    )
}
