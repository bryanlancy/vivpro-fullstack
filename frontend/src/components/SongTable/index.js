import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { loadSongsThunk } from '../../store/songs'

import { CSVLink } from 'react-csv'

import SongRating from '../SongRating';

export default function SongTable() {

    const dispatch = useDispatch()
    const songs = useSelector(state => state.songs)         // table - normalize song data in redux

    const [page, setPage] = useState(0)                     // pagination - current page
    const [perPage, setPerPage] = useState(10)              // pagination - results per page
    const pagCountOptions = [5, 10, 25, 50]                 // pagination - results per page options
    const [totalPages, setTotalPages] = useState(1)         // pagination - total pages
    const [columns, setColumns] = useState([])              // table - header row labels
    const [jsonList, setJsonList] = useState([])            // table - array of table data in json format
    const [sortColumn, setSortColumn] = useState('index')   // table - column to sort by
    const [sortAsc, setSortAsc] = useState(true)            // table - sorting direction

    function updatePage(newPage) {
        if (newPage <= totalPages && newPage >= 0) setPage(newPage)
    }

    function sortTable(column) {
        if (column === sortColumn) {
            setSortAsc(!sortAsc)
        }
        else {
            setSortColumn(column)
            setSortAsc(true)
        }
    }

    function updatePageCount(e) {
        setPerPage(parseInt(e.target.value))
        setPage(0)
    }

    //load playlist
    useEffect(() => {
        dispatch(loadSongsThunk())
    }, [dispatch])

    useEffect(() => {
        setTotalPages(Math.ceil((Object.keys(songs).length - 1) / (perPage || 10)))
    }, [perPage, songs])

    //Check if songs is loaded, then set column labels
    useEffect(() => {
        if (Object.keys(songs).length) {
            setColumns(Object.keys(Object.values(songs)[0]))
        }
    }, [songs])

    const sortedSongs = useMemo(() => {
        setPage(0)
        const textSort = ['id', 'title']
        if (textSort.includes(sortColumn))
            return Object.values(songs).sort((a, b) => (sortAsc ? a : b)[sortColumn].localeCompare((sortAsc ? b : a)[sortColumn]))
        return Object.values(songs).sort((a, b) => sortAsc ? a[sortColumn] - b[sortColumn] : b[sortColumn] - a[sortColumn])
    }, [songs, sortColumn, sortAsc])

    //Check if labels are set, then load table header
    let songHeader = useMemo(() => {
        if (columns) {
            return (<tr>
                <th onClick={() => sortTable('index')}>index</th>
                {columns.map(label => {
                    if (label !== 'index')
                        return <th onClick={() => sortTable(label)} key={`td-${label}`}>{label}</th>
                    return null
                })}
                <th onClick={() => sortTable('rating')}>rating</th>
            </tr>)
        }
    })

    //Check if labels are set, then load table row data
    let songRows = useMemo(() => {
        const list = []
        const listJSON = []
        if (columns) {
            const start = page * perPage || 0
            for (let i = start; i < start + perPage; i++) {
                if (sortedSongs[i]) {
                    list.push(
                        <tr key={`row-${i}`}>
                            <td>{sortedSongs[i].index}</td>
                            {columns.map(prop => {
                                if (prop === 'index')
                                    return null
                                return <td key={`${i}-prop-${prop}`}>{sortedSongs[i][prop]}</td>
                            })}
                            <td><SongRating id={sortedSongs[i].index} /></td>
                        </tr>
                    )
                    listJSON.push({ index: i, ...songs[i] })
                }
            }
            setJsonList(listJSON)
            return list
        }
    }, [page, perPage, songs, columns, sortedSongs])

    return (
        <div className="playlist">
            <table className="playlist__table">
                <thead>
                    {songHeader}
                </thead>
                <tbody>
                    {songRows}
                </tbody>
            </table>
            <div className="playlist__pagination">
                <button onClick={() => updatePage(page - 1)} disabled={page <= 0}>Previous Page</button>
                <p>Page: {page + 1}</p>
                <button onClick={() => updatePage(page + 1)} disabled={page >= totalPages}>Next Page</button>
                <label>
                    Results per page
                    <select value={perPage} onChange={updatePageCount}>
                        {pagCountOptions.map(count => <option key={`count-${count}`} value={count}>{count}</option>)}
                    </select>
                </label>
            </div>
            <CSVLink data={jsonList} filename={'song_list.csv'}>Download Table</CSVLink>
        </div >
    )
}
