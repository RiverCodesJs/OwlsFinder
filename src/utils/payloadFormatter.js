const payloadFormatter = arr => {
  const obj = arr.reduce((acc, ob) => ({ ...acc, [ob.id]: { ...ob } }), {})
  return obj
}

export default payloadFormatter
