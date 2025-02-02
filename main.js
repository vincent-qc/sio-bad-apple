const floodfill = (grid, width, height) => {
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const checkbounds = (y, x) => {
    return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
  };

  const queue = [];
  const visited = new Set();
  const initial = new Set();

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] !== null) {
        queue.push([y, x, grid[y][x]]);
        initial.add(`${y},${x}`);
      }
    }
  }

  while (queue.length > 0) {
    const [y, x, block] = queue.shift();

    // Skip if already visited
    if (visited.has(`${y},${x}`)) {
      continue;
    } else {
      visited.add(`${y},${x}`);
    }

    // Create new block at new grid position
    if (!initial.has(`${y},${x}`)) {
      const clone = block.cloneNode(true);
      block.parentNode.appendChild(clone);
      clone.style.top = `${y * height}px`;
      clone.style.left = `${x * width}px`;
      grid[y][x] = clone;
    }

    // Fill neighboring blocks with same block
    for (const [dy, dx] of directions) {
      const ny = y + dy;
      const nx = x + dx;
      if (checkbounds(ny, nx) && grid[ny][nx] === null) {
        grid[ny][nx] = block;
        queue.push([ny, nx, block]);
      }
    }
  }
};

const run = () => {
  // Resize calendar
  const container = document.getElementById("main-container");
  const calendar = document.querySelector(
    ".f-pnl.col-lg-8.float-left.pad-right-none"
  );
  const courses = document.querySelector(
    ".f-pnl.right-portal-col.side-tips.col-lg-4.float-right.side-tips-collapse-middle.pad-right-none"
  );
  container.style.maxWidth = "100%";
  calendar.style.maxWidth = "80%";
  courses.style.maxWidth = "20%";

  // Compute calendar grid
  const timeintervals = document.querySelectorAll(".minor-time-interval");
  if (timeintervals.length < 1) {
    console.error("No time intervals found");
    return;
  }

  // Create grid
  const gridheight = Math.ceil(timeintervals.length / 12);
  const gridwidth = 5 * 4; // 5 days in a week, 4 blocks per slot
  const grid = Array.from({ length: gridheight }, () =>
    Array.from({ length: gridwidth }, () => null)
  );

  // Create block height to resize and reposition caldendar
  const blockHeight = timeintervals[0].clientHeight * 13.5;
  const blockWidth = timeintervals[0].clientWidth / 20;

  // Resize and reposition calendar
  const blocks = document.querySelectorAll(".gwt-appointment");
  blocks.forEach((block) => {
    const xpos = Math.floor(parseInt(block.style.left) / 5);
    const ypos = Math.floor(parseInt(block.style.top) / blockHeight); // We floor here as SIO's blocks are lower than expected

    block.style.height = `${blockHeight}px`;
    block.style.width = `${blockWidth}px`;
    block.style.top = `${ypos * blockHeight}px`;
    block.style.left = `${xpos * blockWidth}px`;

    console.log(xpos, ypos);
    grid[ypos][xpos] = block;
  });

  // Run floodfill algorithm
  floodfill(grid, blockWidth, blockHeight);
};
