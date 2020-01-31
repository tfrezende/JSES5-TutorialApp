// === BUDGET CONTROLLER ===
var budgetController = (function (){

    var Expense = function(id, des, val){
        this.id = id;
        this.description = des;
        this.value = val;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome){

        if (totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income = function(id, des, val){
        this.id = id;
        this.description = des;
        this.value = val;
    };

    var calculateTotal = function(type){
        var sum = 0;

        data.allItems[type].forEach(function(curr) {
            sum += curr.value;
        });

        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val){
            var newItem, id;

            // Creating a new ID
            if(data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            if (type === 'exp'){

                newItem = new Expense(id, des, val);

            } else if (type === 'inc'){

                newItem = new Income(id, des, val);

            }

            data.allItems[type].push(newItem);

            return newItem;
        },

        calculateBudget: function(){

            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate balance (income - expense)
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that was spent
            if(data.totals.inc > 0)
            {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function(){

            data.allItems.exp.forEach(function(curr){
                curr.calculatePercentage(data.totals.inc);
            });
        },

        getPercentages: function(){

            var allPerc = data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });

            return allPerc;
        },

        deleteItem: function(type, id) {

            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            })

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }
    };

})();
// === UI CONTROLLER ===
var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer:  '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type){
        var numSplit, int, dec;

        /*
        + or - before the number
        exactly 2 decimal points
        comma separating the thousands
        */
        num = Math.abs(num); // módulo
        num = num.toFixed(2); // 2 decimals
        console.log(num);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' +  int.substr(int.length - 3, 3);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback){
        for (var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            // Retorna um objeto
            return{
                type: document.querySelector(DOMStrings.inputType).value, // Either INC or EXP
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc'){
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp'){
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            // Replace placeholder with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function(){
            var fields;
            // Gets a list from the inputs
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' +
            DOMStrings.inputValue);
            // Fools JS into thinking the list is an array
            var fieldsArr = Array.prototype.slice.call(fields);
            // Iterates over the array and clears all fields
            fieldsArr.forEach(function(curr, ind, arr){
                curr.value = "";
            });
            // Moves the cursor back to the first position
            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            var type;

            obj.budget >= 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent =
                formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent =
                formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent =
                formatNumber(obj.totalExp, 'exp');
            if (obj.percentage >= 0){

                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';

            } else {

                document.querySelector(DOMStrings.percentageLabel).textContent = '---';

            }

        },

        displayMonth: function(){
            var now, year, m, months;

            now = new Date();

            m = now.getMonth();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];

            year = now.getFullYear();

            document.querySelector(DOMStrings.dateLabel).textContent = months[m] + ', ' + year;
        },

        displayPercentages: function(percentages){

            var fields = document.querySelectorAll(DOMStrings.expPercentageLabel);

            nodeListForEach(fields, function(curr, ind){
                if(percentages[ind] > 0){
                    curr.textContent = percentages[ind] + '%';
                } else {
                    curr.textContent = '---';
                }
            });

        },

        deleteListItem: function(selectorID) {
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);

        },

        changeType: function() {

            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );

            nodeListForEach(fields, function(curr){
                curr.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },


        getDOMStrings: function(){
            return DOMStrings;
        }
    };
})();

// === GLOBAL CONTROLLER ===
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    }

    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function(){

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from budgetCtrl
        var percentages = budgetCtrl.getPercentages();

        // 3. Update UI
        UICtrl.displayPercentages(percentages);

    }

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add item to UI controller
            UICtrl.addListItem(newItem, input.type);
            // 4. Clear fields
            UICtrl.clearFields();
            // 5. Calculate budget
            updateBudget();
            // 6. Update percentages
            updatePercentages();
        }
    }

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, id;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(event.target.parentNode.parentNode.parentNode.parentNode);
        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            // 1. Delete item from data structure
            budgetCtrl.deleteItem(type, id);

            // 2. Delete item from UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and display new budget
            updateBudget();

            // 4. Update percentages
            updatePercentages();

        }

    }

    return {
        init: function() {

            UICtrl.displayBudget(
                {
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
                }
            );

            setupEventListeners();

            UICtrl.displayMonth();
        }
    };

})(budgetController, UIController);

controller.init();
