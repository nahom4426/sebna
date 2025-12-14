import React from 'react';
import PropTypes from 'prop-types';

/**
 * Modal Component - Reusable modal dialog
 * @param {boolean} isOpen - Control modal visibility
 * @param {function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} footer - Modal footer
 * @param {string} size - 'sm', 'md', 'lg', 'xl'
 * @param {boolean} closeButton - Show close button
 */
const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeButton = true,
  className = '',
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg shadow-2xl w-full ${sizes[size]} ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
          {closeButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  closeButton: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;
