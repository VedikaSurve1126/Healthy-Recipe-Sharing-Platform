const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');  // Required to interact with the file system
const app = express();


app.use(bodyParser.urlencoded({ extended: true })); // For handling form submissions (URL-encoded)
app.use(bodyParser.json()); // For handling JSON payloads in requests

const uri = 'mongodb://localhost:27017'; // Connection string to your MongoDB instance
const client = new MongoClient(uri);

// Serve static files (e.g., HTML, CSS, JS) from HomePage, MainPage, and root directory
app.use(express.static(path.join(__dirname, 'HomePage')));
app.use(express.static(path.join(__dirname, 'MainPage')));
app.use(express.static(path.join(__dirname)));

// Ensure the 'uploads' folder exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Connect to MongoDB
async function connectToDb() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('HSRP'); // Use your actual database name
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        throw error;
    }
}

// Serve the homepage at the default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the homepage
});

// Serve the upload page
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'MainPage', 'upload.html'));
});

// Users Collection: Handle Sign-Up
//done
app.post('/signup', async (req, res) => {
    const { fullName, email, password, gender, birthday } = req.body;

    try {
        const db = await connectToDb();
        const usersCollection = db.collection('users');

        const user = { fullName, email, password, gender, birthday };
        await usersCollection.insertOne(user);
        res.send('CONGRATULATIONS!! You have successfully signed up!!');
    } catch (error) {
        console.error('Error storing user data in MongoDB:', error);
        res.status(500).send('Error storing data in MongoDB');
    }
});

// Handling contact form submissions
//done
app.post('/feedback', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const db = await connectToDb();
        const feedbackCollection = db.collection('feedback'); // Use the correct collection

        const feedback = { name, email, message };
        await feedbackCollection.insertOne(feedback); // Use the feedback collection here
        res.send({ message: 'Thank you for your feedback! Your response has been recorded.' }); 
    } catch (error) {
        console.error('Error storing feedback in MongoDB:', error);
        res.status(500).send('Error storing feedback in MongoDB');
    }
});

// Recipe Upload Route
//done
app.post('/addRecipe', async (req, res) => {
    const { recipeName, instructions, cuisine, category} = req.body;
    
    try {
        const db = await connectToDb();
        const recipesCollection = db.collection('recipes'); // Reference to the recipes collection

        const recipe = {recipeName, instructions, cuisine, category};

        await recipesCollection.insertOne(recipe); // Insert the new recipe into the collection
        res.send({ message: 'Recipe uploaded successfully!' }); // Success response
    } catch (error) {
        console.error('Error uploading recipe to MongoDB:', error);
        res.status(500).send('Error uploading recipe to MongoDB');
    }
});

// Recipe Fetch Route
app.get('/api/recipes', async (req, res) => {
    try {
        const db = await connectToDb();
        const recipesCollection = db.collection('recipes');

        const recipes = await recipesCollection.find().toArray(); // Fetch all recipes
        res.json(recipes); // Send the recipes as a JSON response
    } catch (error) {
        console.error('Error fetching recipes from MongoDB:', error);
        res.status(500).send('Error fetching recipes from MongoDB');
    }
});

// Route to fetch a single recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
    const recipeId = req.params.id;

    try {
        const db = await connectToDb();
        const recipesCollection = db.collection('recipes');

        const recipe = await recipesCollection.findOne({ _id: new ObjectId(recipeId) });

        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).send({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.status(500).send({ message: 'Error fetching recipe from MongoDB' });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
