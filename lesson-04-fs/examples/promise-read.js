const fs = require("fs/promises");

async function main() {
  try {
    const text = await fs.readFile("./files/message.txt", "utf8");
    console.log(text);
  } catch (error) {
    console.error(error.message);
  }
}

main();
