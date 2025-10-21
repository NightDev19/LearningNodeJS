# Day1 - Node.js + TypeScript + Express

A simple Node.js project using **TypeScript** and **Express**, with **Jest** for testing.
Includes a working **GitHub Actions CI** workflow.

---

## **Project Structure**
```
Day1/
├── src/
│ ├── index.ts # Entry point
│ ├── app.ts # Express app
│ ├── routes/
│ │ └── index.ts # Main router
│ └── tests/
│ └── app.test.ts # Jest test for routes
├── package.json
├── tsconfig.json
├── jest.config.js
└── .github/
  └── workflows/ci.yml # GitHub Actions CI
```
---

## **Setup**

1. Clone the repo:

```bash
git clone <repo_url>
```
cd Day1

2. Install dependencies:

```bash
npm install
```
## Scripts

| Command         | Description                                                           |
| --------------- | --------------------------------------------------------------------- |
| `npm run dev`   | Run development server with hot reload                                |
| `npm run build` | Compile TypeScript into `dist/` folder (optional, not needed for dev) |
| `npm start`     | Run production server from compiled code                              |
| `npm test`      | Run Jest tests                                                        |

## Running the App

To run the app in development mode, use the following command:

```bash
npm run dev
```
### Visit in your browser or API client:

http://localhost:8000/ → "Hello, Node.js with TypeScript!"

http://localhost:8000/example → JSON { "message": "This is an example route!" }```

### Testing

* Tests are in src/__tests__/app.test.ts.
* Run tests:
```bash
npm test
```
* Optionally, view test coverage:
```bash
npm test -- --coverage
```
## Continuous Integration (CI)

* CI workflow: .github/workflows/ci.yml
* Runs on push or pull_request to main or master.
* Steps:
  1. Install dependencies
  2. Compile TypeScript
  3. Run Jest tests
## Adding Routes
1. Add new route in src/routes/index.ts or a new router file.
2. Implement route logic directly in the route handler (for now)..
3. Later, you can add controllers/ and services/ folders for better structure.
