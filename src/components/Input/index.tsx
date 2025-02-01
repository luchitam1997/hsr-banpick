interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  containerClassName?: string
  labelClassName?: string
  inputClassName?: string
  errorClassName?: string
}

export function Input({
  label,
  error,
  containerClassName = '',
  labelClassName = 'block text-base font-medium text-primary',
  inputClassName = 'text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none',
  errorClassName = 'text-red-500 text-sm mt-1',
  ...props
}: InputProps) {
  return (
    <div className={containerClassName}>
      {label && <label className={labelClassName}>{label}</label>}
      <input
        type='text'
        className={`${inputClassName} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  )
}
