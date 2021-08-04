import { useSelector } from 'react-redux'
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, BarChart, Bar } from 'recharts'

export default function SongChart({ type }) {
    const { songs } = useSelector(state => state)
    const songArr = Object.values(songs)
    let data = []
    let title
    let chart
    switch (type) {
        case 'histogram':
            title = 'Duration'
            const durationSort = songArr.sort((a, b) => a.duration_ms - b.duration_ms)

            if (durationSort.length > 0) {
                const numGroups = 10
                const min = durationSort[0]?.duration_ms
                const max = durationSort[durationSort.length - 1]?.duration_ms
                const breaks = Array.from({ length: numGroups - 1 }, (v, i) => (i + 1) * ((max - min) / numGroups) + min)

                let i = 0
                let j = 0
                function toSec(ms) {
                    if (ms) return (ms / 1000).toFixed(2)
                }

                while (i < numGroups) {
                    const sec = toSec(breaks[i])
                    const groupData = {

                        label: sec ? `< ${sec}sec` : `> ${toSec(breaks[i - 1])}sec`, break: breaks[i], count: 0
                    }
                    while (durationSort[j] && !(durationSort[j].duration_ms > groupData.break)) {
                        groupData.count++
                        j++
                    }
                    data.push(groupData)
                    i++
                }
            }
            chart = (
                <BarChart data={data}>
                    <CartesianGrid />
                    <Tooltip />
                    <XAxis dataKey="label" />
                    <YAxis unit=' songs' />
                    <Bar dataKey="count" fill="#6da30a" />
                </BarChart >
            )
            break
        case 'bar':
            data = songArr.map(song => { //Songs from redux converted to array, convert ms to s
                return {
                    ...song,
                    duration_s: song.duration_ms / 1000
                }
            })
            title = 'Acoustics & Tempo'
            chart = (
                <BarChart data={data} barGap={0} barCategoryGap={1}>
                    <CartesianGrid />
                    <Tooltip />
                    <XAxis dataKey="title" name="title" interval='reserveStartEnd' />
                    <YAxis yAxisId="left" orientation="left" stroke="#a2a510" />
                    <YAxis yAxisId="right" orientation="right" stroke="#6355e2" />
                    <Legend />
                    <Bar yAxisId="left" dataKey="tempo" fill="#a2a510" />
                    <Bar yAxisId="right" dataKey="acousticness" fill="#6355e2" />

                </BarChart>
            )
            break
        case 'scatter':
            data = songArr.map(song => { //Songs from redux converted to array, convert ms to s
                return {
                    ...song,
                    duration_s: song.duration_ms / 1000
                }
            })
            title = "Danceability"
            chart = (
                <ScatterChart>
                    <CartesianGrid />
                    <Tooltip />
                    <XAxis dataKey="title" name="title" interval='reserveStartEnd' />
                    <YAxis dataKey="danceability" name="dancebility" />
                    <Scatter name="Dancebility" data={data} fill="#4c8bc5" />
                </ScatterChart>
            )
            break
        default:
            return null
    }

    return (

        <div className="song-chart">
            <h3 className="song-chart__title">{title}</h3>
            <ResponsiveContainer width="100%" height={350}>
                {chart}
            </ResponsiveContainer>
        </div>
    )
}

