import { useState } from "react";
import axios from "axios";

export default function useArticles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/articles");
      setArticles(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const postArticle = (article) => {
    setLoading(true);
    return fetch("http://127.0.0.1:5000/articles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        // Jika ingin langsung menambahkan artikel ke state:
        // setArticles(prev => [...prev, data]);
        return data;
      })
      .catch((err) => {
        setError(err.message);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getArticleById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/articles/${id}`);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const getArticlesByUser = async (userId) => {
    setArticles(null);
    setLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/articles/by/${userId}`
      );
      setArticles(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const fetchFavoriteArticles = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/articles/favorite",
        { user_id: userId },
        { headers: { "Content-Type": "application/json" } }
      );
      setArticles(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Fungsi baru: mengambil semua artikel dan menentukan status favorit
  const fetchArticlesWithFavoriteStatus = async (userId) => {
    setLoading(true);
    try {
      // Mengambil semua artikel dan artikel favorit secara paralel
      const [allArticlesRes, favoriteArticlesRes] = await Promise.all([
        axios.get("http://127.0.0.1:5000/articles"),
        axios.post(
          "http://127.0.0.1:5000/articles/favorite",
          { user_id: userId },
          { headers: { "Content-Type": "application/json" } }
        )
      ]);

      // Ambil daftar id dari artikel favorit
      const favoriteIds = favoriteArticlesRes.data.map(article => article._id);

      // Tandai setiap artikel apakah merupakan favorit
      const combinedArticles = allArticlesRes.data.map(article => ({
        ...article,
        isFavorite: favoriteIds.includes(article._id)
      }));

      setArticles(combinedArticles);
      setLoading(false);
      return combinedArticles;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const updateArticle = async (id, updatedData) => {
    setLoading(true);
    try {
      const res = await axios.put(`http://127.0.0.1:5000/articles/${id}`, updatedData, {
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Delete article
  const deleteArticle = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`http://127.0.0.1:5000/articles/${id}`);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    articles,
    error,
    loading,
    fetchArticles,
    getArticleById,
    getArticlesByUser,
    fetchFavoriteArticles,
    fetchArticlesWithFavoriteStatus,
    postArticle,
    updateArticle,
    deleteArticle
  };
}
