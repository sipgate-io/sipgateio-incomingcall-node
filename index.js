const express = require('express');

require("dotenv").config();

const port = process.env.PORT || process.env.WEBHOOK_PORT;
const app = express();

app.use(express.urlencoded({ extended: true }));

app.post('/', (request, response) => {
	console.log(request.body);
	response.end();
});

app.listen(port, () => {
	console.log('Server listening on: http://localhost:%s', port);
});
