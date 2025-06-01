import React from "react";

const SelectList = ({
  label,
  name,
  register,
  error,
  options = [],
  defaultOption,
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        {...register}
        className={`w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 px-4 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 ${className}`}
      >
        <option value="" disabled>
          {defaultOption}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-red-500 text-sm">{error}</span>
      )}
    </div>
  );
};

export default SelectList;
