const APIkey = "82419201b70a640e24addb464cc51a86";
const token = "e38724577bf4f09a950b244769bab02b3c66c1ad400c194a0c453f2ad48f833e";
const board_id = "5e84855c0e3020311734d71b";
const list_id = "5e85df93edcbde48590e50db";
const list_name = "to Do";
const base_url = "https://api.trello.com/1/";
var cardIdOnModal = 0;
var cardContainer = document.getElementsByClassName("card-container")[0];

document.addEventListener("DOMContentLoaded", function () {
  fetchAllCardAPI();
});

function fetchAllCardAPI() {
  let url = `${base_url}lists/${list_id}/cards?key=${APIkey}&token=${token}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("successfully fetched");
      fetchAllCards(data);
    })
    .catch((error) => {
      let topParentElement = document.getElementsByClassName("list")[0];
      let bodyTag = document.getElementsByTagName("body")[0];
      let errorStatus = document.createElement("h3");
      errorStatus.appendChild(document.createTextNode("Page Not Found"));
      let errorLine = document.createElement("p");
      errorLine.appendChild(document.createTextNode(error));
      topParentElement.style.display = "none";
      bodyTag.appendChild(errorStatus);
      bodyTag.appendChild(errorLine);
    });
}

function fetchAllCards(data) {
  data.forEach((card) => {
    createCardSkeleton(card.id, card.name);
  });
}
function createCardSkeleton(cardId, title) {
  let cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardBody.appendChild(document.createTextNode(title));

  let deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-light delete-card";
  deleteBtn.appendChild(document.createTextNode("X"));
  let cards = document.createElement("div");
  cards.className = "card";

  cardBody.setAttribute("data-cardId", cardId);
  cardBody.setAttribute("data-toggle", "modal");
  cardBody.setAttribute("data-target", "#modalForCards");

  cards.appendChild(cardBody);
  cards.appendChild(deleteBtn);
  cardContainer.appendChild(cards);
}

function fetchAllChecklistAPI(cardId) {
  let url = `${base_url}cards/${cardId}/checklists?key=${APIkey}&token=${token}`;
  console.log(url);
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      fetchAllChecklistData(data);
    })
    .catch((error) => {
      let topParentElement = document.getElementsByClassName("list")[0];
      let bodyTag = document.getElementsByTagName("body")[0];
      let errorStatus = document.createElement("h3");
      errorStatus.appendChild(document.createTextNode("Page Not Found"));
      let errorLine = document.createElement("p");
      errorLine.appendChild(document.createTextNode(error));
      topParentElement.style.display = "none";
      bodyTag.appendChild(errorStatus);
      bodyTag.appendChild(errorLine);
    });
}

function fetchAllChecklistData(data) {
  data.forEach((checklistObj) => {
    let outputData = createSkeletonForCheckList(
      checklistObj.id,
      checklistObj.name
    );
    if (checklistObj.checkItems.length > 0) {
      let progressbar = outputData[0];
      let checklistContent = outputData[1];
      let countCheckedItem = 0;
      let itemCount = parseInt(progressbar.dataset.checkitemcount);
      checklistObj.checkItems.forEach((checkitemObj) => {
        let checkboxTitle = checkitemObj.name;
        itemCount++;
        let outputArray = createSkeletonForItems(
          checklistContent,
          checkboxTitle,
          checkitemObj.id
        );

        if (checkitemObj.state === "complete") {
          let checkBoxInput = outputArray[0];
          let checkboxLabel = outputArray[1];
          countCheckedItem++;
          checkBoxInput.checked = true;
          let delTag = document.createElement("del");
          delTag.appendChild(
            document.createTextNode(checkboxLabel.textContent)
          );
          checkboxLabel.textContent = "";
          checkboxLabel.appendChild(delTag);
        }
      });
      progressbarUpdation(progressbar, itemCount, countCheckedItem);
    }
  });
}
function createSkeletonForItems(checklistContent, checkboxTitle, itemId) {
  let checkBoxInput = document.createElement("input");
  checkBoxInput.className = "form-check-input";
  checkBoxInput.type = "checkbox";
  checkBoxInput.value = "";

  let checkboxLabel = document.createElement("label");
  checkboxLabel.className = "form-check-label";
  checkboxLabel.setAttribute("data-checkitemid", itemId);
  checkboxLabel.appendChild(document.createTextNode(checkboxTitle));

  let updateItemInput = document.createElement("input");
  updateItemInput.className = "form-control checkItem";
  updateItemInput.type = "text";
  updateItemInput.value = "";

  let updateBtn = document.createElement("button");
  updateBtn.className = "btn btn-success update-checkItem";
  updateBtn.type = "button";
  updateBtn.appendChild(document.createTextNode("update"));

  let deleteItemBtn = document.createElement("button");
  deleteItemBtn.className = "btn btn-secondary delete-checkItem";
  deleteItemBtn.type = "button";
  deleteItemBtn.appendChild(document.createTextNode("Delete Item"));

  let cancelUpdate = document.createElement("button");
  cancelUpdate.className = "btn btn-danger cancel-checkItem";
  cancelUpdate.type = "button";
  cancelUpdate.appendChild(document.createTextNode("cancel"));

  let updateElementDiv = document.createElement("div");
  updateElementDiv.className = "update-item-area";
  updateElementDiv.appendChild(updateItemInput);
  updateElementDiv.appendChild(updateBtn);
  updateElementDiv.appendChild(deleteItemBtn);
  updateElementDiv.appendChild(cancelUpdate);

  let formCheckElement = document.createElement("div");
  formCheckElement.className = "form-check";
  formCheckElement.appendChild(checkBoxInput);
  formCheckElement.appendChild(checkboxLabel);
  formCheckElement.appendChild(updateElementDiv);
  checklistContent.appendChild(formCheckElement);

  return [checkBoxInput, checkboxLabel];
}

function createSkeletonForCheckList(checklistId, checklistTitle) {
  let pElement = document.createElement("p");
  pElement.className = "checklist-title";
  pElement.appendChild(document.createTextNode(checklistTitle));

  let deleteChecklist = document.createElement("button");
  deleteChecklist.className = "button delete-checklist";
  deleteChecklist.appendChild(document.createTextNode("delete"));

  let checkListHeader = document.createElement("div");
  checkListHeader.className = "checklist-header";
  checkListHeader.appendChild(pElement);
  checkListHeader.appendChild(deleteChecklist);

  let progressbar = document.createElement("div");
  progressbar.className = "progress-bar";
  progressbar.setAttribute("role", "progressbar");
  progressbar.style.width = "0%";
  progressbar.setAttribute("aria-valuenow", "0");
  progressbar.setAttribute("aria-valuemin", "0");
  progressbar.setAttribute("aria-valuemax", "100");
  progressbar.setAttribute("data-checkItemCount", "0");
  progressbar.setAttribute("data-checkedItem", "0");
  progressbar.appendChild(document.createTextNode("0%"));

  let progressDiv = document.createElement("div");
  progressDiv.className = "progress";
  progressDiv.appendChild(progressbar);

  let checklistContent = document.createElement("div");
  checklistContent.className = "checklist-content";
  checklistContent.appendChild(checkListHeader);
  checklistContent.appendChild(progressDiv);

  let inputItem = document.createElement("input");
  inputItem.type = "text";
  inputItem.className = "form-control item";
  inputItem.value = "";

  let addBtn = document.createElement("button");
  addBtn.className = "btn btn-success add-item";
  addBtn.type = "button";
  addBtn.appendChild(document.createTextNode("Add"));

  let cancelItemBtn = document.createElement("button");
  cancelItemBtn.className = "btn btn-danger cancel-item";
  cancelItemBtn.type = "button";
  cancelItemBtn.appendChild(document.createTextNode("Cancel"));

  let addItemTextArea = document.createElement("div");
  addItemTextArea.className = "add-item-textarea";
  addItemTextArea.appendChild(inputItem);
  addItemTextArea.appendChild(addBtn);
  addItemTextArea.appendChild(cancelItemBtn);

  let addItemBtn = document.createElement("button");
  addItemBtn.className = "button add-items";
  addItemBtn.appendChild(document.createTextNode("Add item"));

  let checklistContainer = document.createElement("div");
  checklistContainer.className = "checklist-container";
  checklistContainer.appendChild(checklistContent);
  checklistContainer.appendChild(addItemTextArea);
  checklistContainer.appendChild(addItemBtn);
  checklistContainer.setAttribute("data-checklistId", checklistId);

  let modalbody = document.getElementById("modalBody");
  modalbody.appendChild(checklistContainer);
  return [progressbar, checklistContent];
}

lists.onclick = function (event) {
  if (event.target.className === "btn btn-light delete-card") {
    deleteCards(event);
  } else if (event.target.id === "addAnotherCard") {
    showTextArea();
  } else if (event.target.className === "btn btn-success") {
    addCardAPI();
  } else if (event.target.className === "btn btn-danger") {
    cancelCardAdd();
  } else if (event.target.className === "card-body") {
    displayCardNameOnModal(event);
  } else {
    return;
  }
};
modalForCards.onclick = function (event) {
  if (event.target.id === "checklistBtn") {
    showCheckListTextArea();
  } else if (event.target.className === "btn btn-success checklist") {
    addCheckListAPI();
  } else if (event.target.className === "btn btn-danger checklist") {
    hideCheckListTextArea();
  } else if (event.target.className === "button add-items") {
    showAddItemTextArea(event);
  } else if (event.target.className === "btn btn-success add-item") {
    addItemsAPIInChecklist(event);
  } else if (event.target.className === "btn btn-danger cancel-item") {
    hideAdditemTextArea(event);
  } else if (event.target.className === "form-check-input") {
    markCheckboxItem(event);
  } else if (event.target.className === "button delete-checklist") {
    deleteChecklist(event);
  } else if (event.target.className === "form-check-label") {
    showCheckListItemMenu(event);
  } else if (event.target.className === "btn btn-success update-checkItem") {
    updateCheckItem(event);
  } else if (event.target.className === "btn btn-secondary delete-checkItem") {
    deleteCheckItem(event);
  } else if (event.target.className === "btn btn-danger cancel-checkItem") {
    cancelCheckItemUpdate(event);
  } else if(event.target.className === 'modal fade show') {
    clearModalData();
  } else {
    return;
  }
};

function deleteCards(event) {
  let url = `${base_url}cards/${event.target.previousSibling.dataset.cardid}?key=${APIkey}&token=${token}`;
  let card = event.target.closest(".card");
  deleteAPIForCardAndChecklist(url, card);
}
function deleteChecklist(e) {
  let checklistContainer = e.target.closest(".checklist-container");
  let url = `${base_url}cards/${cardIdOnModal}/checklists/${checklistContainer.dataset.checklistid}?key=${APIkey}&token=${token}`;
  deleteAPIForCardAndChecklist(url, checklistContainer);
}
function deleteAPIForCardAndChecklist(url, containerToDelete) {
  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      containerToDelete.remove();
      console.log("Successfully removed");
    })
    .catch((error) => {
      let topParentElement = document.getElementsByClassName("list")[0];
      let bodyTag = document.getElementsByTagName("body")[0];
      let errorStatus = document.createElement("h3");
      errorStatus.appendChild(document.createTextNode("Page Not Found"));
      let errorLine = document.createElement("p");
      errorLine.appendChild(document.createTextNode(error));
      topParentElement.style.display = "none";
      bodyTag.appendChild(errorStatus);
      bodyTag.appendChild(errorLine);
    });
}
function deleteCheckItem(e) {
  let checklistContainer = e.target.closest(".checklist-container");
  let checklistId = checklistContainer.dataset.checklistid;
  let checkItemId = e.target.parentElement.previousSibling.dataset.checkitemid;
  let url = `${base_url}checklists/${checklistId}/checkItems/${checkItemId}?key=${APIkey}&token=${token}`;
  deleteAPIForCardAndChecklist(url, e.target.parentElement.parentElement);
  let checklistContent = checklistContainer.children[0];

  let progressbar = checklistContent.children[1].firstElementChild;
  let itemCount = progressbar.dataset.checkitemcount;
  itemCount--;
  progressbarUpdation(progressbar, itemCount, progressbar.dataset.checkeditem);
}
function showTextArea() {
  document.getElementById("addAnotherCard").style.display = "none";
  document.getElementById("titleSpace").style.display = "block";
}
function cancelCardAdd() {
  document.getElementById("addAnotherCard").style.display = "block";
  document.getElementById("titleSpace").style.display = "none";
}
function showCheckListTextArea() {
  document.getElementById("checklistBtn").style.display = "none";
  document.getElementById("checklistTextArea").style.display = "inline-block";
}
function hideCheckListTextArea() {
  document.getElementById("checklistBtn").style.display = "inline-block";
  document.getElementById("checklistTextArea").style.display = "none";
}
function displayCardNameOnModal(e) {
  document.getElementById("modalTitle").textContent = e.target.textContent;
  cardIdOnModal = e.target.dataset.cardid;
  fetchAllChecklistAPI(e.target.dataset.cardid); //check here using flag that this method
  //should not get called 2nd time.
}
function showAddItemTextArea(e) {
  e.target.style.display = "none";
  e.target.previousSibling.style.display = "block";
}
function hideAdditemTextArea(e) {
  e.target.parentElement.nextSibling.style.display = "block";
  e.target.parentElement.style.display = "none";
}
function showCheckListItemMenu(e) {
  Array.from(document.getElementsByClassName("update-item-area")).forEach(
    (classEle) => {
      if (classEle.style.display !== "none") {
        classEle.style.display = "none";
      }
    }
  );
  e.target.nextSibling.style.display = "block";
  e.target.closest(".checklist-container").lastElementChild.style.display =
    "none";
}
function cancelCheckItemUpdate(e) {
  e.target.parentElement.style.display = "none";
  e.target.closest(".checklist-container").lastElementChild.style.display =
    "block";
}
function clearModalData() {
  let checklistContainer = document.getElementsByClassName('checklist-container');
  Array.from(checklistContainer).forEach(checklistObj => {
    checklistObj.remove();
  })
}
function markItemAsChecked(checkboxLabel) {
  let delTag = document.createElement("del");
  delTag.appendChild(document.createTextNode(checkboxLabel.textContent));
  checkboxLabel.textContent = "";
  checkboxLabel.appendChild(delTag);
}
function markItemAsUnchecked(checkboxLabel) {
  let text = checkboxLabel.firstElementChild.textContent;
  checkboxLabel.firstElementChild.remove();
  checkboxLabel.textContent = text;
}
function progressbarUpdation(progressbar, itemCount, countCheckedItem) {
  progressbar.setAttribute("data-checkItemCount", itemCount);
  progressbar.setAttribute("data-checkedItem", countCheckedItem);
  let calcPercentage = Math.ceil(100 / itemCount);
  if (itemCount === countCheckedItem) {
    calcPercentage = 100;
  } else if (countCheckedItem === 0) {
    calcPercentage = 0;
  } else {
    calcPercentage = calcPercentage * countCheckedItem;
  }
  progressbar.style.width = `${calcPercentage}%`;
  progressbar.setAttribute("aria-valuenow", calcPercentage);
  progressbar.setAttribute("aria-valuemin", "0");
  progressbar.setAttribute("aria-valuemax", "100");
  progressbar.textContent = `${calcPercentage}%`;
}
function markCheckboxItem(e) {
  let checkboxLabel = e.target.nextSibling;
  let progressElement = e.target.closest(".checklist-content").children[1]
    .firstElementChild;
  let checkItemCount = parseInt(progressElement.dataset.checkitemcount);
  let countCheckedItem = parseInt(progressElement.dataset.checkeditem);
  if (e.target.checked) {
    countCheckedItem++;
    let url = `${base_url}cards/${cardIdOnModal}/checkItem/${checkboxLabel.dataset.checkitemid}?state=complete&key=${APIkey}&token=${token}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        progressbarUpdation(progressElement, checkItemCount, countCheckedItem);
        markItemAsChecked(checkboxLabel);
        console.log("Success:", data.state);
      })
      .catch((error) => {
        let topParentElement = document.getElementsByClassName("list")[0];
        let bodyTag = document.getElementsByTagName("body")[0];
        let errorStatus = document.createElement("h3");
        errorStatus.appendChild(document.createTextNode("Page Not Found"));
        let errorLine = document.createElement("p");
        errorLine.appendChild(document.createTextNode(error));
        topParentElement.style.display = "none";
        bodyTag.appendChild(errorStatus);
        bodyTag.appendChild(errorLine);
      });
  } else {
    countCheckedItem--;
    let url = `${base_url}cards/${cardIdOnModal}/checkItem/${checkboxLabel.dataset.checkitemid}?state=incomplete&key=${APIkey}&token=${token}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        progressbarUpdation(progressElement, checkItemCount, countCheckedItem);
        markItemAsUnchecked(checkboxLabel);
        console.log("Success:", data.state);
      })
      .catch((error) => {
        let topParentElement = document.getElementsByClassName("list")[0];
        let bodyTag = document.getElementsByTagName("body")[0];
        let errorStatus = document.createElement("h3");
        errorStatus.appendChild(document.createTextNode("Page Not Found"));
        let errorLine = document.createElement("p");
        errorLine.appendChild(document.createTextNode(error));
        topParentElement.style.display = "none";
        bodyTag.appendChild(errorStatus);
        bodyTag.appendChild(errorLine);
      });
  }
}
function updateCheckItem(e) {
  let checkItemLabel = e.target.closest(".update-item-area").previousSibling;
  if (e.target.previousSibling.value.length > 0) {
    let url = `${base_url}cards/${cardIdOnModal}/checkItem/${checkItemLabel.dataset.checkitemid}?name=${e.target.previousSibling.value}&key=${APIkey}&token=${token}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        checkItemLabel.textContent = e.target.previousSibling.value;
        console.log("Success:", data.name);
      })
      .catch((error) => {
        let topParentElement = document.getElementsByClassName("list")[0];
        let bodyTag = document.getElementsByTagName("body")[0];
        let errorStatus = document.createElement("h3");
        errorStatus.appendChild(document.createTextNode("Page Not Found"));
        let errorLine = document.createElement("p");
        errorLine.appendChild(document.createTextNode(error));
        topParentElement.style.display = "none";
        bodyTag.appendChild(errorStatus);
        bodyTag.appendChild(errorLine);
        console.error("Error:", error);
      });
  } else {
    alert("Please enter some data");
  }
}
function addItemsAPIInChecklist(event) {
  let checklistContainer = event.target.closest(".checklist-container");
  let checkListContent = checklistContainer.firstElementChild;
  let progressbar = checkListContent.children[1].firstElementChild;
  let checkboxTitle = event.target.previousSibling.value;
  if (checkboxTitle.length > 0) {
    let url = `${base_url}checklists/${checklistContainer.dataset.checklistid}/checkItems?name=${checkboxTitle}&key=${APIkey}&token=${token}`;
    console.log(url);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let itemCount = progressbar.dataset.checkitemcount;
        itemCount++;
        let countCheckedItem = parseInt(progressbar.dataset.checkeditem);
        progressbarUpdation(progressbar, itemCount, countCheckedItem);
        createSkeletonForItems(checkListContent, checkboxTitle, data.id);
        console.log("Success:", data.name);
      })
      .catch((error) => {
        let topParentElement = document.getElementsByClassName("list")[0];
        let bodyTag = document.getElementsByTagName("body")[0];
        let errorStatus = document.createElement("h3");
        errorStatus.appendChild(document.createTextNode("Page Not Found"));
        let errorLine = document.createElement("p");
        errorLine.appendChild(document.createTextNode(error));
        topParentElement.style.display = "none";
        bodyTag.appendChild(errorStatus);
        bodyTag.appendChild(errorLine);
        console.error("Error:", error);
      });
  } else {
    alert("please enter some data");
  }
  console.log(checkListContent);
}

function addCheckListAPI() {
  let checklistTitle = document.getElementById("checkListTitle").value;
  console.log(checklistTitle);
  if (checklistTitle.length > 0) {
    let url = `${base_url}cards/${cardIdOnModal}/checklists?name=${checklistTitle}&key=${APIkey}&token=${token}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        createSkeletonForCheckList(data.id, checklistTitle);
        hideCheckListTextArea();
        console.log("Success:", data.name);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  } else {
    alert("please enter some data");
  }
}
function addCardAPI() {
  let title = document.getElementById("cardTitle").value;
  if (title.length > 0) {
    let url = `${base_url}cards?name=${title}&idList=${list_id}&key=${APIkey}&token=${token}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        createCardSkeleton(data.id, title);
        cancelCardAdd();
        console.log("Success:", data.name);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("please enter some data");
  }
}
