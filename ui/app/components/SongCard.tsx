interface SongProps {
  title: string;
  content: string;
  authorSong: string;
  rating: string;
  tags: string[];
}

export default function SongCard({ song }: { song: SongProps }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{song.title}</h3>
          <p className="text-blue-600 font-medium">{song.authorSong}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
          ★ {song.rating}
        </div>
      </div>

      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
        {song.content}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {song.tags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}