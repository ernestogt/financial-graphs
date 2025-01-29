import NewsItem from './NewsItem'

interface NewsListProps {
    news: any[]
}

export default function NewsList({ news }: NewsListProps) {
    return (
        <div className="space-y-6">
            {news.map((item, index) => (
                <NewsItem key={index} item={item} />
            ))}
        </div>
    )
}

