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
    setArticles(null)
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/articles/by/${userId}`);
      setArticles(res.data);
      // console.log(res.data);
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
  };
}
