import React from "react";

const MainContent = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] rounded-xl overflow-hidden">
        <img
          src="https://source.unsplash.com/featured/?workspace"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center p-6 text-white">
          <h2 className="text-3xl font-bold">
            Breaking Into Product Design: Advice from Untitled Founder, Frankie
          </h2>
          <p className="mt-2 text-lg">
            Let’s get one thing out of the way: You don’t need a fancy degree to
            get into Product Design.
          </p>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="mt-12">
        <h3 className="text-2xl font-bold">Recent blog posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={`https://source.unsplash.com/400x300/?technology,${index}`}
                alt={`Blog ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold">Blog Post {index + 1}</h4>
                <p className="text-gray-600 text-sm mt-2">
                  A short description of the blog post goes here.
                </p>
                <p className="text-gray-500 text-xs mt-2">Author Name • Date</p>
              </div>
            </div>
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
