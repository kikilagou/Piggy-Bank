// DATA MODULE
var dataController = (function () {

    var Expense = function(id, name, description, amount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.amount = amount;
    }

    var Income = function(id, name, description, amount) {
        this.id = id;
        this.name = name
        this.description = description;
        this.amount = amount;
    }

    data = {
        allItems: {
            '+': [],
            '-': []
        }, 
        totals: {
            '+': 0,
            '-': 0
        }
    }

    // Allow other functions to add items 
    return {
        addItem: function(type, name, desc, amount) {
            var newItem, ID;

            if(data.allItems[type].length > 0 ){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
             
            if (type === '+') {
                newItem = new Income(ID, name, desc, amount);
            } else if (type === '-') {
                newItem = new Expense(ID, name, desc, amount);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        testing: function() {
            console.log(data); 
        }
    }


})();

// UI MODULE
var UIController = (function () {

    var DOMStrings = {
        incomeButton: '#income-button',
        incomeName: '#income-name',
        incomeDesc: '#income-description',
        incomeAmount: '#income-amount',
        expenseButton: '#expense-button',
        expenseName: '#expense-name',
        expenseDesc: '#expense-description',
        expenseAmount: '#expense-amount'
    }
    return {
        getIncomeInput: function () {
            return {
                type: document.querySelector(DOMStrings.incomeButton).value,
                name: document.querySelector(DOMStrings.incomeName).value,
                description: document.querySelector(DOMStrings.incomeDesc).value,
                amount: document.querySelector(DOMStrings.incomeAmount).value
            }
        },
        getExpenseInput: function () {
            return {
                type: document.querySelector(DOMStrings.expenseButton).value,
                name: document.querySelector(DOMStrings.expenseName).value,
                description: document.querySelector(DOMStrings.expenseDesc).value,
                amount: document.querySelector(DOMStrings.expenseAmount).value
            }
        },

        addListItem: function(obj, type) {
            // create html string with placeholder text

            //  replace the placeholder text with actual data

            // insert html into the dom 
        },

        getDOMStrings: function () {
            return DOMStrings;
        }
    }

})();

// CONTROLLER MODULE
var controller = (function (dataCtrl, UICtrl) {

    var setUpEventListeners = function () {
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.incomeButton).addEventListener('click', function () {
            ctrlAddItem('+');
        });
        document.querySelector(DOM.expenseButton).addEventListener('click', function () {
            ctrlAddItem('-');
        });

        
    }

    var ctrlAddItem = function (type) {
        var input, newItem;

        // get input data from fields
        if (type === "+") {
            input = UICtrl.getIncomeInput()
            console.log(input)
        } else if (type === '-') {
            input = UICtrl.getExpenseInput();
            console.log(input)
        }

        // add item to data contorller
        newItem = dataCtrl.addItem(input.type, input.name, input.description, input.amount); 

        // add new item to user interface 
        // calc budget
        // display budget 

        //test
        // console.log('it works')
    }

    return {
        init: function () {
            console.log("App has started")
            setUpEventListeners();
        }
    };

})(dataController, UIController);

controller.init();