window.onload = function () {
    // Select the necessary elements from the HTML
    const canvas = document.getElementById("annotationCanvas");
    const ctx = canvas.getContext("2d");
    const colorPicker = document.getElementById("colorPicker");
    const eraserButton = document.getElementById("eraserButton");
    const clearButton = document.getElementById("clearButton");
    const saveButton = document.getElementById("saveButton");
    const undoButton = document.getElementById("undoButton");
    const redoButton = document.getElementById("redoButton");

    const PEN_TEXT = "✏️ Pen";
    const ERASER_TEXT = "🧽 Eraser";

    let drawing = false;
    let erasing = false;
    let currentColor = colorPicker ? colorPicker.value : "#ff0000"; // Set default if missing
    let strokes = [];
    let redoStack = [];

    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        redraw();
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    let currentStroke = [];

    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        currentStroke = [];
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener("mousemove", function (e) {
        if (!drawing) return;

        ctx.lineWidth = erasing ? 15 : 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = erasing ? "white" : currentColor;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        currentStroke.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, color: ctx.strokeStyle, width: ctx.lineWidth });
        currentStroke.push({ x: e.clientX, y: e.clientY, color: ctx.strokeStyle, width: ctx.lineWidth });
    });

    canvas.addEventListener("mouseup", () => {
        if (currentStroke.length > 0) {
            strokes.push({ points: currentStroke, erasing });
            redoStack = [];
        }
        drawing = false;
        ctx.beginPath();
    });

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let stroke of strokes) {
            ctx.beginPath();
            ctx.lineWidth = stroke.erasing ? 15 : 2;
            ctx.strokeStyle = stroke.erasing ? "white" : stroke.points[0].color;
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

            for (let i = 1; i < stroke.points.length; i++) {
                let p = stroke.points[i];
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            }
        }
    }

    undoButton.addEventListener("click", function () {
        if (strokes.length > 0) {
            redoStack.push(strokes.pop());
            redraw();
        }
    });

    redoButton.addEventListener("click", function () {
        if (redoStack.length > 0) {
            strokes.push(redoStack.pop());
            redraw();
        }
    });

    function toggleEraser() {
        erasing = !erasing;
        eraserButton.textContent = erasing ? PEN_TEXT : ERASER_TEXT;
    }

    eraserButton.addEventListener("click", toggleEraser);

    if (colorPicker) {
        colorPicker.addEventListener("input", function () {
            currentColor = colorPicker.value;
            erasing = false;
            eraserButton.textContent = ERASER_TEXT;
        });
    }

    clearButton.addEventListener("click", function () {
        strokes = [];
        redoStack = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    saveButton.addEventListener("click", function () {
        const link = document.createElement("a");
        link.download = "drawing.png";
        link.href = canvas.toDataURL();
        link.click();
        event.preventDefault();
        if (event.ctrlKey && event.key.toLowerCase() === "z") {

    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key.toLowerCase() === "z") {
            undoButton.click();
        } else if (event.ctrlKey && event.key.toLowerCase() === "y") {
        } else if (event.key.toLowerCase() === "e") {
            toggleEraser();
            eraserButton.textContent = erasing ? "✏️ Pen" : "🧽 Eraser";
        } else if (event.key.toLowerCase() === "c") {
            clearButton.click();
        }
    });
};
