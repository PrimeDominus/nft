const env = require('dotenv')
const config = {}

// Environment Variables
env.config()


config.PORT = process.env.PORT
config.BASE_URL = process.env.BASE_URL
config.API_SECRET_TOKEN = process.env.API_SECRET_TOKEN
config.API_SECRET_KEY = process.env.API_SECRET_KEY
config.NETWORK = process.env.NETWORK
config.IPFS_TOKEN = process.env.IPFS_TOKEN


module.exports = config