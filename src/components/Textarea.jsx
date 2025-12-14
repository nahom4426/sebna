import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Textarea Component - Reusable textarea field
 * @param {string} label - Textarea label
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Textarea value
 * @param {function} onChange - Change handler
 * @param {string} error - Error message
 * @param {boolean} required - Mark as required
 * @param {number} rows - Number of rows
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Disable textarea
 * @param {number} maxLength - Maximum character length
 */
const Textarea = ({
  label,
  placeholder = '',
  value = '',
  onChange,
  error = '',
  required = false,
  rows = 4,
  className = '',
  disabled = false,
  maxLength = null,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value.length);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-2 border-2 rounded-lg transition-all duration-300 focus:outline-none resize-none ${
            isFocused ? 'border-blue-900 shadow-md' : 'border-gray-200'
          } ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          {...props}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {maxLength && (
          <p className={`text-xs ${charCount > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
            {charCount} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

Textarea.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
};

export default Textarea;
