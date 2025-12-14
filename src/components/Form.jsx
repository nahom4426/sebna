import React from 'react';
import PropTypes from 'prop-types';

/**
 * Form Component - Reusable form wrapper
 * @param {function} onSubmit - Form submit handler
 * @param {ReactNode} children - Form fields
 * @param {string} className - Additional CSS classes
 * @param {boolean} loading - Show loading state
 * @param {string} submitButtonText - Submit button text
 * @param {string} submitButtonVariant - Button variant
 */
const Form = ({
  onSubmit,
  children,
  className = '',
  loading = false,
  submitButtonText = 'Submit',
  submitButtonVariant = 'primary',
  showSubmitButton = true,
  ...props
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} {...props}>
      {children}
      {showSubmitButton && (
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-2 px-4 rounded-lg transition-all duration-300 ${
            submitButtonVariant === 'primary'
              ? 'bg-gradient-to-r from-blue-900 to-orange-600 text-white hover:shadow-lg disabled:opacity-50'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-900'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block animate-spin">⏳</span>
              Processing...
            </span>
          ) : (
            submitButtonText
          )}
        </button>
      )}
    </form>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  loading: PropTypes.bool,
  submitButtonText: PropTypes.string,
  submitButtonVariant: PropTypes.oneOf(['primary', 'secondary']),
  showSubmitButton: PropTypes.bool,
};

export default Form;
