import { ResponsiveContainer, ScatterChart, BarChart } from 'recharts'

export default function SongChart({ type }) {


    console.log(type)

    let chart
    switch (type) {
        case 'histogram':
            chart = (
                <h1>Histogram</h1>
            )
            break
        case 'Bar':
            chart = (
                <h1>Histogram</h1>
            )
            break
        case 'Bar':
            chart = (
                <h1>Histogram</h1>
            )
            break
        default:
            return null
    }

    return (
        <ResponsiveContainer>
            {chart}
        </ResponsiveContainer>
    )
}
