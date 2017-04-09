const bytewise = require('bytewise')
const level = require('level')

/*
  Bytewise sorts things in this order:
  
    * null
    * false
    * true
    * Number (numeric)
    * Date (numeric, epoch offset)
    * Buffer, Uint8Array (bitwise)
    * String (lexicographic)
    * Set (componentwise with elements sorted)
    * Array (componentwise)
    * Object (componentwise string-keyed key/value pairs)
    * Map (componentwise key/value pairs)
    * RegExp (stringified lexicographic)
    * Function (stringified lexicographic)
    * undefined

  So use null & undefined to match everything: this is like conventional ascii ! and ~
*/

const db = level('./db-6-key-with-bytewise', {
  keyEncoding: bytewise,
  valueEncoding: 'json'
})

var ops = [
  { type: 'put', key: ['user', 'dominictarr'], value: { bio: 'mad science boating' } },
  { type: 'put', key: ['user', 'mafintosh'], value: { bio: 'torrents of open source' } },
  { type: 'put', key: ['user', 'substack'], value: { bio: 'beep boop' } },
  { type: 'put', key: ['post', 1412991992967, 'substack'], value: { body: 'robots' } },
  { type: 'put', key: ['post', 1412992015628, 'dominictarr'], value: { body: 'jib sail' } },
  { type: 'put', key: ['post', 1412992057388, 'substack'], value: { body: 'npm publish' } },
  { type: 'put', key: ['post', 1412992068543, 'mafintosh'], value: { body: 'browserify browserify' } },
  { type: 'put', key: ['post-user', 'dominictarr', 1412992015628], value: 0 },
  { type: 'put', key: ['post-user', 'mafintosh', 1412992068543], value: 0 },
  { type: 'put', key: ['post-user', 'substack', 1412995992967], value: 0 },
  { type: 'put', key: ['post-user', 'substack', 1412992057388], value: 0 },
]

// BATCH PUT some data
db.batch(ops, (err) => {
  if (err) return console.log(`db.batch error: ${err}`)
  console.log(`db.batch(ops) done`)

  /*
    SORT "user" KEYS WITH BYTEWISE AND null undefined DELIMITERS
    db.createReadStream([options])
    https://github.com/level/levelup#dbcreatereadstreamoptions
  */
  db.createReadStream({
    gt: ['user', null],
    lt: ['user', undefined],
  }).on('data', (data) => {
    console.log(`on "data" data.key: ${JSON.stringify(data.key)} data.value: ${JSON.stringify(data.value)}`)
  })


})


// wait 1 second before the other tests
setTimeout(() => {

  /*
    SORT "post-user" KEYS WITH "substack" WITH BYTEWISE AND null undefined DELIMITERS
    db.createReadStream([options])
    https://github.com/level/levelup#dbcreatereadstreamoptions
  */
  db.createReadStream({
    gt: ['post-user', 'substack', null],
    lt: ['post-user', 'substack', undefined],
  }).on('data', (data) => {
    console.log(`on "data" data.key: ${JSON.stringify(data.key)} data.value: ${JSON.stringify(data.value)}`)
  })

}, 1000)
