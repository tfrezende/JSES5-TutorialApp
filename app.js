// === BUDGET CONTROLLER ===
var budgetController = (function (){

    var Expense = function(id, des, val){
        this.id = id;
        this.description = des;
        this.value = val;
    }

    var Income = function(id, des, val){
        this.id = id;
        this.description = des;
        this.value = val;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        values: {
            exp: 0,
            inc: 0
        }
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
            console.log(type);
            console.log(type === 'exp');
            console.log(type === 'inc');
            if (type === 'exp'){

                newItem = new Expense(id, des, val);

            } else if (type === 'inc'){

                newItem = new Income(id, des, val);

            }

            data.allItems[type].push(newItem);

            return newItem;
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
        expensesContainer:  '.expenses__list'
    };

    return {
        getInput: function() {
            // Retorna um objeto
            return{
                type: document.querySelector(DOMStrings.inputType).value, // Either INC or EXP
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc'){
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp'){
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%<div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            // Replace placeholder with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Inser HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function(){
            var fields;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' +
            DOMStrings.inputValue);

            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(curr, ind, arr){
                curr.value = "";
            });

            fieldsArr[0].focus();
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
    }



    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get input data
        input = UICtrl.getInput();
        // 2. Add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add item to UI controller
        console.log(newItem);
        UICtrl.addListItem(newItem, input.type);
        // 4. Clear fields
        UICtrl.clearFields();
        // 5. Calculate budget

        // 6. Display budget on UI

    }

    return {
        init: function() {
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
