import { appSettings } from "./secrets.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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
  shoppingListEl.append(newEl);
}
function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

addButtonEl.addEventListener("click" , function() {
  let inputValue = inputFieldEl.value;
  push(shoppingListInDB, inputValue);
  clearInputFieldEl();
});

onValue(shoppingListInDB, function(snapshot) {
  let itemsArray = Object.entries(snapshot.val());
  clearShoppingListEl();
  for(let i = 0 ; i < itemsArray.length; i++){
    let currentItem = itemsArray[i];
    appendItemToShoppingListEl(currentItem);
  }

})