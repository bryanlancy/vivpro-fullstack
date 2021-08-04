import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function SongRating({ id }) {

    const { [id]: song } = useSelector(state => state.songs)


    const [hovered, setHovered] = useState(0)
    const [rating, setRating] = useState(0)

    useEffect(() => {
        if (song) {

        }
    })




    if (!song) return null

    return (
        <div className="song__rating">
            <i className="far fa-star"></i>
            <i className="far fa-star"></i>
            <i className="far fa-star"></i>
            <i className="far fa-star"></i>
            <i className="far fa-star"></i>
        </div>


    )
}
