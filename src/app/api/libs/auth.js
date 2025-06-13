/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken'
import ERROR from '~/error'

export const authenticateToken = ({ headers }) => {
  const authHeader = headers.get('authorization')
  const token = authHeader && authHeader.replace(/Bearer /,'')
  if (token) {
    const { userId, role } = jwt.verify(token, process.env.JWT_SECRET)
    return { userId, role }
  } else {
    ERROR.FORBIDDEN()
  }
}

