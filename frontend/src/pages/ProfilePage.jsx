import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import ProfileModal from "../components/ProfileModal";

const ProfilePage = () => {
  // Destructure updateProfile along with user from useAuth
  const { user, updateProfile } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.username,
        email: user.email,
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const openModal = (type) => {
    setIsOpen(true);
    setModalType(type);
    setFormData((prev) => ({
      ...prev,
      name: user.username,
      email: user.email,
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData((prev) => ({
      ...prev,
      newPassword: "",
      confirmPassword: "",
    }));
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setErrors({});
    const newErrors = {};

    if (modalType === "username" && !formData.name.trim()) {
      newErrors.name = "Username wajib diisi!";
    }

    if (modalType === "email" && !formData.email.trim()) {
      newErrors.email = "Email wajib diisi!";
    }

    if (modalType === "password") {
      if (!formData.newPassword) {
        newErrors.newPassword = "Password wajib diisi!";
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
          formData.newPassword
        )
      ) {
        newErrors.newPassword =
          "Password harus minimal 8 karakter dan mengandung uppercase, lowercase, dan angka.";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password wajib diisi!";
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword =
          "Password dan konfirmasi password tidak cocok!";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updateData = {
      username: formData.name,
      email: formData.email,
    };

    if (modalType === "password") {
      updateData.newPassword = formData.newPassword;
    }

    try {
      // Call useAuth's updateProfile function instead of using axios directly
      await updateProfile(user.id, updateData);
      console.log("Profil berhasil diperbarui");
      closeModal();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil");
    }
  };

  const getInitials = (name) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    return initials.toUpperCase();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl w-full">
        <div className="flex items-center space-x-4 mb-6">
          {user?.photo_profile ? (
            <img
              className="h-24 w-24 rounded-full object-cover"
              src={user.photo_profile}
              alt="User profile"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-500 flex items-center justify-center">
              <span className="text-white text-2xl">
                {getInitials(user?.username)}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {user?.username}
            </h3>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">User name</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
                {user?.username}
                <button
                  onClick={() => openModal("username")}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
                {user?.email}
                <button
                  onClick={() => openModal("email")}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">Password</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
                <button
                  onClick={() => openModal("password")}
                  className="text-blue-600 text-sm"
                >
                  Forgot Password?
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <ProfileModal
        isOpen={isOpen}
        modalType={modalType}
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleSave={handleSave}
        closeModal={closeModal}
      />
    </div>
  );
};

export default ProfilePage;
