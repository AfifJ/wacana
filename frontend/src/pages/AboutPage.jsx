import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Afif Jamhari",
      role: "124220018",
      image: "https://picsum.photos/id/18/200/300",
    },
    {
      name: "Habib Maulana Akbar",
      role: "124220022",
      image: "https://picsum.photos/id/50/200/300",
    },
    {
      name: "Ammar Bayu Saputra",
      role: "124220101",
      image: "https://picsum.photos/id/65/200/300",
    },
    {
      name: "Zola Dimas Firmansyah",
      role: "124220106",
      image: "https://picsum.photos/id/100/200/300",
    },
  ];

  return (
    <>
    <Navbar />
    <div className="bg-gray-800 py-12">
      <div className="max-w-6xl mx-auto text-center mt-10">
        <h2 className="text-3xl font-bold text-white">Meet The Team</h2>
        <p className="text-gray-600 mt-2">The people behind our success</p>

        {/* Team Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full border-4 border-gray-300"
              />
              <h3 className="text-lg font-semibold mt-4">{member.name}</h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
              <div className="flex space-x-3 mt-4 text-gray-600">
                <a href="#" className="hover:text-blue-500">
                  🔵
                </a>
                <a href="#" className="hover:text-blue-500">
                  🟢
                </a>
                <a href="#" className="hover:text-blue-500">
                  🔴
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AboutUs;
