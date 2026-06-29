import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhook } from './controllers/webhooks.js'
const app=express()
await connectDB()
app.use(cors())
app.get('/',(req,res)=>res.send("API working"))
app.post('/clerk',express.json(),clerkWebhook)
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`App is running on port http://localhost:${PORT}`)
})