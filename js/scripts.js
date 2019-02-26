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

fetch(API_address)
  .then(response => response.json())
  .then(response => console.log(response));


//
// EMPLOYEE CARD CREATION
//


//
// EVENT LISTENERS
//
