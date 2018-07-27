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

export const drawBead = ({ x, y, c }) => {
  drawCircle({
    x,
    y,
    color: 'grey',
    radius: 125,
    c,
  });
  drawCircle({
    x,
    y,
    color: 'brown',
    radius: 100,
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
