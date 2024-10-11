import db from '~/app/api/libs/db'
import payloadFormatter from '~/app/api/utils/payloadFormatter'
import cleanerData from '~/app/api/libs/cleanerData'

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
            where: { id: data.id || 0 },
            create: { ...data }
          }
        }
      }
    }
    
    return {
      ...acc,
      [entity]: {
        connectOrCreate: data.map(relationData => ({
          where: { id: relationData.id || 0 },
          create: { ...relationData }
        }))
      }
    }
  }, {}) : {}

  const data = d ? { data: { ...d, ...connections } } : {}

  return Object.assign(filters, include, data)
}

//@queryType one of [findUnique, findMany, delete, update, create]
const query = async ({ entity, filter, includes, queryType, data, relations, password = false }) => {

  const opts = getOptions({ filter, includes, data, relations })
  let payload
  switch(queryType){
    case 'findUnique':
      payload = await db[entity].findUnique({ ...opts })
      return cleanerData({ payload, includes, password })

    case 'findMany':
      payload = await db[entity].findMany({ ...opts })
      return payloadFormatter(payload.map(p => cleanerData({ payload: p, includes, password })))

    case 'create':
      payload = await db[entity].create({ ...opts })
      return cleanerData({ payload, includes, password })
    
    case 'update':
      payload = await db[entity].update({ ...opts })
      return cleanerData({ payload, includes, password })
    
    case 'delete':
      payload = await db[entity].delete({ ...opts })
      return cleanerData({ payload, includes, password })
    
    default: 
      return null
  }
}

export default query