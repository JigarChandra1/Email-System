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
   message: 'Welcome to the Email-System.',
   APIs: [
      {
         URL: "/api/email",
         verb: "POST",
         description: "Add a new email to the system. Accepts an email in the request body"
      },
      {
         URL: "/api/email/<EMAIL_ID>/status",
         verb: "GET",
         description: "Get status (ALLOWED/RISKY) of an email in the system"
      },
      {
         URL: "/api/email/<EMAIL_ID>/status",
         verb: "PATCH",
         description: "Update status (ALLOWED/RISKY) of an email in the system"
      },
      {
         URL: "/api/email/<EMAIL_ID>",
         verb: "DELETE",
         description: "Delete an email in the system"
      }
   ]
}));
app.listen(port, () => {
   console.log(`Server is running on PORT ${port}`);
});
module.exports = app;