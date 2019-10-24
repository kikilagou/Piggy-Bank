// DATA MODULE
var dataController = (function () {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    data = {
        allItems: {
            inc: [],
            exp: []
        }, 
        totals: {
            inc: 0,
            exp: 0
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
        getDOMStrings: function () {
            return DOMStrings;
        }
    }

})();

// CONTROLLER MODULE
var controller = (function (budgetCtrl, UICtrl) {

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
        // get input data from fields
        if (type === "+") {
            var input = UICtrl.getIncomeInput()
            console.log(input)
        } else if (type === '-') {
            var input = UICtrl.getExpenseInput();
            console.log(input)
        }

        // add item to data contorller
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