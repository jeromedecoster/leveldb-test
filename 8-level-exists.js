const exists = require('level-exists')
const level = require('level')


const name = './db-8-level-exists'

/*
  REMOVE THE PREVIOUS DB (from package `leveldown` but exposed by `level`)
  leveldown.destroy(location, callback)
  https://github.com/Level/levelup#leveldowndestroylocation-callback
*/
level.destroy(name, () => {

  // create the db
  let db = level(name, { valueEncoding: 'json' })

  exists.install(db)

  /*
    CHECK IF THE KEY EXISTS
    db#exists(key, cb)
    https://github.com/juliangruber/level-exists#dbexistskey-cb
  */
  db.exists('the-key', (err, found) => {
    if (err) return console.log(`db.put exists: ${err}`)
    console.log('the-key exists? %s', found)

    db.put('the-key', 'the-value', (err) => {
      if (err) return console.log(`db.put error: ${err}`)
      console.log(`db.put(the-key, the-value) done`)

      // check if exists again
      db.exists('the-key', (err, found) => {
        if (err) return console.log(`db.put exists: ${err}`)
        console.log('the-key exists? %s', found)

        db.del('the-key', (err) => {
          if (err) return console.log(`db.del error: ${err}`)
          console.log(`db.del(the-key) done`)

          // and check if exists again
          db.exists('the-key', (err, found) => {
            if (err) return console.log(`db.put exists: ${err}`)
            console.log('the-key exists? %s', found)
          })
        })
      })
    })
  })
})
