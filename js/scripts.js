const div_employeeGallery = document.getElementById('gallery');
const documentBody = document.querySelector('body');
var div_employeeCards = null;
var api_employeeList = null;


//
// SETTING UP MODAL FRAMEWORK
//
const div_modalContainer = document.createElement('DIV');

div_modalContainer.className = 'modal-container';
div_modalContainer.style.display = 'none';
documentBody.insertBefore(div_modalContainer, documentBody.querySelector('script'));


//
// API REQUEST AND RESPONSE
//
const API_address = `https://randomuser.me/api/?results=12&inc=name,location,email,picture,dob,cell`;
const API_config = {
		     method: 'POST',
		     headers: {'Content-type': 'application/json'},
		     body: {
			     "results": "12",
			     "password": "5-10",
			     "inc": "name,location,email,picture,phone,dob,cell"
		           }
		   };

/*
 * Used to check if response from API is completed.
 * @param   {Object}  response - a Promise object
 * @return  {Object}  Promise - the Promise object resolved from the request OR a 'reject' Promise object
 */
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  }else {
    return Promise.reject(new Error(response.statusText));
  }
}

const promise_employeeDir = 
  fetch(API_address)
    .then(checkStatus)
    .then(response => response.json())
    .then(response => {
      api_employeeList = response.results;
      createEmployeeCards(api_employeeList);
      div_employeeCards = document.querySelectorAll('.card');
      createCardListeners();
      return response;
    })
    .catch(error => console.log('There was a problem with the response:', error));



//
// EMPLOYEE CARD CREATION
//

/*
 * Create an employee card.
 * @param   {Object}  employeeList - an array of employee objects
 */
function createEmployeeCards(employeeList) {
  var innerHTML = '';
  
  for (employee of employeeList) {
    innerHTML += `<div class="card"> 
		    <div class="card-img-container">                                                  
		      <img class="card-img" src="${employee.picture.large}" alt="profile picture"> 
		    </div>                                                                            
		    <div class="card-info-container">                                                 
		      <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>                           
		      <p class="card-text">${employee.email}</p>                                                
		      <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
		    </div>
		  </div>`;
  }
  div_employeeGallery.innerHTML = innerHTML;
}

/*
 * Searches for a matching email address (received from the 'clicked' employee card') against the employee list.
 * Searches for email because emails are generally not duplicated.
 * Creates a modal for that employee.
 * @param   {Node}  employee - a single employee DOM node object 
 */
function createEmployeeModal(employee) {
  var innerHTML = '';
  const search_Email = employee.querySelector('p').innerText;

  const found_employee = api_employeeList.find(api_employee => api_employee.email === search_Email);

  innerHTML += `<div class="modal">                                                                                
		  <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button> 
		  <div class="modal-info-container">                                                             
		    <img class="modal-img" src="${found_employee.picture.large}" alt="profile picture">           
		    <h3 id="name" class="modal-name cap">${found_employee.name.first} ${found_employee.name.last}</h3>
		    <p class="modal-text">${found_employee.email}</p>                                                            
		    <p class="modal-text cap">${found_employee.location.city}</p>                                                         
		    <hr>                                                                                       
		    <p class="modal-text">${found_employee.cell}</p>                                                   
		    <p class="modal-text">${found_employee.location.street}, 
					  ${found_employee.location.city}, ${found_employee.location.state} ${found_employee.location.postcode}
		    </p>
		    <p class="modal-text">Birthday: ${found_employee.dob.date}</p>                                            
		  </div>                                                                                         
		</div>`;
  div_modalContainer.innerHTML = innerHTML;
  div_modalContainer.style.display = '';

  closeModalListener();
}



//
// EVENT LISTENERS
//

/*
 * Create individual listeners for each employee card.
 * @param   {NodeList}   employees - a DOM node element list of all the employees on the page
 */
function createCardListeners() {
  for (employee of div_employeeCards) {
    employee.addEventListener('click', (e) => createEmployeeModal(e.currentTarget));
  }
}

function closeModalListener() {
  //'Click' event listener for closing the modal window
  document.getElementById('modal-close-btn')
    .addEventListener('click', () => div_modalContainer.style.display = 'none');
  //Added the ability to close the modal using the 'esc' key
  document
    .addEventListener('keydown', (e) => e.key.toLowerCase() === 'escape' ? div_modalContainer.style.display = 'none' : false);
}
