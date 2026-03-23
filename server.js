const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // On importe le fichier JSON créé à l'étape 1

const app = express();
const PORT = 3000;

app.use(express.json());

// Affiche la documentation sur /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Tes données (Inchangées)
let articles = [
    {
        id: 1,
        titre: "Introduction au web",
        auteur: "Charles",
        date: "2026-03-18",
        categorie: "Technologie"
    }
];

// Tes routes (Nettoyées des commentaires Swagger qui bloquaient)
app.get('/api/articles', (req, res) => {
    res.status(200).json(articles);
});

app.get('/api/articles/date/:date', (req, res) => {
    const results = articles.filter(a => a.date === req.params.date);
    res.status(200).json(results);
});

// Route de création (Inchangée)
app.post('/api/articles', (req, res) => {
    const { titre, auteur } = req.body;
    if (!titre || !auteur) {
        return res.status(400).json({ message: "Le titre et l'auteur sont obligatoires" });
    }
    const nouvelArticle = {
        id: articles.length + 1,
        ...req.body,
        date: new Date().toISOString().split('T')[0]
    };
    articles.push(nouvelArticle);
    res.status(201).json(nouvelArticle);
});
// Route pour supprimer un article
app.delete('/api/articles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    articles = articles.filter(a => a.id !== id);
    res.json({ message: "Article supprimé avec succès" });
});
app.get('/api/articles/recherche/:query', (req, res) => {
    const recherche = req.params.query.toLowerCase();
    const resultats = articles.filter(a => 
        a.titre.toLowerCase().includes(recherche)
    );
    res.status(200).json(resultats);
});
app.get('/api/articles/:id', (req, res) => {
    const idParam = parseInt(req.params.id);
    const article = articles.find(a => a.id === idParam);
    if (!article) {
        return res.status(404).json({ message: "Désolé, cet article n'existe pas." });
    }
    res.status(200).json(article);
});
app.listen(PORT, () => {
    console.log(`Serveur prêt sur http://localhost:${PORT}`);
    console.log(`Documentation : http://localhost:${PORT}/api-docs`);
});