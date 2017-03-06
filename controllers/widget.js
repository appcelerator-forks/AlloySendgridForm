var args = arguments[0] || {};
var SENDGRID_USERNAME = args.sendGridUsername || "";
var SENDGRID_PWD = args.sendGridPwd || "";
var sendgrid = require(WPATH('tisendgrid'))(SENDGRID_USERNAME, SENDGRID_PWD);
var validate = require(WPATH('hdjs.validate'));
var validator = new validate.FormValidator();
var callback = args.callback || null;
var toField = args.toField || "";
var	toFieldEditable=_.has(args, 'toFieldEditable') ? args.toFieldEditable : false;
var	subjectField=args.subjectField || "";
var	msgField=args.msgField || "";

$.toField.value = toField;
$.toField.editable = toFieldEditable;
$.subjectField.value = subjectField;
$.msgField.value = msgField;

function sendEmail(){
    var email = {
        to: $.toField.value,
        from: $.fromField.value,
        subject: $.subjectField.value,
        text: $.msgField.value
    };

    var message = sendgrid.Email(email);

    sendgrid.send(message, function(e) {
        if (e) {
            alert(e.errors[0]);
        }else{
            alert('Thank you!');
            callback && callback();
        }
    });

}

function validationCallback(errors) {
    if(errors.length > 0) {
        for (var i = 0; i < errors.length; i++) {
            Ti.API.debug(errors[i].message);
        }
        alert(errors[0].message);
    } else {
        sendEmail();
    }
}


function returnCallback() {
    validator.run([
        {
            id: 'toField',
            value: $.toField.value,
            display: 'TO',
            rules: 'required|valid_email'
        },
        {
            id: 'fromField',
            value: $.fromField.value,
            display: 'FROM',
            rules: 'required|valid_email'
        },
        {
            id: 'subjectField',
            value: $.subjectField.value,
            display: 'Subject',
            rules: 'required|min_length[3]|max_length[50]'
        },{
            id: 'msgField',
            value: $.msgField.value,
            display: 'Message',
            rules: 'required|min_length[10]|max_length[400]'
        }
    ], validationCallback);
}

$.sendEmailBtn.addEventListener('click', returnCallback);

$.cancelBtn.addEventListener('click', function(){
	callback && callback();
});