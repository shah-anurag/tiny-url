const express = require('express')
const app = express()
const users = require('./routes/user_routes')
const mongoose = require('mongoose')
const port = 3002

app.use(express.json())
app.use('/user', users)

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(
    'mongodb://127.0.0.1:27017/tinyurl',
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => {
      console.log('Connected to tinyurl db!');
    }
)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})