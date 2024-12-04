import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20122004',
    database: 'eventude'
});
console.log('Connecté à la base de données.');

// POST REGISTER
app.post('/register', async (req, res) => {
    const { username, email, password, userType } = req.body;

    if (!username || !email || !password || !userType) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const query = 'INSERT INTO users (username, email, password, user_type) VALUES (?, ?, ?, ?)';
    try {
        await db.execute(query, [username, email, password, userType]);
        res.status(201).json({ message: 'Utilisateur inscrit avec succès.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'Cet utilisateur ou cet email existe déjà.' });
        } else {
            console.error(err);
            res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
    }
});

// POST LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    try {
        const [results] = await db.execute(query, [email, password]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const user = results[0];
        res.status(200).json({ username: user.username, userType: user.user_type });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});



app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
