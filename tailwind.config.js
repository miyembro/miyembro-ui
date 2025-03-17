const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};



// module.exports = {
//   theme: {
//     extend: {
//       backgroundImage: {
//         'metallic-blue': 'linear-gradient(to right, #4F86F7, #355ECA, #2A3A6A)',
//       },
//     },
//   },
//   variants: {},
//   plugins: [],
// }
