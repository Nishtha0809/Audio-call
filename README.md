# Blockchain System Client

This project has been converted from Vite React to a normal Create React App style React project.

## Run the project

```bash
npm install
npm start
```

The application will start at:

```text
http://localhost:3000
```

## Build the project

```bash
npm run build
```

## Main conversion changes

- Replaced Vite scripts with `react-scripts` scripts.
- Removed `vite.config.js` and root `index.html`.
- Added `public/index.html` for Create React App.
- Replaced `src/main.jsx` with `src/index.js`.
- Fixed import path casing for `Pages`, `Components`, and `Admin` folders.
- Fixed the article image variable conflict in `Articles.jsx`.
