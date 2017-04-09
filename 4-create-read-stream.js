const level = require('level')

const db = level('./db-4-create-read-stream')

var ops = [
  { type: 'put', key: 'abc', value: '111' },
  { type: 'put', key: 'def', value: '222' },
  { type: 'put', key: 'ghi', value: '333' },
  { type: 'put', key: 'jkl', value: '444' },
  { type: 'put', key: 'mno', value: '555' },
  { type: 'put', key: 'pqr', value: '666' },
  { type: 'put', key: 'stu', value: '777' },
  { type: 'put', key: 'vwx', value: '888' },
  { type: 'put', key: 'yz.', value: '999' },
]

// BATCH PUT some data
db.batch(ops, (err) => {
  if (err) return console.log(`db.batch error: ${err}`)
  console.log(`db.batch(ops) done`)

  /*
    CREATE READ STREAM
    db.createReadStream([options])
    https://github.com/level/levelup#dbcreatereadstreamoptions
  */
  db.createReadStream()
    .on('data', (data) => {
      console.log(`on "data" data.key: ${data.key} data.value: ${data.value}`)
    })
    .on('error', (err) => {
      console.log(`on "error" err: ${err}`)
    })
    .on('close', () => {
      console.log(`on "close"`)
    })
    .on('end', () => {
      console.log(`on "end"`)
    })
})


// wait 1 second before the other tests
setTimeout(() => {

  /*
    FILTER / SORT KEYS WITH GT AND LT OPTIONS
    db.createReadStream([options])
    https://github.com/level/levelup#dbcreatereadstreamoptions
  */
  db.createReadStream({
    gt: 'd',
    lt: 's'
  }).on('data', (data) => {
    console.log(`on "data" data.key: ${data.key} data.value: ${data.value}`)
  })

}, 1000)
