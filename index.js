const express = require('express');

const port = 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));

app.post('/', (request, response) => {
	console.log(request.body);
	response.end();
});

app.listen(port, () => {
	console.log('Server listening on: http://localhost:%s', port);
});
