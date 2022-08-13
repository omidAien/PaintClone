const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const { body } = document;

// Global Variables
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const ctx = canvas.getContext('2d');
let currentSize = 10;
let bucketColor = '#FFFFFF';
let currentColor = '#A51DAB';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// Displaying Brush Size
function displayBrushSize() {
    if (currentSize < 10) {
        brushSize.textContent = `0${currentSize}`;
    } else {
        brushSize.textContent = currentSize;
    }
}

// Setting Brush Size
brushSlider.addEventListener('change', () => {
    currentSize = brushSlider.value;
    displayBrushSize();
});

// Setting Brush Color
brushColorBtn.addEventListener('change', () => {
    isEraser = false;
    currentColor = `#${brushColorBtn.value}`;
});

// Setting Background Color
bucketColorBtn.addEventListener('change', () => {
    bucketColor = `#${bucketColorBtn.value}`;
    createCanvas();
    restoreCanvas();
});

// Eraser
eraser.addEventListener('click', () => {
    isEraser = true;
    eraser.style.color = 'black';
    brushIcon.style.color = 'white';
    currentColor = bucketColor;
    activeToolEl.textContent = 'Eraser';
    currentSize = 50;
});

// Switch back to Brush
function switchToBrush() {
    isEraser = false;
    activeToolEl.textContent = "Brush";
    brushIcon.style.color = 'black';
    eraser.style.color = 'white';
    currentColor = `#${brushColorBtn.value}`;
    currentSize = 10;
    brushSlider.value = 10;
    displayBrushSize();
}

// Create Canvas
function createCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    ctx.fillStyle = bucketColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    body.append(canvas);
    switchToBrush();
}

// Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
    createCanvas();
    drawnArray = [];
    // Active Tool
    activeToolEl.textContent = 'Canvas Cleared';
    setTimeout(switchToBrush, 1500);
});

// Draw what is stored in DrawnArray
function restoreCanvas() { 

    for (let i = 1; i < drawnArray.length; i++) {
        ctx.beginPath();
        ctx.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
        ctx.lineWidth = drawnArray[i].bSize;
        ctx.lineCap = 'butt';
        ctx.strokeStyle = drawnArray[i].erase ? bucketColor : drawnArray[i].bColor;
        ctx.lineTo(drawnArray[i].x, drawnArray[i].y);
        ctx.stroke();
    }
}

// storeDrawn
function storeDrawn(x, y, bSize, bColor, erase) {
    const line = { x, y, bSize, bColor, erase };
    drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(event) {
    const boundaries = canvas.getBoundingClientRect();
    return {
        x: event.clientX - boundaries.left,
        y: event.clientY - boundaries.top
    };
}

// Mouse Down
canvas.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    const currentPosition = getMousePosition(event);
    ctx.moveTo(currentPosition.x, currentPosition.y);
    ctx.beginPath();
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'butt';
    ctx.strokeStyle = currentColor;
});

// Mouse Move
canvas.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        const currentPosition = getMousePosition(event);
        ctx.lineTo(currentPosition.x, currentPosition.y);
        ctx.stroke();
        storeDrawn(
            currentPosition.x,
            currentPosition.y,
            currentSize,
            currentColor,
            isEraser
        );
    } else {
        storeDrawn(undefined);
    }

});

// Mouse Up
canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
    localStorage.setItem('savedCanvas', JSON.stringify(drawnArray));
    // Active Tool
    activeToolEl.textContent = 'Canvas Saved';
    setTimeout(switchToBrush, 1500);
});

// Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
    if (localStorage.getItem('savedCanvas')) {
    drawnArray = JSON.parse(localStorage.savedCanvas);
    restoreCanvas();
    // Active Tool
    activeToolEl.textContent = 'Canvas Loaded';
    setTimeout(switchToBrush, 1500);
    } else {
    activeToolEl.textContent = 'No Canvas Found';
    setTimeout(switchToBrush, 1500);
    }
});

// Clear Local Storage
clearStorageBtn.addEventListener('click', () => {
    localStorage.removeItem('savedCanvas');
    // Active Tool
    activeToolEl.textContent = 'Local Storage Cleared';
    setTimeout(switchToBrush, 1500);
});

// Download Image
downloadBtn.addEventListener('click', () => {
    downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
    downloadBtn.download = 'paint-example.jpeg';
    // Active Tool
    activeToolEl.textContent = 'Image File Saved';
    setTimeout(switchToBrush, 1500);
});
    
// Brush Icon
brushIcon.addEventListener('click', switchToBrush);

// OnLoad Page
createCanvas();