const pad = require('string.prototype.padstart')
const Secondary = require('level-secondary')
const sublevel = require('level-sublevel')
const bytewise = require('bytewise')
const level = require('level')


const name = './db-9-level-secondary'

var operations = [
  // body length = 11
  { type: 'put', key: 'a-key', value: { id: '1337', title: 'hello world', body: 'lorem ipsum' } },
  // body length = 9
  { type: 'put', key: 'another-key', value: { id: '1974', title: 'another world', body: 'dolor sit' } },
  // body length = 9
  { type: 'put', key: 'same-length-key', value: { id: '1983', title: 'same world', body: 'cosix fed' } },
  // body length = 4
  { type: 'put', key: 'last-key', value: { id: '2014', title: 'last world', body: 'amet' } }
]

/*
  REMOVE THE PREVIOUS DB (from package `leveldown` but exposed by `level`)
  leveldown.destroy(location, callback)
  https://github.com/Level/levelup#leveldowndestroylocation-callback
*/
level.destroy(name, () => {

  // create the db (notice: secondary requires a sublevel wrapped db)
  let db = sublevel(level(name, { valueEncoding: 'json' }))

  var posts = db.sublevel('posts')

  // add a title index
  posts.byTitle = Secondary(posts, 'title')

  // add a length index
  // append the post.id for unique indexes with possibly overlapping values
  // notice: if you don't add `'!' + post.id`, only the first 9 post length will be returned !
  // ok: it starts to be a little complicated if you don't care too much about db and don't want
  // to take too much time on it...
  posts.byLength = Secondary(posts, 'length', (post) => {
    var encoded = bytewise.encode(post.body.length)
    console.log(`length ${post.body.length} is encoded to: ${encoded}`)
      // try to uncomment the test line below
      // return encoded
    return encoded + '!' + post.id
  })

  posts.batch(operations, (err) => {
    if (err) return console.log(`posts.batch error: ${err}`)
    console.log(`posts.batch(operations) done`)

    /*
      GET THE VALUE THAT HAS BEEN INDEXED WITH `key`
      Secondary#get(key, opts[, cb])
      https://github.com/juliangruber/level-secondary#secondarygetkey-opts-cb
    */
    posts.byTitle.get('another world', (err, value) => {
      if (err) return console.log(`posts.byTitle.get error: ${err}`)
      console.log(`db.get('another world') done value: ${JSON.stringify(value)}`)

      posts.byTitle.get('wrong-title', (err, value) => {
        // log the error...
        if (err) console.log(`posts.byTitle.get('wrong-title') error: ${err}`)
          // ...and continue the demo

        // get all the post with body length >= 7
        posts.byLength.createReadStream({
          gte: bytewise.encode(7),
          // lte: bytewise.encode(10)
        }).on('data', (data) => {
          console.log(`on "data" data.key: ${data.key} data.value: ${JSON.stringify(data.value)}`)
        })
      })
    })
  })
})
