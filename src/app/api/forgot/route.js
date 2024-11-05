import { NextResponse } from 'next/server'
import forgotYourPassword from '~/app/api/libs/mail/templates/forgotYourPassword'
import query from '~/app/api/libs/query'
import jwt from 'jsonwebtoken'
import emailSender from '~/app/api/libs/mail/emailSender'

export const POST = async request => {
  try {
    const { email } = await request.json()
    const user = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { email: email },
      includes: ['permissions']
    })    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
    await emailSender({ reciver: email, template: forgotYourPassword({ token }) })
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}