import { Stack, TextField, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useFormikContext } from "formik"
import { useState } from "react"

const CustomField = styled(TextField)(({theme}) => ({
  backgroundColor: theme.palette.contrast.main,
  borderRadius: "4px",
  borderBottom: "2px solid black",
  width: "60%",
  [`& .MuiFilledInput-input`]: {
      padding: "16px 12px"
  }
}))

const FormikTextField = ({ variant = "filled" , field, password, ...props}) => {

  const [visibility, setVisibility] = useState(false)
  const {errors, setFieldValue} = useFormikContext()

  return (
    <Stack width="100%" alignItems="center">
      <CustomField 
      {...props}
      placeholder={props.placeholder}
      error={Boolean(errors[field?.name])}
      name={field?.name}
      variant={variant}
      value={field?.value}
      onChange={({target}) => setFieldValue(field?.name, target.value)}
      slotProps={password ? {
        input: { 
          disableUnderline: true,
          type: password && !visibility ? 'password' : 'text', 
          }
        }: null
      } 
      />
      {/*errors[field?.name] ? <Typography width="60%" color="error" fontSize={12} textAlign="left">{errors[field?.name]}</Typography> : null*/}
    </Stack>
  )
}

export default FormikTextField