//TODO : Make a simple calculator
//Taking Input
process.stdin.on("data", (chunk) => {
  const input = chunk.toString().trim();

  if (input === "Quit") {
    process.exit(0);
  }

  try {
    const value = eval(input);
    console.log(`${value}`);
  } catch (exception) {
    console.log("I dont know how to do that");
  }
  process.stdout.write("Enter Something to calculate : ");
});
console.log("Enter 'Quit' to quit the process")
process.stdout.write("Enter Something to calculate : "); //Same as Console.log()
