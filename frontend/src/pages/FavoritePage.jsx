import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import useArticles from "../hooks/useArticles";
import { removeFromFavorite } from "../utils/removeFromFavorite"; // added import
import Loader from "../components/Loader";

const FavoritePage = () => {
  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const { loading, error, fetchFavoriteArticles } = useArticles();

  useEffect(() => {
    if (user && user.id) {
      fetchFavoriteArticles(user.id).then((data) => {
        setFavoriteArticles(data);
      });
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Favorite Articles</h2>
          {loading ? (
            <p>
              <Loader />
              Loading favorite articles...
            </p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : favoriteArticles && favoriteArticles.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favoriteArticles.map((article, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  {article.thumbnail && (
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="text-lg font-semibold">{article.title}</h4>
                    <p className="text-gray-600 text-sm mt-2">
                      {article.content}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Author ID: {article.author_id} • Category ID:{" "}
                      {article.category_id}
                    </p>
                    <button
                      onClick={async () => {
                        if (
                          !window.confirm(
                            "Are you sure you want to remove this article from favorites?"
                          )
                        )
                          return;
                        try {
                          await removeFromFavorite({
                            article_id: article._id,
                            user_id: user.id,
                          });
                          setFavoriteArticles((prev) =>
                            prev.filter((item) => item._id !== article._id)
                          );
                        } catch (error) {
                          console.error("Failed to remove favorite", error);
                        }
                      }}
                      className="mt-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 focus:outline-none"
                    >
                      Remove Favorite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No favorite articles yet.</p>
          )}
        </section>
      </div>
    </>
  );
};

export default FavoritePage;
