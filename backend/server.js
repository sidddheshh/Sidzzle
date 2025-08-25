// Import packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // for .env file

const app = express();
app.use(cors()); // allow requests from frontend  
app.use(express.json()); // parse JSON data

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// MongoDB schema
const questionSchema = new mongoose.Schema({
  id: Number,
  question: String,
  hints: [String],
  answer: String,
  relatedArticle: {
    title: String,
    url: String
  }
});

const Question = mongoose.model('Question', questionSchema, 'questions');

const today = new Date();
const todaysDate = today.getDate();


// API route — get today's question (example: ID = 1)
app.get('/api/question/today', async (req, res) => {
  try {
    
    // print here
    console.log("API called..")
    console.log('Todays date : '+ todaysDate);
    
    const question = await Question.findOne({ id: todaysDate }); // Our original query
    console.log("Todays Question:", question); // print here

    res.json(question);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
