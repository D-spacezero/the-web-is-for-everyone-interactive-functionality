// select the <ul> elements from the HTML document
const playerList = document.querySelector("#player-list");
const playerNumberList = document.querySelector("#player-number-list");
const playerNameList = document.querySelector("#player-name-list");
const playerGenderList = document.querySelector("#player-gender-list");
const playerInfoList = document.querySelector("#player-info-list");

// read the player data from the JSON file
fetch("./data/players.json")
  .then((response) => response.json())
  .then((data) => {
    // access the player array
    const players = data.players;

    const overlayContent = document.querySelector("#overlay-content");

    const form = document.createElement("form");
    form.method = "POST";
    form.style.display = "none";
    form.id = "updateForm";

    overlayContent.appendChild(form);

    const playerDiv = document.createElement("div");
    playerDiv.id = "playerDiv";
    overlayContent.appendChild(playerDiv);

    const editButton = document.createElement("button");

    editButton.innerText = "edit";

    editButton.addEventListener("click", () => {
      // wissel naar form
      if (form.style.display === "none") {
        form.style.display = "block";
        playerDiv.style.display = "none";
        overlayContent.style.top = "47.497%";
        editButton.style.display = "none";
      } else {
        form.style.display = "none";
        playerDiv.style.display = "block";
        overlayContent.style.top = "41.96%";
      }
    });

    overlayContent.appendChild(editButton);

    // loop through the players array and create a <li> element for each player
    for (let i = 0; i < players.length; i++) {
      // create a new <li> element for player name
      const playerNameListItem = document.createElement("li");
      //playerNameListItem.classList.add('ply-name');
      playerNameListItem.textContent = players[i].name;

      // create a new <li> element for player number
      const playerNumberListItem = document.createElement("li");
      playerNumberListItem.textContent = players[i].number;

      // create a new <li> element for player gender
      const playerGenderListItem = document.createElement("li");
      playerGenderListItem.textContent = players[i].gender;

      // create a new <button> element for the player information button
      const infoButton = document.createElement("button");

      // create a new <img> element for the SVG icon
      const icon = document.createElement("img");
      icon.setAttribute("src", "./media/info.svg");
      icon.setAttribute("alt", "Player information");

      // add the SVG icon to the button
      infoButton.appendChild(icon);

      // add an event listener to the button to handle the click event
      infoButton.addEventListener("click", () => {
        // get the player data for the current index from the players array
        const currentPlayer = players[i];

        form.action = `/players/${currentPlayer.number}`;

        // display the player data in an overlay
        const overlay = document.querySelector("#overlay");
        const closeButton = document.querySelector("#close-button");

        overlay.style.display = "block";
        overlayContent.style.top = "41.96%";

        const playerTitle = document.createElement("h2");
        playerTitle.innerText = currentPlayer.name;

        const playerNumber = document.createElement("p");
        playerNumber.innerText = `Number: ${currentPlayer.number}`;

        const playerGender = document.createElement("p");
        playerGender.innerText = `Gender: ${currentPlayer.gender}`;

        const playerNationality = document.createElement("p");
        playerNationality.innerText = `Nationality: ${currentPlayer.nationality}`;

        const playerTeam = document.createElement("p");
        playerTeam.innerText = `Team: ${currentPlayer.team}`;

        playerDiv.appendChild(playerTitle);
        playerDiv.appendChild(playerNumber);
        playerDiv.appendChild(playerGender);
        playerDiv.appendChild(playerNationality);
        playerDiv.appendChild(playerTeam);

        // make an input for each field

        const formTitle = document.createElement("h2");
        formTitle.innerText = currentPlayer.name;

        form.appendChild(formTitle);

        const nameFormDiv = document.createElement("div");
        const nameLabel = document.createElement("label");
        nameLabel.htmlFor = "name";
        nameLabel.innerText = "Name: ";

        const nameInput = document.createElement("input");
        nameInput.name = "name";
        nameInput.value = currentPlayer.name;

        nameFormDiv.appendChild(nameLabel);
        nameFormDiv.appendChild(nameInput);

        const numberFormDiv = document.createElement("div");
        const numberLabel = document.createElement("label");
        numberLabel.htmlFor = "number";
        numberLabel.innerText = "Number: ";

        const numberInput = document.createElement("input");
        numberInput.name = "number";
        numberInput.value = currentPlayer.number;

        numberFormDiv.appendChild(numberLabel);
        numberFormDiv.appendChild(numberInput);

        const genderFormDiv = document.createElement("div");
        const genderLabel = document.createElement("label");
        genderLabel.htmlFor = "gender";
        genderLabel.innerText = "Gender: ";

        const genderInput = document.createElement("input");
        genderInput.name = "gender";
        genderInput.value = currentPlayer.gender;

        genderFormDiv.appendChild(genderLabel);
        genderFormDiv.appendChild(genderInput);

        const natFormDiv = document.createElement("div");
        const natLabel = document.createElement("label");
        natLabel.htmlFor = "nationality";
        natLabel.innerText = "Nationality: ";

        const natInput = document.createElement("input");
        natInput.name = "nationality";
        natInput.value = currentPlayer.nationality;

        natFormDiv.appendChild(natLabel);
        natFormDiv.appendChild(natInput);

        const teamFormDiv = document.createElement("div");
        const teamLabel = document.createElement("label");
        teamLabel.htmlFor = "team";
        teamLabel.innerText = "Team: ";

        const teamInput = document.createElement("input");
        teamInput.name = "team";
        teamInput.value = currentPlayer.team;

        teamFormDiv.appendChild(teamLabel);
        teamFormDiv.appendChild(teamInput);

        form.appendChild(nameFormDiv);
        form.appendChild(numberFormDiv);
        form.appendChild(genderFormDiv);
        form.appendChild(natFormDiv);
        form.appendChild(teamFormDiv);

        const saveButton = document.createElement("button");
        saveButton.type = "submit";
        saveButton.innerText = "save";

        form.appendChild(saveButton);

        // add an event listener to the close button to hide the overlay when clicked
        closeButton.addEventListener("click", () => {
          form.style.display = "none";
          playerDiv.style.display = "block";
          form.innerHTML = "";
          playerDiv.innerHTML = "";
          editButton.style.display = "block";
          overlay.style.display = "none";
        });
      });

      // add the <li> elements to the corresponding <ul> elements
      playerNameList.appendChild(playerNameListItem);
      playerNumberList.appendChild(playerNumberListItem);
      playerGenderList.appendChild(playerGenderListItem);

      // add the player information button to the <li> element for player name
      playerInfoList.appendChild(infoButton);
    }
  })
  .catch((error) => {
    console.error(error);
  });
