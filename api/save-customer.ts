// api/save-customer.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // 1. S'assurer que la méthode est POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // 2. Récupérer les données envoyées par le formulaire
    const { name, email } = req.body;

    // 3. Valider les données (très important en production)
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    // 4. Utiliser Prisma pour enregistrer le client dans la base de données
    const newCustomer = await prisma.customer.create({
      data: {
        name: name,
        email: email,
      },
    });

    // 5. Renvoyer une réponse de succès
    return res.status(201).json(newCustomer);

  } catch (error) {
    console.error(error);
    // 6. Gérer les erreurs
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}