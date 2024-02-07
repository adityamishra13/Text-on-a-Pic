// to get the canvas and its 2d rendering context 
const canvas = document.getElementById('imageCanvas');
const context = canvas.getContext('2d');


// Get input elements from the HTML document
const imageInput = document.getElementById('imageInput');
const textInput = document.getElementById('text');
const fontSelect = document.getElementById('font');
const fontSizeInput = document.getElementById('fontSize');
const colorInput = document.getElementById('color');
const coordXInput = document.getElementById('coordX');
const coordYInput = document.getElementById('coordY');

// Array to store the history of canvas states for undo and redo
let history = [];

// Index to keep track of the current state in history
let historyPointer = -1;

// event listener triggered when the user selects any image file 
imageInput.addEventListener('change', handleImage);

function handleImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    // to create an Image object and draw it on the canvas  when the selected image file is loaded
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);       // to clear the canvas 
            context.drawImage(img, 0, 0, canvas.width, canvas.height);  // to draw the image
            saveState(); // to save the current state to the history array
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);   // to read the file as a data URL
}

function addText() {
    // to get user input values
    const text = textInput.value;
    const font = fontSelect.value;
    const fontSize = parseInt(fontSizeInput.value);
    const color = colorInput.value;
    const x = parseInt(coordXInput.value);
    const y = parseInt(coordYInput.value);

    // to set the font style and fill color
    context.font = `${fontSize}px ${font}`;
    context.fillStyle = color;

    // to draw the text on the canvas at the specified coordinates
    context.fillText(text, x, y);

    saveState();
}

function saveState() {
    history = history.slice(0, historyPointer + 1); // to remove future states when undoing from the current state
    const currentState = canvas.toDataURL(); // to convert the canvas state to a data URL
    history.push(currentState); // to add the current state to the history array
    historyPointer++; // to move the pointer to the latest state
}

function undo() {
    if (historyPointer > 0) {
        historyPointer--; // to move the pointer back in history array
        const img = new Image();
        img.onload = function () {
            // to clear the canvas and draw the image from the selected state
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);
        };
        img.src = history[historyPointer];   // to set the source of the image to the selected state
    }
}

function redo() {
    if (historyPointer < history.length - 1) {
        historyPointer++;   // to move the pointer forward in history
        const img = new Image();
        img.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);
        };
        img.src = history[historyPointer];
    }
}

//  to save the edited image
function saveImage() {
    const dataURL = canvas.toDataURL();     // to convert the canvas state to a data URL
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'final_img.png';        // Set the download attribute with a default filename final_img.png
    a.click();      // Simulates a click on the link to trigger the download
}