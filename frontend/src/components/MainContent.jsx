import React from "react";
import { Link } from "react-router-dom"; // Import Link dari react-router-dom
import dummyPosts from "../assets/posts"; // Sesuaikan path

const MainContent = () => {
  // Urutkan dummyPosts berdasarkan tanggal terbaru (descending)
  const sortedPosts = [...dummyPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Ambil post terbaru untuk hero section
  const latestPost = sortedPosts[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] rounded-xl overflow-hidden mt-9">
        <img
          src={latestPost.image}
          alt={latestPost.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-6 text-white">
          <Link to={`/post/${latestPost.id}`} className="hover:underline">
            <h2 className="text-3xl font-bold">{latestPost.title}</h2>
          </Link>
          <p className="mt-2 text-lg">{latestPost.content}</p>
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-2xl font-bold">Artikel terbaru</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {sortedPosts.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`} className="block hover:shadow-lg transition-shadow">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold">{post.title}</h4>
                  <p className="text-gray-600 text-sm mt-2">{post.content}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {post.author} • {post.date}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
          Load more...
        </button>
      </div>
    </div>
  );
};

export default MainContent;