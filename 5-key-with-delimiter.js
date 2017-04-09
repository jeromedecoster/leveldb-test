const level = require('level')

const db = level('./db-5-key-with-delimiter', { valueEncoding: 'json' })

var ops = [
  { type: 'put', key: 'user!bob', value: { age: 15, male: true } },
  { type: 'put', key: 'user!tom', value: { age: 18, male: true } },
  { type: 'put', key: 'admin!jack', value: { age: 22, male: true } },
  { type: 'put', key: 'admin!bob', value: { age: 35, male: true } },
  { type: 'put', key: 'user!jane', value: { age: 17, male: false } },
  { type: 'put', key: 'admin!clara', value: { age: 21, male: false } },
]

// BATCH PUT some data
db.batch(ops, (err) => {
  if (err) return console.log(`db.batch error: ${err}`)
  console.log(`db.batch(ops) done`)

  /*
    FILTER / SORT KEYS WITH GT AND LT OPTIONS AND ! ~ DELIMITERS
    db.createReadStream([options])
    https://github.com/level/levelup#dbcreatereadstreamoptions
  */
  db.createReadStream({
    gt: 'admin!',
    lt: 'admin!~'
  }).on('data', (data) => {
    console.log(`on "data" data.key: ${data.key} data.value: ${JSON.stringify(data.value)}`)
  })
})
