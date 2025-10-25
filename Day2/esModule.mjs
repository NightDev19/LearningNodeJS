// Rewriting the calculator using the ES Module pattern

import * as readline from "readline";
import { stdin as input, stdout as output } from "process";

/*
Don't use the interface name
Interface is a reserved word in JavaScript
*/
const rl = readline.createInterface({ input, output });

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

let answer = await question("Enter a simple equation: ");
while (answer != "quit") {
  try {
    const value = eval(answer);
    console.log(`${value}`);
  } catch (exception) {
    console.log("I don't know how to do that");
  }
  answer = await question("Enter a simple equation: ");
}

rl.close();

// // Using recursive function to ask user for input
// function question() {
//   rl.question("Enter a simple equation: ", (userInput) => {
//     if (userInput === "Quit") {
//       rl.close();
//     } else {
//       try {
//         const value = eval(input);
//         console.log(`${value}`);
//       } catch (exception) {
//         console.log("I don't know how to do that");
//       }
//       question();
//     }
//   });
// }
// console.log("Enter 'Quit' to exit");
// question();
