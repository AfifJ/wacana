import Navbar from "../components/Navbar";
import { useEffect } from "react";
import useArticles from "../hooks/useArticles";
import Loader from "../components/Loader";

const MyPost = () => {
  const { articles, loading, error, getArticlesByUser } = useArticles();
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.id) {
      getArticlesByUser(user.id);
    }
  }, []);

  const favoriteArticles = articles;
  return (
    <>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">My Post</h2>
        {loading ? (
          <p>
            <Loader />
            Loading posts...
          </p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : favoriteArticles.length ? (
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No favorite articles yet.</p>
        )}
      </section>
    </>
  );
};

export default MyPost;
