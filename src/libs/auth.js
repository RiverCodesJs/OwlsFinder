import jwt from 'jsonwebtoken'

export const authenticateToken = req => {
  const authHeader = req.headers.get('authorization')

  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return { status: 401, message: 'Token required' }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)

    req.user = user

    return { status: 200, message: 'Token valid' }
  } catch (err) {
    return { status: 403, message: 'Token invalid' }
  }
}

