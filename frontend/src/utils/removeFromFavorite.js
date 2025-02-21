import axios from "axios";

export async function removeFromFavorite({ article_id, user_id }) {
  const BASE_URL = "http://127.0.0.1:5000";
  const url = `${BASE_URL}/articles/${article_id}/favorite`;

  try {
    const response = await axios.delete(url, {
      data: { user_id },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error removing from favorite:", error);
    throw error;
  }
}
