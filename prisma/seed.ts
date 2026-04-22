import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── RESTAURANTS ────────────────────────────────
  const restaurants = await prisma.restaurant.createMany({
    data: [
      // ⭐ Étoilés
      {
        name: "L'Ambroisie",
        address: "9 Place des Vosges, 75004 Paris",
        lat: 48.8554,
        lng: 2.3654,
        michelin_type: "etoile_3",
        stars: 3,
        budget: "high",
        cuisine: "Française classique",
        ambiance: "Élégant et intime",
        photo_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        description: "Temple de la haute gastronomie française dans un cadre historique Place des Vosges.",
        is_eco: false,
        is_hidden_gem: false,
        is_visual: true,
      },
      {
        name: "Le Cinq",
        address: "31 Avenue George V, 75008 Paris",
        lat: 48.8688,
        lng: 2.3010,
        michelin_type: "etoile_3",
        stars: 3,
        budget: "high",
        cuisine: "Française moderne",
        ambiance: "Luxueux et raffiné",
        photo_url: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=800",
        description: "Restaurant gastronomique du Four Seasons Hotel George V, une expérience culinaire d'exception.",
        is_eco: false,
        is_hidden_gem: false,
        is_visual: true,
      },
      {
        name: "Arpège",
        address: "84 Rue de Varenne, 75007 Paris",
        lat: 48.8560,
        lng: 2.3160,
        michelin_type: "etoile_3",
        stars: 3,
        budget: "high",
        cuisine: "Légumes et créativité",
        ambiance: "Épuré et artistique",
        photo_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        description: "Alain Passard sublime les légumes dans ce temple végétal trois étoiles.",
        is_eco: true,
        is_hidden_gem: false,
        is_visual: true,
      },
      {
        name: "Le Clarence",
        address: "31 Avenue Franklin D. Roosevelt, 75008 Paris",
        lat: 48.8698,
        lng: 2.3090,
        michelin_type: "etoile_2",
        stars: 2,
        budget: "high",
        cuisine: "Française gastronomique",
        ambiance: "Hôtel particulier majestueux",
        photo_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        description: "Dans un hôtel particulier du 19e siècle, Christophe Pelé propose une cuisine d'auteur remarquable.",
        is_eco: false,
        is_hidden_gem: false,
        is_visual: true,
      },
      {
        name: "Table by Bruno Verjus",
        address: "7 Rue de Prague, 75012 Paris",
        lat: 48.8490,
        lng: 2.3775,
        michelin_type: "etoile_2",
        stars: 2,
        budget: "high",
        cuisine: "Produits d'exception",
        ambiance: "Convivial et authentique",
        photo_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
        description: "Bruno Verjus, ancien blogueur devenu chef étoilé, célèbre le produit brut.",
        is_eco: true,
        is_hidden_gem: true,
        is_visual: false,
      },
      {
        name: "Comice",
        address: "31 Avenue de Versailles, 75016 Paris",
        lat: 48.8440,
        lng: 2.2750,
        michelin_type: "etoile_1",
        stars: 1,
        budget: "high",
        cuisine: "Franco-canadienne",
        ambiance: "Moderne et chaleureux",
        photo_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
        description: "Noam Gedalof propose une cuisine inventive mêlant influences françaises et canadiennes.",
        is_eco: false,
        is_hidden_gem: true,
        is_visual: true,
      },
      {
        name: "Accents Table Bourse",
        address: "24 Rue Feydeau, 75002 Paris",
        lat: 48.8696,
        lng: 2.3396,
        michelin_type: "etoile_1",
        stars: 1,
        budget: "medium",
        cuisine: "Française contemporaine",
        ambiance: "Décontracté chic",
        photo_url: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800",
        description: "Romain Mahi signe une cuisine généreuse avec des accents du Sud-Ouest.",
        is_eco: false,
        is_hidden_gem: true,
        is_visual: false,
      },
      {
        name: "Alliance",
        address: "5 Rue de Poissy, 75005 Paris",
        lat: 48.8500,
        lng: 2.3512,
        michelin_type: "etoile_1",
        stars: 1,
        budget: "medium",
        cuisine: "Franco-japonaise",
        ambiance: "Minimaliste et zen",
        photo_url: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800",
        description: "Toshitaka Omiya fusionne techniques japonaises et produits français avec brio.",
        is_eco: true,
        is_hidden_gem: true,
        is_visual: true,
      },

      // 🍴 Bib Gourmand
      {
        name: "Le Petit Cler",
        address: "29 Rue Cler, 75007 Paris",
        lat: 48.8572,
        lng: 2.3046,
        michelin_type: "bib",
        stars: 0,
        budget: "low",
        cuisine: "Bistrot français",
        ambiance: "Familial et convivial",
        photo_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        description: "Bistrot de quartier généreux avec des plats canailles à prix doux.",
        is_eco: false,
        is_hidden_gem: true,
        is_visual: false,
      },
      {
        name: "Grandcoeur",
        address: "41 Rue du Temple, 75004 Paris",
        lat: 48.8588,
        lng: 2.3540,
        michelin_type: "bib",
        stars: 0,
        budget: "medium",
        cuisine: "Française moderne",
        ambiance: "Cour intérieure romantique",
        photo_url: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800",
        description: "Mauro Colagreco signe la carte de ce lieu magnifique dans le Marais.",
        is_eco: false,
        is_hidden_gem: false,
        is_visual: true,
      },
      {
        name: "Abri",
        address: "92 Rue du Faubourg Poissonnière, 75010 Paris",
        lat: 48.8765,
        lng: 2.3492,
        michelin_type: "bib",
        stars: 0,
        budget: "low",
        cuisine: "Franco-japonaise",
        ambiance: "Comptoir intime",
        photo_url: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800",
        description: "Minuscule comptoir japonais où Katsuaki Okiyama régale avec un menu unique.",
        is_eco: true,
        is_hidden_gem: true,
        is_visual: false,
      },
      {
        name: "Le Cadoret",
        address: "1 Rue Pradier, 75019 Paris",
        lat: 48.8820,
        lng: 2.3830,
        michelin_type: "bib",
        stars: 0,
        budget: "low",
        cuisine: "Néo-bistrot",
        ambiance: "Populaire et vivant",
        photo_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
        description: "Néo-bistrot emblématique de Belleville, cuisine de saison et vins nature.",
        is_eco: true,
        is_hidden_gem: true,
        is_visual: false,
      },
      {
        name: "Chez Casimir",
        address: "6 Rue de Belzunce, 75010 Paris",
        lat: 48.8790,
        lng: 2.3538,
        michelin_type: "bib",
        stars: 0,
        budget: "low",
        cuisine: "Bistrot traditionnel",
        ambiance: "Authentique et bruyant",
        photo_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
        description: "Institution du 10e, buffet d'entrées légendaire et plats réconfortants.",
        is_eco: false,
        is_hidden_gem: false,
        is_visual: false,
      },

      // 🏨 Hôtels
      {
        name: "Le Meurice",
        address: "228 Rue de Rivoli, 75001 Paris",
        lat: 48.8651,
        lng: 2.3281,
        michelin_type: "hotel",
        stars: 5,
        budget: "high",
        cuisine: "Française gastronomique",
        ambiance: "Palace historique",
        photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        description: "Palace mythique face aux Tuileries, restaurant gastronomique par Alain Ducasse.",
        is_eco: false,
        is_hidden_gem: false,
        is_visual: true,
      },
      {
        name: "Hôtel Plaza Athénée",
        address: "25 Avenue Montaigne, 75008 Paris",
        lat: 48.8660,
        lng: 2.3037,
        michelin_type: "hotel",
        stars: 5,
        budget: "high",
        cuisine: "Naturalité",
        ambiance: "Glamour parisien",
        photo_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        description: "L'adresse iconique de l'avenue Montaigne, terrasse rouge légendaire.",
        is_eco: true,
        is_hidden_gem: false,
        is_visual: true,
      },
      {
        name: "Hôtel Brach",
        address: "1-7 Rue Jean Richepin, 75016 Paris",
        lat: 48.8630,
        lng: 2.2720,
        michelin_type: "hotel",
        stars: 5,
        budget: "high",
        cuisine: "Méditerranéenne",
        ambiance: "Design contemporain",
        photo_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        description: "Hôtel design signé Philippe Starck, rooftop avec vue sur tout Paris.",
        is_eco: true,
        is_hidden_gem: true,
        is_visual: true,
      },
    ],
  })
  console.log(`✅ ${restaurants.count} restaurants créés`)

  // ─── TAMPONS ────────────────────────────────────
  const tamponsData = [
    {
      name: "Premier Pas",
      description: "Effectuer votre premier check-in",
      icon: "👣",
      condition: JSON.stringify({ type: "checkin_count", value: 1 }),
    },
    {
      name: "Curieux",
      description: "Visiter 3 restaurants",
      icon: "🍽️",
      condition: JSON.stringify({ type: "checkin_count", value: 3 }),
    },
    {
      name: "Découvreur",
      description: "Visiter 5 restaurants",
      icon: "⭐",
      condition: JSON.stringify({ type: "checkin_count", value: 5 }),
    },
    {
      name: "Explorateur",
      description: "Visiter 10 restaurants",
      icon: "🔍",
      condition: JSON.stringify({ type: "checkin_count", value: 10 }),
    },
    {
      name: "Connaisseur",
      description: "Visiter 25 restaurants",
      icon: "🎩",
      condition: JSON.stringify({ type: "checkin_count", value: 25 }),
    },
    {
      name: "Grand Gastronome",
      description: "Visiter 50 restaurants",
      icon: "🏆",
      condition: JSON.stringify({ type: "checkin_count", value: 50 }),
    },
    {
      name: "Chasseur d'Étoiles",
      description: "Visiter un restaurant 3 étoiles",
      icon: "🌟",
      condition: JSON.stringify({ type: "michelin_type", value: "etoile_3" }),
    },
    {
      name: "Pépite Trouvée",
      description: "Visiter une pépite cachée",
      icon: "🤫",
      condition: JSON.stringify({ type: "hidden_gem", value: true }),
    },
    {
      name: "Éco-Responsable",
      description: "Visiter un restaurant eco-friendly",
      icon: "🌿",
      condition: JSON.stringify({ type: "eco", value: true }),
    },
    {
      name: "Bib Gourmand Fan",
      description: "Visiter 3 restaurants Bib Gourmand",
      icon: "😋",
      condition: JSON.stringify({ type: "bib_count", value: 3 }),
    },
  ]

  for (const tampon of tamponsData) {
    await prisma.tampon.create({ data: tampon })
  }
  console.log(`✅ ${tamponsData.length} tampons créés`)

  // ─── HISTOIRES ──────────────────────────────────
  const histoiresData = [
    {
      titre: "La Naissance du Guide",
      contenu:
        "En 1900, André Michelin crée un petit guide rouge offert aux automobilistes. À l'époque, la France ne compte que 3 000 voitures. Le guide propose des conseils pratiques : comment changer un pneu, où trouver de l'essence, et bien sûr, où bien manger. Personne ne se doutait que ce modeste livret deviendrait la bible de la gastronomie mondiale.",
      image_carte_url: "https://images.unsplash.com/photo-1585540083814-ea6ee8af9e4f?w=800",
      condition_unlock: JSON.stringify({ type: "niveau", value: "Curieux" }),
    },
    {
      titre: "La Première Étoile",
      contenu:
        "C'est en 1926 que le Guide Michelin commence à attribuer des étoiles aux restaurants. Une seule étoile d'abord, pour signaler les 'bonnes tables'. Le système à trois étoiles arrive en 1931, avec sa fameuse hiérarchie : une étoile pour une très bonne table, deux étoiles pour une cuisine excellente 'méritant un détour', et trois étoiles pour une cuisine exceptionnelle 'valant le voyage'.",
      image_carte_url: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800",
      condition_unlock: JSON.stringify({ type: "niveau", value: "Découvreur" }),
    },
    {
      titre: "Le Secret des Inspecteurs",
      contenu:
        "Les inspecteurs Michelin sont les agents secrets de la gastronomie. Anonymes, ils visitent les restaurants en payant leur addition comme n'importe quel client. Leur identité est si bien gardée que même leurs familles ignorent parfois les détails de leur travail. Un inspecteur visite en moyenne 250 restaurants par an et prend ses repas seul pour rester concentré sur l'assiette.",
      image_carte_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800",
      condition_unlock: JSON.stringify({ type: "niveau", value: "Connaisseur" }),
    },
    {
      titre: "Le Drame des Étoiles Perdues",
      contenu:
        "Perdre une étoile Michelin peut être dévastateur. En 2003, le chef Bernard Loiseau se donne la mort, hanté par la rumeur de la perte de sa troisième étoile. Ce drame a profondément marqué le monde de la gastronomie et a soulevé des questions sur la pression que le système d'étoiles exerce sur les chefs. Depuis, le Guide a évolué vers plus de transparence.",
      image_carte_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
      condition_unlock: JSON.stringify({ type: "niveau", value: "Inspecteur" }),
    },
    {
      titre: "Le Bib Gourmand : L'Étoile du Peuple",
      contenu:
        "Créé en 1997, le Bib Gourmand (du surnom de Bibendum, la mascotte Michelin) récompense les restaurants offrant un excellent rapport qualité-prix. C'est la reconnaissance que la bonne cuisine n'est pas réservée aux grandes tables. Le Bib est devenu un symbole pour les gourmets malins qui veulent bien manger sans se ruiner.",
      image_carte_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
      condition_unlock: JSON.stringify({ type: "restaurant", value: 9 }), // Premier bib gourmand
    },
    {
      titre: "Bibendum : La Mascotte Immortelle",
      contenu:
        "Le Bonhomme Michelin, ou Bibendum, est né en 1898 quand Édouard Michelin voit une pile de pneus et dit 'Si elle avait des bras, elle aurait l'air d'un bonhomme'. Dessiné par Marius Rossillon, Bibendum est devenu l'une des plus anciennes et plus reconnues mascottes publicitaires au monde. En 2000, il a été élu 'meilleur logo du siècle'.",
      image_carte_url: "https://images.unsplash.com/photo-1495461199391-8c39ab674581?w=800",
      condition_unlock: JSON.stringify({ type: "checkin_count", value: 1 }),
    },
    {
      titre: "Le Guide Pendant la Guerre",
      contenu:
        "Pendant la Seconde Guerre mondiale, la publication du Guide est interrompue. Mais en 1944, les Alliés demandent à Michelin de réimprimer l'édition 1939 du guide de France — c'est la cartographie la plus précise disponible pour planifier le Débarquement en Normandie. Le Guide Michelin a littéralement aidé à libérer la France.",
      image_carte_url: "https://images.unsplash.com/photo-1580130379624-3a069adbffc5?w=800",
      condition_unlock: JSON.stringify({ type: "niveau", value: "Grand Gastronome" }),
    },
    {
      titre: "La Conquête du Monde",
      contenu:
        "Longtemps cantonné à l'Europe, le Guide Michelin s'est internationalisé à partir de 2005 avec New York, puis Tokyo en 2007. Tokyo est rapidement devenue la ville la plus étoilée du monde, dépassant Paris. Aujourd'hui, le Guide couvre plus de 40 pays sur tous les continents, de São Paulo à Bangkok, de Séoul à Dubaï.",
      image_carte_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      condition_unlock: JSON.stringify({ type: "checkin_count", value: 15 }),
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
