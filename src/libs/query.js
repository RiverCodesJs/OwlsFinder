import db from '~/libs/db'
import payloadFormatter from '~/utils/payloadFormatter'
import cleanerData from '~/libs/cleanerData'

const getOptions = ({ filter, includes, data: p, relations }) => {
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

  const data = p ? { data: { ...p, ...connections } } : {}

  const obj = Object.assign(filters, include, data)
  
  return obj
}

//@queryType one of [findUnique, findMany, delete, update, create]
const query = async ({ entity, filter, includes, queryType, data, relations }) => {

  const opts = getOptions({ filter, includes, data, relations })
  
  let payload
  let payloadDirty
  switch(queryType){
    case 'findUnique':
      payloadDirty = await db[entity].findUnique({ ...opts })
      payload = cleanerData({ _payload: payloadDirty, includes })
      return payload

    case 'findMany':
      payloadDirty = await db[entity].findMany({ ...opts })
      payload = payloadFormatter(payloadDirty.map(_payload => cleanerData({ _payload, includes })))
      return payload

    case 'create':
      payloadDirty = await db[entity].create({ ...opts })
      payload = cleanerData({ _payload: payloadDirty, includes })
      return payload
    
    case 'update':
      payload = cleanerData(await db[entity].update({ ...opts }))
      return payload
    
    case 'delete':
      payload = cleanerData(await db[entity].delete({ ...opts }))
      return payload
    
    default: 
      return 'query type not allowed'
  }
}

export default query