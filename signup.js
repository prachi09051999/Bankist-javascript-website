const signupBtn = document.querySelector('.signup__btn');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const pinInput = document.getElementById('pin');

signupBtn && signupBtn.addEventListener('click',function(e){
  e.preventDefault();
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const pin = pinInput.value.trim();
  if(!firstName || !lastName || !pin) return;
  const user = createUser(firstName,lastName,pin);
  storeUser(user);
  firstNameInput.value = "";
  lastNameInput.value = "";
  pinInput.value = "";
});

class User {
  /* Private fields */
  #movements = [];
  #pin;
  constructor(firstName,lastName,pin){
    this.firstName = firstName;
    this.lastName = lastName;
    this.#pin = pin;
  }
  getPin(){
    return this.#pin;
  }
}

function createUser(firstName,lastName,pin){
  const user = new User(firstName,lastName,pin);
  return user;
}

function storeUser(user){
// console.log(user,localStorage);
const userArr = JSON.parse(localStorage.getItem('users'));
const storedVal = localStorage.getItem('users');
let stringData = '{';
  for(const i in user){
    stringData += `"${i}":"${user[i]}",`;
  }
  stringData += `"pin":"${user.getPin()}"`
  stringData += '}';
  if(userArr.length>0)
localStorage.setItem('users',storedVal.slice(0,-1) + ',' + stringData+']');
else localStorage.setItem('users',storedVal.slice(0,-1) + stringData+']');
console.log("after",localStorage);
}

(()=>{
  if(!localStorage.getItem('users')){
    localStorage.setItem('users','[]');
    console.log(localStorage);
  }
})()