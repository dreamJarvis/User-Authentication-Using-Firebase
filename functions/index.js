// vedio tutorial : https://www.youtube.com/watch?v=4wa3CMK4E2Y&list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ&index=18
const functions = require('firebase-functions');
const admin = require('firebase-admin');    //  adding admin functions
admin.initializeApp();      // initialize this app on server side

// make an user an admin
// export : cause we need to export our function specified by the name of the function after .
// export.function_name
// functions : access to firebase functions
// functions.type_of_functions (many types can be included after the .)
// .onCall() : means we are going to call this function from the front-end, takes callback as a parameter
// data : custom data that we are gonna send
// context : authentication of the user that made this call to the function
exports.addAdminRole = functions.https.onCall((data, context) => {

    // adding an if condition to insure that only other admin can add new admins
    if(context.auth.token.admin !== true){
        return {error: 'only admins can add other admins'};
    } 
 
    // here , when we make an call to firebase auth, inorder to get the authentication details by users email-id, it returns a promise
    // and we are usong return , because we want to send something to user
    return admin.auth().getUserByEmail(data.email)
        // we resolve promises by using .then()
        .then(user => {                                                 //  when the promise is returned, we agian make an call to the auth, and set this user custom claims, and again an promise is returned
            return admin.auth().setCustomUserClaims(user.uid, {
                admin: true
            });

        // the promise sent after setting custom claims are handled here
        }).then(() => {
            return {
                message: `Success ! ${data.email} is set as admin`
            };
        }).catch(err => {
            return err;
        })
});