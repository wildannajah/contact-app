import { useFormContext, Controller } from 'react-hook-form'
import { TextField, type TextFieldProps } from '@mui/material'

interface IProps {
  name: string
}

type Props = IProps & TextFieldProps

export default function RHFTextField({ name, ...other }: Props) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={error != null}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  )
}
