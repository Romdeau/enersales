angular.module('mailService', [])

.factory('Mail', function($http, $filter) {
  // create a new object
	var mailFactory = {};

  // email for sale creation
  mailFactory.createSale = function(mailData) {
    var mailArray = ({
  		fromEmail: "noreply@eneraque.com",
  		toEmail: "thomas.taege@eneraque.com",
  		subject: 'A new sale has been created',
  		text: 'Template Text',
  		html: 'Template HTML'
  	});

    //inject content from mailData
    mailArray.toEmail = mailData.salesman.email;
    mailArray.text = "Successfully added job " + mailData.poNumber + " for customer " + mailData.customer + ".\nYou have been assigned as the saleman for this job. \nPlease complete the handover process for this job when you are able to @ http://enersales.eneraque.com/sales/" + mailData._id;
    mailArray.html = "Successfully added job " + mailData.poNumber + " for customer " + mailData.customer + ".<br />You have been assigned as the saleman for this job. <br /><br />Please complete the handover process for this job when you are able to @ http://enersales.eneraque.com/sales/" + mailData._id;

    //send the email
    return $http.post('/api/email/', mailArray);
  };

  // email for handover meeting
  mailFactory.createHandover = function(mailData) {
    var mailArray = ({
  		fromEmail: "noreply@eneraque.com",
  		toEmail: "thomas.taege@eneraque.com",
  		subject: 'A handover meeting has been proposed',
  		text: 'Template Text',
  		html: 'Template HTML'
  	});

		var meetingTime = $filter('date')(mailData.meetingDate, "dd-MM-yyyy h:mm a");

    //inject content from mailData
    //mailArray.toEmail = mailData.salesman.email + ", " + mailData.projectManager;
    mailArray.text = "Hello, a handover meeting for PO " + mailData.poNumber + " for " + mailData.customer + " has been proposed for:\n\n" + meetingTime + "\n\nIf this does not suit please reply to each other, this email address does not exist";
    mailArray.html = "Hello, a handover meeting for PO " + mailData.poNumber + " for " + mailData.customer + " has been proposed for:<br/><br/>" + meetingTime + "<br/><br/>If this does not suit please reply to each other, this email address does not exist";


    //send the email
    return $http.post('/api/email/', mailArray);
  };

  // email for handover meeting
  mailFactory.finaliseAccounts = function(mailData) {
    var mailArray = ({
  		fromEmail: "noreply@eneraque.com",
  		toEmail: "thomas.taege@eneraque.com",
  		subject: 'Accounts have finalised this PO',
  		text: 'Template Text',
  		html: 'Template HTML'
  	});

    //inject content from mailData
    mailArray.toEmail = mailData.salesman.email;
    mailArray.cc = mailData.accountsManager.email;
    mailArray.text = "Hello, " + mailData.salesman.name + " has completed the accounts process for this PO\n\nIf you have any queries please reply to each other, this email address does not exist";
    mailArray.html = "Hello, " + mailData.salesman.name + "<br/><br/>" + mailData.accountsManager.name + " has completed the accounts process for this PO<br/><br/>If you have any queries please reply to each other, this email address does not exist";

    //send the email
    return $http.post('/api/email/', mailArray);
  };

	// email for sale creation
  mailFactory.createUser = function(userData) {
    var userArray = ({
  		fromEmail: "noreply@eneraque.com",
  		toEmail: "thomas.taege@eneraque.com",
  		subject: 'A new sale has been created',
  		text: 'Template Text',
  		html: 'Template HTML'
  	});

    //inject content from mailData
    userArray.toEmail = userData.email;
    userArray.html = "Hello " + userData.name + "<br/><br/>A user account for <a href='http://enersales.eneraque.com/>Enersales</a> has been created for you. To access it please login with the username " + userData.username + " at <a href='http://enersales.eneraque.com'>enersales.eneraque.com</a>.";

    //send the email
    return $http.post('/api/email/', userArray);
  };

  // return our entire saleFactory object
  return mailFactory;

});
