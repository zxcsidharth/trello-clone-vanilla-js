// import {key, token, board_id, list_id, base_url} from './constant.js';
const APIkey = '82419201b70a640e24addb464cc51a86';
const token = 'e38724577bf4f09a950b244769bab02b3c66c1ad400c194a0c453f2ad48f833e';
const board_id = "5e84855c0e3020311734d71b";
const list_id = "5e85df93edcbde48590e50db";
const list_name = "to Do";
const base_url = "https://api.trello.com/1/";
var cardIdOnModal = 0;


var cardContainer = document.getElementsByClassName('card-container')[0];

document.addEventListener("DOMContentLoaded", function(){
  let url = `${base_url}lists/${list_id}/cards?key=${APIkey}&token=${token}`;
  fetch(url)
     .then((response) => {
        return response.json();
     })
     .then((data) => {
           fetchAllCards(data);
     });
});

function fetchAllCards(data) {
  data.forEach(card => {
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.appendChild(document.createTextNode(card.name));

    cardBody.setAttribute('data-toggle', 'modal');
    cardBody.setAttribute('data-target', '#modalForCards');
    cardBody.setAttribute('data-cardId', card.id);
    

    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-light delete-card';
    deleteBtn.appendChild(document.createTextNode('X'));


    let cards = document.createElement('div');
    cards.className = 'card';
    cards.appendChild(cardBody);
    cards.appendChild(deleteBtn);
    cardContainer.appendChild(cards);
  });
  console.log(data);
}

function fetchAllChecklist(cardId) {
  let url = `${base_url}cards/${cardId}/checklists?key=${APIkey}&token=${token}`;
  fetch(url)
     .then((response) => {
        return response.json();
     })
     .then((data) => {
           fetchAllChecklistData(data);
     });

}

function fetchAllChecklistData(data){
  let modalbody = document.getElementById('modalBody');
  data.forEach(checkistObj => {
    let pElement = document.createElement('p');
    pElement.className = 'checklist-title';
    pElement.appendChild(document.createTextNode(checkistObj.name));

    let deleteChecklist = document.createElement('button');
    deleteChecklist.className = 'button delete-checklist';
    deleteChecklist.appendChild(document.createTextNode('delete'));

    let checkListHeader = document.createElement('div');
    checkListHeader.className = 'checklist-header';
    checkListHeader.appendChild(pElement);
    checkListHeader.appendChild(deleteChecklist);

    let progressbar = document.createElement('div');
    progressbar.className = 'progress-bar';
    progressbar.setAttribute('role', 'progressbar');
    progressbar.style.width = '0%';
    progressbar.setAttribute('aria-valuenow', '0');
    progressbar.setAttribute('aria-valuemin', 0);
    progressbar.setAttribute('aria-valuemax', 100);
    progressbar.appendChild(document.createTextNode('0%'));

    let progressDiv = document.createElement('div');
    progressDiv.className = 'progress';
    progressDiv.appendChild(progressbar);

    let checklistContent = document.createElement('div');
    checklistContent.className = 'checklist-content';
    checklistContent.appendChild(checkListHeader);
    checklistContent.appendChild(progressDiv);

    let inputItem = document.createElement('input');
    inputItem.type = 'text';
    inputItem.className = 'form-control item';
    inputItem.value = "";

    let addBtn = document.createElement('button');
    addBtn.className = 'btn btn-success add-item';
    addBtn.type = 'button';
    addBtn.appendChild(document.createTextNode('Add'));

    let cancelItemBtn = document.createElement('button');
    cancelItemBtn.className = 'btn btn-danger cancel-item';
    cancelItemBtn.type = 'button';
    cancelItemBtn.appendChild(document.createTextNode('Cancel'));

    let addItemTextArea = document.createElement('div');
    addItemTextArea.className = 'add-item-textarea';
    addItemTextArea.appendChild(inputItem);
    addItemTextArea.appendChild(addBtn);
    addItemTextArea.appendChild(cancelItemBtn);

    let addItemBtn = document.createElement('button');
    addItemBtn.className = 'button add-items';
    addItemBtn.appendChild(document.createTextNode('Add item'));

    let checklistContainer = document.createElement('div');
    checklistContainer.className = 'checklist-container';
    checklistContainer.appendChild(checklistContent);
    checklistContainer.appendChild(addItemTextArea);
    checklistContainer.appendChild(addItemBtn);

    checklistContainer.setAttribute('data-checklistId', checkistObj.id);
    modalbody.appendChild(checklistContainer);

  }) 
}

lists.onclick = function(event) {
  if (event.target.className === 'btn btn-light delete-card') {
    deleteCards(event);
  } else if(event.target.id === 'addAnotherCard') {
    showTextArea();
  } else if(event.target.className === 'btn btn-success') {
    addCardToTheList();
  } else if(event.target.className === 'btn btn-danger') {
    cancelCardAdd();
  } else if(event.target.id === 'checklistBtn'){
    showCheckListTextArea();
  } else if(event.target.className === 'btn btn-success checklist') {
    addCheckListToTheCard();
  } else if(event.target.className === 'btn btn-danger checklist') {
    hideCheckListTextArea();
  } else if (event.target.className === 'card-body') {
    displayCardNameOnModal(event);
  } else if (event.target.className === 'button add-items') {
    showAddItemTextArea(event);
  } else if(event.target.className === 'btn btn-success add-item') {
    addItemsInChecklist(event);
  } else if(event.target.className === 'btn btn-danger cancel-item') {
    hideAdditemTextArea(event);
  }
   else {
    return;
  }
}

// function hello(){
//   console.log('a hey');
// }

function deleteCards(event) {
  let url = `${base_url}cards/${event.target.previousSibling.dataset.cardid}?key=${APIkey}&token=${token}`;
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.json())
  .then((data) => {
    event.target.closest('.card').remove();
    console.log('Successfully removed');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function showTextArea() {
    document.getElementById('addAnotherCard').style.display = 'none';
    document.getElementById('titleSpace').style.display = 'block';
}
function cancelCardAdd() {
    document.getElementById('addAnotherCard').style.display = 'block';
    document.getElementById('titleSpace').style.display = 'none';
}

function showCheckListTextArea() {
  document.getElementById('checklistBtn').style.display = 'none';
  document.getElementById('checklistTextArea').style.display = 'inline-block';
}
function hideCheckListTextArea() {
  document.getElementById('checklistBtn').style.display = 'inline-block';
  document.getElementById('checklistTextArea').style.display = 'none';
}
function displayCardNameOnModal(e) {
  document.getElementById('modalTitle').textContent = e.target.textContent;
  cardIdOnModal = e.target.dataset.cardid;
  fetchAllChecklist(e.target.dataset.cardid)

}
function showAddItemTextArea(e) {
  e.target.style.display = 'none';
  e.target.previousSibling.style.display = 'block';
}
function hideAdditemTextArea(e) {
  e.target.parentElement.nextSibling.style.display = 'block';
  e.target.parentElement.style.display = 'none';
}
function addItemsInChecklist(event) {
  let checklistItem = event.target.closest('.checklist-container');
  let checkListContent = checklistItem.firstElementChild;
  let checkboxTitle = event.target.previousSibling.value;
  console.log(checkboxTitle);
  let checkBoxInput = document.createElement('input');
  checkBoxInput.className = 'form-check-input';
  checkBoxInput.type = 'checkbox';
  checkBoxInput.value = "";

  let checkboxLabel = document.createElement('label');
  checkboxLabel.className = 'form-check-label';
  checkboxLabel.appendChild(document.createTextNode(checkboxTitle))

  let formCheckElement = document.createElement('div');
  formCheckElement.className = 'form-check';
  formCheckElement.appendChild(checkBoxInput);
  formCheckElement.appendChild(checkboxLabel);

  checkListContent.appendChild(formCheckElement);
  console.log(checkListContent);
}

function addCheckListToTheCard() {
  let checklistTitle = document.getElementById('checkListTitle').value;
  let pElement = document.createElement('p');
  pElement.className = 'checklist-title';
  pElement.appendChild(document.createTextNode(checklistTitle));

  let deleteChecklist = document.createElement('button');
  deleteChecklist.className = 'button delete-checklist';
  deleteChecklist.appendChild(document.createTextNode('delete'));

  let checkListHeader = document.createElement('div');
  checkListHeader.className = 'checklist-header';
  checkListHeader.appendChild(pElement);
  checkListHeader.appendChild(deleteChecklist);

  let progressbar = document.createElement('div');
  progressbar.className = 'progress-bar';
  progressbar.setAttribute('role', 'progressbar');
  progressbar.style.width = '0%';
  progressbar.setAttribute('aria-valuenow', '0');
  progressbar.setAttribute('aria-valuemin', 0);
  progressbar.setAttribute('aria-valuemax', 100);
  progressbar.appendChild(document.createTextNode('0%'));

  let progressDiv = document.createElement('div');
  progressDiv.className = 'progress';
  progressDiv.appendChild(progressbar);

  let checklistContent = document.createElement('div');
  checklistContent.className = 'checklist-content';
  checklistContent.appendChild(checkListHeader);
  checklistContent.appendChild(progressDiv);

  let inputItem = document.createElement('input');
  inputItem.type = 'text';
  inputItem.className = 'form-control item';
  inputItem.value = "";

  let addBtn = document.createElement('button');
  addBtn.className = 'btn btn-success add-item';
  addBtn.type = 'button';
  addBtn.appendChild(document.createTextNode('Add'));

  let cancelItemBtn = document.createElement('button');
  cancelItemBtn.className = 'btn btn-danger cancel-item';
  cancelItemBtn.type = 'button';
  cancelItemBtn.appendChild(document.createTextNode('Cancel'));

  let addItemTextArea = document.createElement('div');
  addItemTextArea.className = 'add-item-textarea';
  addItemTextArea.appendChild(inputItem);
  addItemTextArea.appendChild(addBtn);
  addItemTextArea.appendChild(cancelItemBtn);

  let addItemBtn = document.createElement('button');
  addItemBtn.className = 'button add-items';
  addItemBtn.appendChild(document.createTextNode('Add item'));

  let checklistContainer = document.createElement('div');
  checklistContainer.className = 'checklist-container';
  checklistContainer.appendChild(checklistContent);
  checklistContainer.appendChild(addItemTextArea);
  checklistContainer.appendChild(addItemBtn);

  let url = `${base_url}cards/${cardIdOnModal}/checklists?name=${checklistTitle}&key=${APIkey}&token=${token}`;
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.json())
  .then((data) => {
    checklistContainer.setAttribute('data-checklistId', data.id);
    console.log('Success:', data.name);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

  let modalbody = document.getElementById('modalBody');
  modalbody.appendChild(checklistContainer);
  hideCheckListTextArea();
}

function addCardToTheList() {
    let title = document.getElementById('cardTitle').value;
    // now here we create a card
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.appendChild(document.createTextNode(title));

    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-light delete-card';
    deleteBtn.appendChild(document.createTextNode('X'));
    let cards = document.createElement('div');
    cards.className = 'card';
    // fetch API's Usage

    let url = `${base_url}cards?name=${title}&idList=${list_id}&key=${APIkey}&token=${token}`;
    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then((response) => response.json())
      .then((data) => {
        cardBody.setAttribute('data-cardId', data.id);
        cardBody.setAttribute('data-toggle', 'modal');
        cardBody.setAttribute('data-target', '#modalForCards');
        console.log('Success:', data.name);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    cards.appendChild(cardBody);
    cards.appendChild(deleteBtn);
    cardContainer.appendChild(cards);
    cancelCardAdd();

}


//     console.log(url);
// try to reduce the event listners
    