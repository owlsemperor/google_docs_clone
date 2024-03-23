// const port = process.env.PORT || 3000
// const dbUrl = process.env.DB_URL
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log(
      `Server is connected from database from port ${process.env.PORT}`
    )
  } catch (error) {
    console.log(error)
  }
}
export default connection
