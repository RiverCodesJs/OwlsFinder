import db from '~/libs/db'
import payloadFormatter from '~/utils/payloadFormatter'

const opts = (filter, includes, data, relationEntity, relationData) => {
  const filters = { where: { ...filter } }
  const include = includes ? { 
    include: includes.reduce((acc, include) => ({ ...acc, [include]: { select: { id: true } } }), {}) 
  } : {}
  const datas = data ? { data } : {}
  const connection = { [relationEntity]: { connectOrCreate: { where: { id: relationData.id || 0 }, create: { ...relationData } } } }

  const obj = Object.assign(filters, include, datas, connection)
  
  return obj
}

//@queryType one of [findUnique, findMany, delete, update, create]
const query = async ({ entity, filter, includes, queryType, data, relationEntity, relationData }) => {
  
  const options = opts(filter, includes, data, relationEntity, relationData)

  let payload
  switch(queryType){
    case 'findUnique':
      payload = payloadFormatter(await db[entity].findUnique({ ...options }))
      return payload

    case 'findMany':
      payload = payloadFormatter(await db[entity].findMany({ ...options }))
      return payload
      

    case 'create':
      payload = payloadFormatter(await db[entity].create({ ...options }))
      return payload
    
    case 'update':
      payload = payloadFormatter(await db[entity].update({ ...options }))
      return payload
    
    case 'delete':
      payload = payloadFormatter(await db[entity].delete({ ...options }))
      return payload
    
    default: 
      return 'query type not allowed'
  }
}

export default query