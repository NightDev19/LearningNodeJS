class Person {
  constructor(...info) {
    this.name = info[0];
    this.age = info[1];
    this.email = info[2];
  }
}

class Student extends Person {
  constructor(...info) {
    super(...info);
    this.studentId = info[3];
  }
}

studentInfo = new Student("John Doe", 20, "john@example.com", "12345");

console.log(studentInfo);

class AnotherPerson {
  constructor({ name = "", age = 0, email = "" } = {}) {
    this.name = name;
    this.age = age;
    this.email = email;
  }
}

class AnotherStudent extends AnotherPerson {
  constructor({ name = "", age = 0, email = "", studentId = "" } = {}) {
    super({ name, age, email });
    this.studentId = studentId;
  }

  greet() {
    return console.log("Hello " + this.name);
  }
}

const another_StudentInfo = new AnotherStudent({
  name: "Jane Doe",
  age: 22,
  email: "jane@example.com",
  studentId: "67890",
});

console.log(another_StudentInfo);
console.log(another_StudentInfo.greet());
