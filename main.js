const floodfill = (grid) => {
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const checkbounds = (x, y) => {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
  };

  const firstblock = (() => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== null) {
          return [i, j, grid[i][j]];
        }
      }
    }
  })();

  const queue = [];
  queue.push(firstblock);

  queue.push;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {}
  }
};

const run = () => {
  // Compute calendar grid
  const timeintervals = document.querySelectorAll(".minor-time-interval");
  if (timeintervals.length < 1) {
    console.error("No time intervals found");
    return;
  }

  // Create grid
  const gridheight = Math.ceil(timeintervals.length / 12);
  const gridwidth = 5 * 2; // 5 days in a week, 2 blocks per slot
  const grid = Array.from({ length: gridheight }, () =>
    Array.from({ length: gridwidth }, () => null)
  );

  // Create block height to resize and reposition caldendar
  const blockHeight = timeintervals[0].clientHeight * 13.5;
  const blockWidth = timeintervals[0].clientWidth / 10;

  // Resize and reposition calendar
  const blocks = document.querySelectorAll(".gwt-appointment");
  blocks.forEach((block) => {
    const xpos = Math.floor(parseInt(block.style.left) / 10);
    const ypos = Math.floor(parseInt(block.style.top) / blockHeight); // We floor here as SIO's blocks are lower than expected

    block.style.height = `${blockHeight}px`;
    block.style.width = `${blockWidth}px`;
    block.style.top = `${ypos * blockHeight}px`;
    block.style.left = `${xpos * blockWidth}px`;

    console.log(xpos, ypos);
    grid[ypos][xpos] = block;
  });

  console.log(grid);
};
