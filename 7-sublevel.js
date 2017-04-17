const sublevel = require('level-sublevel')
const level = require('level')


const name = './db-7-sublevel'

/*
  REMOVE THE PREVIOUS DB (from package `leveldown` but exposed by `level`)
  leveldown.destroy(location, callback)
  https://github.com/Level/levelup#leveldowndestroylocation-callback
*/
level.destroy(name, () => {

  // create the db
  let db = level(name, { valueEncoding: 'json' })
    // sublevel wrap level to inject is own capacities
  db = sublevel(db)

  // create 2 sublevel database (contained in a plain object for clarity)
  const databases = {
    regions: db.sublevel('regions'),
    bears: db.sublevel('bears')
  }

  // create some operations to populate the databases (contained in a plain object for clarity)
  const operations = {
    regions: [
      { type: 'put', key: 'northamerica', value: { name: 'North America' } },
      { type: 'put', key: 'southamerica', value: { name: 'South America' } }
    ],
    bears: [
      { type: 'put', key: 'steve', value: { type: 'grizzly', region: 'northamerica' } },
      { type: 'put', key: 'paul', value: { type: 'polar bear', region: 'southamerica' } }
    ]
  }

  databases.regions.batch(operations.regions, (err) => {
    if (err) return console.log(`databases.regions.batch error: ${err}`)
    console.log(`databases.regions.batch(operations.regions) done`)

    databases.bears.batch(operations.bears, (err) => {
      if (err) return console.log(`databases.bears.batch error: ${err}`)
      console.log(`databases.bears.batch(operations.bears) done`)

      // no data is accessible from the parent `db`
      db.createReadStream()
        .on('data', (data) => {
          // this will not be printed...
          console.log(`db on "data" data.key: ${data.key} data.value: ${JSON.stringify(data.value)}`)
        })
        .on('end', () => {
          console.log(`db on "end"`)
        })

      // wait 1 second before the `databases.bears` test
      setTimeout(() => {
        databases.bears.createReadStream()
          .on('data', (data) => {
            console.log(`databases.bears on "data" data.key: ${data.key} data.value: ${JSON.stringify(data.value)}`)
          })
          .on('end', () => {
            console.log(`databases.bears on "end"`)
          })
      }, 1000)

      // wait 2 seconds before the `databases.regions` test
      setTimeout(() => {
        databases.regions.createReadStream()
          .on('data', (data) => {
            console.log(`databases.regions on "data" data.key: ${data.key} data.value: ${JSON.stringify(data.value)}`)
          })
          .on('end', () => {
            console.log(`databases.regions on "end"`)
          })
      }, 2000)
    })
  })


})
