import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Input Component - Reusable text input field
 * @param {string} label - Input label
 * @param {string} placeholder - Placeholder text
 * @param {string} type - Input type (text, email, password, number, etc.)
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} error - Error message
 * @param {boolean} required - Mark as required
 * @param {string} icon - Icon class (Font Awesome)
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Disable input
 */
const Input = ({
  label,
  placeholder = '',
  type = 'text',
  value = '',
  onChange,
  error = '',
  required = false,
  icon = null,
  className = '',
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className={`fas ${icon}`}></i>
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-2 ${icon ? 'pl-10' : ''} border-2 rounded-lg transition-all duration-300 focus:outline-none ${
            isFocused ? 'border-blue-900 shadow-md' : 'border-gray-200'
          } ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  icon: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Input;
