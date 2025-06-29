import { Typography, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useFormikContext } from 'formik'

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  '& [class*=MuiInputBase-root-MuiFilledInput-root]': {
    backgroundColor: theme.palette.contrast.main,
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    }
  },
  '& [class*=MuiInputBase-input-MuiFilledInput-input]': {
    borderRadius: '4px 4px 0 0',
    padding: '16px 12px',
  }
}))

const FormikTextField = ({ variant = 'filled' , field, password, ...props }) => {

  const { errors, setFieldValue } = useFormikContext()

  return (
    <Container>
      <TextField 
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
        } : null
        } 
      />
      {errors[field?.name] ? <Typography color="error" variant='caption'>{errors[field?.name]}</Typography> : null}
    </Container>
  )
}

export default FormikTextField