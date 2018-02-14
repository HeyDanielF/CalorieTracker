//Storage Controller
const StorageCtrl = (function(){

    //public methods
    return {
        storeItem: (item) => {
            let items;
           //check if any items in localstorage
           if(localStorage.getItem('items') === null){
               items = [];
               //push new items
               items.push(item);
               //set local storage
               localStorage.setItem('items', JSON.stringify(items));
           }else {
               //get what is in localstorage
                items = JSON.parse(localStorage.getItem('items'));

                //push new item
                items.push(item);

                //reset ls
                localStorage.setItem('items', JSON.stringify(items));
           }
        },
        getItemsFromStorage: () =>{
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: (updatedItem) => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item,index) => {
                if(updatedItem.id === item.id){
                    items.splice(index,1,updatedItem);
                }
            });
            
            localStorage.setItem('items', JSON.stringify(items));

        },
        deleteItemFromStorage: (id) => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item,index) => {
                if(id === item.id){
                    items.splice(index,1);
                }
            });
            
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: () => {
            localStorage.removeItem('items');
        }
    }
})();


//Item Controller
const ItemCrl = (function(){
   
    const Item = function(id,name,calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    //Data Structure / State
    const data = {
        // items : [
            // { id: 0, name: 'Steak Dinner', calories: 1000},
            // { id: 1, name: 'Cookie', calories: 400},
            // { id: 2, name: 'Eggs', calories: 300},
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: () => data.items,
        addItem:(name, calories) => {
            let ID;
            //Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }
            //calories to numer
            calories = parseInt(calories);

            //Create new Item
            newItem = new Item(ID,name,calories);
            //Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById:(id) => {
            let found = null;
            //loop through items;
            data.items.forEach((item) => {
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },
        updateItem: (name, calories) => {
            //calories to number
            calories = parseInt(calories);
            let found = null;

            data.items.forEach((item) => {
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;


        },
        deleteItem: (id) =>{
            //get ids
           const ids = data.items.map((item) => item.id);
            //get index
            const index = ids.indexOf(id);
            //remove item
            data.items.splice(index, 1);

        },
        clearAllItems: () => {
            data.items = [];
        },
        getCurrentItem: () => data.currentItem,
        setCurrentItem: (item) => {
            data.currentItem = item;
        },
        getTotalCalories: () => {
            let total = 0;

            data.items.forEach((item) => {
                total += item.calories;
            });

            //set total cal in data structure
            data.totalCalories = total;

            //return total
            return data.totalCalories;

        },
        logData: () => data
    }

})();


//UI Controller
const UICtrol = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    
    //public methods
    return {
        populateItemList: (items) =>{
            let html = '';
            items.forEach((item) => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </li>
                `;
            });

            //insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: () => 
        { return {name: document.querySelector(UISelectors.itemNameInput).value, 
                    calories: document.querySelector(UISelectors.itemCaloriesInput).value }}
        ,
        addListItem: (item) => {
            //show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            //Create li element
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add ID
            li.id = `item-${item.id}`;

            //add html
            li.innerHTML = `
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            `
            //Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);

        },
        updateListItem: (item) => {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach((listItem) => {
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>                
                    `;
                }

            });
          

        },
        deleteListItem: (id) => {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        clearInput: () => {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: () => {
            document.querySelector(UISelectors.itemNameInput).value = ItemCrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCrl.getCurrentItem().calories;
            UICtrol.showEditState();
        },
        removeItems: () => {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //turn nodelist into array
            listItems = Array.from(listItems);

            listItems.forEach((item) => {
                item.remove();
            })

        },
        hidelist: () => {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: (totalCalories) =>{
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: () => {
            UICtrol.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: () => {

            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: () => UISelectors
    }

})();
//App Controller
const App = (function(ItemCrl,UICtrol,StorageCtrl){

    //Load Event Listeners
    const loadEventListeners = () => {
        //GET UI selectors
        const UISelectors = UICtrol.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //disable submit on enter
        document.addEventListener('keypress',(e)=>{
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })

        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
        //update item event
         document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
         
         //delete item event
         document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);
         
         //back button event
         document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrol.clearEditState);

         //Clear items Event
         document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);
    }
    


    //add item submit
    const itemAddSubmit = (e) => {
        e.preventDefault();
        //Get form input from UI Controller
 
        const input  = UICtrol.getItemInput();

        //Check for name and calorie input 
        if(input.name !== '' && input.calories !== ''){
            //add item
            const newItem = ItemCrl.addItem(input.name, input.calories);

            //add item to UI list
            UICtrol.addListItem(newItem);

            //Get Total Calories
            const totalCalories = ItemCrl.getTotalCalories();
            //Add total calories to the UI
            UICtrol.showTotalCalories(totalCalories);



            //store in localStorage
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrol.clearInput();

        }

     
    }

    //click edit item
    const itemEditClick = (e) => {
        e.preventDefault();

        if(e.target.classList.contains('edit-item')){
           //get list item id
           const listId = e.target.parentNode.parentNode.id;
           //break into an array
           const listIdArr = listId.split('-');

           //get the acutal ID;
           const id = parseInt(listIdArr[1]);

           //get item
           const itemToEdit = ItemCrl.getItemById(id);
           //set current item
           ItemCrl.setCurrentItem(itemToEdit);
           //add item to form
           UICtrol.addItemToForm();
        }
    }

    //update item submit
    const itemUpdateSubmit = (e) => {
        e.preventDefault();
        //get item input
        const input = UICtrol.getItemInput();
        //Update Item
        const updatedItem = ItemCrl.updateItem(input.name, input.calories);

        //update UI
        UICtrol.updateListItem(updatedItem);

        //Get Total Calories
        const totalCalories = ItemCrl.getTotalCalories();
        //Add total calories to the UI
        UICtrol.showTotalCalories(totalCalories);

        //update localStorage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrol.clearEditState();
    }

    //delete button event
    const itemDeleteSubmit = (e) =>{
        e.preventDefault();
        const currentItem = ItemCrl.getCurrentItem();

        //delete from data structure
        ItemCrl.deleteItem(currentItem.id);

        //delete from UI
        UICtrol.deleteListItem(currentItem.id);

        //Get Total Calories
        const totalCalories = ItemCrl.getTotalCalories();
        //Add total calories to the UI
        UICtrol.showTotalCalories(totalCalories);

        //delete from ls
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrol.clearEditState();

    }

    //Clear Items Event
    const clearAllItemsClick = (e) => {

        //delete all items from data structure
        ItemCrl.clearAllItems();

        //Get Total Calories
        const totalCalories = ItemCrl.getTotalCalories();
        //Add total calories to the UI
        UICtrol.showTotalCalories(totalCalories);
        
        //hide the UL 
        UICtrol.hidelist();

        //Remove from UI
        UICtrol.removeItems();

        //clear from local storage
        StorageCtrl.clearItemsFromStorage();

        e.preventDefault();

    }
    
   //public methods
   return {
    init: () => {
        //clear edit state / set initial state
        UICtrol.clearEditState();
        
        //Fetch Items from Data Structure
        const items = ItemCrl.getItems();

        //Check if any items;
        if(items.length === 0){
            UICtrol.hidelist();
        }else{
        //populate List with Items
        UICtrol.populateItemList(items);

        }

        //Get Total Calories
        const totalCalories = ItemCrl.getTotalCalories();
        //Add total calories to the UI
        UICtrol.showTotalCalories(totalCalories);


        
        //Load Event Listeners
        loadEventListeners();

     }
    }

})(ItemCrl,UICtrol,StorageCtrl);

//Initialize App
App.init();