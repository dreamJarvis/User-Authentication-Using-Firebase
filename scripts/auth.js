// add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
	e.preventDefault();		//	preventing reloading the page
	const adminEmail = document.querySelector('#admin-email').value;
	
	// calling the cloud-server function, by the name addAdminRole created in functions 
	const addAdminRole = functions.httpsCallable('addAdminRole');

	// in order to call the function we have to send, user data
	addAdminRole({email : adminEmail})
		.then(result =>{
			console.log(result);
		});
});

// auth status : get the currently signed in user
// the function takes an callback function and user as its parameter
// every time there is ahange in authnetication, this function gets called, and it takes that user as a parameter which is initiating the change
// when user is logged in : user is valid value (contains info/data about usr)
// when user is logged out :  user value is null
auth.onAuthStateChanged(user => {
	if(user){
		user.getIdTokenResult()				// returns a promise
			.then(idTokenResult => {
				user.admin = idTokenResult.claims.admin;
				setUpUI(user);		// cause we onlu want the create guide properties to the admins
			});

		// get data
		db.collection('guides').onSnapshot(snapshot => {
			// sends data from the database to this function, when user is logged in
			setUpGuides(snapshot.docs);			//	guides will be shown to every logged in member 
		}, function(error){
			console.log(error.message);
		});
	} else{
		setUpUI();
		setUpGuides([]);
	}
});

// create new guide
// adding new guides to the already existing table
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e)=>{
	e.preventDefault();

	db.collection('guides').add({
		title : createForm['title'].value,
		content: createForm['content'].value
	}).then(() => {
		const modal = document.querySelector('#modal-create');
		M.Modal.getInstance(modal).close();
		loginForm.reset();
	}).catch((err) => {
		console.log(" create form error" ,err.message);
	})
})

// signup : creating new user in the database
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

	// get user info
	// note : you can only get id's as he signupForm contains the info of id #signup-form
	const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
	
	// regular exresion pattern to match that of the user
	var mailformat =  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

	// after matching theat the user has entered an valid email-id,we create a new user in the firebase with the given email , password value
	const modal = document.querySelector('#modal-signup');	
    if(email.match(mailformat)){
		auth.createUserWithEmailAndPassword(email, password)
			.then(cred => {
				// here we are creating a collection with the same id as that of with which user has singned in as...so that whenever we want ot access data specific to our user, wo can obtain it by it's auth id, which is the same as that of the user signed in with
				// .doc() : creating an document with user.uid i.e. the auth id of the user
				return db.collection('users').doc(cred.user.uid).set({
					bio: signupForm['signup-bio'].value
				});
			}).then(() => {
				// when the user is signed in, then we show that user value using matrialize modals class which has reference to our created modals 
				// we initialize those modals using Modal.instance()
				M.Modal.getInstance(modal).close();
				signupForm.reset();		// resets the signup form data
				signupForm.querySelector('.error').innerHTML = '';
			}).catch(err => {
				signupForm.querySelector('.error').innerHTML = err.message;
			});
    }else {
		alert("You have entered an invalid email address!");
		signupForm.reset();
	}
});


// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
	e.preventDefault();
	auth.signOut();		//	sets  out the onAuthStateChanged() funt^n, so that the values in the display will be changed accordingly
})

// login user
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// get user info
	const email = loginForm['login-email'].value;
	const password = loginForm['login-password'].value;

	// using firebase function to login
	// automatically changes the auth status
	auth.signInWithEmailAndPassword(email, password)
		.then(cred => {
			// alert('user logged in');
			const modal = document.querySelector('#modal-login');
			M.Modal.getInstance(modal).close();
			loginForm.reset();
			signupForm.querySelector('.error').innerHTML = '';
		}).catch(err => {
			loginForm.querySelector('.error').innerHTML = err.message;
			console.log(err.message);
		});
});