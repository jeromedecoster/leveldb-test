const level = require('level')

const db = level('./db-3-batch')

/*
  THERE IS 2 AVAILABLE OPERATIONS
  { type: 'del', key: ... }
  { type: 'put', key: ..., value: ...  }
*/
var operations = [
  { type: 'put', key: 'a-key', value: 'hello world' },
  { type: 'put', key: 'another-key', value: 'another world' }
]

/*
  BATCH
  db.batch(array[, options][, callback]) (array form)
  https://github.com/level/levelup#dbbatcharray-options-callback-array-form
*/
db.batch(operations, (err) => {
  if (err) return console.log(`db.batch error: ${err}`)
  console.log(`db.batch(operations) done`)

  // the a-key is here
  db.get('a-key', (err, value) => {
    if (err) return console.log(`db.get error: ${err}`)
    console.log(`db.get(a-key) done value: ${value}`)

    var operations2 = [
      { type: 'put', key: 'a-new-key', value: 'a new world' },
      { type: 'del', key: 'a-key' },
      { type: 'del', key: 'another-key' },
    ]

    db.batch(operations2, (err) => {
      if (err) return console.log(`db.batch error: ${err}`)
      console.log(`db.batch(operations2) done`)

      // the a-key is no more here
      db.get('a-key', (err, value) => {
        if (err) return console.log('a-key is no more here')
      })
    })
  })
})
