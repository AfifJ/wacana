import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useArticles from '../hooks/useArticles'; // new import

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const { loading, error, getArticleById } = useArticles(); // use hook's states and fetcher

    useEffect(() => {
        getArticleById(id)
          .then(data => setPost(data))
          .catch(() => {}); // error already handled in the hook
    }, [id, getArticleById]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-12">
            {post ? (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-10">
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-96 object-cover"
                    />
                    <div className="p-6">
                        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                        <div className="flex items-center text-sm text-blue-600 mb-4">
                            <span>By {post.author_id}</span>
                            <span className="mx-2"></span>
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