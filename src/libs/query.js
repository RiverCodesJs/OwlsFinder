import db from '~/libs/db'
import payloadFormatter from '~/utils/payloadFormatter'
import cleanerData from '~/libs/cleanerData'

const getOptions = ({ filter, includes, payload: p, relations }) => {
  const filters = filter ? { where: { ...filter } } : {}
  const include = includes ? { 
    include: includes.reduce((acc, include) => ({ 
      ...acc, 
      [include]: { 
        select: include ==='permissions' ? { name: true } : { id: true } 
      } 
    }), {}) 
  } : {}
  const payload = p ? { data: { ...p } } : {}
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

  const obj = Object.assign(filters, include, payload, connections)
  
  return obj
}

//@queryType one of [findUnique, findMany, delete, update, create]
const query = async ({ entity, filter, includes, queryType, data, relations }) => {
  
  const opts = getOptions(filter, includes, data, relations)

  let payload
  switch(queryType){
    case 'findUnique':
      payload = payloadFormatter(cleanerData(await db[entity].findUnique({ ...opts })))
      return payload

    case 'findMany':
      payload = payloadFormatter(cleanerData(await db[entity].findMany({ ...opts })))
      return payload
      

    case 'create':
      payload = payloadFormatter(cleanerData(await db[entity].create({ ...opts })))
      return payload
    
    case 'update':
      payload = payloadFormatter(cleanerData(await db[entity].update({ ...opts })))
      return payload
    
    case 'delete':
      payload = payloadFormatter(cleanerData(await db[entity].delete({ ...opts })))
      return payload
    
    default: 
      return 'query type not allowed'
  }
}

export default query