/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken'
import ERROR from '~/error'

export const authenticateToken = ({ headers }) => {
  const authHeader = headers.get('authorization')
  const token = authHeader && authHeader.replace(/authorization /,'')
  if (token) {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    return userId
  } else {
    ERROR.FORBIDDEN()
  }
}

