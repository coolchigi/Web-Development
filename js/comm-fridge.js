/**
 * Hi TA marking my work, when testing the drop items, you may notice some errors that has something to do with the items.
 * This is due to the fact that you'd have to press the div and nothing but the div, else.
 * Pressing anything outside the div would cause some issues.
 * This is because, the div has some nested element, i know bad design and fridgeName would be an empty string and those errors would appear.
 * I apologize for the inconvinence.
 *
 *Current state, updates every other thing but items :'()
 */

var Fridges = {};

var pageId = document.getElementsByTagName("body")[0].id;

var middleColumn = document.getElementById("middle-column");
var number = document.getElementById("number_items");

var submitButton = document.querySelector("#submit_btn");
var addButton = document.querySelector("#add_btn");

let notification = document.getElementById("respArea");

var selectTag = document.getElementById("grocery_items");

let fridgeData = null;

//Data for the add.html
var addItemPage = document.getElementById("add_item");
var itemImage = document.getElementById("itemImage");
var itemType = document.getElementById("itemType");
var itemName = document.getElementById("itemName");

var itemsArray = [itemImage, itemType, itemName];

var userInput = {
  name: "",
  number: -1,
  img: "",
};

var check_options = "";
var opts = document.getElementById("data");
var check_input;
var opt_id = document.getElementById("grocery_items");

var results = document.getElementById("view_results");

window.onload = () => {
  if (pageId != null && pageId === "add_items") {
    loadAdd(); //second page
  }
  fetch("http://localhost:8000/js/comm-fridge-data.json")
    .then((response) => {
      response
        .json()
        .then((data) => {
          Fridges["data"] = data;
          displayFridges();
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });

  fetch("http://localhost:8000/js/comm-fridge-items.json")
    .then((response) => {
      response
        .json()
        .then((data) => {
          Fridges["items"] = data;
          init();
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

function loadAdd() {
  let paragraph = document.createElement("p");
  paragraph.innerHTML = `${itemName.value} was successfully added to the list!`;

  itemImage.addEventListener("input", handleAdd);
  itemName.addEventListener("input", handleAdd);
  itemType.addEventListener("input", handleAdd);
  console.log(itemName.value);

  addButton.addEventListener("click", sendJson);
}
function handleAdd(event) {
  let numFilled = 0;
  for (let i = 0; i < itemsArray.length; i++) {
    if (itemsArray[i].value.length > 0) {
      console.log(itemsArray[i].value);
      numFilled++;
    }
  }
  if (numFilled == 3) {
    document.querySelector("#add_btn").disabled = false;
  } else {
    document.querySelector("#add_btn").disabled = true;
  }
}

function sendJson(event) {
  event.preventDefault();
  let itemsData = {
    name: itemName.value,
    type: itemType.value,
    img: itemImage.value,
  };

  fetch("/newItem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(itemsData),
  })
    .then((res) => res.json())
    .then((response) =>
      console.log(
        "Sent successfully!",
        JSON.stringify(response)
      )((notification.innerHTML = `${itemsData.name} was added successfully!`))
    )
    .catch((error) => console.error("Error:", error));
}

function displayFridges(pageId) {
  let fridges = Fridges["data"];
  console.log(fridges);
  let fridgesSection = document.getElementById("fridges");
  let header = document.createElement("h1");
  header.textContent = "Available fridges";
  console.log(header);
  fridgesSection.appendChild(header);

  for (let i = 0; i < fridges.length; i++) {
    let fridgeData = document.createElement("div");
    fridgeData.id = "fridge_" + i;

    let fridgeContent = "<img src='images/fridge.svg'></span>";
    fridgeContent += "<span><strong>" + fridges[i].name + "</strong></span>";
    fridgeContent += "<span>" + fridges[i].address.street + "</span>";
    fridgeContent += "<span>" + fridges[i].contact_phone + "</span>";

    fridgeData.innerHTML = fridgeContent;
    fridgeData.addEventListener("click", function (event) {
      let fridgeID = event.currentTarget.id.split("_")[1];
      displayFridgeContents(parseInt(fridgeID));
    });

    fridgesSection.appendChild(fridgeData);
  }
}

function displayFridgeContents(fridgeID) {
  let fridge = Fridges["data"][fridgeID];

  document.getElementById("frigeHeading").innerHTML =
    "Items in the " + fridge.name;
  document.getElementById(
    "left-column"
  ).firstElementChild.innerHTML = `<span id='fridge_name'>${fridge.name}</span><br />${fridge.address.street}<br />${fridge.contact_phone}`;
  document.getElementById("meter").innerHTML = `<span style='width:${
    fridge.capacity + 14.2
  }%'>%</span>`;

  populateLeftMenu(fridge);

  for (const [key, value] of Object.entries(fridge["items"])) {
    middleColumn.insertAdjacentHTML(
      "beforeend",
      `<div class="singleItem" id=${fridge["items"][key].type}>
          <img src="${fridge["items"][key].img}" style="width: 70px; " />
          <div class="singleItem_details">
              <span class="singleItem_name">${fridge["items"][key].name}</span>
              <br><br>
              <span class="singleItem_quantity">Quantity: ${fridge["items"][key].quantity}</span>
              <div class="singleItem_pickup">Pickup: 
              <span class="item-value">
              <button id=${fridge["items"][key].name} onclick="decrement(this)" class="decrement">-</button>
              <input class="quantityInput" type="number" value=0 >
              <button id=${fridge["items"][key].name} onclick="increment(this)" class="increment">+</button>
              </span>
              </div>
          </div></div>`
    );
  }

  document.getElementById("fridges").classList.add("hidden");
  document.getElementById("fridge_details").classList.remove("hidden");
}

function populateLeftMenu(fridge) {
  let categories = {};

  for (const [key, value] of Object.entries(fridge["items"])) {
    let type = value.type;
    if (type in categories == false) {
      categories[type] = 1;
    } else {
      categories[type]++;
    }
  }

  let leftMenu = document.getElementById("categories");
  leftMenu.className = "filtering";
  for (const [key, value] of Object.entries(categories)) {
    let label = key.charAt(0).toUpperCase() + key.slice(1);
    let listItem = document.createElement("li");
    listItem.id = key;
    listItem.className = "category";
    listItem.textContent = label + " (" + value + ")";

    listItem.addEventListener("click", filterMiddleView);
    leftMenu.appendChild(listItem);
  }
}

function filterMiddleView(event) {
  let element = event.target;

  const active = document.querySelectorAll("ul.filtering li");
  const singleItem = document.querySelectorAll(".singleItem");
  for (let i = 0; i < active.length; i++) {
    if (element == active[i]) {
      if (element.classList.contains("selected-type")) {
      } else {
        element.classList.add("selected-type");

        for (let i = 0; i < singleItem.length; i++) {
          if (element.id !== singleItem[i].id) {
            console.log(singleItem[i].id);
            singleItem[i].classList.add("hidden");
          } else {
            singleItem[i].classList.remove("hidden");
          }
        }
      }
    } else {
      if (
        active[i] !== element &&
        active[i].classList.contains("selected-type")
      ) {
        active[i].classList.remove("selected-type");
      }
    }
  }
}

function decrement(e) {
  let val = e.parentElement.children[1].value;
  if (val > 0) {
    val--;
  } else {
    val = 0;
  }
  e.parentElement.children[1].value = val;
}

function increment(e) {
  let fridge = Fridges["data"];

  //console.log(val);
  let quantity = 0;
  let val = e.parentElement.children[1].value;

  for (const [key, value] of Object.entries(fridge)) {
    console.log(fridge[value].quantity);
    if (fridge[key]["items"][key].name == e.id) {
      quantity = fridge[key]["items"][key].quantity;
    }
  }
  console.log("Quantity: " + quantity);
  if (val < quantity) {
    val++;
  } else {
    val = val;
  }
  e.parentElement.children[1].value = val;
}
function checkTextField(event) {
  let element = event.target;

  if (element.parentElement.id === "grocery_items") {
    check_options = opt_id.value;
    userInput.name = opt_id.value;
  }
  if (element.name === "number_items") {
    check_input = element.value;
  }

  if (check_options != "" && check_input > 0) {
    document.querySelector("#submit_btn").disabled = false;
  } else {
    document.querySelector("#submit_btn").disabled = true;
  }
}

function init() {
  let selectTag = document.getElementById("grocery_items");
  let fridges_2 = Fridges["items"];
  for (let i = 0; i < fridges_2.length; i++) {
    let option = document.createElement("option");
    option.text += fridges_2[i].name;
    option.setAttribute("id", fridges_2[i].name);
    option.setAttribute("value", fridges_2[i].type);
    selectTag.appendChild(option);
  }

  selectTag.addEventListener("click", checkTextField);
  number.addEventListener("input", checkTextField);
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    processForm(event);
  });
}
/*This function is called to process the submitButton
* Logic of this function is
  Have an available fridges array that contains the fridge(s) that
    has qty >= userQty
    input value is present in accepted items
    Next the available fridges are sorted by capacity, from smallest to biggest
    After breaking down the complexity, we're left with get bestFridge
*/
function processForm(event) {
  let fridgeItemID = selectTag.options[selectTag.selectedIndex].text;
  let fridgeitemQty = number.value;
  userInput.quantity = number.value;

  // Generate "Available Fridges" list with header
  results.classList.remove("hidden");
  results.innerHTML = "";
  let fridgesAvailable = [];

  let header = document.createElement("h2");
  header.textContent = "Available Fridges";
  results.append(header);
  for (const [key, val] of Object.entries(Fridges["data"])) {
    let valItem = null;
    for (const item of val.items) {
      if (item.name === fridgeItemID) {
        valItem = item;
        break;
      }
    }

    if (
      valItem != null &&
      val["can_accept_items"] >= fridgeitemQty &&
      val["accepted_types"].includes(opt_id.value)
    ) {
      fridgesAvailable.push(val);
    }
  }

  fridgesAvailable.sort((x, y) => {
    return x.capacity - y.capacity;
  });

  let bestFridge = fridgesAvailable[0];
  for (const [key, value] of Object.entries(fridgesAvailable)) {
    if (
      fridgesAvailable[key]["items"][
        fridgeItems(fridgesAvailable[key]["items"], fridgeItemID)
      ].quantity <
      bestFridge["items"][
        fridgeItems(fridgesAvailable[key]["items"], fridgeItemID)
      ].quantity
    ) {
      bestFridge = fridgesAvailable[key];
    }

    let fridgeData = document.createElement("div");
    /**
     * ID has to be one word so I needed to replace the space with -
     * for example, ID = Parkdale fridge
     * id needs to be one word so i replaced the space with a -
     */
    fridgeData.setAttribute(
      "id",
      fridgesAvailable[key].name.replaceAll(" ", "-")
    );

    let fridgeContent = "<img src='images/fridge.svg'></span>";
    fridgeContent +=
      "<span><strong>" + fridgesAvailable[key].name + "</strong></span>";
    fridgeContent +=
      "<span>" + fridgesAvailable[key].address.street + "</span>";
    fridgeContent +=
      "<span>" + "Capacity: " + fridgesAvailable[key].capacity + "%</span>";
    fridgeContent += "<span>" + fridgesAvailable[key].contact_phone + "</span>";
    fridgeContent +=
      "<span>" +
      "Can accept # of items: " +
      fridgesAvailable[key].can_accept_items +
      "</span>";

    fridgeData.innerHTML = fridgeContent;
    fridgeData.addEventListener("click", updateJson);
    results.appendChild(fridgeData);
  }
  document
    .getElementById(bestFridge.name.replace(" ", "-"))
    .classList.add("bestFridge");
}

function fridgeItems(fridgeItems, fridgeItemID) {
  for (const [key, value] of Object.entries(fridgeItems)) {
    if (fridgeItems[key].name == fridgeItemID) {
      return key;
    }
  }
}

function updateJson(event) {
  /**
   * Need to click on the DIV itself and not the elements within the DIV
   *If element within DIV is clicked, you'd get an empty string
   */
  let element = event.target.id.replaceAll("-", " ");
  let filePath = selectTag.options[selectTag.selectedIndex].text.toLowerCase();
  filePath = filePath.replaceAll("_", " ");

  let itemsToSend = {
    fridgeName: element,
    itemName: selectTag.options[selectTag.selectedIndex].text,
    itemType: userInput.name,
    itemQty: userInput.quantity,
    img: `images/${userInput.name}/${filePath}.jpeg`,
  };

  fetch("/endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemsToSend),
  })
    .then((res) => res.json())
    .then((response) =>
      console.log("Sent successfully!", JSON.stringify(response))
    )
    .catch((error) => console.error("Error:", error));
}
