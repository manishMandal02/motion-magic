type DrawTimestampMarkerProps = {
  ctx: CanvasRenderingContext2D;
  canvasHeight: number;
  dpi: number;
  markerPosition: number;
  timestampValue: string | null;
};

// draw line markers with timestamp value (after intervals)
const drawTimestampMarkerLines = ({
  ctx,
  canvasHeight,
  markerPosition,
  dpi,
  timestampValue,
}: DrawTimestampMarkerProps) => {
  ctx.translate(0.5, 0.5);
  if (timestampValue) {
    ctx.moveTo(markerPosition * dpi, canvasHeight - 13 * dpi);
    ctx.fillText(timestampValue, (markerPosition + 1.25 * dpi) * dpi, canvasHeight - 11 * dpi);
  } else {
    ctx.moveTo(markerPosition * dpi, canvasHeight - 8 * dpi);
  }

  ctx.lineTo(markerPosition * dpi, canvasHeight - 1 * dpi);

  ctx.stroke();
  ctx.translate(-0.5, -0.5);
};

export default drawTimestampMarkerLines;
