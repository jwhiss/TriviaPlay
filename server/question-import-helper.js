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
            "difficulty": "easy",
            "category": "Science: Mathematics",
            "question": "What&#039;s the square root of 49?",
            "correct_answer": "7",
            "incorrect_answers": [
                "4",
                "12",
                "9"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Geography",
            "question": "Which of the following languages does NOT use the Latin alphabet?",
            "correct_answer": "Georgian",
            "incorrect_answers": [
                "Turkish",
                "Swahili",
                "Vietnamese"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Entertainment: Cartoon &amp; Animations",
            "question": "What was the release date of the first episode of &quot;The Powerpuff Girls&quot;?",
            "correct_answer": "November 18, 1998",
            "incorrect_answers": [
                "June 25, 1999",
                "July 28, 2000",
                "April 14, 2001"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Film",
            "question": "In the 2002 film &quot;Kung Pow! Enter the Fist&quot;, why was Wimp Lo purposely trained wrong?",
            "correct_answer": "As a joke",
            "incorrect_answers": [
                "For cheating",
                "Revenge",
                "To test him"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Entertainment: Video Games",
            "question": "The Internet Meme &quot;All your base are belong to us&quot; is based on the poorly translated English Version of which Video Game?",
            "correct_answer": "Zero Wing",
            "incorrect_answers": [
                "F-Zero",
                "Wing Commander",
                "Star Wars: X-Wing"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Comics",
            "question": "What is Hellboy&#039;s true name?",
            "correct_answer": "Anung Un Rama",
            "incorrect_answers": [
                "Right Hand of Doom",
                "Ogdru Jahad",
                "Azzael"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Science: Computers",
            "question": "Lenovo acquired IBM&#039;s personal computer division, including the ThinkPad line of laptops and tablets, in what year?",
            "correct_answer": "2005",
            "incorrect_answers": [
                "1999",
                "2002",
                "2008"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Television",
            "question": "The first half-hour CGI cartoon, ReBoot, aired on which year?",
            "correct_answer": "1994",
            "incorrect_answers": [
                "1993",
                "1998",
                "1999"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Entertainment: Video Games",
            "question": "What was Frank West&#039;s job in &quot;Dead Rising&quot;?",
            "correct_answer": "Photojournalist",
            "incorrect_answers": [
                "Janitor",
                "Chef",
                "Taxi Driver"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Vehicles",
            "question": "What are the cylinder-like parts that pump up and down within the engine?",
            "correct_answer": "Pistons",
            "incorrect_answers": [
                "Leaf Springs",
                "Radiators",
                "ABS"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Film",
            "question": "About how much money did it cost for Tommy Wiseau to make his masterpiece &quot;The Room&quot; (2003)?",
            "correct_answer": "$6 Million",
            "incorrect_answers": [
                "$20,000",
                "$1 Million",
                "$10 Million"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Science &amp; Nature",
            "question": "Alzheimer&#039;s disease primarily affects which part of the human body?",
            "correct_answer": "Brain",
            "incorrect_answers": [
                "Lungs",
                "Skin",
                "Heart"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Entertainment: Video Games",
            "question": "In which mall does &quot;Dead Rising&quot; take place?",
            "correct_answer": "Willamette Parkview Mall",
            "incorrect_answers": [
                "Liberty Mall",
                "Twin Pines Mall",
                "Central Square Shopping Center"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Film",
            "question": "In the Mad Max franchise, what type of car is the Pursuit Special driven by Max?",
            "correct_answer": "Ford Falcon",
            "incorrect_answers": [
                "Holden Monaro",
                "Chrysler Valiant Charger",
                "Pontiac Firebird"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Entertainment: Books",
            "question": "Which of the following is the world&#039;s best-selling book?",
            "correct_answer": "The Lord of the Rings",
            "incorrect_answers": [
                "The Little Prince",
                "Harry Potter and the Philosopher&#039;s Stone",
                "The Da Vinci Code"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Video Games",
            "question": "Which of these features was added in the 1994 game &quot;Heretic&quot; that the original &quot;DOOM&quot; could not add due to limitations?",
            "correct_answer": "Looking up and down",
            "incorrect_answers": [
                "Increased room sizes",
                "Unlimited weapons",
                "Highly-detailed textures"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Entertainment: Music",
            "question": "Whose signature guitar technique is called the &quot;windmill&quot;?",
            "correct_answer": "Pete Townshend",
            "incorrect_answers": [
                "Jimmy Page",
                "Eddie Van Halen",
                "Jimi Hendrix"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Board Games",
            "question": "In what year was the card game Magic: the Gathering first introduced?",
            "correct_answer": "1993",
            "incorrect_answers": [
                "1987",
                "1998",
                "2003"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "What is the most-visited website out of these options?",
            "correct_answer": "Google",
            "incorrect_answers": [
                "YouTube",
                "Facebook",
                "Wikipedia"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Animals",
            "question": "What is the scientific name for the Bald Eagle?",
            "correct_answer": "Haliaeetus Leucocephalus ",
            "incorrect_answers": [
                "Tyto Alba",
                "Cyanocitta Cristata",
                "Aquila Chrysaetos"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Film",
            "question": "What was the name of the protagonist in the movie Commando (1985)?",
            "correct_answer": "John Matrix",
            "incorrect_answers": [
                "Ben Richards",
                "Douglas Quaid",
                "Harry Tasker"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Entertainment: Film",
            "question": "When does &quot;Rogue One: A Star Wars Story&quot; take place chronologically in the series?",
            "correct_answer": "Between Episode 3 and 4",
            "incorrect_answers": [
                "After Episode 6",
                "Before Episode 1",
                "Between Episode 4 and 5"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Geography",
            "question": "Which is the world&#039;s longest river?",
            "correct_answer": "Nile",
            "incorrect_answers": [
                "Missouri",
                "Amazon",
                "Yangtze"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Geography",
            "question": "What city  has the busiest airport in the world?",
            "correct_answer": "Atlanta, Georgia USA",
            "incorrect_answers": [
                "London, England",
                "Chicago,Illinois ISA",
                "Tokyo,Japan"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Science: Computers",
            "question": "What kind of memory is used on memory cache?",
            "correct_answer": "SRAM",
            "incorrect_answers": [
                "DRAM",
                "ROM",
                "Flash"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Music",
            "question": "Which album by American rapper Kanye West contained songs such as &quot;Love Lockdown&quot;, &quot;Paranoid&quot; and &quot;Heartless&quot;?",
            "correct_answer": "808s &amp; Heartbreak",
            "incorrect_answers": [
                "Late Registration",
                "The Life of Pablo",
                "Graduation"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Sports",
            "question": "What team did England beat in the semi-final stage to win in the 1966 World Cup final?",
            "correct_answer": "Portugal",
            "incorrect_answers": [
                "West Germany",
                "Soviet Union",
                "Brazil"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Geography",
            "question": "Which of the following European languages is classified as a &quot;language isolate?&quot;",
            "correct_answer": "Basque",
            "incorrect_answers": [
                "Galician",
                "Maltese",
                "Hungarian"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Entertainment: Film",
            "question": "Which sci-fi cult films plot concerns aliens attempting to prevent humans from creating a doomsday weapon?",
            "correct_answer": "Plan 9 from Outer Space",
            "incorrect_answers": [
                "The Man from Planet X",
                "It Came from Outer Space",
                "The Day The Earth Stood Still"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Japanese Anime &amp; Manga",
            "question": "In the &quot;Sailor Moon&quot; series, what is Sailor Jupiter&#039;s civilian name?",
            "correct_answer": "Makoto Kino",
            "incorrect_answers": [
                "Minako Aino",
                "Usagi Tsukino",
                "Rei Hino"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "History",
            "question": "Who discovered Penicillin?",
            "correct_answer": "Alexander Flemming",
            "incorrect_answers": [
                "Marie Curie",
                "Alfred Nobel",
                "Louis Pasteur"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Video Games",
            "question": "This weapon in Counter-Strike: Global Offensive does not exist in real life.",
            "correct_answer": "M4A4",
            "incorrect_answers": [
                "AWP",
                "M4A1",
                "MP9"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "History",
            "question": "What year did World War II end?",
            "correct_answer": "1945",
            "incorrect_answers": [
                "1943",
                "1947",
                "1950"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Science: Computers",
            "question": "Which RAID array type is associated with data mirroring?",
            "correct_answer": "RAID 1",
            "incorrect_answers": [
                "RAID 0",
                "RAID 10",
                "RAID 5"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Entertainment: Video Games",
            "question": "What is Gabe Newell&#039;s favorite class in Team Fortress 2?",
            "correct_answer": "Spy",
            "incorrect_answers": [
                "Heavy",
                "Medic",
                "Pyro"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Entertainment: Music",
            "question": "In 2006, which band released their debut album &quot;A Fever You Can&#039;t Sweat Out&quot;?",
            "correct_answer": "Panic! At the Disco",
            "incorrect_answers": [
                "Twenty One Pilots",
                "My Chemical Romance",
                "Fall Out Boy"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Video Games",
            "question": "What character is NOT apart of the Grand Theft Auto series?",
            "correct_answer": "Michael Cardenas",
            "incorrect_answers": [
                "Packie McReary",
                "Tommy Vercetti",
                "Lester Crest"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Science &amp; Nature",
            "question": "Which of the following is the male pollen-producing reproductive part of a flower?",
            "correct_answer": "Stamen",
            "incorrect_answers": [
                "Sepal",
                "Pistil",
                "Petal"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Entertainment: Music",
            "question": "When did the rapper Eazy-E die?",
            "correct_answer": "March 26, 1995",
            "incorrect_answers": [
                "July 11, 1992",
                "February 14, 1993",
                "October 21, 1994"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Science: Mathematics",
            "question": "What is the equation for the area of a sphere?",
            "correct_answer": "(4/3)&pi;r^3",
            "incorrect_answers": [
                "4&pi;r^2",
                "(1/3)&pi;hr^2",
                "&pi;r^4"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Geography",
            "question": "Which of these cities is NOT in England?",
            "correct_answer": "Edinburgh",
            "incorrect_answers": [
                "Oxford",
                "Manchester",
                "Southampton"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "General Knowledge",
            "question": "The lesser-known continuation of the saying &quot;Curiosity killed the cat...&quot; is:",
            "correct_answer": "&quot;...but satisfaction brought it back.&quot;",
            "incorrect_answers": [
                "&quot;...and the silent mouse remained thereat.&quot;",
                "&quot;...which taught it not to do that.&quot;",
                "&quot;...but death by the truth is better than ignorance.&quot;"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Video Games",
            "question": "In the Jackbox party game Monster Seeking Monster, which monster can steal two hearts from other monsters under certain conditions?",
            "correct_answer": "Serial Killer",
            "incorrect_answers": [
                "Parasite",
                "Stalker",
                "Magic Mirror"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "medium",
            "category": "Entertainment: Video Games",
            "question": "What is the final game of the &quot;Zero Escape&quot; series called?",
            "correct_answer": "Zero Escape Zero Time Dilemma ",
            "incorrect_answers": [
                "Nine Hours, Nine Persons, Nine Doors ",
                "Zero Escape Virtue&#039;s Last Reward",
                "The Nonary Game: Sigma&#039;s Last Life"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Entertainment: Cartoon &amp; Animations",
            "question": "In the TV show &quot;Rick and Morty&quot;, Rick uses the catchphrase &quot;Wubba Lubba Dub Dub&quot;, which means what in Birdperson?",
            "correct_answer": "I am in great pain, please help me.",
            "incorrect_answers": [
                "I pray that my life ends soon.",
                "Lets get this party started!",
                "I am suffering, please help me."
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "History",
            "question": "After the 1516 Battle of Marj Dabiq, the Ottoman Empire took control of Jerusalem from which sultanate?",
            "correct_answer": "Mamluk",
            "incorrect_answers": [
                "Ayyubid",
                "Ummayyad",
                "Seljuq"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Entertainment: Television",
            "question": "In &quot;Star Trek&quot;, what sauce is commonly used by Klingons on bregit lung?",
            "correct_answer": "Grapok sauce",
            "incorrect_answers": [
                "Gazorpazorp pudding",
                "Sweet chili sauce",
                "Grapork sauce"
            ]
        },
        {
            "type": "multiple",
            "difficulty": "hard",
            "category": "Entertainment: Video Games",
            "question": "Which artist composed the original soundtrack for &quot;Watch Dogs 2&quot;?",
            "correct_answer": "Hudson Mohawke",
            "incorrect_answers": [
                "Rustie",
                "Machinedrum",
                "Flying Lotus"
            ]
        }
    ]
}
importQuestions(otdResponse);