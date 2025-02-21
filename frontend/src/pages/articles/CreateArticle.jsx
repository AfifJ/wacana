import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useArticles from '../../hooks/useArticles';
import { useAuth } from '../../hooks/useAuth';

const CreateArticle = () => {
  const { postArticle } = useArticles();
  const { user } = useAuth(); // Pastikan hook useAuth mengembalikan user yang sudah tersimpan
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log(user)

    const articleData = {
      title,
      content,
      thumbnail,
      category_id: categoryId,
      author_id: user ? user.id : '', // Pastikan user sudah login dan memiliki _id
      is_live: isLive,
    };

    try {
      await postArticle(articleData);
      alert('Article posted successfully!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-48"
            placeholder="Write your article content here..."
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Thumbnail URL</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Category ID</label>
          <input
            type="text"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label className="font-semibold mr-2">Is Live:</label>
          <input
            type="checkbox"
            checked={isLive}
            onChange={(e) => setIsLive(e.target.checked)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Posting...' : 'Post Article'}
        </button>
      </form>
    </div>
  );
};

export default CreateArticle;
