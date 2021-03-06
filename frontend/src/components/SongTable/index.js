import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { loadSongsThunk } from '../../store/songs'

import { CSVLink } from 'react-csv'

import SongRating from '../SongRating';

import './SongTable.css'

export default function SongTable() {

    const dispatch = useDispatch()
    const songs = useSelector(state => state.songs)         // table - normalize song data in redux

    const [page, setPage] = useState(0)                     // pagination - current page
    const [perPage, setPerPage] = useState(10)              // pagination - results per page
    const pagCountOptions = [5, 10, 25, 50]                 // pagination - results per page options
    const [totalPages, setTotalPages] = useState(1)         // pagination - total pages
    const [columns, setColumns] = useState([])              // table - header row labels
    const [jsonList, setJsonList] = useState([])            // table - array of table data in json format, for CSV
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


    //Sort songs by column from songs object
    const sortedSongs = useMemo(() => {
        setPage(0)
        const textSort = ['id', 'title']
        if (textSort.includes(sortColumn))
            return Object.values(songs).sort((a, b) => (sortAsc ? a : b)[sortColumn].localeCompare((sortAsc ? b : a)[sortColumn]))
        return Object.values(songs).sort((a, b) => sortAsc ? a[sortColumn] - b[sortColumn] : b[sortColumn] - a[sortColumn])
    }, [songs, sortColumn, sortAsc])

    //Check if labels are set, then load table header
    const ignore = ['index', 'rating']
    let songHeader = useMemo(() => {
        if (columns) {
            return (<tr>
                <th className="playlist__table-index" onClick={() => sortTable('index')}>index</th>
                {columns.map(label => {
                    if (ignore.includes(label))
                        return null
                    return <th
                        className={`playlist__table-${label}`}
                        onClick={() => sortTable(label)}
                        key={`td-${label}`}
                    >
                        {label}
                    </th>
                })}
                <th className="playlist__table-rating"
                    onClick={() => sortTable('rating')}
                >rating</th>
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
                    const { index } = sortedSongs[i]
                    list.push(
                        <tr key={`row-${i}`}>
                            <td>{index}</td>
                            {columns.map(prop => {
                                if (ignore.includes(prop))
                                    return null
                                return <td key={`${i}-prop-${prop}`}>{sortedSongs[i][prop]}</td>
                            })}
                            <td><SongRating id={index} /></td>
                        </tr>
                    )
                    listJSON.push({ index: i, ...songs[i] })
                }
            }
            setJsonList(listJSON)
            return list
        }
    }, [page, perPage, songs, columns, sortedSongs])


    console.log(page + 1, totalPages)

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
                <CSVLink className="playlist__download" data={jsonList} filename={'song_list.csv'}>Download Table</CSVLink>
                <button onClick={() => updatePage(page - 1)} disabled={page <= 0}>Previous Page</button>
                <p>Page: {page + 1}</p>
                <button onClick={() => updatePage(page + 1)} disabled={(page + 1) >= totalPages}>Next Page</button>
                <label>
                    Results per page
                    <select value={perPage} onChange={updatePageCount}>
                        {pagCountOptions.map(count => <option key={`count-${count}`} value={count}>{count}</option>)}
                    </select>
                </label>
            </div>
        </div >
    )
}
