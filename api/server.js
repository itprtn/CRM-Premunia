      // server.jsconst express = require('express');const fs = "fs"; // Correction: importer 'fs' correctementconst path = require('path');const { PrismaClient } = require('@prisma/client'); // Assurez-vous que c'est le bon cheminconst cors = require('cors'); // Pour gérer les requêtes cross-origin pendant le dev si besoinconst app = express();const port = process.env.PORT || 3001; // Port pour l'API backend
app.use(cors()); // Activez CORS si votre frontend et backend sont sur des ports/domaines différentsapp.use(express.json()); // Pour parser les corps de requête JSONconst prisma = new PrismaClient(); // Initialiser Prisma Client// Montez vos routes API dynamiquementconst apiDir = path.join(__dirname, 'api');

fs.readdirSync(apiDir).forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.ts')) { // Ajustez si vous compilez TS en JSconst routeName = file.replace(/\.(js|ts)$/, '');
        const routePath = `/api/${routeName}`;
        try {
            const handlerModule = require(path.join(apiDir, file));
            if (handlerModule && typeof handlerModule.default === 'function') {
                console.log(`Montage de la route: ${routePath}`);
                app.all(routePath, async (req, res) => {
                    // Passer prisma au handler si nécessaire (ou l'importer directement dans les handlers)// req.prisma = prisma; // Exemple pour passer prismatry {
                        await handlerModule.default(req, res);
                    } catch (error) {
                        console.error(`Erreur dans le handler pour ${routePath}:`, error);
                        res.status(500).json({ error: 'Erreur interne du serveur' });
                    }                });            } else {
                console.warn(`Impossible de monter le handler pour ${file}: pas d'export par défaut ou pas une fonction.`);
            }        } catch (error) {
            console.error(`Erreur lors du chargement du module ${file}:`, error);
        }
    }
});

// Route de test simple
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'API en bonne santé' });
});


app.listen(port, () => {
    console.log(`Serveur API backend écoutant sur http://localhost:${port}`);
});
