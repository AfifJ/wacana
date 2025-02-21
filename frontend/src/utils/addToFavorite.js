import axios from "axios";

// File: /Users/afifjamhari/Project Coding/01. Coding Kuliah/ruang-karya/frontend/src/utils/addToFavorite.js

export async function addToFavorite({ article_id, user_id }) {
  const url = `http://127.0.0.1:5000/articles/${article_id}/favorite`;

  try {
    const response = await axios.post(
      url,
      {
        user_id: user_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding to favorite:", error);
    throw error;
  }
}
