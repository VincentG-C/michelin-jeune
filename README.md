# Projet Michelin :
Disponible ici (la localisation ne marche pas car http) : http://198.199.78.21/
Github: https://github.com/VincentG-C/michelin-jeune
## Pour le lancer :
docker compose up
## Pour le seeder (l'application doit être lancée):
docker container exec [APP_CONTAINER_ID] npm install dotenv
docker container exec [APP_CONTAINER_ID] npm run db:seed