import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <h1 className="text-3xl font-bold">Welcome to Home</h1>
      </div>
    </div>
  );
}
