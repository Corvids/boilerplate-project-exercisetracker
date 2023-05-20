const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const { Schema } = mongoose;

app.use(cors())
app.use(express.json())
mongoose.connect(process.env.DB_URL)

const UserSchema = new Schema ({
  username: String
})
const User = mongoose.model("User", UserSchema)

const ExerciseSchema = new Schema ({
  user_id: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date
});
const Exercise = mongoose.model("Exercise", ExerciseSchema)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {  
  const userObject = new User({
    username: req.body.username
  })

  try {
    const user = await userObject.save()
    console.log('try adding user', user)
    res.json( user )
  } catch(err) {
    console.log(err)
  }

})

app.post('/api/users/:_id/exercises', async (req, res) => {  
  const id = req.params._id
  const { description, duration, date } = req.body

  try {
    const user = await User.findById(id)
    
    if( !user ) {
      res.send("User not found")
    }

    const exerciseObject = new Exercise({
      user_id: id,
      description,
      duration,
      date: date? new Date(date) : new Date()
    })
    const exercise = exerciseObject.save()
    res.json({
      _id: user._id,
      username: user.username,
      description: exercise.description,
      date: new Date(exercise.date).toDateString()
    })

  } catch(err) {
    console.log(err)
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
