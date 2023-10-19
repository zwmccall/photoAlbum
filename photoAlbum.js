var curImgIndex = 0;
var numAlbums = 0;

/**
 * Does the HTTP request to get the photo data
 *
 * @param {number} val Which photo in the album to get. 0 gets the first, -1 gets previous from current, 1 gets next from current.
 */
function getData(val){

	if (val == 0){
		curImgIndex = 0;
	} else if (val == -1){
		curImgIndex--;
	} else if (val == 1){
		curImgIndex++;
	}

	var id = document.getElementById("idVal").value;

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

		if (this.status == 200) {
			var data = JSON.parse(this.responseText);

			if (id == ""){
				//This assumes data is provided in sequential album ID order
				numAlbums = data[data.length-1].albumId;
			}

			setImg(data[curImgIndex], data.length, id)
		}
	};

	var url = 'https://jsonplaceholder.typicode.com/photos';

	//Only let user select to filter an album with a valid ID
	if (id != "" && (id <= 0 || id > numAlbums)){
		if (id <= 0){
			alert('Album ID value must be greater than zero!');
		} else if (id > numAlbums){
			alert('Album ID value must be less than the number of albums!');
		}
		return false;
	}

	if (id != ""){
		url += '?albumId=' + id
	}

	xhr.open('GET', url, true);
	xhr.send();
}

/**
 * Sets the image and all related text for the currently selected photo.
 *
 * @param {number} imgData The JSON data of the currently selected photo.
 * @param {number} albumLength The amount of photos in the filtered album.
 * @param {number} albumID The ID of the filtered album.
 */
function setImg(imgData, albumLength, albumID){
	if (imgData){
		document.getElementById("thumbnail").src = imgData.thumbnailUrl;
		document.getElementById("thumbnail").title = imgData.title;
		document.getElementById("titleHeader").innerText = 'Title: ' + imgData.title;
		document.getElementById("thumbnail").onclick = function() { window.open(imgData.url, '_blank'); };
		document.getElementById("pNumHeader").innerText = 'Current Photo: ' + (curImgIndex+1) + ' of ' + albumLength;
		document.getElementById("aNumHeader").innerText = 'Current Album: ' + imgData.albumId + ' of ' + numAlbums;
		if (albumID != ""){
			document.getElementById("filterHeader").innerText = 'Filter By: Album ' + albumID;
		} else {
			document.getElementById("filterHeader").innerText = 'Filter By: All Images';
		}
		setBtns(albumLength);
	} else {
		document.getElementById("thumbnail").src = "";
		document.getElementById("thumbnail").title = "";
		document.getElementById("titleHeader").innerText = 'Title: No Data Found';
		document.getElementById("thumbnail").onclick = function() { };
		document.getElementById("pNumHeader").innerText = 'Current Photo: No Data Found';
		document.getElementById("aNumHeader").innerText = 'Current Album: No Data Found';
		if (albumID != ""){
			document.getElementById("filterHeader").innerText = 'Filter By: Album ' + albumID;
		} else {
			document.getElementById("filterHeader").innerText = 'Filter By: All Images';
		}
		setBtns(albumLength);
		alert('No album with that ID');
	}
}

/**
 * Enables/disables the next and previous buttons based off where the current photo is in the filtered album.
 *
 * @param {number} albumLength The amount of photos in the filtered album.
 */
function setBtns(albumLength){
	if (curImgIndex == 0){
		document.getElementById("prevBtn").disabled = true;
	} else {
		document.getElementById("prevBtn").disabled = false;
	}

	if (curImgIndex+1 == albumLength || albumLength == 0){
		document.getElementById("nextBtn").disabled = true;
	} else {
		document.getElementById("nextBtn").disabled = false;
	}
}

var idVal = document.getElementById("idVal");
idVal.addEventListener("keydown", function (e) {
	if (e.code === "Enter") {
		getData(0);
	}
});