import { appSettings } from "./secrets.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue , remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");


const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById('shopping-list');


function clearInputFieldEl() {
  inputFieldEl.value = "";
}
function appendItemToShoppingListEl(item) {
  //shoppingListEl.innerHTML += `<li>${itemValue}</li>`
  let itemID = item[0]
  let itemValue = item[1];

  let newEl = document.createElement("li");
  newEl.textContent = itemValue;
  newEl.addEventListener("click", function() {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
    remove(exactLocationOfItemInDB);
  })

  shoppingListEl.append(newEl);
}
function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function inputFieldCreateItem() {
  let inputValue = inputFieldEl.value;
  if(inputValue != "") {
    push(shoppingListInDB, inputValue);
    clearInputFieldEl();
  }
}

inputFieldEl.addEventListener('keyup', function (e) {
  if (e.key === 'Enter'){
      inputFieldCreateItem();
  }
});

addButtonEl.addEventListener("click" , function() {
  inputFieldCreateItem();
});

onValue(shoppingListInDB, function(snapshot) {
  if(snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearShoppingListEl();
    for(let i = 0 ; i < itemsArray.length; i++){
      let currentItem = itemsArray[i];
      appendItemToShoppingListEl(currentItem);
    }
  }
  else {
    shoppingListEl.innerHTML = "No items here ... yet";
  }
})