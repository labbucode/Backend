const express = require('express');
const app = express();
const connectDB  = require('./connectDB')
require('dotenv').config();
const authRouter = require('./router/authRouter');
const lisitngsRouter = require('./router/listingsRouter')
const cors = require('cors')
const PORT = 5001;
const verifyJWT = require('./middleware/verifyJwt');

app.use(cors({
    origin:['http://localhost:3000', 'http://localhost:5173','http://techprime-1f4c71nxi-labbucode.vercel.app','https://techprime-eight.vercel.app']
}))


app.use(express.json())
app.get('/',(req,res)=>{
    res.send('Welcome to homepage')
   
})
app.use('/auth',authRouter)
app.use(verifyJWT);
app.use('/listings',lisitngsRouter)

async function start() {
     await connectDB()
    app.listen(PORT,()=>{
        console.log(`Server running on ${PORT}`);
    })
}
start()
