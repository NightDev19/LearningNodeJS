// Arrow function
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const power = (base, exponent) => Math.pow(base, exponent);
const square = (num) => Math.pow(num, 2);
const cube = (num) => Math.pow(num, 3);
const factorial = (num) =>
  num === 0 || num === 1 ? 1 : num * factorial(num - 1);
const squareRoot = (num) => Math.sqrt(num);
console.log(square(5));
console.log(cube(3));
console.log(factorial(5));
console.log(squareRoot(16));

const arr = [1, 2, 3, 4, 5];

(() => arr.forEach((num) => console.log(num)))();

function character() {
  console.log("Character");
}
character();

function character1(name) {
  console.log(`Hello ${name}`);
}

character1("Kj");


