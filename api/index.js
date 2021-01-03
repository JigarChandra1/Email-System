const express =  require('express');
const bodyParser = require('body-parser');
const errorResponder = require('./server/errors/error-responder');
const email = require('./server/routes/Email');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;

app.use('/api/email', email);
app.use(errorResponder);

// when a random route is inputed
app.get('*', (req, res) => res.status(200).send({
   message: 'Welcome to the Email-System.'
}));
app.listen(port, () => {
   console.log(`Server is running on PORT ${port}`);
});
module.exports = app;