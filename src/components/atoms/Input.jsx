export default function Input({ type = 'text', placeholder, value, onChange, className = '', required = false, ...props }) {
        return (
          &lt;input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            required={required}
            {...props}
          /&gt;
        );
      }