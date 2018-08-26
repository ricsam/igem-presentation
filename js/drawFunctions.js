export const BEAD_RADIUS = 100;

const drawCircle = ({
  color, x, y, radius, c,
}) => {
  c.fillStyle = color;
  c.beginPath();
  c.arc(x, y, radius, 0, 2 * Math.PI, true);
  c.fill();
  c.closePath();
};

export const drawFormula = ({
  parts, x, y, center = true, fontSize, c,
}) => {
  c.save();

  c.font = `${fontSize}px Helvetica`;

  const fullText = parts.join('');
  const { width: fullTextWidth } = c.measureText(fullText);
  let startX = x;
  if (center) {
    startX = x - fullTextWidth / 2;
    c.textBaseline = 'middle';
  }

  parts.reduce((x0, part) => {
    let y0 = y;
    if (typeof part === 'number') {
      y0 += fontSize / 3;
    }
    c.fillText(part, x0, y0);
    return x0 + c.measureText(part).width;
  }, startX);

  c.restore();
};
export const drawBeadNh2 = ({
  r,
  c,
  x = _w / 2,
  y = _h / 2,
  offsetAngle = 0,
  lineLength = 50,
  linkerColor = 'orange',
}) => {
  for (let i = -offsetAngle; i < 2 * Math.PI; i += (Math.PI * 2) / 12) {
    const xStart = x + (r) * Math.cos(i);
    const yStart = y + (r) * Math.sin(i);
    const xEnd = x + (lineLength + r) * Math.cos(i - offsetAngle);
    const yEnd = y + (lineLength + r) * Math.sin(i - offsetAngle);

    c.lineWidth = 4;
    c.strokeStyle = linkerColor;
    c.beginPath();
    c.moveTo(xStart, yStart);
    c.lineTo(xEnd, yEnd);
    c.closePath();
    c.stroke();
    // drawFormula({ parts, x, y, center = true, fontSize, c,});
    c.fillStyle = 'gray';
    c.beginPath();
    c.arc(xEnd, yEnd, 25, 0, Math.PI * 2, true);
    c.fill();
    c.closePath();
    c.fillStyle = 'black';
    drawFormula({
      parts: ['NH', 2],
      x: xEnd,
      y: yEnd,
      fontSize: 18,
      c,
    });
  }
};

export const drawEnzyme = ({
  r,
  c,
  x = _w / 2,
  y = _h / 2,
  offsetAngle = 0,
  lineLength = 50,
  linkerColor = 'orange',
}) => {
  for (let i = -offsetAngle; i < 2 * Math.PI; i += (Math.PI * 2) / 12) {
    const xStart = x + r * Math.cos(i);
    const yStart = y + r * Math.sin(i);
    const xEnd = x + (lineLength + r - 25) * Math.cos(i - offsetAngle);
    const yEnd = y + (lineLength + r - 25) * Math.sin(i - offsetAngle);

    const xCenter = x + (lineLength + r) * Math.cos(i - offsetAngle);
    const yCenter = y + (lineLength + r) * Math.sin(i - offsetAngle);

    c.lineWidth = 4;
    c.strokeStyle = linkerColor;
    c.beginPath();
    c.moveTo(xStart, yStart);
    c.lineTo(xEnd, yEnd);
    c.closePath();
    c.stroke();

    // drawFormula({ parts, x, y, center = true, fontSize, c,});
    c.lineWidth = 4;
    c.strokeStyle = 'black';
    c.beginPath();
    c.arc(xCenter, yCenter, 25, 0, Math.PI * 2, true);
    c.stroke();
    c.closePath();

    c.fillStyle = 'black';
    drawFormula({
      parts: ['Enz'],
      x: xCenter,
      y: yCenter,
      fontSize: 18,
      c,
    });
  }
};

export const drawBead = ({ x, y, c }) => {
  drawCircle({
    x,
    y,
    color: 'grey',
    radius: BEAD_RADIUS,
    c,
  });

  c.fillStyle = 'white';
  drawFormula({
    parts: ['Fe', 3, 'O', 4],
    x,
    y,
    fontSize: 50,
    c,
  });
};
