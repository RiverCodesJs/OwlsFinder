import { NextResponse } from 'next/server'
import forgotYourPassword from '~/app/api/libs/mail/templates/forgotYourPassword'
import queryDB from '~/app/api/libs/queryDB'
import jwt from 'jsonwebtoken'
import emailSender from '~/app/api/libs/mail/emailSender'
import ERROR from '~/error'

export const POST = async request => {
  try {
    const { email } = await request.json()
    if(!email) return ERROR.INVALID_FIELDS()
    const user = await queryDB({
      entity: 'user',
      queryType: 'findUnique',
      filter: { email: email },
    })    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
    await emailSender({ reciver: email, template: forgotYourPassword({ token }) })
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}