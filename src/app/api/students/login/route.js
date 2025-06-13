import { NextResponse } from 'next/server'
import { Student } from '~/app/api/entities'
import jwt from 'jsonwebtoken'
import queryDB from '~/app/api/libs/queryDB'
import ERROR from '~/error'
import validatorFields from '~/app/api/libs/validatorFields'
import emailSender from '~/app/api/libs/mail/emailSender'
import loginStudents from '~/app/api/libs/mail/templates/loginStudents'

export const POST = async request => {
  try {
    const data = await request.json()
    if (validatorFields({ data, shape: Student.shape })) {
      const user = await queryDB({
        entity: 'user',
        queryType: 'findUnique',
        filter: {
          ...data,
          type: 'student'
        },
      })
      if(user){
        const token = jwt.sign({ userId: user.id, role: user.type }, process.env.JWT_SECRET)
        await emailSender({ reciver: user.email, template: loginStudents({ token }) })
        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
      }
    }
    return ERROR.INVALID_FIELDS()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
