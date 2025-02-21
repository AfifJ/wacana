import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useArticles from "../../hooks/useArticles";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/Navbar";
import { PhotographIcon } from "@heroicons/react/outline";

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getArticleById, updateArticle, deleteArticle } = useArticles();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil data artikel saat komponen dimount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getArticleById(id);
        // Isi form dengan data artikel
        setTitle(data.title || "");
        setContent(data.content || "");
        setThumbnail(data.thumbnail || "");
        setCategoryId(data.category_id || "");
        setIsLive(data.is_live !== false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    console.log(categoryId)
    fetchData();
  }, [id, getArticleById]);

  // Menangani perubahan file thumbnail dan membuat preview
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
    }
  };

  // Update artikel
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const updatedData = {
      title,
      content,
      thumbnail,
      category_id: categoryId,
      // Gunakan author_id dari data artikel yang diambil atau user, pastikan field ini tidak kosong
      author_id: user ? user.id : "",
      is_live: isLive,
    };

    try {
      await updateArticle(id, updatedData);
      alert("Article updated successfully!");
      navigate("/mypost");
    } catch (err) {
      console.error(err);
      setError(err.message);
      alert("Failed to update article");
    } finally {
      setLoading(false);
    }
  };

  // Delete artikel
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    setLoading(true);
    try {
      await deleteArticle(id);
      alert("Article deleted successfully!");
      navigate("/posts");
    } catch (err) {
      console.error(err);
      setError(err.message);
      alert("Failed to delete article");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Article</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
          >
            Back
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <label className="block font-semibold mb-2">Thumbnail</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <PhotographIcon className="text-gray-400 text-4xl" />
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded h-48"
              placeholder="Write your article content here..."
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Category ID</label>
            <input
              type="text"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex items-center">
            <label className="font-semibold mr-2">Is Live:</label>
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
              className="h-5 w-5"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Updating..." : "Update Article"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Article
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditArticle;
