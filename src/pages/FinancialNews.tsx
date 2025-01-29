import { useState, useEffect } from 'react'
import NewsList from '@/components/NewsList'
import { fetchNews } from '@/api'
export default function FinancialNews() {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchNews()
            .then(data => {
                setNews(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Financial News</h1>
            <NewsList news={news} />
        </div>
    )
}

