const formatMePayload = (values) => ({
  names: values.names,
  paternalSurname: values.paternalSurname,
  maternalSurname: values.paternalSurname,
  email: values.email ?? `${values.names[0]}${values.paternalSurname}@cobachih.edu.mx`.toLowerCase(),
  password: values.password,
  enrollmentId: "",
  groups: [],
  currentGroup: "",
  nextGroup: "",
  shift: "",
})

export default formatMePayload