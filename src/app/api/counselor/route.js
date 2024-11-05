import { NextResponse } from 'next/server'
import { authenticateToken } from '~/app/api/libs/auth'
import { Counselor } from '~/app/api/entities'
import { counselorPermissions } from '~/app/api/utils/permissions'
import ERROR from '~/error'
import registerCounselor from '~/app/api/libs/mail/templates/registerCounselor'
import query from '~/app/api/libs/query'
import jwt from 'jsonwebtoken'
import emailSender from '~/app/api/libs/mail/emailSender'
import getPermissionsByEntity from '~/app/api/libs/getPermissionsByEntity'

export const POST = async request => {
  try {
    const userId = authenticateToken(request)
    const { permissions } = await query({
      entity: 'user',
      queryType: 'findUnique',
      filter: { id: Number(userId) },
      includes: ['permissions']
    })
    const hasPermission = getPermissionsByEntity({ permissions, entity: Counselor, action: 'create' })
    if(hasPermission){
      const { email } = await request.json()
      if (!email) return ERROR.INVALID_FIELDS()
      const user = await query({
        entity: 'user',
        queryType: 'findUnique',
        filter: { email },
        error: false
      })   
      if (Object.keys(user).length > 0) return ERROR.EMAIL_ALREADY_EXISTS()
      const counselor = await query({
        entity: 'user',
        queryType: 'create',
        data: {
          email,
          type: 'Counselor'
        },
        relations: [{
          entity: 'permissions',
          data: counselorPermissions
        }]
      })
      const token = jwt.sign({ 
        userId: counselor.id
      }, process.env.JWT_SECRET)
      await emailSender({ reciver: email, template: registerCounselor({ token }) })
      return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
    } else {
      return ERROR.FORBIDDEN()
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 })
  }
}
