import { useState } from "react";

export default function useArticles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchArticles = () => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/articles")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchArticleById = (id) => {
    setLoading(true);
    return fetch(`http://127.0.0.1:5000/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .finally(() => setLoading(false));
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

  return { articles, error, loading, fetchArticles, fetchArticleById, postArticle };
}
