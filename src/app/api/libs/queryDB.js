import db from '~/app/api/libs/db'
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
const queryDB = async ({ entity, filter, includes, queryType, data, relations }) => {
  const opts = queryType !== 'createMany' ? getOptions({ filter, includes, data, relations }) : { data }
  let payload
  let element
  let options
  switch(queryType){
    case 'findUnique':
      return await db[entity].findUnique({ ...opts })
  
    case 'findMany': 
      payload = await db[entity].findMany({ ...opts })
      return payload.length ? payload : null

    case 'create':
      return await db[entity].create({ ...opts })
    
    case 'createMany':
      return await createStudents(data)
    
    case 'update':
      if (!opts?.where?.id) return ERROR.NOT_FOUND()
      options = getOptions({ filter })
      element = await db[entity].findUnique(options)
      payload = element ? await db[entity].update({ ...opts }) : null
      return payload
    
    case 'delete':
      options = getOptions({ filter })
      element = await db[entity].findUnique(options)
      payload = element ? await db[entity].delete({ ...opts }) : null
      return payload 

    default: 
      return null
  }
}

export default queryDB