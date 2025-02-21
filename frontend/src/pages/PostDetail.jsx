import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Data dummy untuk sementara
const dummyPosts = [
    {
        id: 1,
        title: "Breaking News: New Technology Emerges",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "https://via.placeholder.com/150",
        author: "John Doe",
        date: "2023-10-01"
    },
    {
        id: 2,
        title: "Health Tips: How to Stay Fit",
        content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        image: "https://plus.unsplash.com/premium_photo-1667762241847-37471e8c8bc0?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        author: "Jane Smith",
        date: "2023-10-02"
    },
    {
        id: 3,
        title: "Travel Guide: Top Destinations for 2023",
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        image: "https://via.placeholder.com/150",
        author: "Alice Johnson",
        date: "2023-10-03"
    },
    {
        id: 4,
        title: "Finance: How to Save Money",
        content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: "https://via.placeholder.com/150",
        author: "Bob Brown",
        date: "2023-10-04"
    }
];

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Simulasi fetch data dari API
                // const response = await axios.get(`https://api.example.com/posts/${id}`);
                // setPost(response.data);

                // Untuk sementara, gunakan data dummy
                const foundPost = dummyPosts.find(p => p.id === parseInt(id));
                if (foundPost) {
                    setPost(foundPost);
                } else {
                    throw new Error("Post not found");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-12">
            {post ? (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-10">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-96 object-cover"
                    />
                    <div className="p-6">
                        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                        <div className="flex items-center text-sm text-blue-600 mb-4">
                            <span>By {post.author}</span>
                            <span className="mx-2">•</span>
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