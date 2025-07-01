import { FormControl, InputLabel, MenuItem, Select, Typography as T } from '@mui/material'
import { useFormikContext } from 'formik'

const FormikSelect = ({ label, options, field, ...props }) => {
  const { errors, setFieldValue } = useFormikContext()

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        {...props}
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
      {errors[field?.name] ? <T color="error" variant="caption">{errors[field?.name]}</T> : null}
    </FormControl>
  )
}

export default FormikSelect