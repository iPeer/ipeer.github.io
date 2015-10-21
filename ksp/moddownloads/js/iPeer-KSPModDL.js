var secsTilUpdate = 0;
var isUpdating = false;
var isFirstUpdate = true;
var currentProject;
var timerStarted = false;

var projectList = { 
	"agos" : {
		"name": "AGroupOnStage",
		"github": "https://github.com/iPeer/AGroupOnStage/releases",
		"kerbalstuff": "https://kerbalstuff.com/mod/766",
		"api_id": "agosdl"
	},
	"tlag" : {
		"name": "ThrottleLimitActionGroups",
		"github": "https://github.com/iPeer/ThrottleLimitActionGroups/releases",
		"kerbalstuff": "https://kerbalstuff.com/mod/811",
		"api_id": "tlagdl"
	},
	"csag" : {
		"name": "ControlSurfaceActionGroups",
		"github": "https://github.com/iPeer/ControlSurfaceActionGroups/releases",
		"kerbalstuff": "https://kerbalstuff.com/mod/841",
		"api_id": "csagdl"
	},
	"iffs" : {
		"name": "InFlightFlagSwitcher",
		"github": "https://github.com/iPeer/InFlightFlagSwitcher/releases",
		"kerbalstuff": "https://kerbalstuff.com/mod/982",
		"api_id": "iffsdl"
	},
	"cbg" : {
		"name": "ClampsBeGone",
		"github": "https://github.com/iPeer/ClampsBeGone/releases",
		"kerbalstuff": "https://kerbalstuff.com/mod/1037",
		"api_id": "cbgdl"
	}
};

function enableLinks() {

// Gotta do these all manually, can't for loop 'em!
	$(".footerLink.agos").click(function (e) { changeProject("agos"); });
	$(".footerLink.tlag").click(function (e) { changeProject("tlag"); });
	$(".footerLink.csag").click(function (e) { changeProject("csag"); });
	$(".footerLink.iffs").click(function (e) { changeProject("iffs"); });
	$(".footerLink.cbg").click(function (e) { changeProject("cbg"); });


}

function generateFooter() {

	var footer = "";

	for (var p in projectList) {

		if (footer.length > 0) { footer += "<span class=\"footer_pipe\">|</span>"; }

		if (currentProject == projectList[p]) {

			footer += projectList[p]["name"];
			
		}
		else {

			footer += "<a class=\"footerLink "+p+"\" href=\"#"+p+"\">"+projectList[p]["name"]+"</a>";

		}

	}

	return footer;

}

function setProjectFromURL() {

	var project = "agos";

	var urlData = window.location.href.split("#");
	if (urlData.length > 1) {
		if (projectList[urlData[1]] != undefined) { project = urlData[1]; }
	}

	changeProject(project);

}

$(document).ready(function () {

	setProjectFromURL();


	$("span.apiLink").click(function (e) {
		toggleAPIData();
	});

	/*$("span.disclaimer").click(function () {

		if (disclaimerOpen) {
			$("div.disclaimerText").fadeOut();
			disclaimerOpen = false;
		}
		else {
			$("div.disclaimerText").fadeIn();
			disclaimerOpen = true;
		}

	});*/

});


function changeProject(proj) {

	//console.log("Project change requested: "+proj);

	if (projectList[proj] == undefined) { changeProject("agos"); }
	else { 

		$(".downloads").html("Getting data...");

		currentProject = projectList[proj];
		var github = currentProject["github"];
		var apiURL = "http://ipeer.auron.co.uk/api/"+currentProject["api_id"]+".json";

		if (currentProject["kerbalstuff"] != undefined) {

			var kerbal = currentProject["kerbalstuff"];
			$(".kerbalstufflink").attr("href", kerbal);
			$(".countsep").show();
			$(".downloadSource.kerbal").show();
			$("#kerbalstuff").show();

		}
		else {
 
			$("#kerbalstuff").hide();
			$(".countsep").hide();
			$(".downloadSource.kerbal").hide();

		}

		$(".githublink").attr("href", github);
		$(".apiLink").attr("href", apiURL);
		

		$(".footer").html(generateFooter());
		updateData();
		updateTicker();
		if (!timerStarted) {

			setInterval(updateTicker, 1000);
			timerStarted = true;

		}

	}

	document.title = currentProject["name"]+" Download Counter";

	// make sure links are initialised
	enableLinks();

}

function updateTicker() {

	var update = (secsTilUpdate < 0 ? 0 : secsTilUpdate);

	var min = Math.floor(update / 60);
	var sec = update % 60;

	var updateString = pad(min)+":"+pad(sec);

	//var currentString = $("span.updateTime").text();

	//var newString = currentString.substring(0, currentString.lastIndexOf(" "))+" "+updateString;

	//$("span.updateTime").html(newString+".");

	$(".updateTimer").html(updateString);

	secsTilUpdate--;

	if (update <= 0) {
		update = 0;
		if (!isUpdating) {
			updateData();
		}
	}

}

function pad(n) {

	if (n < 10) { return "0"+n; }
	return n;

}

function updateData() {

	isUpdating = true;

	var projectFile = currentProject["api_id"];

	var lastJSON;

	//console.log("Project is "+lastURLPart);

	var _json = $.getJSON("//ipeer.auron.co.uk/api/"+projectFile+".json", function (data) {

	lastJSON = data;

	/*var status = $("span.updateTime").text();
	var statusStart = status.substring(0, 6);
	var statusEnd = status.substring(status.indexOf("."));
	var newStatus = statusStart+data["updated_formatted"]+statusEnd;*/

	var updateDate = data["updated_formatted"];


	var downloads = data["downloads_formatted"];
	var change = data["change_formatted"];

	var github = data["downloads_github_formatted"];
	var kerbalstuff = data["downloads_kerbalstuff_formatted"];

	var today = data["downloads_today_formatted"];
	var yesterday = data["downloads_yesterday_formatted"];

	//$("span.updateTime").html(newStatus);
	$("span.updateDate").html(updateDate);
	$("span.downloads").html(downloads);

	if (change > 0) {

		$("span.changes").html("+"+change);
		$("span.changes").fadeIn();

	}
	else {

		$("span.changes").fadeOut();

	}

	//console.log(data);

	$("textarea.jsonData").text(JSON.stringify(data));

	$("span#github").html(github);
	$("span#kerbalstuff").html(kerbalstuff);

	$("span#today").html(today);
	$("span#yesterday").html(yesterday);

	
	/*if (isFirstUpdate) {*/

		var lastUpdate = data["updated"];
		var nextUpdate = lastUpdate + 300;

		var timeTilUpdate = nextUpdate - Math.floor(new Date().getTime() / 1000)		

		secsTilUpdate = timeTilUpdate + 30;

		if (secsTilUpdate > 300) { secsTilUpdate = 300; }
		isFirstUpdate = false;

	/*}
	else {
		secsTilUpdate = 300;
	}*/


	});

	
	//console.log(_json);
	

	isUpdating = false;
}

function toggleAPIData() {

	var apiText = $("span.apiLink").text();

	if (apiText.startsWith("Show")) {
		$("span.apiLink").html(apiText.replace("Show", "Hide"));
		$("textarea.jsonData").slideDown();
	}
	else {
		$("span.apiLink").html(apiText.replace("Hide", "Show"));
		$("textarea.jsonData").slideUp();
	}

}