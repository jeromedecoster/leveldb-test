const level = require('level')

/*
  OPTIONS
  levelup(location[, options[, callback]])
  https://github.com/level/levelup#options
*/
const db = level('./db-2-json', { valueEncoding: 'json' })

/*
  PUT JSON
*/
db.put('the-key', { message: 'hello world', date: new Date() }, (err) => {
  if (err) return console.log(`db.put error: ${err}`)
  console.log(`db.put(the-key, { message: 'hello world', date: new Date() }) done`)

  /*
    GET JSON
  */
  db.get('the-key', (err, value) => {
    if (err) return console.log(`db.get error: ${err}`)
    console.log(`db.get(the-key) done value: ${JSON.stringify(value)}`)
  })
})
