import { NextResponse } from 'next/server'
import { authenticateToken } from '~/app/api/libs/auth'
import { Admin } from '~/app/api/entities'
import { adminPermissions } from '~/app/api/utils/permissions'
import ERROR from '~/error'
import registerCounselor from '~/app/api/libs/mail/templates/registerCounselor'
import queryDB from '~/app/api/libs/queryDB'
import jwt from 'jsonwebtoken'
import emailSender from '~/app/api/libs/mail/emailSender'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'

export const POST = async request => {
  try {
    const userId = authenticateToken(request)
    const { permissions } = await queryDB({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Admin, action: 'create' })
    if(hasPermission){
      const { email } = await request.json()
      if (!email) return ERROR.INVALID_FIELDS()
      const user = await queryDB({
        entity: 'user',
        queryType: 'findUnique',
        filter: { email },
        error: false
      })
      if (user) return ERROR.EMAIL_ALREADY_EXISTS()
      const counselor = await queryDB({
        entity: 'user',
        queryType: 'create',
        data: {
          email,
          type: 'Admin'
        },
        relations: [{
          entity: 'permissions',
          data: adminPermissions
        }]
      })
      const token = jwt.sign({ 
        userId: counselor.id
      }, process.env.JWT_SECRET)
      await emailSender({ reciver: email, template: registerCounselor({ token }) })
      return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
    } 
    return ERROR.FORBIDDEN()
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
