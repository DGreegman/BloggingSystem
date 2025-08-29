import express from 'express'
import { configDotenv } from 'dotenv'
import { connectDB } from './config/db.config.js'
import globalError from './errors/global.error.js'
import CustomError from './errors/custom.error.js'
import router from './routes/index.js'

configDotenv()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/v1', router)


app.use((req, res, next)=>{
    next(new CustomError(`Route ${req.originalUrl} not found`, 404));
})

app.use(globalError)

const port = process.env.PORT || 8000
if(process.env.NODE_ENV !== 'production'){
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
        connectDB()
    })
}