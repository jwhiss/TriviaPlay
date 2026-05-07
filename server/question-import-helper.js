const mongoose = require('mongoose');
const Question = require('./models/Question'); // Path to your model file
const entities = require('html-entities');

async function importQuestions(otdData) {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/triviaplay');
        console.log("Connected to MongoDB...");
        // 1. Access the 'results' array from the OTD response
        const rawQuestions = otdData.results;

        // 2. Map the OTD format to your Schema format
        const formattedQuestions = rawQuestions.map(q => ({
            category: q.category,
            type: q.type,
            difficulty: q.difficulty,
            question: entities.decode(q.question),
            correctAnswer: entities.decode(q.correct_answer), // Mapping snake_case to camelCase
            incorrectAnswers: q.incorrect_answers.map(ans => entities.decode(ans))
        }));

        // 3. Bulk insert into MongoDB
        const docs = await Question.insertMany(formattedQuestions);

        console.log(`${docs.length} questions were successfully imported!`);
    } catch (error) {
        console.error("Error importing questions:", error);
    }
}

const otdResponse = {
    "response_code": 0,
    "results": [
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "Earl Grey tea is black tea flavoured with what?",
            "correct_answer": "Bergamot oil",
            "incorrect_answers": [
                "Lavender",
                "Vanilla",
                "Honey"
            ]
        },
        {
            "type": "boolean",
            "difficulty": "hard",
            "category": "General Knowledge",
            "question": "&quot;Number 16 Bus Shelter&quot; was a child&#039;s name that was approved by the New Zealand government.",
            "correct_answer": "True",
            "incorrect_answers": [
                "False"
            ]
        },
        {
            "type": "boolean",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Dihydrogen Monoxide was banned due to health risks after being discovered in 1983 inside swimming pools and drinking water.",
            "correct_answer": "False",
            "incorrect_answers": [
                "True"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Which canal connects the Mediterranean Sea with the Red Sea?",
            "correct_answer": "Suez Canal",
            "incorrect_answers": [
                "Panama Canal",
                "Sinai Canal",
                "Qaraqum Canal"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "How many cards are there in a standard deck of playing cards?",
            "correct_answer": "52",
            "incorrect_answers": [
                "32",
                "40",
                "64"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Trypophobia is the fear of ",
            "correct_answer": "groups of holes",
            "incorrect_answers": [
                "swimming in deep water",
                "public speaking",
                "eating too much"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "When did the website &quot;Facebook&quot; launch?",
            "correct_answer": "2004",
            "incorrect_answers": [
                "2005",
                "2003",
                "2006"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "In which year did Ghana gain independence?",
            "correct_answer": "1957",
            "incorrect_answers": [
                "1947",
                "1960",
                "1958"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "What do sailors call the front of a boat?",
            "correct_answer": "Bow",
            "incorrect_answers": [
                "Stern",
                "Port",
                "Starboard"
            ]
        },
        {
            "type": "boolean",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "The color orange is named after the fruit.",
            "correct_answer": "True",
            "incorrect_answers": [
                "False"
            ]
        },
        {
            "type": "boolean",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "&quot;Typewriter&quot; is the longest word that can be typed using only the first row on a QWERTY keyboard.",
            "correct_answer": "False",
            "incorrect_answers": [
                "True"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "In past times, what would a gentleman keep in his fob pocket?",
            "correct_answer": "Watch",
            "incorrect_answers": [
                "Money",
                "Keys",
                "Notebook"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "The Mexican Beer &quot;Corona&quot; is what type of beer?",
            "correct_answer": "Pale Lager",
            "incorrect_answers": [
                "India Pale Ale",
                "Pilfsner",
                "Baltic Porter"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "The phrase &quot;accident waiting to happen&quot; is an example of what type of figure of speech?",
            "correct_answer": "Idiom",
            "incorrect_answers": [
                "Simile",
                "Metaphor",
                "Analogy"
            ]
        },
        {
            "type": "boolean",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "A scientific study on peanuts in bars found traces of over 100 unique specimens of urine.",
            "correct_answer": "False",
            "incorrect_answers": [
                "True"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "Where does water from Poland Spring water bottles come from?",
            "correct_answer": "Maine, United States",
            "incorrect_answers": [
                "Hesse, Germany",
                "Masovia, Poland",
                "Bavaria, Poland"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Which country has the Union Jack in its flag?",
            "correct_answer": "New Zealand",
            "incorrect_answers": [
                "South Africa",
                "Canada",
                "Hong Kong"
            ]
        },
        {
            "type": "boolean",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "The French word for &quot;glass&quot; is &quot;glace&quot;.",
            "correct_answer": "False",
            "incorrect_answers": [
                "True"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "This field is sometimes known as &ldquo;The Dismal Science.&rdquo;",
            "correct_answer": "Economics",
            "incorrect_answers": [
                "Philosophy",
                "Politics",
                "Physics"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Who is the author of Jurassic Park?",
            "correct_answer": "Michael Crichton",
            "incorrect_answers": [
                "Peter Benchley",
                "Chuck Paluhniuk",
                "Irvine Welsh"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "Which iconic Disneyland attraction was closed in 2017 to be remodeled as a &quot;Guardians of the Galaxy&quot; themed ride?",
            "correct_answer": "Twilight Zone Tower of Terror",
            "incorrect_answers": [
                "The Haunted Mansion",
                "Pirates of the Caribbean",
                "Peter Pan&#039;s Flight"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "What was the first ever London Underground line to be built?",
            "correct_answer": "Metropolitan Line",
            "incorrect_answers": [
                "Circle Line",
                "Bakerloo Line",
                "Victoria Line"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "How would one say goodbye in Spanish?",
            "correct_answer": "Adi&oacute;s",
            "incorrect_answers": [
                " Hola",
                "Au Revoir",
                "Salir"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "General Knowledge",
            "question": "How many notes are there on a standard grand piano?",
            "correct_answer": "88",
            "incorrect_answers": [
                "98",
                "108",
                "78"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "Which month is Black History Month in the US?",
            "correct_answer": "February",
            "incorrect_answers": [
                "May",
                "November",
                "August"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "What is the Italian word for &quot;tomato&quot;?",
            "correct_answer": "Pomodoro",
            "incorrect_answers": [
                "Aglio",
                "Cipolla",
                "Peperoncino"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "&quot;A3&quot;, &quot;B1&quot;, and &quot;Legal&quot; are typical names of sizes for what object?",
            "correct_answer": "Paper",
            "incorrect_answers": [
                "Airplanes",
                "Law books",
                "Phone screens"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "What country does sushi &amp; karaoke come from?",
            "correct_answer": "Japan",
            "incorrect_answers": [
                "China",
                "South Korea",
                "Vietnam"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Who was the 1st President of Mexico?",
            "correct_answer": "Guadalupe Victoria",
            "incorrect_answers": [
                "Benito Ju&aacute;rez",
                "Miguel Hidalgo Y Costilla",
                "Vicente Guerrero"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "General Knowledge",
            "question": "Which of these anatomical terms refers to the tail end of the creature?",
            "correct_answer": "Caudal",
            "incorrect_answers": [
                "Ventral",
                "Proximal",
                "Coronal"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "General Knowledge",
            "question": "Which of these cities does NOT have a United States Minting location?",
            "correct_answer": "St. Louis, MO",
            "incorrect_answers": [
                "San Fransisco, CA",
                "Philidelphia, PA",
                "West Point, NY"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "Amsterdam Centraal station is twinned with what station?",
            "correct_answer": "London Liverpool Street",
            "incorrect_answers": [
                "Frankfurt (Main) Hauptbahnhof",
                "Paris Gare du Nord",
                "Brussels Midi"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "What does the &quot;G&quot; mean in &quot;G-Man&quot;?",
            "correct_answer": "Government",
            "incorrect_answers": [
                "Going",
                "Ghost",
                "Geronimo"
            ]
        },
        {
            "type": "boolean",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Pluto is a planet.",
            "correct_answer": "False",
            "incorrect_answers": [
                "True"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "What is the average life span of a garden ant?",
            "correct_answer": "15 years",
            "incorrect_answers": [
                "24 hours",
                "1 week",
                "3 years"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Where is the train station &quot;Llanfair&shy;pwllgwyngyll&shy;gogery&shy;chwyrn&shy;drobwll&shy;llan&shy;tysilio&shy;gogo&shy;goch&quot;?",
            "correct_answer": "Wales",
            "incorrect_answers": [
                "Moldova",
                "Czech Republic",
                "Denmark"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "Which of the following buildings is example of a structure primarily built in the Art Deco architectural style?",
            "correct_answer": "Niagara Mohawk Building",
            "incorrect_answers": [
                "Taipei 101",
                "One Detroit Center",
                "Westendstrasse 1"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "The &ldquo;fairy&rdquo; type made it&rsquo;s debut in which generation of the Pokemon core series games?",
            "correct_answer": "6th",
            "incorrect_answers": [
                "2nd",
                "7th",
                "4th"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "Which language is NOT Indo-European?",
            "correct_answer": "Hungarian",
            "incorrect_answers": [
                "Russian",
                "Greek",
                "Latvian"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "What year was Walt Disney born?",
            "correct_answer": "1901",
            "incorrect_answers": [
                "1902",
                "1903",
                "1900"
            ]
        },
        {
            "type": "boolean",
            "difficulty": "hard",
            "category": "General Knowledge",
            "question": "This is the correct spelling of &quot;Supercalifragilisticexpialidocious&quot;.",
            "correct_answer": "True",
            "incorrect_answers": [
                "False"
            ]
        },
        {
            "type": "boolean",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Nutella is produced by the German company Ferrero.",
            "correct_answer": "False",
            "incorrect_answers": [
                "True"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Which American-owned brewery led the country in sales by volume in 2015?",
            "correct_answer": "D. G. Yuengling and Son, Inc",
            "incorrect_answers": [
                "Anheuser Busch",
                "Boston Beer Company",
                "Miller Coors"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "If you are traveling at a speed of 80 mph, how long will it take you to drive 80 miles?",
            "correct_answer": "60 minutes",
            "incorrect_answers": [
                "90 minutes",
                "30 minutes",
                "50 minutes"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Red Vines is a brand of what type of candy?",
            "correct_answer": "Licorice",
            "incorrect_answers": [
                "Lollipop",
                "Chocolate",
                "Bubblegum"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "On a dartboard, what number is directly opposite No. 1?",
            "correct_answer": "19",
            "incorrect_answers": [
                "20",
                "12",
                "15"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "Which of the following card games revolves around numbers and basic math?",
            "correct_answer": "Uno",
            "incorrect_answers": [
                "Go Fish",
                "Twister",
                "Munchkin"
            ]
        },
        {
            "type": "boolean",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "A pasodoble is a type of Italian pasta sauce.",
            "correct_answer": "False",
            "incorrect_answers": [
                "True"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "General Knowledge",
            "question": "When was the Playstation 3 released?",
            "correct_answer": "November 11, 2006",
            "incorrect_answers": [
                "January 8, 2007",
                "December 25, 2007",
                "July 16, 2006"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "What name represents the letter &quot;M&quot; in the NATO phonetic alphabet?",
            "correct_answer": "Mike",
            "incorrect_answers": [
                "Matthew",
                "Mark",
                "Max"
            ]
        }
    ]
}
importQuestions(otdResponse);