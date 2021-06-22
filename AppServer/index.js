const express = require('express')
const app = express()
const apis = require('./routes/api/url_routes')
const users = require('./routes/api/user_routes')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const PORT = 3000;

app.use(bodyParser.json())
app.use('/api', apis)
app.use('/user', users)

// Some fixes to remove WARN messages because of how mongoose works
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

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})