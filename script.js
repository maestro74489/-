let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;

totalAmountButton.addEventListener("click", () => {
  tempAmount = totalAmount.value;
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    amount.innerHTML = tempAmount;
    balanceValue.innerText = tempAmount;
    expenditureValue.innerText = 0;
    totalAmount.value = "";
  }
});

const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = parseInt(balanceValue.innerText);
  let currentExpense = parseInt(expenditureValue.innerText);
  let parentAmount = parseInt(parentDiv.querySelector(".amount").innerText);
  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    disableButtons(true);
  } else {
    balanceValue.innerText = currentBalance + parentAmount;
    expenditureValue.innerText = currentExpense - parentAmount;
    parentDiv.remove();
  }
};

const listCreator = (expenseName, expenseValue) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space", "list-item");
  list.appendChild(sublistContent);
  sublistContent.innerHTML = `<p class="product expense-title">${expenseName}</p><p class="amount expense-amount">${expenseValue}</p>`;
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
};

checkAmountButton.addEventListener("click", () => {
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }

  productTitleError.classList.add("hide");
  disableButtons(false);
  let expenditure = parseInt(userAmount.value);
  let currentExpense = parseInt(expenditureValue.innerText);
  let currentBalance = parseInt(balanceValue.innerText);
  expenditureValue.innerText = currentExpense + expenditure;
  balanceValue.innerText = currentBalance - expenditure;
  listCreator(productTitle.value, userAmount.value);
  productTitle.value = "";
  userAmount.value = "";
});

const exportBtn = document.getElementById('export-btn');

exportBtn.addEventListener('click', exportExpenses);

function exportExpenses() {
  const expenses = document.querySelectorAll('.list-item');
  let expensesData = `Бюджет (изначальный): ${amount.innerHTML}\nРасходы: ${expenditureValue.innerText}\nБаланс: ${balanceValue.innerText}\n\nСписок расходов:\n`;

  expenses.forEach(expense => {
    const title = expense.querySelector('.expense-title').textContent;
    const amount = expense.querySelector('.expense-amount').textContent;
    expensesData += `${title}, ${amount}\n`;
  });

  const blob = new Blob([expensesData], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'expenses.txt';
  a.click();
  window.URL.revokeObjectURL(url);
}