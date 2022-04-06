'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

const account1 = {
  owner: 'Anukalp Tripathi',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Prachi Tripathi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2022-02-25T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const navBar = document.querySelector('nav');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Logged in User 
let currentUser = null,timer;

// Create username of each account
const createUserName = accounts => {
  accounts.forEach(account =>
    account.userName = account.owner.split(' ').map(d => d.at(0)).join('').toLowerCase());
}

createUserName(accounts);

// Calculate the difference of of days

const daysDifferenceHandler = (date) => {
const today = new Date();
return Math.round((today-date)/(24*60*60*1000));
}

// Showing the formatted date 

const displayDate = (d) => {
  // console.log(date.getFullYear());
  const date = new Date(d);
  const daysPassed = daysDifferenceHandler(date);
  if( daysPassed <= 7){
  return `${daysPassed === 0 ? 'Today' : daysPassed === 1 ? 'Yesterday' : daysPassed + ' days ago'}`
  }
  const day = `${date.getDate()}`.padStart(2,'0');
  const month = `${date.getMonth()+1}`.toString().padStart(2,'0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Showing the transaction dates

const displayTransactionDates = index => {
  const date = currentUser.movementsDates.at(index);
  return displayDate(date);
}

// Showing transaction details
const displayTransactionRow = (val, index) => {
  const typeOfTransaction = val > 0 ? 'deposit' : 'withdrawal';

  const rowHTML = `
  <div class="movements__row">
    <div class="movements__type movements__type--${typeOfTransaction}">${index + 1} ${typeOfTransaction}</div>
    <div class="movements__date">${displayTransactionDates(index)}</div>
    <div class="movements__value">₹ ${val.toFixed(2)}</div>
  </div>`;

  containerMovements.insertAdjacentHTML('afterbegin', rowHTML);
}

// Show current user's Balance
const showUpdatedBalance = person => {
  person.balance = person.movements.reduce((sum, d) =>
    sum + d, 0);
  labelBalance.textContent = `₹ ${person.balance.toFixed(2)}`;
}

// Show deposited values
const showDepositedValues = person => {
  person.depositedAmount = person.movements.reduce((sum, d) => d > 0 ? sum + d : sum, 0);
  labelSumIn.textContent = `₹ ${person.depositedAmount.toFixed(2)}`;
}

// Show withdrawal values
const showWithdrawalValues = person => {
  person.withDrawalAmount = person.movements.reduce((sum, d) => d < 0 ? sum + d : sum, 0);
  labelSumOut.textContent = `₹ ${Math.abs(person.withDrawalAmount).toFixed(2)}`;
}

// showing balance and transactions

const showBalanceDetails = person => {
showUpdatedBalance(person);
showDepositedValues(person);
showWithdrawalValues(person);
}

// Iterating through each row of transaction

const showEachTransactionRow = trans => {
// Removing the existing unused transaction rows to prevent showing wrong data
containerMovements.innerHTML = '';

// displaying each transaction row for respective user
trans.forEach((amount, index) => {
  displayTransactionRow(amount, index);
});
}

// Logout Method
const logOutHandler = () => {
  containerApp.classList.remove('show');
  navBar.classList.remove('show');
  labelWelcome.textContent = 'Log in to get started';
}

// Start Logout Timer

const startLogOutTimer = () => {
  let time = 300;
  const tickTack = () =>{
    const minutes = `${Math.trunc(time/60)}`.padStart(2,'0');
    const seconds = `${time%60}`.padStart(2,'0');
    labelTimer.textContent = `${minutes}:${seconds}`;
  if(time<0){
    clearInterval(timer);
    logOutHandler();
  }
  time--;
  }
  tickTack();
  timer = setInterval(tickTack,1000);
  return timer;
}

// Show personal details 

const showPersonalDetails = person => {
  labelWelcome.textContent = `Welcome back, ${person.owner.split(' ')[0]}`;
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }
  labelDate.textContent = new Intl.DateTimeFormat('en-UK',options).format(now);
   // showing balance details 
   showBalanceDetails(person);

   showEachTransactionRow(person.movements);

  // Displaying data to the page
  labelSumInterest.textContent = `₹ ${(person.depositedAmount * person.interestRate / 100).toFixed(2)}`
}

// Login Method 
const loginMethod = (e) => {
  e.preventDefault();
  const userName = inputLoginUsername.value.trim();
  const userPin = inputLoginPin.value.trim();
  // return if there is no value entered for login
  if (!userName || !userPin) {
    return;
  }
  currentUser = accounts.find(account => account.pin === +userPin && account.userName === userName);
  if (currentUser) {
    containerApp.classList.add('show');
    navBar.classList.add('show');
    showPersonalDetails(currentUser);

    // Clearing the previous timer
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
  // resetting the values and resetting the focus
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
  inputLoginPin.blur();
}
btnLogin.addEventListener('click', loginMethod);

// Transfer Money Method

const transferMoneyHandler = (e) => {
  e.preventDefault();
  const transferName = inputTransferTo.value.trim();
  const transferAmount = +inputTransferAmount.value.trim();
  if (transferName && transferAmount && transferAmount > 0) {
    const receiverAccount = accounts.find(account => account.userName === transferName);
    if (receiverAccount && receiverAccount !== currentUser && transferAmount < currentUser.balance) {
      // Transaction date
      const currentDate = (new Date()).toISOString();

      // Updating the current account details
      currentUser.movements.push(-transferAmount);
      currentUser.movementsDates.push(currentDate);

      // Updating the receivers account details
      receiverAccount.movements.push(transferAmount);
      receiverAccount.movementsDates.push(currentDate);

      // Show latest transaction and updated values in the page
      displayTransactionRow(-transferAmount, currentUser.movements.length - 1);
      showBalanceDetails(currentUser);

    }
  }
  // resetting the form input
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();

   // Resetting the logout timer
   clearInterval(timer);
   timer = startLogOutTimer(timer);
}

btnTransfer.addEventListener('click', transferMoneyHandler);

// Method to check if loan should be approved or not

const loadApprovalhandler = (requestedAmount,currentUser) => {
 if(currentUser.movements.some(trans => trans >= requestedAmount*0.1)){
   currentUser.movements.push(requestedAmount);
   currentUser.movementsDates.push((new Date()).toISOString());
   setTimeout(()=>{
    displayTransactionRow(requestedAmount, currentUser.movements.length - 1 );
    showBalanceDetails(currentUser);
   },3000);
  }
  // Resetting the logout timer
  clearInterval(timer);
  timer = startLogOutTimer(timer);
}

// Sort the transaction rows

let isSorted = false; // represent if transactions are sorted or not

const sortedTransactionHandler = (flag) => {
    const sortedArr = flag ?  currentUser.movements.slice().sort((a,b)=>a-b) : currentUser.movements;
    sortedArr && showEachTransactionRow(sortedArr);
}
btnSort.addEventListener('click',(e)=>
{
  e.preventDefault();
  sortedTransactionHandler(!isSorted);
  isSorted = !isSorted;
});


// Requesting the Loan

const loanRequestHandler = (e) => {
e.preventDefault();
const requestedAmount = Math.floor(inputLoanAmount.value.trim());
if(requestedAmount){
  loadApprovalhandler(+requestedAmount,currentUser);
}
inputLoanAmount.value = "";
}

btnLoan.addEventListener('click',loanRequestHandler);


// Close the account
const closeAcountHandler = e => {
  e.preventDefault();
  const inputCloserName = inputCloseUsername.value.trim();
  const inputCloserPin = inputClosePin.value.trim();
  if(inputCloserName && inputCloserPin && inputCloserName === currentUser.userName && +inputCloserPin === currentUser.pin){
    const index = accounts.findIndex(user => user === currentUser);
    accounts.splice(index,1);
  }
  containerApp.classList.remove('show');
  inputCloseUsername.value = inputClosePin.value = "";
}

btnClose.addEventListener('click',closeAcountHandler);


