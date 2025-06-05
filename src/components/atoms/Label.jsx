export default function Label({ children, htmlFor, className = '' }) {
        return (
          &lt;label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}&gt;
            {children}
          &lt;/label&gt;
        );
      }