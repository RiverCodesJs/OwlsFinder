class CustomError extends Error {
  constructor({ message, status }){
    super(message)
    this.status = status 
  }
}

const ERROR = {
  FORBIDDEN: () => {throw new CustomError({ message: 'Not Allowed', status: 403 })},
  INVALID_FIELDS: () => {throw new CustomError({ message: 'Invalid Fields', status: 400 })},
}

export default ERROR