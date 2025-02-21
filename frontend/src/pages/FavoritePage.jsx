import Navbar from "../components/Navbar";

const FavoritePage = () => {
  // Dummy favorite articles array; replace with real data as needed
  const favoriteArticles = [
    {
      title: "Your First Favorite Article",
      content: "This is a placeholder for your favorite article content.",
      author_id: 1,
      category_id: 1,
    },
    // ...existing code for additional articles...
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Favorite Articles</h2>
          {favoriteArticles.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favoriteArticles.map((article, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
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
      </div>
    </>
  );
};

export default FavoritePage;
