

//1
const balance = document.getElementById(
    "balance"
  );
  const money_plus = document.getElementById(
    "money-plus"
  );
  const money_minus = document.getElementById(
    "money-minus"
  );
  const list = document.getElementById("list");
  const form = document.getElementById("form");
  const text = document.getElementById("text");
  const amount = document.getElementById("amount");
  // const dummyTransactions = [
  //   { id: 1, text: "Flower", amount: -20 },
  //   { id: 2, text: "Salary", amount: 300 },
  //   { id: 3, text: "Book", amount: -10 },
  //   { id: 4, text: "Camera", amount: 150 },
  // ];
  
  // let transactions = dummyTransactions;
  
  //last 
  const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
  
  let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
  
  //5
  //Add Transaction
  function addTransaction(e){
    e.preventDefault();
    if(text.value.trim() === '' || amount.value.trim() === ''){
      alert('please add text and amount')
    }else{
      const transaction = {
        id:generateID(),
        text:text.value,
        amount:+amount.value
      }
  
      transactions.push(transaction);
  
      addTransactionDOM(transaction);
      updateValues();
      updateLocalStorage();
      text.value='';
      amount.value='';
    }
  }
  
  
  //5.5
  //Generate Random ID
  function generateID(){
    return Math.floor(Math.random()*1000000000);
  }
  
  //2
  
  //Add Trasactions to DOM list
  function addTransactionDOM(transaction) {
    //GET sign
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
  
    //Add Class Based on Value
    item.classList.add(
      transaction.amount < 0 ? "minus" : "plus"
    );
  
    item.innerHTML = `
      ${transaction.text} <span>${sign}${Math.abs(
      transaction.amount
    )}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
      `;
    list.appendChild(item);
  }
  
  //4
  
  //Update the balance income and expence
  function updateValues() {
    const amounts = transactions.map(
      (transaction) => transaction.amount
    );
    const total = amounts
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);
    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);
    const expense =
      (amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => (acc += item), 0) *
      -1).toFixed(2);
  
      balance.innerText=`$${total}`;
      money_plus.innerText = `$${income}`;
      money_minus.innerText = `$${expense}`;
  }
  
  
  //6 
  
  //Remove Transaction by ID
  function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
  }
  //last
  //update Local Storage Transaction
  function updateLocalStorage(){
    localStorage.setItem('transactions',JSON.stringify(transactions));
  }
  
  //3
  
  //Init App
  function Init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
  }
  
  Init();
  
  form.addEventListener('submit',addTransaction);
  let formSubmitted = false;

  function generateIncomeFields() {
      var numIncomes = parseInt(document.getElementById("numIncomes").value);
      var incomeContainer = document.getElementById("incomeContainer");
      incomeContainer.innerHTML = "";
      for (var i = 1; i <= numIncomes; i++) {
          incomeContainer.innerHTML += `
          <div>
              <label for="incomeSource${i}">Income Source ${i}:</label>
              <input type="text" id="incomeSource${i}" name="incomeSource${i}" required>
              <label for="incomeAmount${i}">Income Amount ${i}:</label>
              <input type="text" id="incomeAmount${i}" name="incomeAmount${i}" required>
          </div>
          `;
      }
      document.getElementById("incomeFields").style.display = "block";
      document.getElementById("submitButton").style.display = "block";
      document.getElementById("nextButton").style.display = "none";
  }

  function submitForm(event) {
     // Prevent the default form submission behavior
     event.preventDefault();
      var numIncomes = parseInt(document.getElementById("numIncomes").value);
      var allFieldsFilled = true;

      // Check if all fields are filled
      for (var i = 1; i <= numIncomes; i++) {
          var incomeSource = document.getElementById("incomeSource" + i).value;
          var incomeAmount = document.getElementById("incomeAmount" + i).value;
          if (incomeSource.trim() === '' || incomeAmount.trim() === '') {
              allFieldsFilled = false;
              break;
          }
      }

      if (allFieldsFilled) {
       
          // Show the main content and header
          document.querySelector(".header-main").style.display = "block";
          document.querySelector(".main-content").style.display = "block";
          document.querySelector(".initial-form-container").style.display = "none";

          // Set formSubmitted to true
          formSubmitted = true;

          // Show the popup
          document.getElementById("popupContainer").classList.add("show");
      } else {
          alert("Please fill in all income details before submitting.");
      }

      
  }

  document.getElementById("initial-form").addEventListener("submit", submitForm);

  function closePopup() {
  document.getElementById("popupContainer").classList.remove("show");

}

// Function to add initial form details as transactions
function addInitialFormDetails() {
    const numIncomes = parseInt(document.getElementById("numIncomes").value);
    const monthlyExpenses = parseFloat(document.getElementById("monthlyExpenses").value);
    const savingGoal = parseFloat(document.getElementById("saving").value);

    // Add income sources with amounts
    for (let i = 1; i <= numIncomes; i++) {
        transactions.push({
            id: generateID(),
            text: `Income Source ${i}`,
            amount: parseFloat(document.getElementById(`incomeAmount${i}`).value)
        });
    }

    // Add monthly expense
    transactions.push({
        id: generateID(),
        text: "Monthly Expense",
        amount: -monthlyExpenses
    });

    // Add saving goal
    transactions.push({
        id: generateID(),
        text: "Saving Goal",
        amount: -savingGoal
    });
}

// Update the balance, income, and expense
function updateValues() {
    const incomeTransactions = transactions.filter(transaction => transaction.amount > 0 && !transaction.text.startsWith("Income Source"));
    const amounts = incomeTransactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = total > 0 ? total : "0.00";

    const expenseTransactions = transactions.filter(transaction => transaction.amount < 0);
    const expenseAmounts = expenseTransactions.map(transaction => transaction.amount);
    const expense = (expenseAmounts.reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `$${(parseFloat(total) - parseFloat(expense)).toFixed(2)}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}

// Function to submit the form and add initial form details as transactions
function submitForm(event) {
  // Prevent the default form submission behavior
  event.preventDefault();
    var numIncomes = parseInt(document.getElementById("numIncomes").value);
    var allFieldsFilled = true;

    // Check if all fields are filled
    for (var i = 1; i <= numIncomes; i++) {
        var incomeSource = document.getElementById("incomeSource" + i).value;
        var incomeAmount = document.getElementById("incomeAmount" + i).value;
        if (incomeSource.trim() === '' || incomeAmount.trim() === '') {
            allFieldsFilled = false;
            break;
        }
    }

    if (allFieldsFilled) {
        // Add initial form details as transactions
        addInitialFormDetails();

        // Show the main content and header
        document.querySelector(".header-main").style.display = "block";
        document.querySelector(".main-content").style.display = "block";
        document.querySelector(".initial-form-container").style.display = "none";

        // Set formSubmitted to true
        formSubmitted = true;

        // Show the popup
        document.getElementById("popupContainer").classList.add("show");

        // Update balance, income, and expense
        updateValues();
        updateLocalStorage();
    } else {
        alert("Please fill in all income details before submitting.");
    }

    
}
