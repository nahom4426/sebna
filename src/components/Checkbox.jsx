import React from 'react';
import PropTypes from 'prop-types';

/**
 * Checkbox Component - Reusable checkbox input
 * @param {string} label - Checkbox label
 * @param {boolean} checked - Checked state
 * @param {function} onChange - Change handler
 * @param {string} error - Error message
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Disable checkbox
 */
const Checkbox = ({
  label,
  checked = false,
  onChange,
  error = '',
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-4 h-4 rounded border-2 border-gray-300 text-blue-900 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          {...props}
        />
      </div>
      <div className="flex-1">
        {label && (
          <label className={`text-sm font-medium text-gray-700 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {label}
          </label>
        )}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Checkbox;
