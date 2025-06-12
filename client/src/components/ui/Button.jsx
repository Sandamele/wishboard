export default function Button({
  bgClass = 'bg-indigo-500',
  textClass = 'text-white',
  onClick,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${bgClass} ${textClass} ${className} w-full p-2 rounded-lg shadow cursor-pointer transition-colors`}
      {...props}
    >
      {children}
    </button>
  );
}
