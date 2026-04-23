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
        photoUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800",
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

  const chapitre1 = await prisma.chapitre.upsert({
    where: { ordre: 1 },
    update: { titre: 'Dossier N°1' },
    create: { titre: 'Dossier N°1', ordre: 1 },
  })

  const chapitre2 = await prisma.chapitre.upsert({
    where: { ordre: 2 },
    update: { titre: 'Dossier N°2' },
    create: { titre: 'Dossier N°2', ordre: 2 },
  })

  const chapitre3 = await prisma.chapitre.upsert({
    where: { ordre: 3 },
    update: { titre: 'Dossier N°3' },
    create: { titre: 'Dossier N°3', ordre: 3 },
  })

  const orderedRestaurants = [...allRestaurants].sort((a, b) => a.id - b.id)
  const restaurantByName = new Map(allRestaurants.map((restaurant) => [restaurant.name, restaurant]))

  const chapitre1Restaurants = [
    restaurantByName.get('Le Bistrot des Fables'),
    restaurantByName.get('La Table de Mee'),
    restaurantByName.get("La Cloche d'Or"),
  ]

  const chapitre1RestaurantIds = new Set(
    chapitre1Restaurants
      .filter((restaurant): restaurant is NonNullable<typeof restaurant> => Boolean(restaurant))
      .map((restaurant) => restaurant.id)
  )

  const remainingRestaurants = orderedRestaurants.filter(
    (restaurant) => !chapitre1RestaurantIds.has(restaurant.id)
  )

  const chapitre2Restaurants = [remainingRestaurants[0], remainingRestaurants[1], remainingRestaurants[2]]
  const chapitre3Restaurants = [remainingRestaurants[3], remainingRestaurants[4], remainingRestaurants[5]]

  const allChapitresRestaurants = [
    ...chapitre1Restaurants,
    ...chapitre2Restaurants,
    ...chapitre3Restaurants,
  ]

  if (allChapitresRestaurants.some((restaurant) => !restaurant)) {
    throw new Error('Impossible de mapper les restaurants requis pour les 3 chapitres')
  }

  const histoiresData = [
    // Dossier 1
    {
      chapitreId: chapitre1.id,
      restaurantId: chapitre1Restaurants[0]!.id,
      titre: 'Le crime de la fourchette',
      contenu: "Tu penses que la France a inventé les bonnes manières ? Pas du tout. Jusqu'en **1533**, les Français les plus chics mangeaient avec leurs **doigts** et s'essuyaient sur la nappe. C'est **Catherine de Médicis** qui débarque d'Italie avec un objet jugé \"scandaleux\" à l'époque : la fourchette.",
      imageCarteUrl: '/images/histoire-fourchette.png',
      ordre: 1,
    },
    {
      chapitreId: chapitre1.id,
      restaurantId: chapitre1Restaurants[1]!.id,
      titre: 'La vengeance de la pomme de terre',
      contenu: "Pendant longtemps, la France a cru que **la pomme de terre** donnait la lèpre ! Pour forcer les gens à en manger, un agronome nommé Parmentier a utilisé une ruse géniale : il a fait garder son champ de patates par des **soldats armés** le jour. Les gens ont cru que c'était un trésor précieux et, dès que les gardes partaient la nuit, ils venaient en voler pour les goûter. C'est comme ça que la frite est devenue française !",
      imageCarteUrl: '/images/histoire-pommeterre.png',
      ordre: 2,
    },
    {
      chapitreId: chapitre1.id,
      restaurantId: chapitre1Restaurants[2]!.id,
      titre: 'Le premier \"restau\" de l\'histoire',
      contenu: "Avant cette date, on ne choisissait pas son menu : on mangeait ce que l'**aubergiste** servait, tous à la même table. Un homme nommé **Boulanger** a ouvert un lieu à Paris en vendant des bouillons \"restaurants\" (qui restaurent les forces). Il a été traîné en justice par les traiteurs de l'époque qui voulaient garder le monopole de la viande. Il a **gagné**, et le concept de s'asseoir à sa propre table avec une carte était né.",
      imageCarteUrl: '/images/histoire-restaurant.png',
      ordre: 3,
    },
    // Dossier 2 (mêmes histoires dupliquées)
    {
      chapitreId: chapitre2.id,
      restaurantId: chapitre2Restaurants[0]!.id,
      titre: 'Le crime de la fourchette',
      contenu: "Tu penses que la France a inventé les bonnes manières ? Pas du tout. Jusqu'en **1533**, les Français les plus chics mangeaient avec leurs **doigts** et s'essuyaient sur la nappe. C'est **Catherine de Médicis** qui débarque d'Italie avec un objet jugé \"scandaleux\" à l'époque : la fourchette.",
      imageCarteUrl: '/images/histoire-fourchette.png',
      ordre: 1,
    },
    {
      chapitreId: chapitre2.id,
      restaurantId: chapitre2Restaurants[1]!.id,
      titre: 'La vengeance de la pomme de terre',
      contenu: "Pendant longtemps, la France a cru que **la pomme de terre** donnait la lèpre ! Pour forcer les gens à en manger, un agronome nommé Parmentier a utilisé une ruse géniale : il a fait garder son champ de patates par des **soldats armés** le jour. Les gens ont cru que c'était un trésor précieux et, dès que les gardes partaient la nuit, ils venaient en voler pour les goûter. C'est comme ça que la frite est devenue française !",
      imageCarteUrl: '/images/histoire-pommeterre.png',
      ordre: 2,
    },
    {
      chapitreId: chapitre2.id,
      restaurantId: chapitre2Restaurants[2]!.id,
      titre: 'Le premier \"restau\" de l\'histoire',
      contenu: "Avant cette date, on ne choisissait pas son menu : on mangeait ce que l'**aubergiste** servait, tous à la même table. Un homme nommé **Boulanger** a ouvert un lieu à Paris en vendant des bouillons \"restaurants\" (qui restaurent les forces). Il a été traîné en justice par les traiteurs de l'époque qui voulaient garder le monopole de la viande. Il a **gagné**, et le concept de s'asseoir à sa propre table avec une carte était né.",
      imageCarteUrl: '/images/histoire-restaurant.png',
      ordre: 3,
    },
    // Dossier 3 (mêmes histoires dupliquées)
    {
      chapitreId: chapitre3.id,
      restaurantId: chapitre3Restaurants[0]!.id,
      titre: 'Le crime de la fourchette',
      contenu: "Tu penses que la France a inventé les bonnes manières ? Pas du tout. Jusqu'en **1533**, les Français les plus chics mangeaient avec leurs **doigts** et s'essuyaient sur la nappe. C'est **Catherine de Médicis** qui débarque d'Italie avec un objet jugé \"scandaleux\" à l'époque : la fourchette.",
      imageCarteUrl: '/images/histoire-fourchette.png',
      ordre: 1,
    },
    {
      chapitreId: chapitre3.id,
      restaurantId: chapitre3Restaurants[1]!.id,
      titre: 'La vengeance de la pomme de terre',
      contenu: "Pendant longtemps, la France a cru que **la pomme de terre** donnait la lèpre ! Pour forcer les gens à en manger, un agronome nommé Parmentier a utilisé une ruse géniale : il a fait garder son champ de patates par des **soldats armés** le jour. Les gens ont cru que c'était un trésor précieux et, dès que les gardes partaient la nuit, ils venaient en voler pour les goûter. C'est comme ça que la frite est devenue française !",
      imageCarteUrl: '/images/histoire-pommeterre.png',
      ordre: 2,
    },
    {
      chapitreId: chapitre3.id,
      restaurantId: chapitre3Restaurants[2]!.id,
      titre: 'Le premier \"restau\" de l\'histoire',
      contenu: "Avant cette date, on ne choisissait pas son menu : on mangeait ce que l'**aubergiste** servait, tous à la même table. Un homme nommé **Boulanger** a ouvert un lieu à Paris en vendant des bouillons \"restaurants\" (qui restaurent les forces). Il a été traîné en justice par les traiteurs de l'époque qui voulaient garder le monopole de la viande. Il a **gagné**, et le concept de s'asseoir à sa propre table avec une carte était né.",
      imageCarteUrl: '/images/histoire-restaurant.png',
      ordre: 3,
    },
  ]

  for (const histoire of histoiresData) {
    await prisma.histoire.upsert({
      where: { restaurantId: histoire.restaurantId },
      update: histoire,
      create: histoire,
    })
  }
  console.log(`✅ ${histoiresData.length} histoires créées`)

  const recompense1 = await prisma.recompense.upsert({
    where: { chapitreId: chapitre1.id },
    update: {
      titre: 'Dessert offert',
      description: 'Dossier N°1 complété : un dessert offert dans un restaurant partenaire.',
    },
    create: {
      chapitreId: chapitre1.id,
      titre: 'Dessert offert',
      description: 'Dossier N°1 complété : un dessert offert dans un restaurant partenaire.',
    },
  })

  const recompense2 = await prisma.recompense.upsert({
    where: { chapitreId: chapitre2.id },
    update: {
      titre: 'Entrée offerte',
      description: 'Dossier N°2 complété : une entrée offerte dans un restaurant partenaire.',
    },
    create: {
      chapitreId: chapitre2.id,
      titre: 'Entrée offerte',
      description: 'Dossier N°2 complété : une entrée offerte dans un restaurant partenaire.',
    },
  })

  const recompense3 = await prisma.recompense.upsert({
    where: { chapitreId: chapitre3.id },
    update: {
      titre: 'Café gourmand offert',
      description: 'Dossier N°3 complété : un café gourmand offert dans un restaurant partenaire.',
    },
    create: {
      chapitreId: chapitre3.id,
      titre: 'Café gourmand offert',
      description: 'Dossier N°3 complété : un café gourmand offert dans un restaurant partenaire.',
    },
  })

  await prisma.chapitre.update({ where: { id: chapitre1.id }, data: { recompenseId: recompense1.id } })
  await prisma.chapitre.update({ where: { id: chapitre2.id }, data: { recompenseId: recompense2.id } })
  await prisma.chapitre.update({ where: { id: chapitre3.id }, data: { recompenseId: recompense3.id } })

  console.log('✅ 3 récompenses de chapitres créées')

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
