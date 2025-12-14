import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Select Component - Reusable dropdown select field
 * @param {string} label - Select label
 * @param {array} options - Array of options [{value, label}]
 * @param {string} value - Selected value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message
 * @param {boolean} required - Mark as required
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Disable select
 * @param {boolean} multiple - Allow multiple selections
 */
const Select = ({
  label,
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option',
  error = '',
  required = false,
  className = '',
  disabled = false,
  multiple = false,
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
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          multiple={multiple}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-2 border-2 rounded-lg transition-all duration-300 focus:outline-none appearance-none ${
            isFocused ? 'border-blue-900 shadow-md' : 'border-gray-200'
          } ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          {...props}
        >
          {!multiple && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
          <i className="fas fa-chevron-down"></i>
        </span>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
};

export default Select;
