import { NextResponse } from 'next/server'
import { Admin } from '~/app/api/entities'
import { ADMIN_PERMISSIONS } from '~/app/api/utils/permissions'
import { validatePermission } from '~/app/api/libs/permissions'
import ERROR from '~/error'
import registerCounselor from '~/app/api/libs/mail/templates/registerCounselor'
import queryDB from '~/app/api/libs/queryDB'
import jwt from 'jsonwebtoken'
import emailSender from '~/app/api/libs/mail/emailSender'

export const POST = async request => {
  try {
    const hasPermission = await validatePermission({ entity: Admin, action: 'create', request })
    if(!hasPermission) return ERROR.FORBIDDEN()
    const { email } = await request.json()
    if (!email) return ERROR.INVALID_FIELDS()
    const user = await queryDB({
      entity: 'user',
      queryType: 'findUnique',
      filter: { email },
      error: false
    })
    if (user) return ERROR.EMAIL_ALREADY_EXISTS()
    const admin = await queryDB({
      entity: 'user',
      queryType: 'create',
      data: {
        email,
        type: 'Admin'
      },
      relations: [{
        entity: 'permissions',
        data: Object.keys(ADMIN_PERMISSIONS).map(key => ({ name: key }))
      }]
    })
    const token = jwt.sign({ 
      userId: admin.id
    }, process.env.JWT_SECRET)
    await emailSender({ reciver: email, template: registerCounselor({ token }) })
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
