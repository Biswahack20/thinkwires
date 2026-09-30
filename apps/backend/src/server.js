import app from './app.js';
async function startserver() {
  app.listen(3000, () => {
    console.log('server started');
  });
}

startserver();
