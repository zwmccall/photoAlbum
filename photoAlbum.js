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
	const thumbnail = document.getElementById("thumbnail");
	const titleHeader = document.getElementById("titleHeader");
	const pNumHeader = document.getElementById("pNumHeader");
	const aNumHeader = document.getElementById("aNumHeader");
	const filterHeader = document.getElementById("filterHeader");

	if (imgData){
		thumbnail.src = imgData.thumbnailUrl;
		thumbnail.title = imgData.title;
		thumbnail.onclick = function() { window.open(imgData.url, '_blank'); };
		titleHeader.innerText = 'Title: ' + imgData.title;
		pNumHeader.innerText = 'Current Photo: ' + (curImgIndex+1) + ' of ' + albumLength;
		aNumHeader.innerText = 'Current Album: ' + imgData.albumId + ' of ' + numAlbums;
		if (albumID != ""){
			filterHeader.innerText = 'Filter By: Album ' + albumID;
		} else {
			filterHeader.innerText = 'Filter By: All Images';
		}
		setBtns(albumLength);
	} else {
		thumbnail.src = "";
		thumbnail.title = "";
		thumbnail.onclick = function() { };
		titleHeader.innerText = 'Title: No Data Found';
		pNumHeader.innerText = 'Current Photo: No Data Found';
		aNumHeader.innerText = 'Current Album: No Data Found';
		if (albumID != ""){
			filterHeader.innerText = 'Filter By: Album ' + albumID;
		} else {
			filterHeader.innerText = 'Filter By: All Images';
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
	const prevBtn = document.getElementById("prevBtn");
	const nextBtn = document.getElementById("nextBtn");
	
	prevBtn.disabled = curImgIndex === 0 ? true : false;
	nextBtn.disabled = curImgIndex + 1 === albumLength || albumLength === 0 ? true : false;
}

var idVal = document.getElementById("idVal");
idVal.addEventListener("keydown", function (e) {
	if (e.code === "Enter") {
		getData(0);
	}
});