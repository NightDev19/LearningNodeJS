function outer() {
  let counter = 0;

  function inner() {
    counter++;
    console.log(counter);
  }

  return inner; // ✅ return the function, don't call it here
}

const counter = outer(); // outer() returns the inner function
counter(); // 1
counter(); // 2
counter(); // 3

for (let i = 0; i < 5; i++) {
  console.log("a");
}

const names = ["Alice", "Bob", "Charlie"];
names.forEach((name) => console.log(name));

const object = {
  name: "John",
  age: 30,
};

// use for in
for (const key in object) {
  console.log(`${key} : ${object[key]}`);
}

// use for of
for (const name of names) {
  console.log(name);
}

// what is for of used for ?
// for of is used to iterate over iterable objects like arrays, strings, maps, sets, etc.
// Then what is the used of forEach ?
// forEach is used to iterate over arrays and execute a function for each element in the array.
// Then what is the used of for ?
// for is used to iterate over a range of values or an array.
// Then what is the used of for in ?
// for in is used to iterate over the keys of an object.

const name = (names) => {
  console.log(names);
};
name("Sherwin");
