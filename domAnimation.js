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
     })
     .catch(error => {
        window.location.href = "./Error.html";
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
  console.log(url);
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
  data.forEach(checklistObj => {
    let pElement = document.createElement('p');
    pElement.className = 'checklist-title';
    pElement.appendChild(document.createTextNode(checklistObj.name));

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
    progressbar.setAttribute('data-checkItemCount', 0);
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
    
    if(checklistObj.checkItems.length > 0) {
      checklistObj.checkItems.forEach(checkitemObj => {
        let checkboxTitle = checkitemObj.name;
        console.log(checkboxTitle);
        let checkBoxInput = document.createElement('input');
        checkBoxInput.className = 'form-check-input';
        checkBoxInput.type = 'checkbox';
        checkBoxInput.value = "";

        let checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'form-check-label';
        checkboxLabel.setAttribute('data-checkitemid', checkitemObj.id);
        checkboxLabel.appendChild(document.createTextNode(checkboxTitle))
        if(checkitemObj.state === 'complete') {
          checkBoxInput.checked = true;
          let delElement = document.createElement('del');
          delElement.appendChild(document.createTextNode(checkboxLabel.textContent));
          checkboxLabel.textContent = "";
          checkboxLabel.appendChild(delElement);
        }

        let updateItemInput = document.createElement('input');
        updateItemInput.className = 'form-control checkItem';
        updateItemInput.type = 'text';
        updateItemInput.value = "";

        let updateBtn = document.createElement('button');
        updateBtn.className = 'btn btn-success update-checkItem';
        updateBtn.type = 'button';
        updateBtn.appendChild(document.createTextNode('update'));

        let deleteItemBtn = document.createElement('button');
        deleteItemBtn.className = 'btn btn-secondary delete-checkItem';
        deleteItemBtn.type = 'button';
        deleteItemBtn.appendChild(document.createTextNode('Delete Item'));

        let cancelUpdate = document.createElement('button');
        cancelUpdate.className = 'btn btn-danger cancel-checkItem';
        cancelUpdate.type = 'button';
        cancelUpdate.appendChild(document.createTextNode('cancel'));

        let updateElementDiv = document.createElement('div');
        updateElementDiv.className = 'update-item-area';
        updateElementDiv.appendChild(updateItemInput);
        updateElementDiv.appendChild(updateBtn);
        updateElementDiv.appendChild(deleteItemBtn);
        updateElementDiv.appendChild(cancelUpdate);

        let formCheckElement = document.createElement('div');
        formCheckElement.className = 'form-check';
        formCheckElement.appendChild(checkBoxInput);
        formCheckElement.appendChild(checkboxLabel);
        formCheckElement.appendChild(updateElementDiv);
        checklistContent.appendChild(formCheckElement);
      })
      
    }
    let checklistContainer = document.createElement('div');
    checklistContainer.className = 'checklist-container';
    checklistContainer.appendChild(checklistContent);
    checklistContainer.appendChild(addItemTextArea);
    checklistContainer.appendChild(addItemBtn);
    checklistContainer.setAttribute('data-checklistId', checklistObj.id);
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
  } else if(event.target.className === 'form-check-input') {
    markItemAsChecked(event);
  } else if(event.target.className === 'button delete-checklist') {
    deleteChecklist(event);
  } else if(event.target.className === 'form-check-label') {
    showCheckListItemMenu(event);
  } else if(event.target.className === 'btn btn-success update-checkItem') {
    updateCheckItem(event);
  } else if(event.target.className === 'btn btn-secondary delete-checkItem') {
    deleteCheckItem(event);
  } else if(event.target.className === 'btn btn-danger cancel-checkItem') {
    cancelCheckItemUpdate(event);
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

function deleteChecklist(e) {
  let checklistContainer = e.target.closest('.checklist-container');
  let url = `${base_url}cards/${cardIdOnModal}/checklists/${checklistContainer.dataset.checklistid}?key=${APIkey}&token=${token}`;
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.json())
  .then((data) => {
    checklistContainer.remove();
    console.log('Successfully removed');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  console.log(url);
}
function deleteCheckItem(e) {
  let checklistId = e.target.closest('.checklist-container').dataset.checklistid;
  let checkItemId = e.target.parentElement.previousSibling.dataset.checkitemid;
  let url = `${base_url}checklists/${checklistId}/checkItems/${checkItemId}?key=${APIkey}&token=${token}`;
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.json())
  .then((data) => {
    e.target.parentElement.parentElement.remove();
    console.log('Successfully removed');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  console.log(url);
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
  fetchAllChecklist(e.target.dataset.cardid);  //check here using flag that this method
  //fetchAllchecklistItems(e.target.dataset.);    //should not get called 2nd time.
}
function showAddItemTextArea(e) {
  e.target.style.display = 'none';
  e.target.previousSibling.style.display = 'block';
}
function hideAdditemTextArea(e) {
  e.target.parentElement.nextSibling.style.display = 'block';
  e.target.parentElement.style.display = 'none';
}
function showCheckListItemMenu(e) {
  Array.from(document.getElementsByClassName('update-item-area')).forEach(classEle => {
    if(classEle.style.display !== 'none') {
      classEle.style.display = 'none';
    }
  });
  e.target.nextSibling.style.display = 'block';
  e.target.closest('.checklist-container').lastElementChild.style.display = 'none';
}
function cancelCheckItemUpdate(e) {
  e.target.parentElement.style.display = 'none';
  e.target.closest('.checklist-container').lastElementChild.style.display = 'block';
}

function markItemAsChecked(e) {
  // console.log(e.target.checked);
  let checkboxLabel = e.target.nextSibling;
  let progressElement = e.target.parentElement.previousSibling.firstElementChild;
  let checkItemCount = progressElement.dataset.checkitemcount;
  
  if(e.target.checked) {
    let url =`${base_url}cards/${cardIdOnModal}/checkItem/${checkboxLabel.dataset.checkitemid}?state=complete&key=${APIkey}&token=${token}`; 
    console.log(url);
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((data) => {
      let delElement = document.createElement('del');
      delElement.appendChild(document.createTextNode(checkboxLabel.textContent));
      checkboxLabel.textContent = "";
      checkboxLabel.appendChild(delElement);
      console.log('Success:', data.state);
    })
    .catch((error) => {
      // window.location.href = "./Error.html";
      console.error('Error:', error);
    });
    // progressElement.dataset.checkitemcount
    console.log(e.target.nextSibling);
  } else {
    let url =`${base_url}cards/${cardIdOnModal}/checkItem/${checkboxLabel.dataset.checkitemid}?state=incomplete&key=${APIkey}&token=${token}`;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((data) => {
      let text = checkboxLabel.firstElementChild.textContent;
      checkboxLabel.firstElementChild.remove();
      checkboxLabel.textContent = text;
      console.log('Success:', data.state);
    })
    .catch((error) => {
      // window.location.href = "./Error.html";
      console.error('Error:', error);
    });
  }
}
function updateCheckItem(e) {
  let checkItemLabel = e.target.closest('.update-item-area').previousSibling;
  console.log(checkItemLabel);
  let url =`${base_url}cards/${cardIdOnModal}/checkItem/${checkItemLabel.dataset.checkitemid}?name=${e.target.previousSibling.value}&key=${APIkey}&token=${token}`; 
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.json())
  .then((data) => {
    checkItemLabel.textContent = e.target.previousSibling.value;
    console.log('Success:', data.name);
  })
  .catch((error) => {
    // window.location.href = "./Error.html";
    console.error('Error:', error);
  });

}

function addItemsInChecklist(event) {
  let checklistContainer = event.target.closest('.checklist-container');
  let checkListContent = checklistContainer.firstElementChild;
  let checkboxTitle = event.target.previousSibling.value;
  // console.log(checkboxTitle);
  let url = `${base_url}checklists/${checklistContainer.dataset.checklistid}/checkItems?name=${checkboxTitle}&key=${APIkey}&token=${token}`;
  console.log(url);
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.json())
  .then((data) => {
    let checkBoxInput = document.createElement('input');
    checkBoxInput.className = 'form-check-input';
    checkBoxInput.type = 'checkbox';
    checkBoxInput.value = "";

    let checkboxLabel = document.createElement('label');
    checkboxLabel.className = 'form-check-label';
    checkboxLabel.setAttribute('data-checkitemid', data.id)
    checkboxLabel.appendChild(document.createTextNode(checkboxTitle))

    let updateItemInput = document.createElement('input');
    updateItemInput.className = 'form-control checkItem';
    updateItemInput.type = 'text';
    updateItemInput.value = "";

    let updateBtn = document.createElement('button');
    updateBtn.className = 'btn btn-success update-checkItem';
    updateBtn.type = 'button';
    updateBtn.appendChild(document.createTextNode('update'));

    let deleteItemBtn = document.createElement('button');
    deleteItemBtn.className = 'btn btn-secondary delete-checkItem';
    deleteItemBtn.type = 'button';
    deleteItemBtn.appendChild(document.createTextNode('Delete Item'));

    let cancelUpdate = document.createElement('button');
    cancelUpdate.className = 'btn btn-danger cancel-checkItem';
    cancelUpdate.type = 'button';
    cancelUpdate.appendChild(document.createTextNode('cancel'));

    let updateElementDiv = document.createElement('div');
    updateElementDiv.className = 'update-item-area';
    updateElementDiv.appendChild(updateItemInput);
    updateElementDiv.appendChild(updateBtn);
    updateElementDiv.appendChild(deleteItemBtn);
    updateElementDiv.appendChild(cancelUpdate);

    let formCheckElement = document.createElement('div');
    formCheckElement.className = 'form-check';
    formCheckElement.appendChild(checkBoxInput);
    formCheckElement.appendChild(checkboxLabel);
    formCheckElement.appendChild(updateElementDiv);
    checkListContent.appendChild(formCheckElement);
    console.log('Success:', data.name);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
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
  progressbar.setAttribute('data-checkItemCount', 0);
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
    