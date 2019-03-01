const dom_body = document.querySelector('body');
const dom_employeeGallery = document.getElementById('gallery');
var dom_employeeCards = null;
var api_employeeList = null;


//
// SETTING UP MODAL FRAMEWORK
//
const dom_modalContainer = document.createElement('DIV');

dom_modalContainer.className = 'modal-container';
dom_modalContainer.style.display = 'none';
dom_body.insertBefore(dom_modalContainer, dom_body.querySelector('script'));

dom_modalContainer.innerHTML += `<div class="modal">                                                                                
				   <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button> 
				   <div class="modal-info-container">                                                             
				     <img class="modal-img" src="" alt="profile picture">           
				     <h3 id="name" class="modal-name cap"></h3>
				     <p class="modal-text"></p>                                                            
				     <p class="modal-text cap"></p>                                                         
				     <hr>                                                                                       
				     <p class="modal-text"></p>                                                   
				     <p class="modal-text"></p>
				     <p class="modal-text"></p>                                            
				   </div>                                                                                         
				 </div>`;



//
// API REQUEST AND RESPONSE
//
const API_address = `https://randomuser.me/api/?results=12&nat=US&inc=name,location,email,picture,dob,cell`;

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

fetch(API_address)
  .then(checkStatus)
  .then(response => response.json())
  .then(response => {
    api_employeeList = response.results;
    createEmployeeCards(api_employeeList);
    dom_employeeCards = document.querySelectorAll('.card');
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
  
   for (let employee of employeeList) {
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
  dom_employeeGallery.innerHTML = innerHTML;
}

/*
 * Searches for a matching email address (received from the 'clicked' employee card') against the employee list.
 * Searches for email because emails are generally not duplicated; names can be.
 * Creates a modal for that employee.
 * @param   {Object}  employee - a single employee card from the DOM 
 */
function createEmployeeModal(employee) {
  const search_Email = employee.querySelector('p').innerText;
  const found_employee = api_employeeList.find(api_employee => api_employee.email === search_Email);//Find the employee in the local "database"
  var innerHTML = '';
  //Visually formatting some of the employee information
  var employeeBirthDay = found_employee.dob.date.slice(5,7) + "/" +  //Month
			 found_employee.dob.date.slice(8,10) + "/" + //Day
			 found_employee.dob.date.slice(0,4);         //Year
  var employeeCell = found_employee.cell.replace('-', ' ');
  var employeeStreetNo = found_employee.location.street.match(/[0-9]+/)[0];
  var employeeStreetName = found_employee.location.street.match(/[^0-9 ]+/)[0].charAt(0).toUpperCase() +
			   found_employee.location.street.match(/[^0-9 ]+/)[0].slice(1);
  var employeeStreet = employeeStreetNo + " " + employeeStreetName;
  var employeeCity = found_employee.location.city.charAt(0).toUpperCase() + found_employee.location.city.slice(1);
  var employeeState = found_employee.location.state.charAt(0).toUpperCase() + found_employee.location.state.slice(1);

  dom_modalContainer.querySelector('.modal-img').src = found_employee.picture.large;
  dom_modalContainer.querySelector('#name').innerText = `${found_employee.name.first} ${found_employee.name.last}`;
  dom_modalContainer.querySelectorAll('p')[0].innerText = found_employee.email;
  dom_modalContainer.querySelectorAll('p')[1].innerText = found_employee.location.city;
  dom_modalContainer.querySelectorAll('p')[2].innerText = employeeCell;
  dom_modalContainer.querySelectorAll('p')[3].innerText = `${employeeStreet}, \
							   ${employeeCity}, ${employeeState} ${found_employee.location.postcode}`;
  dom_modalContainer.querySelectorAll('p')[4].innerText = `Birthday: ${employeeBirthDay}`;
  dom_modalContainer.style.display = '';
  closeModalListener();

  /*innerHTML += `<div class="modal">                                                                                
		  <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button> 
		  <div class="modal-info-container">                                                             
		    <img class="modal-img" src="${found_employee.picture.large}" alt="profile picture">           
		    <h3 id="name" class="modal-name cap">${found_employee.name.first} ${found_employee.name.last}</h3>
		    <p class="modal-text">${found_employee.email}</p>                                                            
		    <p class="modal-text cap">${found_employee.location.city}</p>                                                         
		    <hr>                                                                                       
		    <p class="modal-text">${found_employee.cell}</p>                                                   
		    <p class="modal-text">${employeeStreet}, 
					  ${employeeCity}, ${employeeState} ${found_employee.location.postcode}
		    </p>
		    <p class="modal-text">Birthday: ${employeeBirthDay}</p>                                            
		  </div>                                                                                         
		</div>`;
  dom_modalContainer.innerHTML = innerHTML;*/
}



//
// EVENT LISTENERS
//

/*
 * Create individual listeners for each employee card.
 * @param   {NodeList}   employees - a DOM node element list of all the employees on the page
 */
function createCardListeners() {
   for (var employee of dom_employeeCards) {
    employee.addEventListener('click', (e) => createEmployeeModal(e.currentTarget));
  }
}

/*
 * 'Click' event listener for closing the modal window.
 * Added the ability to close the modal using the 'esc' key.
 */
function closeModalListener() {
  document.getElementById('modal-close-btn')
    .addEventListener('click', () => dom_modalContainer.style.display = 'none');
  document
    .addEventListener('keydown', (e) => e.key.toLowerCase() === 'escape' ? dom_modalContainer.style.display = 'none' : false);
}



//
// EXTRA CREDIT: SEARCH FUNCTION LISTENER
//

//Adding search input and submit elements to the DOM 
const dom_searchContainer = document.querySelector('.search-container');
dom_searchContainer.innerHTML = `<form action="#" method="get">
				   <input type="search" id="search-input" class="search-input" placeholder="Search...">
				   <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
				 </form>`;
//Adding navigation buttons to the DOM
dom_modalContainer.innerHTML += `<div class="modal-btn-container">
				   <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
				   <button type="button" id="modal-next" class="modal-next btn">Next</button>
				 </div>`;

/*
 * Iterates through the employee cards and displays the user's search.
 */
function searchForUser() {
  const userSearch = document.querySelector('#search-input').value.toLowerCase();

  /*
   * Flips employee cards to display or not display.
   * @param   {String}  action - the action is either 'show' or 'hide'
   */
  function flipEmployeeCards(action) {
     for (let employeeCard of dom_employeeCards) {
      action === 'show' ? employeeCard.style.display = '' : employeeCard.style.display = 'none';
    }
  }

  if (userSearch === '') {
    flipEmployeeCards('show');
  }else { 
     for (let employeeCard of dom_employeeCards) {
      if (employeeCard.querySelector('h3').innerText.toLowerCase() === userSearch) {
	flipEmployeeCards('hide');
	employeeCard.style.display = '';
      }else {
	document.querySelector('#search-input').value = '';
      }
    }
  }
}

// 'Submit' search listener
document.querySelector('#search-submit')
  .addEventListener('click', searchForUser);

// Modal navigation button listener
document.querySelector('.modal-btn-container')
  .addEventListener('click', (e) => {
    var employee_displayed = null;
    var employee_toBeDisplayed = null;

    for (let employee of dom_employeeCards) {
      employee.querySelector('h3').textContent === dom_modalContainer.querySelector('h3').textContent ? employee_displayed = employee : false;
    }

    if (e.target.id === 'modal-next') {
      !employee_displayed.nextSibling ? 
	employee_toBeDisplayed = dom_employeeCards[0] : 
	employee_toBeDisplayed = employee_displayed.nextSibling;
    }else if (e.target.id === 'modal-prev') {
      !employee_displayed.previousSibling ?
	employee_toBeDisplayed = dom_employeeCards[dom_employeeCards.length - 1] :
	employee_toBeDisplayed = employee_displayed.previousSibling;
    }
    employee_toBeDisplayed ? createEmployeeModal(employee_toBeDisplayed) : false;
  });
