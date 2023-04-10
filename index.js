import express from "express";
import fs from "fs";

const url = "https://api.ultitv.fdnd.nl/api/v1/players";
import fileupload from 'express-fileupload';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)


// Maak een nieuwe express app
const app = express();

// Stel in hoe we express gebruiken
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// Post request data zichtbaar
app.use(express.urlencoded({ extended: false }));

// Zorgt ervoor dat files in tmp folder komen
app.use(fileupload({
  useTempFiles: true,
  tempFileDir: "/tmp",
}))

// Update speler binnen de json
app.post("/players/:number", (request, response) => {
  //Haal data uit de body van request
  const { name, gender, nationality, team } = request.body;
  // Speler nummer uit url
  const plyNumber = request.params.number;
  // haalt json uit filemap
  var json = JSON.parse(fs.readFileSync("./tmp/players.json", "utf8"));
  // zoekt index van speler in array
  const index = json.players.findIndex(
    (player) => player.number === Number(plyNumber)
  );
  //console.log(json.players[0]);

  //Update speler met nieuwe data
  json.players[index] = {
    number: Number(plyNumber),
    name: name,
    gender: gender,
    nationality: nationality,
    team: team,
  };

  // Schrijft update terug naar file
  fs.writeFileSync("./tmp/players.json", JSON.stringify(json, null, 2));
  // Redirect home page
  response.redirect("/");
});

// Stuurt json file met spelers
app.get("/players", (request, response) => {
  response.sendFile(path.join(__dirname, "/tmp/players.json"));
});

// Maak een route voor de index
app.get("/", (request, response) => {
  response.render("index");
});

// Stel het poortnummer in en start express
app.set("port", process.env.PORT || 8100);
app.listen(app.get("port"), function () {
  console.log(`Application started on http://localhost:${app.get("port")}`);
});

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error);
}
