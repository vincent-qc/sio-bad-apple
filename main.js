const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchTextFile = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return text.split("\n");
  } catch (error) {
    console.error("Error fetching the text file:", error);
    return [];
  }
};

const floodfill = async (grid, width, height) => {
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  const checkbounds = (y, x) =>
    y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
  const queue = [];
  const visited = new Set();
  const initial = new Set();

  // Add all grid positions that already have a block to the queue.
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] !== null) {
        queue.push([y, x, grid[y][x]]);
        initial.add(`${y},${x}`);
      }
    }
  }

  const CHUNK_SIZE = 30; // Adjust for responsiveness
  async function processQueueChunk() {
    let iterations = 0;
    while (queue.length > 0 && iterations < CHUNK_SIZE) {
      const [y, x, block] = queue.shift();

      if (visited.has(`${y},${x}`)) {
        iterations++;
        continue;
      }
      visited.add(`${y},${x}`);

      if (!initial.has(`${y},${x}`)) {
        const clone = block.cloneNode(true);
        block.parentNode.appendChild(clone);
        clone.style.top = `${y * height}px`;
        clone.style.left = `${x * width}px`;
        grid[y][x] = clone;
      }

      for (const [dy, dx] of directions) {
        const ny = y + dy;
        const nx = x + dx;
        if (checkbounds(ny, nx) && grid[ny][nx] === null) {
          grid[ny][nx] = block;
          queue.push([ny, nx, block]);
        }
      }
      iterations++;
    }
    if (queue.length > 0) {
      // Yield control a bit before processing the next chunk.
      await sleep(20);
      await processQueueChunk();
    }
  }

  await processQueueChunk();
};

const applyFrameToGrid = (frame, grid) => {
  const frameRows = 40;
  const frameCols = 40;
  const gridRows = grid.length;
  const gridCols = grid[0].length;

  for (let i = 0; i < frameRows; i++) {
    const gridRow = Math.floor(i * (gridRows / frameRows));
    for (let j = 0; j < frameCols; j++) {
      const gridCol = Math.floor(j * (gridCols / frameCols));
      if (frame[i * frameCols + j] === "b") {
        if (grid[gridRow] && grid[gridRow][gridCol]) {
          grid[gridRow][gridCol].style.opacity = 0;
        }
      } else {
        if (grid[gridRow] && grid[gridRow][gridCol]) {
          grid[gridRow][gridCol].style.opacity = 1;
        }
      }
    }
  }
};

const run = async () => {
  // Set up and preload the audio.
  const audio = new Audio(
    "https://raw.githubusercontent.com/vincent-qc/bad-sio-apple/main/badapple.mp3"
  );
  audio.preload = "auto";
  audio.volume = 0.5;

  // Wait until the audio is ready.
  await new Promise((resolve) => {
    audio.addEventListener("canplaythrough", resolve, { once: true });
  });

  // Fetch the text file (frame data).
  const url =
    "https://raw.githubusercontent.com/vincent-qc/bad-sio-apple/refs/heads/main/badapple.txt";
  const lines = await fetchTextFile(url);

  // Resize calendar (example elements).
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

  // Get the grid using time intervals.
  const timeintervals = document.querySelectorAll(".minor-time-interval");
  if (timeintervals.length < 1) {
    console.error("No time intervals found");
    return;
  }

  // Create grid dimensions.
  const gridheight = Math.ceil(timeintervals.length / 6);
  const gridwidth = 5 * 6; // 5 days in a week, 6 blocks per slot.
  const grid = Array.from({ length: gridheight }, () =>
    Array.from({ length: gridwidth }, () => null)
  );

  // Calculate block dimensions.
  const blockHeight = (timeintervals[0].clientHeight * 13.5) / 2;
  const blockWidth = timeintervals[0].clientWidth / 30;

  // Reposition and resize calendar blocks.
  const blocks = document.querySelectorAll(".gwt-appointment");
  for (const block of blocks) {
    const xpos = Math.floor(parseInt(block.style.left) / 3.3);
    const ypos = Math.floor(parseInt(block.style.top) / blockHeight);
    block.style.height = `${blockHeight}px`;
    block.style.width = `${blockWidth}px`;
    block.style.top = `${ypos * blockHeight}px`;
    block.style.left = `${xpos * blockWidth}px`;
    grid[ypos][xpos] = block;
    await sleep(20);
  }

  // Start the heavy processing after a brief delay.
  setTimeout(async () => {
    await floodfill(grid, blockWidth, blockHeight);

    // Start the frame animation.
    let currentFrame = 0;
    const animate = () => {
      if (currentFrame >= lines.length) return;
      applyFrameToGrid(lines[currentFrame], grid);
      currentFrame++;
      setTimeout(animate, 1000 / 7.8);
    };
    animate();
  }, 200);
};

run();
