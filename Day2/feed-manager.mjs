// In Common JS Module
// __filename //night/home/NightDev/LearningNodeJs/Day2/feed-manager.mjs
// __dirname //night/home/NightDev/LearningNodeJs/Day2

// ES Path Module
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { access, constants, readFile, writeFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jsonFile = join(__dirname, "feed.json"); // Path to the JSON file 

// Reading and Writing Files

export async function getLinks() {
  /*
 F_OK - Check if file exists
 W_OK - Check if file is writable
 R_OK - Check if file is readable
 X_OK - Check if file is executable
  */
  try {
    await access(jsonFile, constants.F_OK);
  } catch (error) {
    await writeFile(jsonFile, JSON.stringify([])); // utf-8
  }
  const contents = await readFile(jsonFile, { encoding: "utf8" });
  return JSON.parse(contents);
}
export async function saveLinks(links) {
  await writeFile(jsonFile, JSON.stringify(links));
}
