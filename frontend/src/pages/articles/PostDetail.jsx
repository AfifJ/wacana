import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useArticles from '../../hooks/useArticles';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PostDetail = () => {
  const { id } = useParams();
  const { fetchArticleById } = useArticles();
  const { getUserById } = useAuth();
  const [post, setPost] = useState(null);
  const [authorName, setAuthorName] = useState("Unknown");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil detail artikel berdasarkan id
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await fetchArticleById(id);
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, fetchArticleById]);

  // Setelah artikel berhasil diambil, fetch profil penulis berdasarkan author_id
  useEffect(() => {
    const fetchAuthorName = async () => {
      if (post && post.author_id) {
        try {
          const profile = await getUserById(post.author_id);
          setAuthorName(profile.username || "Unknown");
        } catch (err) {
          setAuthorName("Unknown");
        }
      }
    };

    fetchAuthorName();
  }, [post, getUserById]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {post ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-10">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
            <div className="p-6">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center text-sm text-blue-600 mb-4">
                <span>By {authorName}</span>
                <span className="mx-2">•</span>
                <span>{post.date}</span>
              </div>
              <p className="text-gray-800">{post.content}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Post not found</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PostDetail;
