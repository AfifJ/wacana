export default function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-blue-300"
      />
    </div>
  );
}
