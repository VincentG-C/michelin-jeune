import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

type SeedRestaurant = {
  id: number
  name: string
  michelinType: string
  isEco: boolean
}

async function main() {
  console.log('🌱 Seeding database...')

  const restaurants = await prisma.restaurant.createMany({
    data: [
      {
        name: "L'Ambroisie",
        address: "9 Place des Vosges, 75004 Paris",
        lat: 48.8554,
        lng: 2.3654,
        michelinType: "etoile_3",
        stars: 3,
        budget: "high",
        cuisine: "Française classique",
        ambiance: "Élégant et intime",
        photoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        description: "Temple de la haute gastronomie française dans un cadre historique Place des Vosges.",
        isEco: false,
        isHiddenGem: false,
        isVisual: true,
      },
      {
        name: "Le Cinq",
        address: "31 Avenue George V, 75008 Paris",
        lat: 48.8688,
        lng: 2.3010,
        michelinType: "etoile_3",
        stars: 3,
        budget: "high",
        cuisine: "Française moderne",
        ambiance: "Luxueux et raffiné",
        photoUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=800",
        description: "Restaurant gastronomique du Four Seasons Hotel George V, une expérience culinaire d'exception.",
        isEco: false,
        isHiddenGem: false,
        isVisual: true,
      },
      {
        name: "Arpège",
        address: "84 Rue de Varenne, 75007 Paris",
        lat: 48.8560,
        lng: 2.3160,
        michelinType: "etoile_3",
        stars: 3,
        budget: "high",
        cuisine: "Légumes et créativité",
        ambiance: "Épuré et artistique",
        photoUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        description: "Alain Passard sublime les légumes dans ce temple végétal trois étoiles.",
        isEco: true,
        isHiddenGem: false,
        isVisual: true,
      },
      {
        name: "Le Clarence",
        address: "31 Avenue Franklin D. Roosevelt, 75008 Paris",
        lat: 48.8698,
        lng: 2.3090,
        michelinType: "etoile_2",
        stars: 2,
        budget: "high",
        cuisine: "Française gastronomique",
        ambiance: "Hôtel particulier majestueux",
        photoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        description: "Dans un hôtel particulier du 19e siècle, Christophe Pelé propose une cuisine d'auteur remarquable.",
        isEco: false,
        isHiddenGem: false,
        isVisual: true,
      },
      {
        name: "Table by Bruno Verjus",
        address: "7 Rue de Prague, 75012 Paris",
        lat: 48.8490,
        lng: 2.3775,
        michelinType: "etoile_2",
        stars: 2,
        budget: "high",
        cuisine: "Produits d'exception",
        ambiance: "Convivial et authentique",
        photoUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
        description: "Bruno Verjus, ancien blogueur devenu chef étoilé, célèbre le produit brut.",
        isEco: true,
        isHiddenGem: true,
        isVisual: false,
      },
      {
        name: "Comice",
        address: "31 Avenue de Versailles, 75016 Paris",
        lat: 48.8440,
        lng: 2.2750,
        michelinType: "etoile_1",
        stars: 1,
        budget: "high",
        cuisine: "Franco-canadienne",
        ambiance: "Moderne et chaleureux",
        photoUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
        description: "Noam Gedalof propose une cuisine inventive mêlant influences françaises et canadiennes.",
        isEco: false,
        isHiddenGem: true,
        isVisual: true,
      },
      {
        name: "Accents Table Bourse",
        address: "24 Rue Feydeau, 75002 Paris",
        lat: 48.8696,
        lng: 2.3396,
        michelinType: "etoile_1",
        stars: 1,
        budget: "medium",
        cuisine: "Française contemporaine",
        ambiance: "Décontracté chic",
        photoUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800",
        description: "Romain Mahi signe une cuisine généreuse avec des accents du Sud-Ouest.",
        isEco: false,
        isHiddenGem: true,
        isVisual: false,
      },
      {
        name: "Alliance",
        address: "5 Rue de Poissy, 75005 Paris",
        lat: 48.8500,
        lng: 2.3512,
        michelinType: "etoile_1",
        stars: 1,
        budget: "medium",
        cuisine: "Franco-japonaise",
        ambiance: "Minimaliste et zen",
        photoUrl: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800",
        description: "Toshitaka Omiya fusionne techniques japonaises et produits français avec brio.",
        isEco: true,
        isHiddenGem: true,
        isVisual: true,
      },

      {
        name: "Le Bistrot des Fables",
        address: "29 Rue Cler, 75007 Paris",
        lat: 48.8572,
        lng: 2.3046,
        michelinType: "bib",
        stars: 0,
        budget: "low",
        cuisine: "Bistrot français",
        ambiance: "Familial et convivial",
        photoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        description: "Bistrot de quartier généreux avec des plats canailles à prix doux.",
        isEco: false,
        isHiddenGem: true,
        isVisual: false,
      },
      {
        name: "La Table de Mee",
        address: "41 Rue du Temple, 75004 Paris",
        lat: 48.8588,
        lng: 2.3540,
        michelinType: "bib",
        stars: 0,
        budget: "medium",
        cuisine: "Française moderne",
        ambiance: "Cour intérieure romantique",
        photoUrl: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800",
        description: "Mauro Colagreco signe la carte de ce lieu magnifique dans le Marais.",
        isEco: false,
        isHiddenGem: false,
        isVisual: true,
      },
      {
        name: "La Cloche d'Or",
        address: "92 Rue du Faubourg Poissonnière, 75010 Paris",
        lat: 48.8765,
        lng: 2.3492,
        michelinType: "bib",
        stars: 0,
        budget: "low",
        cuisine: "Franco-japonaise",
        ambiance: "Comptoir intime",
        photoUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800",
        description: "Minuscule comptoir japonais où Katsuaki Okiyama régale avec un menu unique.",
        isEco: true,
        isHiddenGem: true,
        isVisual: false,
      },
      {
        name: "Le Cadoret",
        address: "1 Rue Pradier, 75019 Paris",
        lat: 48.8820,
        lng: 2.3830,
        michelinType: "bib",
        stars: 0,
        budget: "low",
        cuisine: "Néo-bistrot",
        ambiance: "Populaire et vivant",
        photoUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
        description: "Néo-bistrot emblématique de Belleville, cuisine de saison et vins nature.",
        isEco: true,
        isHiddenGem: true,
        isVisual: false,
      },
      {
        name: "Chez Casimir",
        address: "6 Rue de Belzunce, 75010 Paris",
        lat: 48.8790,
        lng: 2.3538,
        michelinType: "bib",
        stars: 0,
        budget: "low",
        cuisine: "Bistrot traditionnel",
        ambiance: "Authentique et bruyant",
        photoUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
        description: "Institution du 10e, buffet d'entrées légendaire et plats réconfortants.",
        isEco: false,
        isHiddenGem: false,
        isVisual: false,
      },

      {
        name: "Le Meurice",
        address: "228 Rue de Rivoli, 75001 Paris",
        lat: 48.8651,
        lng: 2.3281,
        michelinType: "hotel",
        stars: 5,
        budget: "high",
        cuisine: "Française gastronomique",
        ambiance: "Palace historique",
        photoUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        description: "Palace mythique face aux Tuileries, restaurant gastronomique par Alain Ducasse.",
        isEco: false,
        isHiddenGem: false,
        isVisual: true,
      },
      {
        name: "Hôtel Plaza Athénée",
        address: "25 Avenue Montaigne, 75008 Paris",
        lat: 48.8660,
        lng: 2.3037,
        michelinType: "hotel",
        stars: 5,
        budget: "high",
        cuisine: "Naturalité",
        ambiance: "Glamour parisien",
        photoUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        description: "L'adresse iconique de l'avenue Montaigne, terrasse rouge légendaire.",
        isEco: true,
        isHiddenGem: false,
        isVisual: true,
      },
      {
        name: "Hôtel Brach",
        address: "1-7 Rue Jean Richepin, 75016 Paris",
        lat: 48.8630,
        lng: 2.2720,
        michelinType: "hotel",
        stars: 5,
        budget: "high",
        cuisine: "Méditerranéenne",
        ambiance: "Design contemporain",
        photoUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        description: "Hôtel design signé Philippe Starck, rooftop avec vue sur tout Paris.",
        isEco: true,
        isHiddenGem: true,
        isVisual: true,
      },
    ],
  })
  console.log(`✅ ${restaurants.count} restaurants créés`)

  const allRestaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      michelinType: true,
      isEco: true,
    },
  }) as SeedRestaurant[]

  const designerTampons: Record<string, string> = {
    'Le Bistrot des Fables': '/tampons/le-bistrot-des-fables.png',
    'La Table de Mee': '/tampons/la-table-de-mee.png',
    "La Cloche d'Or": '/tampons/la-cloche-dor.png',
  }

  const getTamponColor = (michelinType: string, isEco: boolean): string => {
    if (michelinType.startsWith('etoile')) return 'bordeaux'
    if (michelinType === 'bib' || isEco) return 'vert'
    return 'bleu'
  }

  const tamponsData = allRestaurants.map((restaurant: SeedRestaurant) => ({
    restaurantId: restaurant.id,
    imageUrl: designerTampons[restaurant.name] ?? null,
    color: getTamponColor(restaurant.michelinType, restaurant.isEco),
  }))

  const tampons = await prisma.tampon.createMany({
    data: tamponsData,
  })
  console.log(`✅ ${tampons.count} tampons restaurants créés`)

  const recompensesData = [
    {
      tamponRequired: 1,
      titre: 'Histoire Michelin débloquée',
      description: 'Débloque une histoire Michelin dès votre premier tampon.',
    },
    {
      tamponRequired: 3,
      titre: 'Verre offert',
      description: 'Un verre offert pour célébrer vos 3 premiers tampons.',
    },
    {
      tamponRequired: 5,
      titre: 'Dessert offert',
      description: 'Un dessert offert après 5 tampons collectés.',
    },
    {
      tamponRequired: 10,
      titre: 'Entrée offerte',
      description: 'Une entrée offerte pour 10 tampons cumulés.',
    },
    {
      tamponRequired: 15,
      titre: 'Repas -20%',
      description: 'Profitez de 20% de réduction après 15 tampons.',
    },
    {
      tamponRequired: 20,
      titre: 'Invitation cérémonie Michelin',
      description: 'Invitation exclusive à la cérémonie Michelin.',
    },
  ]

  const recompenses = await prisma.recompense.createMany({
    data: recompensesData,
    skipDuplicates: true,
  })
  console.log(`✅ ${recompenses.count} récompenses créées`)

  const histoiresData = [
    {
      titre: "La Naissance du Guide",
      contenu:
        "En 1900, André Michelin crée un petit guide rouge offert aux automobilistes. À l'époque, la France ne compte que 3 000 voitures. Le guide propose des conseils pratiques : comment changer un pneu, où trouver de l'essence, et bien sûr, où bien manger. Personne ne se doutait que ce modeste livret deviendrait la bible de la gastronomie mondiale.",
      imageCarteUrl: "https://images.unsplash.com/photo-1585540083814-ea6ee8af9e4f?w=800",
      conditionUnlock: JSON.stringify({ type: "niveau", value: "Curieux" }),
    },
    {
      titre: "La Première Étoile",
      contenu:
        "C'est en 1926 que le Guide Michelin commence à attribuer des étoiles aux restaurants. Une seule étoile d'abord, pour signaler les 'bonnes tables'. Le système à trois étoiles arrive en 1931, avec sa fameuse hiérarchie : une étoile pour une très bonne table, deux étoiles pour une cuisine excellente 'méritant un détour', et trois étoiles pour une cuisine exceptionnelle 'valant le voyage'.",
      imageCarteUrl: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800",
      conditionUnlock: JSON.stringify({ type: "niveau", value: "Découvreur" }),
    },
    {
      titre: "Le Secret des Inspecteurs",
      contenu:
        "Les inspecteurs Michelin sont les agents secrets de la gastronomie. Anonymes, ils visitent les restaurants en payant leur addition comme n'importe quel client. Leur identité est si bien gardée que même leurs familles ignorent parfois les détails de leur travail. Un inspecteur visite en moyenne 250 restaurants par an et prend ses repas seul pour rester concentré sur l'assiette.",
      imageCarteUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800",
      conditionUnlock: JSON.stringify({ type: "niveau", value: "Connaisseur" }),
    },
    {
      titre: "Le Drame des Étoiles Perdues",
      contenu:
        "Perdre une étoile Michelin peut être dévastateur. En 2003, le chef Bernard Loiseau se donne la mort, hanté par la rumeur de la perte de sa troisième étoile. Ce drame a profondément marqué le monde de la gastronomie et a soulevé des questions sur la pression que le système d'étoiles exerce sur les chefs. Depuis, le Guide a évolué vers plus de transparence.",
      imageCarteUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
      conditionUnlock: JSON.stringify({ type: "niveau", value: "Inspecteur" }),
    },
    {
      titre: "Le Bib Gourmand : L'Étoile du Peuple",
      contenu:
        "Créé en 1997, le Bib Gourmand (du surnom de Bibendum, la mascotte Michelin) récompense les restaurants offrant un excellent rapport qualité-prix. C'est la reconnaissance que la bonne cuisine n'est pas réservée aux grandes tables. Le Bib est devenu un symbole pour les gourmets malins qui veulent bien manger sans se ruiner.",
      imageCarteUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
      conditionUnlock: JSON.stringify({ type: "restaurant", value: 9 }),
    },
    {
      titre: "Bibendum : La Mascotte Immortelle",
      contenu:
        "Le Bonhomme Michelin, ou Bibendum, est né en 1898 quand Édouard Michelin voit une pile de pneus et dit 'Si elle avait des bras, elle aurait l'air d'un bonhomme'. Dessiné par Marius Rossillon, Bibendum est devenu l'une des plus anciennes et plus reconnues mascottes publicitaires au monde. En 2000, il a été élu 'meilleur logo du siècle'.",
      imageCarteUrl: "https://images.unsplash.com/photo-1495461199391-8c39ab674581?w=800",
      conditionUnlock: JSON.stringify({ type: "checkin_count", value: 1 }),
    },
    {
      titre: "Le Guide Pendant la Guerre",
      contenu:
        "Pendant la Seconde Guerre mondiale, la publication du Guide est interrompue. Mais en 1944, les Alliés demandent à Michelin de réimprimer l'édition 1939 du guide de France — c'est la cartographie la plus précise disponible pour planifier le Débarquement en Normandie. Le Guide Michelin a littéralement aidé à libérer la France.",
      imageCarteUrl: "https://images.unsplash.com/photo-1580130379624-3a069adbffc5?w=800",
      conditionUnlock: JSON.stringify({ type: "niveau", value: "Grand Gastronome" }),
    },
    {
      titre: "La Conquête du Monde",
      contenu:
        "Longtemps cantonné à l'Europe, le Guide Michelin s'est internationalisé à partir de 2005 avec New York, puis Tokyo en 2007. Tokyo est rapidement devenue la ville la plus étoilée du monde, dépassant Paris. Aujourd'hui, le Guide couvre plus de 40 pays sur tous les continents, de São Paulo à Bangkok, de Séoul à Dubaï.",
      imageCarteUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      conditionUnlock: JSON.stringify({ type: "checkin_count", value: 15 }),
    },
  ]

  for (const histoire of histoiresData) {
    await prisma.histoire.create({ data: histoire })
  }
  console.log(`✅ ${histoiresData.length} histoires créées`)

  console.log('🎉 Seed terminé avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
