geolite2-mongo (under development)
====================
1. Extract /dump/04-13-2015-geolite-2.rar
2. Restore the data into MongoDB database
    mongorestore --db geolite-2 /dump/04-13-2015-geolite-2/geolite-2
3. Run the application (to change the port edit /lib/routes.js file)
    node lib/geolite2-mongo.js
4. Open http://localhost:4000/locate in your browser to locate any IP Address. (Use http://localhost:4000/locate?ip=XXXX.XXXX.XXXX.XXXX for testing)
