var employeeList = null;
const employeeGallery = document.getElementById('gallery');



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

fetch(API_address)
  .then(checkStatus)
  .then(response => response.json())
  .then(response => {
    createEmployeeCards(response.results);
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
  employeeGallery.innerHTML = innerHTML;
}



//
// EVENT LISTENERS
//
