// DATA MODULE
var dataController = (function () {

    var Expense = function (id, name, description, amount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.amount = amount;
    }

    var Income = function (id, name, description, amount) {
        this.id = id;
        this.name = name
        this.description = description;
        this.amount = amount;
    }

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.amount;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            '+': [],
            '-': []
        },
        totals: {
            '+': 0,
            '-': 0
        },
        budget: 0,
        percentage: -1
    }

    // Allow other functions to add items 
    return {
        addItem: function (type, name, desc, amount) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
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

        deleteItem: function (type, id) {
            var ids, index;

            // find out the index of the id we want to remove in our items array 
            var ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            // delete the item from the data structure 
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        editItem: function (id, type, name, desc, amount) {
            var ids, index;

            var ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            // edit what we want to edit
            if (index !== -1) {
                data.allItems[type].name = name;
                data.allItems[type].description = desc;
                data.allItems[type].amount = amount;
            }
        },

        calculateTotal: function () {
            // calculate total income and expenses 
            calculateTotal('+');
            calculateTotal('-');

            // calc the budget (income - expenses)
            data.budget = data.totals["+"] - data.totals["-"];

            //  calc % of income spent 
            if (data.totals["+"] > 0) {
                data.percentage = Math.round((data.totals["-"] / data.totals["+"]) * 100);

            } else {
                data.percentage = -1;
            }
        },

        getBudget: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals["+"],
                totalExp: data.totals["-"]
            }
        },

        testing: function () {
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
        expenseAmount: '#expense-amount',
        incomeContainer: ".income_container",
        expensesContainer: ".expenses_container",
        monthlyTotal: '.monthly-total',
        totalIncome: '.monthly-total-income',
        totalExpense: '.monthly-total-expense'
    }

    //  WORKING ON IMPLEMENTING DRY PRINCIPLE
    var sortTableRows = function (table, order) {

        var i, x, y;
        var switching = true;

        // Run loop until no switching is needed 
        while (switching) {
            switching = false;
            var rows = table.rows;

            // Loop to go through all rows 
            for (i = 1; i < (rows.length - 2); i++) {
                var Switch = false;

                // Fetch 2 elements that need to be compared 
                x = rows[i].getElementsByTagName("TD");
                y = rows[i + 1].getElementsByTagName("TD");

                // Check if 2 rows need to be switched 
                if (order === "low-high") {
                    if (x[1].innerHTML > y[1].innerHTML) {
                        Switch = true;
                        break;
                    }
                } else if (order === "high-low") {
                    if (x[1].innerHTML < y[1].innerHTML) {
                        Switch = true;
                        break;
                    }
                } else if (order === "alphabetically") {
                    if (x[0].innerHTML.toLowerCase() > y[0].innerHTML.toLowerCase()) {
                        Switch = true;
                        break;
                    }
                }
            }
            if (Switch) {
                // Function to switch rows and mark switch as completed 
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }

    var formatNumber = function (num, type) {
        // +  or - infront of numbers 
        // exactly 2 decimal points
        // num = Math.abs(num);
        // num = num.toFixed(2);

        // numSplit = num.split('.');
        // int = numSplit[0];
        // dec = numSplit[1];

        // // (type === 'expense' ? '-' : '+') + ' ' + 
        // return int + '.' + dec;
        return num;
    }


    return {
        getIncomeInput: function () {
            return {
                type: document.querySelector(DOMStrings.incomeButton).value,
                name: document.querySelector(DOMStrings.incomeName).value,
                description: document.querySelector(DOMStrings.incomeDesc).value,
                amount: parseFloat(document.querySelector(DOMStrings.incomeAmount).value)
            }
        },
        getExpenseInput: function () {
            return {
                type: document.querySelector(DOMStrings.expenseButton).value,
                name: document.querySelector(DOMStrings.expenseName).value,
                description: document.querySelector(DOMStrings.expenseDesc).value,
                amount: parseFloat(document.querySelector(DOMStrings.expenseAmount).value)
            }
        },

        // noIncomesOrExpenses: function() {
        //     var html
        //     // html_incomes = '<div class="landing tac"> <h2 class="mb2">No expenses to show</h2> <p class="mb0">You\'ve got no bills to pay at the moment. <a href="/bills/add">Add one</a> if you need to!</p></div>'
        //     // document.querySelector('.items_lists_incomes').insertAdjacentHTML('beforeend', html_incomes);
        // },

        addListItem: function (obj, type) {
            var html, newHTML, element;
            // create html string with placeholder text
            if (type === '+') {
                element = DOMStrings.incomeContainer;
                html = '<tr id="income-%id%"><td class="income_name_row">%name%</td><td class="income_amount_row">£%amount%</td><td class="income_description_row">%description%</td><td class="delete_edit_income"><a class="edit" data-toggle="modal" data-target="#editIncomeModal" href="#editIncomeModal" style="text-decoration: underline">Edit</a> | <a class="delete" style="text-decoration: underline;">Delete</a></td></tr>'
            } else if (type === '-') {
                element = DOMStrings.expensesContainer;
                html = '<tr id="expense-%id%"><td class="expense_name_row">%name%</td><td class="expense_amount_row">£%amount%</td><td class="expense_description_row">%description%</td><td class="delete_edit_expense"><a class="edit"  data-toggle="modal" data-target="#editExpenseModal" href="#editExpenseModal" style="text-decoration: underline">Edit</a> | <a class="delete" style="text-decoration: underline">Delete</a></td></tr>'
            }
            //  replace the placeholder text with actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%name%', obj.name);
            newHTML = newHTML.replace('%amount%', formatNumber(obj.amount, type));
            newHTML = newHTML.replace('%description%', obj.description);

            // insert html into the dom 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },

        deleteListItem: function (rowID) {
            var row = document.getElementById(rowID);
            row.parentNode.removeChild(row);
        },

        eidtListItem: function (rowID) {
            var row = document.getElementById(rowID);
            row.refresh();
        },

        orderListItems: function (order, list) {
            var in_table = document.getElementById("income_list");
            var ex_table = document.getElementById("expenses_list");

            if (list === 'i') {
                sortTableRows(in_table, order);
            } else if (list === 'e') {
                sortTableRows(ex_table, order);
            }
        },

        clearFields: function (type) {
            var fields, fieldsArray;


            if (type === '+') {
                fields = document.querySelectorAll(DOMStrings.incomeName + ', ' + DOMStrings.incomeDesc + ', ' + DOMStrings.incomeAmount);
                var modal = document.getElementById('incomeModal');
            } else if (type === '-') {
                fields = document.querySelectorAll(DOMStrings.expenseName + ', ' + DOMStrings.expenseDesc + ', ' + DOMStrings.expenseAmount);
                var modal = document.getElementById('expenseModal');
            }

            fieldsArray = Array.prototype.slice.call(fields);
            // clear the fields
            fieldsArray.forEach(element => {
                element.value = "";
            });

            // get rid of the modal
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('style', 'display: none');
            var modalBackdrops = document.getElementsByClassName('modal-backdrop');
            document.body.removeChild(modalBackdrops[0]);
        },

        checkEmptyFields: function (type) {
            var fieldsArray;
            if (type === '+') {
                fields = document.querySelectorAll(DOMStrings.incomeName + ', ' + DOMStrings.incomeAmount);
            } else if (type === '-') {
                fields = document.querySelectorAll(DOMStrings.expenseName + ', ' + DOMStrings.expenseAmount);
            }

            fieldsArray = Array.prototype.slice.call(fields);

            // if the fields are filled then do this
            if (fieldsArray[0].trim == "" || fieldsArray[1].trim == "" || isNaN(fieldsArray[0]) || isNaN(fieldsArray[1])) {
                fieldsArray[0].innerHTML = "Must fill in"
                fieldsArray[1].innerHTML = "Must fill in"
                console.log("NOOOOO");
                return false;
            } else {
                return true;
            }

        },

        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'income' : type = 'expense';

            if (obj.budget < 0) {
                document.querySelector('.monthly-total').style.background = '#e54120';
            } else if (obj.budget > 0) {
                document.querySelector('.monthly-total').style.background = '#579d1f';
            }

            document.querySelector(DOMStrings.monthlyTotal).textContent = '£' + formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.totalIncome).textContent = '£' + formatNumber(obj.totalInc, 'income');
            document.querySelector(DOMStrings.totalExpense).textContent = '£' + formatNumber(obj.totalExp, 'expense');
        },

        getDOMStrings: function () {
            return DOMStrings;
        }
    }
})();

// CONTROLLER MODULE
var controller = (function (dataCtrl, UICtrl) {
    var DOM = UICtrl.getDOMStrings();

    var setUpEventListeners = function () {

        document.querySelector(DOM.incomeButton).addEventListener('click', function (e) {
            // if(UICtrl.checkEmptyFields('+')) {
            //     ctrlAddItem('+');

            // } else {
            //     e.preventDefault();
            // }
            ctrlAddItem('+');
        });

        document.querySelector(DOM.expenseButton).addEventListener('click', function () {
            ctrlAddItem('-');
        });

        document.querySelector(DOM.incomeButton).addEventListener('keypress', function () {
            if (event.key === 13 || event.which === 13) {
                ctrlAddItem('+');
            }
        });

        document.querySelector(DOM.expenseButton).addEventListener('keypress', function () {
            if (event.key === 13 || event.which === 13) {
                ctrlAddItem('-');

            }
        });

        
        // document.querySelector("#form1").addEventListener('keypress', function () {
        //     if (event.key === 13 || event.which === 13) {
        //         ctrlAddItem('+');

        //     }
        // });

        // document.querySelector("#form2").addEventListener('keypress', function () {
        //     if (event.key === 13 || event.which === 13) {
        //         ctrlAddItem('-');

        //     }
        // });

        document.querySelector('.main-row').addEventListener('click', ctrlDeleteItem);

        document.querySelector('.incomes').addEventListener('input', function (event) {
            if (event.target.id !== 'income-select') return;
            UICtrl.orderListItems(event.target.value, 'i');
        }, false);

        document.querySelector('.expenses').addEventListener('input', function (event) {
            if (event.target.id !== 'expenses-select') return;
            UICtrl.orderListItems(event.target.value, 'e');
        }, false);


    }

    var updateBudget = function () {
        // calc budget
        dataCtrl.calculateTotal();

        // return the budget
        var budget = dataCtrl.getBudget();

        // display budget 
        UICtrl.displayBudget(budget);
    }


    var ctrlAddItem = function (type) {
        var input, newItem;

        // get input data from fields
        if (type === "+") {
            input = UICtrl.getIncomeInput()
        } else if (type === '-') {
            input = UICtrl.getExpenseInput();
        }

        // if (input.name !== "" && !isNaN(input.amount) && input.amount > 0) {
        // add item to data contorller
        newItem = dataCtrl.addItem(input.type, input.name, input.description, input.amount);

        UICtrl.addListItem(newItem, input.type);
        UICtrl.clearFields(input.type);
        updateBudget();
        // } else {}
    }

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, id;

        itemID = event.target.parentNode.parentNode.id;
        console.log(itemID);
        // console.log(event.target.className);

        if (itemID) {
            if (event.target.className === 'delete') {
                splitID = itemID.split('-');
                type = splitID[0];
                id = parseInt(splitID[1]);

                if (type === "income") {
                    type = '+';
                } else if (type === "expense") {
                    type = '-';
                }

                dataCtrl.deleteItem(type, id);
                UICtrl.deleteListItem(itemID);
                updateBudget();

            } else if (event.target.className === 'edit') {
                console.log('lets edit this shit');
            }

        }
    }

    var ctrlEditItem = function (event) {
        // grab the stuff from the modal and pass it to the data edit item method 
        // call the ui edit itel method to refresh
    }

    return {
        init: function () {
            if (window.history.replaceState) {
                window.history.replaceState(null, null, window.location.href);
            }

            console.log("App started!")

            UICtrl.displayBudget({
                budget: 0,
                percentage: 0,
                totalInc: 0,
                totalExp: 0
            });

            setUpEventListeners();

            // if(dataCtrl.getItems().incomes.length === 0) {
            //     console.log("WE HAVE NOT INCOMES")
            //     UICtrl.noIncomesOrExpenses();

            // }

            // if(dataCtrl.getItems().expenses.length === 0) {
            //     console.log("WE HAVE NO EXPENSES")
            // }
        }
    };
})(dataController, UIController);

controller.init();