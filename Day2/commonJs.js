// Working on Cal.js but using the CommonJS module system
// using the Readline module to read user input

const readline = require("readline");

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// using recursive function to ask user for input
function question() {
  interface.question("Enter a simple equation: ", (input) => {
    if (input === "Quit") {
      interface.close();
    } else {
      try {
        const value = eval(input);
        console.log(`${value}`);
      } catch (exception) {
        console.log("I dont know how to do that");
      }
      question();
    }
  });
}
question();
