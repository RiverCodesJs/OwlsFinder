import db from '~/app/api/libs/db'
import payloadFormatter from '~/app/api/utils/payloadFormatter'
import cleanerData from '~/app/api/libs/cleanerData'
import ERROR from '~/error'

export const getOptions = ({ filter, includes, data: d, relations }) => {
  const filters = filter ? { where: { ...filter } } : {}
  const include = includes ? { 
    include: includes.reduce((acc, include) => ({ 
      ...acc, 
      [include]: { 
        select: include === 'permissions' ? { name: true } : { id: true } 
      } 
    }), {}) 
  } : {}
  const connections = relations ? relations.reduce((acc, relation) => {
    const { entity, data } = relation
    if(!Array.isArray(data)){
      return {
        ...acc,
        [entity]: {
          connectOrCreate: {
            where: entity === 'permissions' ? { name: data.name } : { id: data.id || 0 }, 
            create: { ...data }
          }
        }
      }
    }
    return {
      ...acc,
      [entity]: {
        connectOrCreate: data.map(relationData => ({
          where: entity === 'permissions' ? { name: relationData.name } : { id: relationData.id || 0 }, 
          create: { ...relationData }
        }))
      }
    }
  }, {}) : {}
  const data = d ? { data: { ...d, ...connections } } : {}
  return Object.assign(filters, include, data)
}
const isEmptyObject = ({ payload }) => {
  if(payload == null){
    return true
  } else {
    return false
  }
}

const createStudents = async data => {
  try {
    const response = Promise.all(
      data.map(async obj => {
        const objFound = await db.user.findUnique({ where: { email: obj.email } })
        if (objFound) {
          const payload = await db.user.update({ where: { email: obj.email }, data: obj })
          return payload
        } else {
          return await db.user.create({ data: obj })
        }
      }))
    return response
  } catch (error) {
    return ERROR.INVALID_FIELDS()
  }
}

//@queryType one of [findUnique, findMany, delete, update, create, createMany]
const query = async ({ entity, filter, includes, queryType, data, relations, password = false, error = true }) => {
  const opts = queryType !== 'createMany' ? getOptions({ filter, includes, data, relations }) : { data }
  if (opts?.where?.id !== undefined && isNaN(opts.where.id)) {
    return ERROR.NOT_FOUND()
  }
  let payload
  let element
  let options
  switch(queryType){
    case 'findUnique':
      payload = await db[entity].findUnique({ ...opts })
      if(isEmptyObject({ payload }) && error){
        return ERROR.NOT_FOUND()
      }
      return cleanerData({ payload, includes, password })

    case 'findMany':
      payload = await db[entity].findMany({ ...opts })
      if(isEmptyObject({ payload }) && error){
        return ERROR.NOT_FOUND()
      }
      return payloadFormatter(payload.map(p => cleanerData({ payload: p, includes, password })))

    case 'create':
      payload = await db[entity].create({ ...opts })
      return cleanerData({ payload, includes, password })
    
    case 'createMany':
      payload = await createStudents(data)
      return payloadFormatter(payload.map(p => cleanerData({ payload: p, includes, password })))
    
    case 'update':
      options = getOptions({ filter })
      element = await db[entity].findUnique(options)
      if(isEmptyObject({ payload: element })){ 
        return ERROR.NOT_FOUND()
      } 
      payload = await db[entity].update({ ...opts })
      return cleanerData({ payload, includes, password })
    
    case 'delete':
      options = getOptions({ filter })
      element = await db[entity].findUnique(options)
      if(isEmptyObject({ payload: element })){ 
        return ERROR.NOT_FOUND()
      }
      payload = await db[entity].delete({ ...opts })
      return cleanerData({ payload, includes, password })
    
    default: 
      return null
  }
}

export default query