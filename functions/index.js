'use-strict'

const functions = require('firebase-functions');
const admin = require ('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.firestore.document("Users/{Users_id}/Notifications/{Notifications_id}").onWrite((change, context)=> {
	const user_id = context.params.Users_id;
	const notification_id = context.params.Notifications_id;
	
	
	
	return admin.firestore().collection("Users").doc(user_id).collection("Notifications").doc(notification_id).get().then(queryResult => {
		
		const from_user_id = queryResult.data().from;
		const from_message = queryResult.data().message;
		
		const from_data = admin.firestore().collection("Users").doc(from_user_id).get();
		const to_data = admin.firestore().collection("Users").doc(user_id).get();
		
		return Promise.all([from_data, to_data]).then(result => {
			
			const from_name = result[0].data().name;
			const to_name = result[1].data().name;
			const token_id = result[1].data().token_id;
			
			const payload = {
				notification : {
					title : "Notification From : "+ from_name,
					body : from_message,
					icon : "default"
				}
			};
			
			return admin.messaging().sendToDevice(token_id, payload).then(result => {
			
				return console.log("Notification Sent.");
			});
		
		
		});
	
	});
	
} );