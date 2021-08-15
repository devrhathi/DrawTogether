(function () {
  const socket = io();
  const canvas = document.querySelector(".myWhiteboard");
  const context = canvas.getContext("2d");
  resizeCanvas();

  let isDrawing = false;
  let current = {};

  function startDrawing(e) {
    isDrawing = true;

    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  }
  function stopDrawing(e) {
    if (!isDrawing) return;
    isDrawing = false;
  }
  function onMouseMove(e) {
    if (!isDrawing) return;
    drawData(
      current.x,
      current.y,
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY,
      true
    );
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  }
  function drawData(x0, y0, x1, y1, shouldEmit) {
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineCap = "round";
    context.lineWidth = 6;
    context.stroke();

    const w = canvas.width;
    const h = canvas.height;

    if (shouldEmit) {
      socket.emit("drawingData", {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
      });
    }
  }

  function drawIncomingData(data) {
    const w = canvas.width;
    const h = canvas.height;
    drawData(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  canvas.addEventListener("resize", resizeCanvas);

  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseout", stopDrawing);

  canvas.addEventListener("touchstart", startDrawing);
  canvas.addEventListener("touchend", stopDrawing);
  canvas.addEventListener("touchcancel", stopDrawing);
  canvas.addEventListener("touchmove", onMouseMove);

  socket.on("drawingData", drawIncomingData);
})();
