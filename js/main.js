
/*------------------------------------------------------
		VFW Local Storage Activity
		April 2012
		Author: Marianne Sheldon
-------------------------------------------------------*/


//Wait until the DOM is ready.
window.addEventListener("DOMContentLoaded", function(){
		
	/*------------------------------------------------------
				getElementById reusable function
	-------------------------------------------------------*/
	function $(x){
		var targetElement = document.getElementById(x);
		return targetElement;
	}	
	
	/*------------------------------------------------------
				Variable Defaults
	-------------------------------------------------------*/
	var refill = false;
	var radioChecked = "no type selected";	
	var pUnits = ["--Select Units--", "mg", "mcg","ml","tsp","tab(s)","other"];
	var frequency = [];
	var errorMsg = $('errors');
	

	
	/*------------------------------------------------------
	Dynamically create Select elements to create drug units
	-------------------------------------------------------*/
	(function makeUnits(){
		console.log("MakeUnits");
		var formTag = document.getElementsByTagName("form"); //getElementsByTagName returns an ARRAY
			selectLi = $('units'),
			makeSelect = document.createElement('select');
			makeSelect.setAttribute("id", "drugUnits");
		for(var i=0,j=pUnits.length; i<j; i++){
			var makeOption = document.createElement('option');
			var optionValue = pUnits[i];
			makeOption.setAttribute("value", optionValue);
			makeOption.innerHTML = optionValue;
			makeSelect.appendChild(makeOption);
		}
		selectLi.appendChild(makeSelect);
	})();
	
	
	
	/*------------------------------------------------------
				Get Checkbox and Radio Data
	-------------------------------------------------------*/

	function checkRadio(){
		var typeRadios = document.querySelectorAll(".drugType");		
		
		for(var k=0,l=typeRadios.length; k<l; k++){
			if(typeRadios[k].checked === true){
				radioChecked = typeRadios[k].value;
				console.log("CheckRadio:", radioChecked);
			}
			
		}
		console.log(radioChecked);
		return radioChecked;
	};
	
	function checkCheckboxes(){
		var refillBox = document.querySelector("#refill");
		console.log(refillBox)
		
		if(refillBox.checked){
			refill = true;
		}
		//console.log("Refill?," + refill)
		return refill
	};
	
	
	
	var save =$('submit_addP');
	save.addEventListener("click", validate);
	
	
	/*------------------------------------------------------
					Form Validation
	-------------------------------------------------------*/

	function validate(e){
		//Define the elements we want to check
		//I'm only checking: drug name, dosage, units and doc phone number
		var getDrug = $('drug');
		var getDose = $('dosage');
		var getUnits = $('drugUnits');
		var getDocPhone = $('docPhone');
		
		//Reset Error Messages
		errorMsg.innerHTML = "";
		getUnits.style.border = "none";
		getDrug.style.border = "none";
		getDose.style.border = "none";
		getDocPhone.style.border = "none";
			
		//Get Error Messages
		var errorMessageArray = [];
			
					//Error for Units
					if(getUnits.value == "--Select Units--"){
						var unitError = "Please select dosage units."
						getUnits.style.border = "2px solid red";
						errorMessageArray.push(unitError);
					}
						
					//Error for Drug
					if(getDrug.value === ""){
						var drugError = "Please enter a drug."
						getDrug.style.border = "2px solid red";
						errorMessageArray.push(drugError);
					}
				
					//Error for Dosage
					if(getDose.value === ""){
						var doseError = "Please enter a dosage amount."
						getDose.style.border = "2px solid red";
						errorMessageArray.push(doseError);
					}
							
					//Error for Doctor's Phone
					//var phoneRegEx = /^(\(?\d\d\d\)?)?( |-|\.)?\d\d\d( |-|\.)?\d{4,4}(( |-|\.)?[ext\.]+ ?\d+)?$/;
					//var pass = phoneRegEx.test(getDocPhone);
					var pass = true;
					console.log("Validation Pass?", pass);
					
					if(!pass){
						var phoneError = "Please enter a valid US phone number."
						getDocPhone.style.border = "2px solid red";
						errorMessageArray.push(phoneError);
					}
			
				//Display Errors (if any)
				if(errorMessageArray.length >=1){
					for(var i=0, j=errorMessageArray.length; i<j; i++){
						var txt = document.createElement('li');
						txt.innerHTML = errorMessageArray[i];
						errorMsg.appendChild(txt);
					}
				}else{
					console.log("validated")
					//Send the key value (which came from the editData function).
					//Remember key value was passed through the edit eventlistener as a property!
					saveData(this.key);
				}
			
			e.preventDefault();
			return false;
	};

	
	/*------------------------------------------------------
					Save Data to Local Storage
	-------------------------------------------------------*/
	//Chad calls this function "storeData"
	function saveData(key){
		//If there is no key, this is a new item and we need to create an id, otherwise we set id to
		//existing key to it will save over the original data
		if(!key){
		//create unique identifier key
			var id = Math.floor(Math.random()*100000001);
		}else{
			id = key;
		}	
			
			
		//get values of Checkboxes and Radios first
				
		checkRadio();
		checkCheckboxes();		
			
		//  Can setItems individually		
		// localStorage.setItem("drug",$('drug').value);  //local storage can ONLY store strings
		// 	localStorage.setItem("dosage",$('dosage').value + " " + $('drugUnits').value);
		// 	localStorage.setItem("frequency",$('freqAmnt').value + " " +$('freqTime').value);
		// 	localStorage.setItem("drugType", radioChecked);
		// 	localStorage.setItem("refill needed", refill);
		// 	localStorage.setItem("doctor", $('doctor').value);
		// 	localStorage.setItem("doctor's phone", $('docPhone').value);
		// 	localStorage.setItem("instructions", $('instructions').value);
		// 	localStorage.setItem("notes", $('notes').value);
		
		
		var prescription = {};
			prescription.drug 	= ["Drug name:", $('drug').value];
			prescription.dosage = ["Dosage:", $('dosage').value + " "];
			prescription.units = ["Units:", $('drugUnits').value];
			prescription.frequencyAmnt = ["Frequency Amount:", $('freqAmnt').value + " "];
			prescription.frequencyTime = ["Frequency Time:",$('freqTime').value];
			prescription.drugType = ["Type of Prescription:", radioChecked];
			prescription.refillNeeded = ["Refill Needed:", refill];
			prescription.doctor = ["Prescribing Doctor's name:", $('doctor').value];
			prescription.docPhone =["Doctor's phone:", $('docPhone').value];
			prescription.instructions = ["Instructions:", $('instructions').value];
			prescription.notes = ["Notes:", $('notes').value];
		
		//Save data into Local Storage: Use Stringify to convert object to a string
		
		localStorage.setItem(id, JSON.stringify(prescription));
	
	
		console.log("data stored");
		
		//e.preventDefault();  //Don't need this here anymore because validation fn prevents the refresh
		//return false;
		
	};
	
	/*------------------------------------------------------
				Toggle Controls
	-------------------------------------------------------*/
	
	function toggleControls(n){
		switch(n){
			case "on":
				$('addPform').style.display = "none";
				$('clear').style.display = "none";
				$('display').style.display = "none";
				//$('addPrescriptionNav').style.display = "inline";
				
				break;
			case "off":
				$('addPform').style.display = "block";
				$('clear').style.display = "inline";
				$('display').style.display = "inline";
				//$('addPrescriptionNav').style.display = "none";
				//$('prescriptions').style.display = "none";
			
				break;
			default:
				return false;
		}
	};

	
	/*------------------------------------------------------
				Display Local Storage Data
	-------------------------------------------------------*/			
	
	var displayLink = $('display');
	displayLink.addEventListener("click", showData);

	function showData(e){   //Chad's videos call this "getData"
		toggleControls("on");
		if(localStorage.length === 0){
			alert("There is no data in Local Storage, so default data was added.");
			autoFillData();
		}
		
		//Write Data from Local Storage and display in the browser
		var makeDiv = document.createElement('div');
		makeDiv.setAttribute("id", "prescriptions");
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
		
		document.body.appendChild(makeDiv);
		$('prescriptions').style.display = "block";
		
		for(var i=0, len=localStorage.length; i<len; i++){
			var editDeleteBtnsLi = document.createElement('li');   //Chad's video call this "linksLi"
			var makeLi = document.createElement('li');
			makeList.appendChild(makeLi);
			makeList.appendChild(document.createElement('br'))
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			//Convert the string from local storage value back to an object by using JSON.parse()
			var obj = JSON.parse(value);
			
			//List item values for each entry
			var makeSubList = document.createElement('ul');
			makeLi.appendChild(makeSubList);
			for(var n in obj){
				var makeSubLi = document.createElement('li');
				makeSubList.appendChild(makeSubLi);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubLi.innerHTML = optSubText;
				makeSubList.appendChild(editDeleteBtnsLi);
			}
			makeEditBtns(localStorage.key(i), editDeleteBtnsLi); //Create our edit and delete buttons for each prescription in local Storage
		}
		
		console.log("data displayed");
			 	
		//e.preventDefault();
		//return false;
	};
	
	/*-----------------------------------------------------------------
		Populate Data with .json data if no local storage present
	-------------------------------------------------------------------*/
		//We are storing JSON data into local storage
	function autoFillData(){
		
		for(var n in json){
			var id = Math.floor(Math.random()*100000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	
	}
	
	
	
	
	
	
	/*------------------------------------------------------
		Create Edit/Delete buttons for each prescription
	-------------------------------------------------------*/
	//Chad's function is called makeItemLinks();
	
	function makeEditBtns(key, editDeleteBtnsLi){
		var editButton = document.createElement('a');  //Chad's is called editLink
		editButton.href = "#";
		editButton.key = key;
		var editText = "Edit ";
		editButton.addEventListener("click", editPre);
		editButton.innerHTML = editText;
		editDeleteBtnsLi.appendChild(editButton);
		
		//add line break between Edit and Delete
		var breakTag = document.createElement('br');
		editDeleteBtnsLi.appendChild(breakTag);
		
		var deleteLink = document.createElement('a'); 
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete ";
		deleteLink.addEventListener("click", deletePre);
		deleteLink.innerHTML = deleteText;
		editDeleteBtnsLi.appendChild(deleteLink);
	};
	
	function editPre(){
		//Grab the data from our item from Local Storage
		var value = localStorage.getItem(this.key);
		var prescrip = JSON.parse(value);
		
		//Show the form
		toggleControls("off");
		
		//populate the form fields with current localStorage values.
		$('drug').value = prescrip.drug[1];
		$('dosage').value = prescrip.dosage[1];
		$('drugUnits').value = prescrip.units[1];
		$('freqAmnt').value = prescrip.frequencyAmnt[1];
		$('freqTime').value = prescrip.frequencyTime[1];
		
		//retrieve radio settings
		
		var radios = document.querySelectorAll(".drugType");
		console.log("Radios:", radios)
		console.log("Prescription Data:", prescrip)
		for (var i=0; i<radios.length; i++){
		
			if(radios[i].value === "one time" && prescrip.drugType[1] === "one time"){
				console.log("one time should be checked")
				radios[i].setAttribute("checked","checked");
			}else if (radios[i].value === "ongoing" && prescrip.drugType[1] === "ongoing"){
				console.log("ongoing should be checked")
				radios[i].setAttribute("checked","checked");
			}else{
				console.log("neither condition was met - review code.")
			}
		}
		//retrieve checkbox settings
		console.log(prescrip.refillNeeded[1])
		if(prescrip.refillNeeded[1] === true){
			document.querySelector("#refill").setAttribute("checked", "checked");
		}
		
		$('doctor').value = prescrip.doctor[1];
		$('docPhone').value = prescrip.docPhone[1];
		$('instructions').value = prescrip.instructions[1];
		$('notes').value = prescrip.notes[1];
		
		//Remove the initial listener from the input 'save contact' button.
		save.removeEventListener("click", saveData);
		//Change Submit Button Value to Edit Button
		$('submit_addP').value = "Edit Contact";
		var editSubmit = $('submit_addP');
		//Save the key value established in this function as a property of the editSubmit event
		//so we can use that value when we save the data we edited
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
		
	};
	
	function deletePre(){
		var ask = confirm("Are you sure you want to delete this contact?");
		if(ask){
			localStorage.removeItem(this.key);
			console.log("Contact was deleted.")
			//Good idea to give feedback to the user at this point
			window.location.reload();
		}else{
			console.log("Contact was NOT deleted.")
			//Good idea to give feedback to the user at this point
		}
	};
	
	
	
	
	
	/*------------------------------------------------------
				Clear Local Storage Data
	-------------------------------------------------------*/
	
	var clearLink = $('clear');
	clearLink.addEventListener("click", clearLocalData);
	
	function clearLocalData(e){
		if(localStorage.length === 0){
			console.log("There is no data to clear from local storage");
		}else{
			localStorage.clear();
			console.log("Local Storage deleted!");
			
			window.location.reload();
			e.preventDefault();
			return false;
		}
	};
	
	
	
});