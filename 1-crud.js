const level = require('level')

const db = level('./db-1-crud')

/*
  CREATE (put)
  db.put(key, value[, options][, callback])
  https://github.com/Level/levelup#dbputkey-value-options-callback
*/
db.put('the-key', 'the-value', (err) => {
  if (err) return console.log(`db.put error: ${err}`)
  console.log(`db.put(the-key, the-value) done`)

  /*
    READ (get)
    db.get(key[, options][, callback])
    https://github.com/Level/levelup#dbgetkey-options-callback
  */
  db.get('the-key', (err, value) => {
    if (err) return console.log(`db.get error: ${err}`)
    console.log(`db.get(the-key) done value: ${value}`)

    /*
      UPDATE (put again)
      db.put(key, value[, options][, callback])
      https://github.com/Level/levelup#dbputkey-value-options-callback
    */
    db.put('the-key', 'the-new-value', (err) => {
      if (err) return console.log(`db.put error: ${err}`)
      console.log(`db.put(the-key, the-new-value) done`)

      /*
        DELETE (del)
        db.del(key[, options][, callback])
        https://github.com/Level/levelup#dbdelkey-options-callback
      */
      db.del('the-key', (err) => {
        if (err) return console.log(`db.del error: ${err}`)
        console.log(`db.del(the-key) done`)
      })
    })
  })
})



// wait 1 second before the other tests
setTimeout(() => {

  /*
    GET A MISSING KEY THROW AN ERROR
    db.get(key[, options][, callback])
    https://github.com/level/levelup#dbgetkey-options-callback
  */
  db.get('a-missing-key', (err, value) => {
    if (err) {
      console.log(`db.get(a-missing-key) error: ${err}`)
      console.log(`err.type: ${err.type}`)
      console.log(`err.message: ${err.message}`)
      console.log(`err.notFound: ${err.notFound}`)
      return
    }
  })

  /*
    DELETE A MISSING KEY DOES NOT THROW ANYTHING
    db.del(key[, options][, callback])
    https://github.com/Level/levelup#dbdelkey-options-callback
  */
  db.del('another-missing-key', (err) => {
    if (err) return console.log(`db.del error: ${err}`)
    console.log(`db.del(another-missing-key) done`)
  })

  /*
    PUT ACCEPTS ALL TYPES BUT RETURN A STRING
    put 12 return "12"
    put NaN return "NaN"
    put Infinity return "Infinity"
    put null return ""
    put undefined return ""
    put false return "false"
    put true return "true"
    put [] return ""
    put [1, 2] return "1,2"
    put {} return "[object Object]"
    put {} return "[object Object]"
    put new Date return "Sun Apr 09 2017 13:42:40 GMT+0200 (CEST)"
  */
  db.put('not-a-string', 12, (err) => {
    if (err) return console.log(`db.put error: ${err}`)
    console.log(`db.put(not-a-string, 12) done`)

    db.get('not-a-string', (err, value) => {
      if (err) return console.log(`db.get error: ${err}`)
      console.log(`db.get(not-a-string) done value: ${value} typeof value: ${typeof value}`)
    })
  })

}, 1000)
