import React, { useMemo } from 'react';

const SelectPrivilegeInput = ({
  label,
  name,
  options = [],
  selectedPrivileges = [],
  onChange,
  required = false,
}) => {
  const groupedPrivileges = useMemo(() => {
    return options.reduce((acc, privilege) => {
      const category = privilege.privilegeCategory || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(privilege);
      return acc;
    }, {});
  }, [options]);

  const getSelectedPrivilegeUuids = () => {
    if (!Array.isArray(selectedPrivileges)) return [];
    return selectedPrivileges.map((priv) => {
      if (typeof priv === 'string') return priv;
      return priv.privilegeUuid || priv.id;
    });
  };

  const selectedUuids = getSelectedPrivilegeUuids();

  const handleTogglePrivilege = (privilegeUuid) => {
    const updated = selectedUuids.includes(privilegeUuid)
      ? selectedUuids.filter((id) => id !== privilegeUuid)
      : [...selectedUuids, privilegeUuid];
    onChange(updated);
  };

  const isChecked = (privilegeUuid) => {
    return selectedUuids.includes(privilegeUuid);
  };

  const isAllCheckedInCategory = (category) => {
    const categoryPrivileges = groupedPrivileges[category] || [];
    return (
      categoryPrivileges.length > 0 &&
      categoryPrivileges.every((priv) =>
        selectedUuids.includes(priv.privilegeUuid)
      )
    );
  };

  const handleSelectAllInCategory = (category, checked) => {
    const categoryPrivileges = groupedPrivileges[category] || [];
    const categoryUuids = categoryPrivileges.map((priv) => priv.privilegeUuid);

    let updated;
    if (checked) {
      updated = [...new Set([...selectedUuids, ...categoryUuids])];
    } else {
      updated = selectedUuids.filter((id) => !categoryUuids.includes(id));
    }
    onChange(updated);
  };

  const categoryOrder = [
    'user',
    'role',
    'privilege',
    'post',
    'comment',
    'message',
    'institution',
    'like',
    'security',
  ];

  const sortedCategories = Object.keys(groupedPrivileges).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  const getCategoryColor = (category) => {
    const colors = {
      user: 'bg-blue-50 border-blue-200',
      role: 'bg-purple-50 border-purple-200',
      privilege: 'bg-indigo-50 border-indigo-200',
      post: 'bg-green-50 border-green-200',
      comment: 'bg-yellow-50 border-yellow-200',
      message: 'bg-pink-50 border-pink-200',
      institution: 'bg-cyan-50 border-cyan-200',
      like: 'bg-red-50 border-red-200',
      security: 'bg-orange-50 border-orange-200',
    };
    return colors[category] || 'bg-gray-50 border-gray-200';
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      user: 'bg-blue-100 text-blue-800',
      role: 'bg-purple-100 text-purple-800',
      privilege: 'bg-indigo-100 text-indigo-800',
      post: 'bg-green-100 text-green-800',
      comment: 'bg-yellow-100 text-yellow-800',
      message: 'bg-pink-100 text-pink-800',
      institution: 'bg-cyan-100 text-cyan-800',
      like: 'bg-red-100 text-red-800',
      security: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 mb-6 pb-3 border-b-2 border-gray-200">
        {label && (
          <span className="text-base font-bold text-gray-800">
            {label}
            {required && <span className="text-red-500 ml-2">*</span>}
          </span>
        )}
        {selectedUuids.length > 0 && (
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {selectedUuids.length} selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedCategories.map((category) => (
          <div
            key={category}
            className={`border-2 rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getCategoryColor(
              category
            )}`}
          >
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-current border-opacity-20">
              <input
                type="checkbox"
                id={`select-all-${category}`}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer transition-all"
                checked={isAllCheckedInCategory(category)}
                onChange={(e) =>
                  handleSelectAllInCategory(category, e.target.checked)
                }
              />
              <label
                htmlFor={`select-all-${category}`}
                className="font-semibold text-sm text-gray-800 cursor-pointer flex-1 capitalize"
              >
                {category}
              </label>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${getCategoryBadgeColor(
                  category
                )}`}
              >
                {groupedPrivileges[category]?.length || 0}
              </span>
            </div>

            <div className="space-y-2">
              {(groupedPrivileges[category] || []).map((privilege) => (
                <div
                  key={privilege.privilegeUuid}
                  className="flex items-start gap-3 p-2 rounded hover:bg-white hover:bg-opacity-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    id={`priv-${privilege.privilegeUuid}`}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer mt-0.5 transition-all"
                    checked={isChecked(privilege.privilegeUuid)}
                    onChange={() =>
                      handleTogglePrivilege(privilege.privilegeUuid)
                    }
                  />
                  <label
                    htmlFor={`priv-${privilege.privilegeUuid}`}
                    className="flex-1 cursor-pointer"
                  >
                    <p className="text-sm font-medium text-gray-800 leading-tight">
                      {privilege.privilegeName}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {privilege.privilegeDescription}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedPrivileges).length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500 font-medium">No privileges available</p>
        </div>
      )}
    </div>
  );
};

export default SelectPrivilegeInput;
