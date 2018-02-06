const { send } = require('micro')
const url = require('url')
const level = require('level')
const promisify = require('then-levelup')
const db = promisify(level('visits', { valueEncoding: 'json' }))


module.exports = async (req, res) => {
  // Your microservice here
  let currentVisits = 0
  const { href, pathname } = url.parse(req.url)

  try {
    currentVisits = await db.get(pathname) + 1
    await db.put(pathname, currentVisits)
  } catch (error) {
    if (error.notFound) {
      currentVisits = 1
      await db.put(pathname, currentVisits)
    } 

  }


  send(res, 200, `This page ${href} has ${currentVisits} visits!`)
}