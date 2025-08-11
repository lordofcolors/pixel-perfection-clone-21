import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';

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
      <div className="w-[317px] max-md:w-[280px] max-sm:w-[250px]">
        <Input
          id="firstName"
          type="text"
          placeholder="First Name"
          className="w-full"
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
        <p className="text-destructive text-xs mt-1 text-center" role="alert">
          {errors.firstName.message as string}
        </p>
      )}
    </div>
  );
};
