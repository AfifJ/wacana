import { Link } from "react-router-dom";
import useArticles from "../hooks/useArticles";
import { useState, useEffect } from "react";
import { addToFavorite } from "../utils/addToFavorite";
import { removeFromFavorite } from "../utils/removeFromFavorite";

const MainContent = () => {
  const { error, loading, fetchArticlesWithFavoriteStatus } = useArticles();
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchArticlesWithFavoriteStatus(user.id).then((updatedArticles) => {
      setArticles(updatedArticles);
    });
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <section className="relative w-full h-[400px] rounded-xl overflow-hidden">
        <img
          src="https://unsplash.it/500/500"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center p-6 text-white">
          <h2 className="text-3xl font-bold">
            Breaking Into Product Design: Advice from Untitled Founder, Frankie
          </h2>
          <p className="mt-2 text-lg">
            Let{"'"}s get one thing out of the way: You don{`'`}t need a fancy
            degree to get into Product Design.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-2xl font-bold">Articles</h3>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {articles.slice(0, visibleCount).map((article, index) => {
            return (
              <div
                key={index}
                className="relative bg-white rounded-lg shadow overflow-hidden"
              >
                <img
                  src={article.thumbnail}
                  alt={`Blog ${article.title}`}
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={async () => {
                    try {
                      if (article.isFavorite) {
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
                      setArticles((prevArticles) =>
                        prevArticles.map((item) =>
                          item._id === article._id
                            ? { ...item, isFavorite: !item.isFavorite }
                            : item
                        )
                      );
                    } catch (error) {
                      console.error(
                        article.isFavorite
                          ? "Failed to remove favorite"
                          : "Failed to add favorite",
                        error
                      );
                    }
                  }}
                  className={`absolute top-2 right-2 px-3 py-1 rounded border ${
                    article.isFavorite
                      ? "bg-gray-600 text-white border-gray-400"
                      : "bg-white text-gray-800 border-gray-400"
                  } hover:opacity-90 focus:outline-none`}
                >
                  {article.isFavorite ? "Favorited" : "Add to Favorites"}
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
            );
          })}
        </div>
      </section>
      {visibleCount < articles.length && (
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
