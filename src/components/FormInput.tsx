import { InputText } from 'primereact/inputtext';
import React from 'react';
import { useFormContext } from 'react-hook-form';

type FormInputProps = {
  placeholder: string;
  name: string;
  type?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  placeholder,
  name,
  type = 'text',
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className='w-full md:w-30rem mb-3'>
      <InputText
      style={{ padding: '1rem' }}
      autoFocus
      type={type}
      placeholder={placeholder}
        {...register(name)}
      />
      {errors[name] && (
        <span className='text-red-500 text-xs pt-1 block'>
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInput;
