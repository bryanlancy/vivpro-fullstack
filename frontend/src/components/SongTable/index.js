import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { loadSongsThunk } from '../../store/songs'

export default function SongTable() {

    const dispatch = useDispatch()
    const [page, setPage] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [columns, setColumns] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const songs = useSelector(state => state.songs)

    //load playlist
    useEffect(() => {
        const pages = dispatch(loadSongsThunk())
        if (pages) setTotalPages(pages)
    }, [dispatch])

    //Check if songs is loaded, then set column labels
    useEffect(() => {
        if (Object.keys(songs).length) {
            setColumns(Object.keys(Object.values(songs)[0]))
        }
    }, [songs])

    //Check if labels are set, then load table header
    let songHeader = useMemo(() => {
        if (columns) {
            return (<tr>
                <th>index</th>
                {columns.map(label => {
                    return <th key={`td-${label}`}>{label}</th>
                })}
            </tr>)
        }
    }, [columns])

    //Check if labels are set, then load table row data
    let songRows = useMemo(() => {
        const list = []
        console.log()
        if (columns) {
            const start = page * perPage || 0
            for (let i = start; i < start + 10; i++) {
                if (songs[i]) {
                    list.push(
                        <tr key={`row-${i}`}>
                            <td>{i}</td>
                            {columns.map(prop => {
                                return <td key={`${i}-prop-${prop}`}>{songs[i][prop]}</td>
                            })}
                        </tr>
                    )
                }
            }
            return list
        }
    }, [page, perPage, columns])

    function updatePage(newPage) {
        setPage(newPage)
    }

    return (
        <div className="songs">
            <table className="songs__table">
                <thead>
                    {songHeader}
                </thead>
                <tbody>
                    {songRows}
                </tbody>
            </table>

            <div className="songs__pagination">
                <button onClick={() => updatePage(page - 1)}>Previous Page</button>
                <p>Page: {page + 1}</p>
                <button onClick={() => updatePage(page + 1)}>Next Page</button>
            </div>
        </div>
    )
}
