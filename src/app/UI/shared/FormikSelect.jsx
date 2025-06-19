import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useFormikContext } from 'formik'

const FormikSelect = ({ variant = 'filled', label, options, field, ...props }) => {
  const { errors, setFieldValue } = useFormikContext()

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        {...props}
        variant={variant}
        name={field?.name}
        value={field?.value || ''}
        onChange={event => setFieldValue(field?.name, event.target.value)}
        label={label}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errors[field?.name] ? <Typography color="error" fontSize={10}>{errors[field?.name]}</Typography> : null}
    </FormControl>
  )
}

export default FormikSelect