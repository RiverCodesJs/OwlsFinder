import { Stack, Typography, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useFormikContext } from 'formik'

const CustomField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.contrast.main,
  borderRadius: '4px',
  ['& .MuiFilledInput-input']: {
    padding: '16px 12px'
  },
  ['& .MuiFilledInput-root']: {
    padding: 0
  },
}))

const FormikTextField = ({ variant = 'filled' , field, password, ...props }) => {

  const { errors, setFieldValue } = useFormikContext()

  return (
    <Stack width="100%" alignItems="flex-start">
      <CustomField 
        {...props}
        placeholder={props.placeholder}
        error={Boolean(errors[field?.name])}
        name={field?.name}
        variant={variant}
        value={field?.value ?? ''}
        onChange={({ target }) => setFieldValue(field?.name, target.value)}
        slotProps={password ? {
          input: { 
            disableUnderline: true,
          }
        }: null
        } 
      />
      {errors[field?.name] ? <Typography width="60%" color="error" fontSize={10} textAlign="left">{errors[field?.name]}</Typography> : null}
    </Stack>
  )
}

export default FormikTextField