// setup materialize components
const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');

// when the authstatus gets a user then it fires this function
// which in turn sets up the display accordingly , i.e. navbar here
// so the logged in user will have , logout, guides and account links
// while the new user/loggedout user will se , signUP, login links
const setUpUI = (user) => {
	if(user){
		
		// setting every admin UI to true : i.e. properties only admin can see
		if(user.admin){
			adminItems.forEach(item => item.style.display = 'block');
		}

		// users account info
		db.collection('users').doc(user.uid).get()
			.then(doc => {
				const html = `
					<div>Logged in as ${user.email}</div>
					<div>${doc.data().bio}</div>
					<div class="pink-text">${user.admin ? 'Admin' : ''}</div>
				`
				accountDetails.innerHTML = html;	
			})
		
		// account info
		loggedInLinks.forEach(item => item.style.display = 'block');
		loggedOutLinks.forEach(item => item.style.display = 'none');
	}else{
		accountDetails.innerHTML = "none";

		// toggle UI elements
		loggedInLinks.forEach(item => item.style.display = 'none');
		loggedOutLinks.forEach(item => item.style.display = 'block');
		adminItems.forEach(item => item.style.display = 'none');
	}
}

// set up Guides if user are logged in
// using the data sent from the database will set uo the guides
const setUpGuides = (data) => {
	if(data.length){
		let html = "";
		data.forEach(element => {
			const guide = element.data();	// getting data from the database collection
			const li = `
				<li>
					<div class="collapsible-header grey lighten-4">${guide.title}</div>
					<div class="collapsible-body white">${guide.content}</div>
				</li>
			`;
			html += li;
		});
		
		guideList.innerHTML = html;
	}else{
		guideList.innerHTML = "<h5 class='center-align'>Login to view data</h5>"
	}
}

// seeting up matrialize components in the DOM
// so when the content has been loaded in to the DOM
document.addEventListener('DOMContentLoaded', function() {
	var modals = document.querySelectorAll('.modal');	// get all the elements with class of modals
	M.Modal.init(modals);	// then initialize them with matrialize Modal class

	// similarly select all the .collapasable component's from the DOM, and the initialize those components with the materialize Collapsable class
	var items = document.querySelectorAll('.collapsible');
	M.Collapsible.init(items);
});