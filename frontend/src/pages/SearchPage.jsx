import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import useArticles from "../hooks/useArticles";
import { addToFavorite } from "../utils/addToFavorite";
import { removeFromFavorite } from "../utils/removeFromFavorite";
import Loader from "../components/Loader";

const SearchPage = () => {
  const { error, loading, fetchArticlesWithFavoriteStatus } = useArticles();
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState("");
  const [loadingFavorites, setLoadingFavorites] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchArticlesWithFavoriteStatus(user.id).then((updatedArticles) => {
        setArticles(updatedArticles);
        setInitialLoading(false);
      });
    }
  }, [user, fetchArticlesWithFavoriteStatus]);

  const filteredArticles = articles.filter((article) => {
    const lowerQuery = query.toLowerCase();
    return (
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery)
    );
  });

  const handleFavoriteToggle = async (article) => {
    const isCurrentlyFavorite = article.isFavorite;
    setLoadingFavorites((prev) => ({
      ...prev,
      [article._id]: true,
    }));

    try {
      if (isCurrentlyFavorite) {
        await removeFromFavorite({
          article_id: article._id,
          user_id: user.id,
        });
      } else {
        await addToFavorite({
          article_id: article._id,
          user_id: user.id,
        });
      }
      const updatedArticles = await fetchArticlesWithFavoriteStatus(user.id);
      setArticles(updatedArticles);
    } catch (error) {
      console.error("Failed to update favorite", error);
    } finally {
      setLoadingFavorites((prev) => ({
        ...prev,
        [article._id]: false,
      }));
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Search Input */}
        <section className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or content..."
            className="w-full p-3 border rounded-lg"
          />
        </section>
        {/* Search Results */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Search Results</h3>
          {user && initialLoading && (
            <div>
              <Loader />
              Loading...
            </div>
          )}
          {!user && <div>Silahkan login dulu</div>}
          {error && <p>Error: {error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <div
                key={index}
                className={`relative rounded-lg shadow overflow-hidden ${
                  article.isFavorite ? "bg-white" : "bg-gray-100"
                }`}
              >
                <img
                  src={article.thumbnail}
                  alt={`Blog ${article.title}`}
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={() => handleFavoriteToggle(article)}
                  className="absolute top-2 right-2 px-3 py-1 rounded border bg-gray-600 text-white border-gray-400 hover:opacity-90 focus:outline-none"
                  disabled={loadingFavorites[article._id]}
                >
                  {loadingFavorites[article._id]
                    ? article.isFavorite
                      ? "Removing..."
                      : "Adding..."
                    : article.isFavorite
                    ? "Favorited"
                    : "Add to Favorites"}
                </button>
                <div className="p-4">
                  <Link to={`/post/${article._id}`}>
                    <h4 className="text-lg font-semibold">{article.title}</h4>
                    <p className="text-gray-600 text-sm mt-2">
                      {article.content}
                    </p>
                  </Link>
                  <p className="text-gray-500 text-xs mt-2">
                    Author: {article.author_id} • Category:{" "}
                    {article.category_id}
                  </p>
                </div>
              </div>
            ))}
            {filteredArticles.length === 0 && !initialLoading && (
              <p>No articles found for this query</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default SearchPage;
