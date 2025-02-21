import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useArticles from "../hooks/useArticles";
import Loader from "../components/Loader";

const MyPost = () => {
  const navigate = useNavigate();
  const { articles, loading, error, getArticlesByUser } = useArticles();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.id) {
      getArticlesByUser(user.id);
    }
  }, [getArticlesByUser]);

  return (
    <>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">My Post</h2>
          <Link
            to="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
          >
            Create New Post
          </Link>
        </div>

        {loading ? (
          <p>
            <Loader />
            Loading posts...
          </p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : articles.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow overflow-hidden cursor-pointer"
                onClick={() => navigate(`/edit/${article._id}`)}
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
                  <p className="text-gray-600 text-sm mt-2">{article.content}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Author ID: {article.author_id} • Category ID:{" "}
                    {article.category_id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No Post yet.</p>
        )}
      </section>
    </>
  );
};

export default MyPost;
