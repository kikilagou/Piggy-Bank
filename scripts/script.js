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

        // getItems: function() {
        //     return {
        //         incomes: data.allItems["+"],
        //         expenses: data.allItems["-"]
        //     }
        // },

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
                totalIncome: ".monthly-total-income",
                totalExpense: ".monthly-total-expense"
            }

            var sortTableRowsAlpha = function (table) {
                // credit for this function: https://www.geeksforgeeks.org/how-to-sort-rows-in-a-table-using-javascript/
                var i, x, y;
                var switching = true;

                // Run loop until no switching is needed 
                while (switching) {
                    switching = false;
                    var rows = table.rows;

                    // Loop to go through all rows 
                    for (i = 1; i < (rows.length - 1); i++) {
                        var Switch = false;

                        // Fetch 2 elements that need to be compared 
                        x = rows[i].getElementsByTagName("TD")[0];
                        y = rows[i + 1].getElementsByTagName("TD")[0];

                        // Check if 2 rows need to be switched 
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

                            // If yes, mark Switch as needed and break loop 
                            Switch = true;
                            break;
                        }
                    }
                    if (Switch) {
                        // Function to switch rows and mark switch as completed 
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
            }

            var sortTableRowsHighLow = function (table) {
                // credit for this function: https://www.geeksforgeeks.org/how-to-sort-rows-in-a-table-using-javascript/
                var i, x, y;
                var switching = true;

                // Run loop until no switching is needed 
                while (switching) {
                    switching = false;
                    var rows = table.rows;

                    // Loop to go through all rows 
                    for (i = 1; i < (rows.length - 1); i++) {
                        var Switch = false;

                        // Fetch 2 elements that need to be compared 
                        x = rows[i].getElementsByTagName("TD")[1];
                        y = rows[i + 1].getElementsByTagName("TD")[1];

                        // Check if 2 rows need to be switched 
                        if (x.innerHTML < y.innerHTML) {

                            // If yes, mark Switch as needed and break loop 
                            Switch = true;
                            break;
                        }
                    }
                    if (Switch) {
                        // Function to switch rows and mark switch as completed 
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
            }

            var sortTableRowsLowHigh = function (table) {
                // credit for this function: https://www.geeksforgeeks.org/how-to-sort-rows-in-a-table-using-javascript/
                var i, x, y;
                var switching = true;

                // Run loop until no switching is needed 
                while (switching) {
                    switching = false;
                    var rows = table.rows;

                    // Loop to go through all rows 
                    for (i = 1; i < (rows.length - 1); i++) {
                        var Switch = false;

                        // Fetch 2 elements that need to be compared 
                        x = rows[i].getElementsByTagName("TD")[1];
                        y = rows[i + 1].getElementsByTagName("TD")[1];

                        // Check if 2 rows need to be switched 
                        if (x.innerHTML > y.innerHTML) {

                            // If yes, mark Switch as needed and break loop 
                            Switch = true;
                            break;
                        }
                    }
                    if (Switch) {
                        // Function to switch rows and mark switch as completed 
                        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                        switching = true;
                    }
                }
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
                            html = '<tr id="income-%id%"><td class="income_name_row">%name%</td><td class="income_amount_row">%amount%</td><td class="income_description_row">%description%</td><td class="delete_edit_income"><a class="edit-delete" id="edit_income_%editid%">Edit</a> | <a class="edit-delete" id="delete_income_%delid%">Delete</a></td></tr> '
                        } else if (type === '-') {
                            element = DOMStrings.expensesContainer;
                            html = '<tr id="expense-%id%"><td class="expense_name_row">%name%</td><td class="expense_amount_row">%amount%</td><td class="expense_description_row">%description%</td><td class="delete_edit_expense"><a class="edit-delete" id="edit_expense_%editid%"">Edit</a> | <a class="edit-delete" id="delete_expense_%delid%"">Delete</a></td></tr>'
                        }
                        //  replace the placeholder text with actual data
                        newHTML = html.replace('%id%', obj.id);
                        newHTML = newHTML.replace('%name%', obj.name);
                        newHTML = newHTML.replace('%amount%', obj.amount);
                        newHTML = newHTML.replace('%description%', obj.description);
                        newHTML = newHTML.replace('%editid%', obj.id);
                        newHTML = newHTML.replace('%delid%', obj.id);

                        // insert html into the dom 
                        document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
                    },

                    orderListItems: function (order) {
                        var table = document.getElementById('income_list');
                        if (order === "lowhigh") {
                            console.log("ordering items low to high");
                            sortTableRowsLowHigh(table);
                        } else if (order === "highlow") {
                            console.log("ordering items high to low");
                            sortTableRowsHighLow(table);
                        } else if (order === "alpha") {
                            console.log("ordering items alphabetical order");
                            sortTableRowsAlpha(table);
                        }
                    },

                    clearFields: function (type) {
                        var fields, fieldsArray;

                        if (type === '+') {
                            fields = document.querySelectorAll(DOMStrings.incomeName + ', ' + DOMStrings.incomeDesc + ', ' + DOMStrings.incomeAmount);
                        } else if (type === '-') {
                            fields = document.querySelectorAll(DOMStrings.expenseName + ', ' + DOMStrings.expenseDesc + ', ' + DOMStrings.expenseAmount);
                        }

                        fieldsArray = Array.prototype.slice.call(fields);
                        fieldsArray.forEach(element => {
                            element.value = "";
                        });

                        // fieldsArray[0].focus();
                    },

                    displayBudget: function (obj) {

                        document.querySelector(DOMStrings.monthlyTotal).textContent = obj.budget;
                        document.querySelector(DOMStrings.totalIncome).textContent = obj.totalInc;
                        document.querySelector(DOMStrings.totalExpense).textContent = obj.totalExp;

                        if (obj.budget < 0) {
                            document.querySelector('.monthly-total').style.background = '#e54120';
                        } else if (obj.budget > 0) {
                            document.querySelector('.monthly-total').style.background = '#579d1f';

                        }

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

                document.addEventListener('input', function (event) {

                    // Only run on our select menu
                    if (event.target.id !== 'income-select') return;

                    // console.log(event.target.value);

                    if (event.target.value === "high-low") {
                        console.log("high to low");
                        UICtrl.orderListItems("highlow")
                    } else if (event.target.value === "low-high") {
                        console.log("low to high");
                        UICtrl.orderListItems("lowhigh")
                        // UICtrl.orderListItems(document.getElementById('income_list'), "lowhigh")
                    } else if (event.target.value === "alphabetically") {
                        console.log("alpha");
                        UICtrl.orderListItems("alpha")
                        // UICtrl.orderListItems(document.getElementById('income_list'), "alpha")
                    }
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

                // add new item to user interface 
                UICtrl.addListItem(newItem, input.type);
                UICtrl.clearFields(input.type);

                updateBudget();
                // } else {}

            }


            return {
                init: function () {
                    console.log("App has started")
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