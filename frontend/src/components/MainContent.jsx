import { Link } from "react-router-dom";
import useArticles from "../hooks/useArticles";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";

// Fungsi helper untuk memotong teks hingga sejumlah kata tertentu
const truncateText = (text, wordLimit) => {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

const MainContent = () => {
  const { articles, error, loading, fetchArticles } = useArticles();
  const { getUserById } = useAuth();
  const [visibleCount, setVisibleCount] = useState(6);
  const [profiles, setProfiles] = useState({});

  useEffect(() => {
    fetchArticles();
  }, []);

  // Urutkan artikel dari yang terbaru berdasarkan updated_at saja
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
  }, [articles]);

  // Menghitung daftar unik author IDs menggunakan useMemo
  const uniqueAuthorIds = useMemo(
    () => [...new Set(sortedArticles.map((article) => article.author_id))],
    [sortedArticles]
  );

  // Ambil profil (username) untuk setiap author ID unik
  useEffect(() => {
    const fetchProfiles = async () => {
      const mapping = {};
      for (const id of uniqueAuthorIds) {
        try {
          const profile = await getUserById(id);
          mapping[id] = profile.username; // asumsikan endpoint mengembalikan field "username"
        } catch (err) {
          mapping[id] = "Unknown";
        }
      }
      setProfiles(mapping);
    };

    if (uniqueAuthorIds.length > 0) {
      fetchProfiles();
    }
  }, [uniqueAuthorIds, getUserById]);

  // Ambil artikel terbaru (misalnya, artikel pertama dari sortedArticles)
  const latestPost = sortedArticles.length > 0 ? sortedArticles[0] : null;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] rounded-xl overflow-hidden mt-9">
        <img
          src="https://unsplash.it/500/500"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-6 text-white">
          {latestPost ? (
            <>
              <Link to={`/post/${latestPost._id}`} className="hover:underline">
                <h2 className="text-3xl font-bold">{latestPost.title}</h2>
              </Link>
              <p className="mt-2 text-lg">
                {truncateText(latestPost.content, 20)}
              </p>
            </>
          ) : (
            <h2 className="text-3xl font-bold">No Articles Available</h2>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-2xl font-bold">Articles</h3>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {sortedArticles.slice(0, visibleCount).map((article, index) => {
            const randomIndex = Math.floor(Math.random() * 1000);
            return (
              <Link
                to={`/post/${article._id}`}
                key={article._id || index}
                className="block"
              >
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <img
                    src={`https://picsum.photos/id/${randomIndex}/200/300`}
                    alt={`Blog ${randomIndex}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-2">
                      {truncateText(article.content, 20)}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Author: {profiles[article.author_id] || "Unknown"} • Category ID:{" "}
                      {article.category_id}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      {visibleCount < sortedArticles.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Load more...
          </button>
        </div>
      )}
    </div>
  );
};

export default MainContent;