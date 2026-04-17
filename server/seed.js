require('dotenv').config();
const mongoose = require('mongoose');
const AdminUser = require('./models/AdminUser');
const Question = require('./models/Question');

const dummyQuestions = [
  {
    category: 'Entertainment: Film',
    type: 'multiple',
    difficulty: 'easy',
    question: 'Who directed "E.T. the Extra-Terrestrial"?',
    correctAnswer: 'Steven Spielberg',
    incorrectAnswers: ['George Lucas', 'James Cameron', 'Stanley Kubrick']
  },
  {
    category: 'Science: Computers',
    type: 'boolean',
    difficulty: 'easy',
    question: 'Linus Torvalds created Linux and Git.',
    correctAnswer: 'True',
    incorrectAnswers: ['False']
  },
  {
    category: 'General Knowledge',
    type: 'multiple',
    difficulty: 'medium',
    question: 'What is the largest organ of the human body?',
    correctAnswer: 'Skin',
    incorrectAnswers: ['Heart', 'Large Intestine', 'Liver']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB. Formatting data...');

    await AdminUser.deleteMany({});
    await Question.deleteMany({});

    const admin = new AdminUser({
      username: 'admin',
      password: 'password123'
    });
    // the pre-save hook handles bcrypt hashing
    await admin.save();
    console.log('Dummy admin user inserted: admin / password123');

    await Question.insertMany(dummyQuestions);
    console.log('Dummy questions inserted.');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
