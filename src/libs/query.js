import db from '~/libs/db'

const opts = (filter, includes, data) => {
  const filters = { where: { ...filter } }
  const include = includes ? { 
    include: includes.reduce((acc, include) => ({ ...acc, [include]: { select: { id: true } } }), {}) 
  } : {}
  const datas = data ? { data } : {}

  const obj = Object.assign(filters, include, datas)
  
  return obj
}
//@queryType one of [findUnique, findMany, delete, update, create]
const query = async ({ entity, filter, includes, queryType, data }) => {
  
  const options = opts(filter, includes, data)

  switch(queryType){
    case 'findUnique':
      return await db[entity].findUnique({ ...options })

    case 'findMany':
      return db[entity].findMany({ ...options })

    case 'create':
      return db[entity].findMany({ ...options })
    
    case 'update':
      return db[entity].update({ ...options })
    
    case 'delete':
      return db[entity].delete({ ...options })
    
    default: 
      return 'query type not allowed'
  }
}

export default query

// const obj = {
//   a: 'a',
//   b: {
//     name:'letter b',
//     action: () => 'hello'
//   }
// }

// console.log(obj['b']['action']())