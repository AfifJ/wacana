const MainContent = () => {
  // Declaration of article data
  const articleData = [
    {
      title: "Understanding JavaScript Closures",
      content:
        "Closures are a fundamental concept in JavaScript that every developer should understand.",
      author_id: 1,
      category_id: 1,
      is_live: true,
    },
    {
      title: "A Guide to React Hooks",
      content:
        "React Hooks provide a powerful way to use state and other React features in functional components.",
      author_id: 2,
      category_id: 2,
      is_live: true,
    },
    {
      title: "CSS Grid Layout: A Comprehensive Guide",
      content:
        "CSS Grid Layout is a two-dimensional layout system for the web.",
      author_id: 3,
      category_id: 3,
      is_live: true,
    },
    {
      title: "Mastering TypeScript",
      content:
        "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
      author_id: 4,
      category_id: 4,
      is_live: true,
    },
    {
      title: "Building RESTful APIs with Node.js",
      content: "Learn how to build RESTful APIs using Node.js and Express.",
      author_id: 5,
      category_id: 5,
      is_live: true,
    },
    {
      title: "Introduction to GraphQL",
      content:
        "GraphQL is a query language for your API, and a server-side runtime for executing queries.",
      author_id: 6,
      category_id: 6,
      is_live: true,
    },
    {
      title: "Getting Started with Docker",
      content:
        "Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.",
      author_id: 7,
      category_id: 7,
      is_live: true,
    },
    {
      title: "Understanding Asynchronous JavaScript",
      content:
        "Asynchronous JavaScript is a powerful concept that allows for non-blocking code execution.",
      author_id: 8,
      category_id: 8,
      is_live: true,
    },
    {
      title: "Building Mobile Apps with React Native",
      content:
        "React Native is a popular framework for building mobile applications using JavaScript and React.",
      author_id: 9,
      category_id: 9,
      is_live: true,
    },
    {
      title: "Introduction to Machine Learning",
      content:
        "Machine learning is a branch of artificial intelligence that focuses on building systems that learn from data.",
      author_id: 10,
      category_id: 10,
      is_live: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] rounded-xl overflow-hidden">
        <img
          src="https://unsplash.it/500/500"
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

      <section className="mt-12">
        <h3 className="text-2xl font-bold">Recent blog posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {articleData.slice(0, 6).map((article) => {
            const randomIndex = Math.floor(Math.random() * 1000);
            return (
              <div
                key={randomIndex}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <img
                  src={`https://picsum.photos/id/${randomIndex}/200/300`}
                  alt={`Blog ${randomIndex}`}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold">{article.title}</h4>
                  <p className="text-gray-600 text-sm mt-2">{article.content}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Author ID: {article.author_id} • Category ID:{" "}
                    {article.category_id}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <div className="flex justify-center mt-8">
        <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
          Load more...
        </button>
      </div>
    </div>
  );
};

export default MainContent;
