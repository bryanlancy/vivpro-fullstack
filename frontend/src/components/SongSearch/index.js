import { useMemo, useState } from "react"
import "./SongSearch.css"
export default function SongSearch() {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState()

    async function fetchSong() {
        if (search) {



            const res = await fetch(`/api/search?title=${search}`)
            if (res.ok) {
                const { song } = await res.json()
                setSearchResult(song)
            } else
                setSearchResult()
        }
    }

    let resultDiv = useMemo(() => {
        if (searchResult) {
            const propList = []

            for (const prop in searchResult) {
                propList.push(<label key={`search-prop-${prop}`}>{prop}<p>{searchResult[prop]}</p></label>)
            }
            return (
                <div className="search__result">
                    {/* <p>Found!</p> */}
                    <div className="search__data">
                        {propList}
                    </div>
                    <iframe src={`https://open.spotify.com/embed/track/${searchResult.id}`} width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                </div>
            )
        } else {
            return (
                <div className="search__result">
                    <p>Nothing found.</p>
                </div>
            )
        }
    }, [searchResult])

    return (
        <div className="search">
            <div className="search__input">
                <label htmlFor="">Search<input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Enter song title" /></label>
                <button onClick={fetchSong}>Get Song</button>
            </div>
            {resultDiv}
        </div >
    )
}
