const fs = require("node:fs/promises");

(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open("./test-subjects/test.txt", "w");

  const stream = fileHandle.createWriteStream();

  let i = 0;

  const numberOfWrites = 100_000_000;

  const writeMany = () => {
    while (i < numberOfWrites) {

      // this is our last write
      if (i === numberOfWrites - 1) {
        return stream.end(` ${i} `);
      }

      // if stream.write returns false, stop the loop
      if (!stream.write(` ${i} `)) break;

      i++;
    }
  };

  writeMany();

  // resume our loop once our stream's internal buffer is emptied
  stream.on("drain", () => {
    // console.log("Drained!!!");
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
    fileHandle.close();
  });
})();
