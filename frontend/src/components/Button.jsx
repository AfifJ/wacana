export default function Button({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 focus:outline-none"
    >
      {children}
    </button>
  );
}
