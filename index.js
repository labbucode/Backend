const express = require('express');
const app = express();
const connectDB  = require('./connectDB')
require('dotenv').config();
const authRouter = require('./router/authRouter');
const lisitngsRouter = require('./router/listingsRouter')

const PORT = 5001;


app.use(express.json())
// home page


app.use('/auth',authRouter)
app.use('/listings',lisitngsRouter)
app.get('/',(req,res)=>{
    res.send('Welcome to homepage')
   



})


async function start() {
     await connectDB()
    app.listen(PORT,()=>{
        console.log(`Server running on ${PORT}`);
    })
}
start()
