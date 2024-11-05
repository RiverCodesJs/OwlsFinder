class CustomError extends Error {
  constructor({ message, status }){
    super(message)
    this.status = status 
  }
}

const ERROR = {
  INVALID_FIELDS: () => { throw new CustomError({ message: 'Invalid Fields', status: 400 }) },
  BAD_EMAIL: () => { throw new CustomError({ message: 'Email Sending Failed', status: 400 }) },
  FORBIDDEN: () => { throw new CustomError({ message: 'Not Allowed', status: 403 }) },
  NOT_FOUND: () => { throw new CustomError({ message: 'Not Found', status: 404 }) },
  EMAIL_ALREADY_EXISTS: () => { throw new CustomError({ message: 'Email already exists', status: 409 }) }
}

export default ERROR