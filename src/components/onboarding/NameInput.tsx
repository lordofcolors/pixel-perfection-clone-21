import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface NameInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  className?: string;
}

export const NameInput: React.FC<NameInputProps> = ({ register, errors, className = '' }) => {
  return (
    <div className={className}>
      <label htmlFor="firstName" className="sr-only">
        First Name
      </label>
      <div className="flex w-[317px] h-10 items-center gap-1 shrink-0 border border-slate-700 bg-slate-950 px-3 py-2 rounded-lg border-solid max-md:w-[280px] max-sm:w-[250px]">
        <input
          id="firstName"
          type="text"
          placeholder="First Name"
          className="flex-[1_0_0] overflow-hidden text-zinc-400 placeholder:text-zinc-400 text-ellipsis text-sm font-normal leading-5 bg-transparent border-none outline-none focus:text-white"
          {...register('firstName', {
            required: 'First name is required',
            minLength: {
              value: 2,
              message: 'First name must be at least 2 characters'
            }
          })}
        />
      </div>
      {errors.firstName && (
        <p className="text-red-400 text-xs mt-1 text-center" role="alert">
          {errors.firstName.message as string}
        </p>
      )}
    </div>
  );
};
