require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3001;

sequelize.authenticate()
  .then(() => {
    console.log('DB conectada');
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error DB:', err);
    process.exit(1);
  });
