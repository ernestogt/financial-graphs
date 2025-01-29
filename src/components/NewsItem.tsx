interface NewsItemProps {
    item: {
        title: string
        url: string
        time_published: string
        authors: string[]
        summary: string
    }
}

export default function NewsItem({ item }: NewsItemProps) {
    const date = new Date(item.time_published).toLocaleString()

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {item.title}
                </a>
            </h2>
            <p className="text-gray-600 mb-2">Published: {date}</p>
            <p className="text-gray-600 mb-2">Authors: {item.authors.join(', ')}</p>
            <p className="text-gray-800">{item.summary}</p>
        </div>
    )
}

