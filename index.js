import express from "express";
import fs from "@cyclic.sh/s3fs";
const url = "https://api.ultitv.fdnd.nl/api/v1/players";

// Maak een nieuwe express app
const app = express();

// Stel in hoe we express gebruiken
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// Post request data zichtbaar
app.use(express.urlencoded({ extended: false }));

// Update speler binnen de json
app.post("/players/:number", (request, response) => {
  //Haal data uit de body van request
  const { name, gender, nationality, team } = request.body;
  // Speler nummer uit url
  const plyNumber = request.params.number;
  // haalt json uit filemap
  var json = JSON.parse(fs.readFileSync("./public/data/players.json", "utf8"));
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
  fs.writeFileSync("./public/data/players.json", JSON.stringify(json, null, 2));
  // Redirect home page
  response.redirect("/");
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
