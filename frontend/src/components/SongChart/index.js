import { useSelector } from 'react-redux'
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, BarChart, Bar } from 'recharts'

export default function SongChart({ type }) {

    const songs = useSelector(state => state.songs)
    const data = Object.values(songs).map(song => { //Songs from redux converted to array, convert ms to s

        return {
            ...song,
            duration_s: song.duration_ms / 1000
        }
    })

    let title
    let chart
    switch (type) {
        case 'histogram':
            title = 'Duration'
            chart = (
                <BarChart data={data}>
                    <CartesianGrid />
                    <Tooltip />
                    <XAxis dataKey="title" />
                    <YAxis unit='s' />
                    <Bar dataKey="duration_s" fill="#6da30a" />
                </BarChart >

            )
            break
        case 'bar':
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
