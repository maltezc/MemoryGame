document
  .getElementById("createMemeButton")
  .addEventListener("click", function (e) {
    e.preventDefault();
    var memeURL = document.getElementById("memeUrl");
    var topInputText = document.getElementById("inputTopText");
    var bottomInputText = document.getElementById("inputBottomText");

    // creates image element and sets the element value to the input value
    //pre-sets div
    var newImageDiv = document.createElement("div");
    newImageDiv.className = "newDivImageClass";

    // creates image and its attributes
    var newImg = document.createElement("img");
    newImg.className = "memeImageClass";
    newImg.setAttribute("src", memeURL.value);
    newImageDiv.addEventListener("click", function (e) {
      e.target.parentElement.remove();
    });

    // top text over image
    var topTextDivElem = document.createElement("div");
    topTextDivElem.className = "topText text-align-top text-align-center";
    topTextDivElem.innerText = topInputText.value;
    newImageDiv.appendChild(topTextDivElem);

    var bottomTextDivElem = document.createElement("div");
    bottomTextDivElem.className =
      "bottomText text-align-bottom text-align-center";
    bottomTextDivElem.innerText = bottomInputText.value;
    newImageDiv.appendChild(bottomTextDivElem);

    // set overlay div.
    var middleDiv = document.createElement("div");

    var deleteButton = document.createElement("button");
    deleteButton.className = "deleteButton btn btn-primary text-center my-5";
    deleteButton.innerText = "Delete";

    // appents image to div
    newImageDiv.appendChild(newImg);
    newImageDiv.appendChild(deleteButton);

    // prepends element to meme history
    var memeHistoryElem = document.getElementById("memeHistory");
    memeHistoryElem.prepend(newImageDiv);

    // resets values
    memeURL.value = "";
    topInputText.value = "";
    bottomInputText.value = "";
  });
