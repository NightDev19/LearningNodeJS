// Working on Path

import { getLinks, saveLinks } from "./feed-manager.mjs";
import { question, close } from "./rl.mjs";
import axios from "axios";
import Parser from "rss-parser";

const feeds = await getLinks();
const parser = new Parser();

// Writing a Command Loop

let input = await question("Enter command (list , add , del , read , quit): ");

while (input != "quit") {
  let cmdParts = input.trim().split(" ");
  let cmd = cmdParts[0];
  // list
  if (cmd === "list") {
    feeds.forEach((feed, index) => {
      console.log(`${index}: ${feed}`);
    });
  }
  // add url
  if (cmd === "add") {
    if (cmdParts.length < 2) {
      console.log("Please input a valid URL");
    } else {
      feeds.push(cmdParts[1]);
      await saveLinks(feeds); // <-- save immediately
      console.log("Feed added successfully.");
    }
  }
  // del index
  if (cmd === "del") {
    if (cmdParts.length < 2) {
      console.log("Please include the index of the URL to delete");
    } else {
      let index = parseInt(cmdParts[1], 10);
      if (index > -1 && index < feeds.length) {
        feeds.splice(index, 1);
      } else {
        console.log("Invalid index");
      }
    }
  }
  // making a http request
  // read index
  if (cmd === "read") {
    if (cmdParts.length < 2) {
      console.log("Please include the index of the URL to read");
    } else {
      let index = parseInt(cmdParts[1], 10);
      if (index > -1 && index < feeds.length) {
        try {
          const url = feeds[index];
          console.log(`Fetching RSS feed from: ${url}`);

          const { data } = await axios.get(url);
          const feed = await parser.parseString(data);

          console.log(`\nFeed Title: ${feed.title}\n`);
          feed.items.forEach((item, i) => {
            console.log(`${i + 1}. ${item.title}`);
          });
        } catch (err) {
          console.error("Failed to parse RSS feed:", err.message);
        }
      } else {
        console.log("Invalid index");
      }
    }
  }

  // quit

  input = await question("Enter command (list , add , del , read , quit): ");
}

await saveLinks(feeds);
close();
