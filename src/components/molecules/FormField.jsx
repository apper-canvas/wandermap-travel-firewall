import Input from '../atoms/Input';
      import Select from '../atoms/Select';
      import Label from '../atoms/Label';
      
      export default function FormField({ 
        label, 
        type = 'text', 
        placeholder, 
        value, 
        onChange, 
        options, 
        className = '', 
        required = false, 
        rows, 
        ...props 
      }) {
        const inputClasses = `w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent ${
          type === 'date' ? 'text-gray-700' : 'text-gray-800'
        }`;
      
        return (
          &lt;div className={className}&gt;
            {label && &lt;Label className="mb-2"&gt;{label}&lt;/Label&gt;}
            {type === 'select' ? (
              &lt;Select 
                value={value} 
                onChange={onChange} 
                className={inputClasses} 
                required={required} 
                {...props}
              &gt;
                {options.map(option =&gt; (
                  &lt;option key={option.value} value={option.value} disabled={option.disabled}&gt;
                    {option.label}
                  &lt;/option&gt;
                ))}
              &lt;/Select&gt;
            ) : type === 'textarea' ? (
              &lt;textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={inputClasses}
                rows={rows}
                required={required}
                {...props}
              /&gt;
            ) : (
              &lt;Input 
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={inputClasses}
                required={required}
                {...props}
              /&gt;
            )}
          &lt;/div&gt;
        );
      }