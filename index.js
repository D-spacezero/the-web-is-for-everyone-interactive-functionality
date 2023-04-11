import express from "express";
import fsS3 from "@cyclic.sh/s3fs";
import fs from "fs";

function resetData() {
  fs.readFile('./public/data/players.json', (error, data)=>{
    fsS3.writeFileSync("./public/data/players.json", data)
  });
}

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
  var json = JSON.parse(fsS3.readFileSync("./public/data/players.json", "utf8"));
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
  fsS3.writeFileSync("./public/data/players.json", JSON.stringify(json, null, 2));
  // Redirect home page
  response.redirect("/");
});

app.get("/players", (request, response) => {
  fsS3.readFile('./public/data/players.json', (error,data)=>{
    response.send(JSON.parse(data))
  })
})

// Maak een route voor de index
app.get("/", (request, response) => {
  response.render("index");
});

// Reset .json data elk half uur, ivm cyclic
setTimeout(resetData, 1800*1000);
resetData();

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
