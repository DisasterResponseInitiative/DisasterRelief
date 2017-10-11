"use strict";

function preparePage() {	
	
	document.getElementById("checkMapInfo").onclick = function() {
		var name = document.getElementById("pac-input").value;
		var latitude = map.center.lat();
		var longitude = map.center.lng();
		document.getElementById("mapInfo").innerHTML = "Name of Organization : " + name + "/n Latitude :"+latitude +"/n Longitude" + longitude;
	};
	// now hide it on the initial page load.
	document.getElementById("tourSelection").style.display = "none";
	document.getElementById("verifyMessage").style.visibility = "hidden";
	document.getElementById("verifyButton").onclick = function() {
		
		var pw = document.getElementById("password").value;
		var repw = document.getElementById("re_password").value;
		
		if(pw !== repw){
			document.getElementById("verifyMessage").style.visibility = "visible";
			document.getElementById("verifyMessage").innerHTML = "Passwords do not match.";
		}
		
		var mobileNo = document.getElementById("emergencyContact").value;
		var email = document.getElementById("email").value;
		var method = document.getElementById("myform").verify; 

		if (method[0].checked) {
			document.getElementById("verifyMessage").style.visibility = "visible";
			document.getElementById("verifyMode").innerHTML = "Email " + email ;
		} 
		else if(method[1].checked) {
			document.getElementById("verifyMessage").style.visibility = "visible";
			document.getElementById("verifyMode").innerHTML = "Mobile Number " + mobileNo;
		}
		else{
			document.getElementById("verifyMessage").style.visibility = "hidden";
		}
	};
}

window.onload =  function() {
	preparePage();
};

