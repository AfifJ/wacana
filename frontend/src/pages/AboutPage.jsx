import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <h1 className="text-3xl font-bold">About Page</h1>
      </div>
      <Footer />
    </div>
  );
}
