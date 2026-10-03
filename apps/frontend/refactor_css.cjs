const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDirs = [
  path.join(srcDir, 'components', 'HomeComponents'),
  path.join(srcDir, 'components', 'common'),
];
const indexCssPath = path.join(srcDir, 'index.css');

let combinedCSS = '';

componentsDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    if (file.endsWith('.module.css')) {
      const componentName = file.replace('.module.css', '');
      const cssPath = path.join(dir, file);
      const jsxPath = path.join(dir, `${componentName}.jsx`);

      if (!fs.existsSync(jsxPath)) return;

      let cssContent = fs.readFileSync(cssPath, 'utf8');
      let jsxContent = fs.readFileSync(jsxPath, 'utf8');

      // Extract all class names from CSS
      const classRegex = /\.([a-zA-Z0-9_-]+)/g;
      let match;
      const classNames = new Set();

      while ((match = classRegex.exec(cssContent)) !== null) {
        classNames.add(match[1]);
      }

      // Prefix CSS classes
      classNames.forEach((className) => {
        // Replace .className with .ComponentName-className, ensuring we don't partially match
        const regex = new RegExp(`\\.${className}(?![a-zA-Z0-9_-])`, 'g');
        cssContent = cssContent.replace(
          regex,
          `.${componentName}-${className}`
        );
      });

      // Update JSX file
      // Remove import
      jsxContent = jsxContent.replace(
        new RegExp(`import styles from ['"]./${file}['"];?\\n?`),
        ''
      );

      // Replace styles.className with "ComponentName-className"
      classNames.forEach((className) => {
        // Handle styles.className
        const dotRegex = new RegExp(
          `styles\\.${className}(?![a-zA-Z0-9_-])`,
          'g'
        );
        jsxContent = jsxContent.replace(
          dotRegex,
          `"${componentName}-${className}"`
        );

        // Handle styles['className']
        const bracketRegex = new RegExp(`styles\\['${className}'\\]`, 'g');
        jsxContent = jsxContent.replace(
          bracketRegex,
          `"${componentName}-${className}"`
        );
      });

      // Fix string concatenations like `className={\`\${"Comp-a"} \${"Comp-b"}\`}` -> `className="Comp-a Comp-b"`
      // or just leave them, but let's try to fix simple ones if possible. The template literals will still work: `${"Comp-a"} ${"Comp-b"}` evaluates correctly.

      // Append to combined CSS
      combinedCSS += `\n/* --- ${componentName} --- */\n` + cssContent + '\n';

      // Save JSX
      fs.writeFileSync(jsxPath, jsxContent, 'utf8');

      // Delete CSS module
      fs.unlinkSync(cssPath);
      console.log(`Processed ${componentName}`);
    }
  });
});

// Append to index.css
fs.appendFileSync(indexCssPath, combinedCSS, 'utf8');
console.log('Done!');
