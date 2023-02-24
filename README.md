<img src="https://www.sipgatedesign.com/wp-content/uploads/wort-bildmarke_positiv_2x.jpg" alt="sipgate logo" title="sipgate" align="right" height="112" width="200"/>

# sipgate.io Node.js incoming call example
This example demonstrates how to receive and process webhooks from [sipgate.io](https://developer.sipgate.io/).

For further information regarding the push functionalities of sipgate.io please visit https://developer.sipgate.io/push-api/api-reference/

- [Prerequisites](#Prerequisites)
- [Enabling sipgate.io for your sipgate account](#Enabling-sipgateio-for-your-sipgate-account)
- [How sipgate.io webhooks work](#How-sipgateio-webhooks-work)
- [Configure webhooks for sipgate.io](#Configure-webhooks-for-sipgateio)
- [Making your computer accessible from the internet](#Making-your-computer-accessible-from-the-internet)
- [Install dependencies:](#Install-dependencies)
- [Execution](#Execution)
- [How It Works](#How-It-Works)
- [Common Issues](#Common-Issues)
- [Related](#Related)
- [Contact Us](#Contact-Us)
- [License](#License)
- [External Libraries](#External-Libraries)


## Prerequisites
- Node.js >= 10.15.3


## Enabling sipgate.io for your sipgate account
In order to use sipgate.io, you need to book the corresponding package in your sipgate account. The most basic package is the free **sipgate.io S** package.

If you use [sipgate basic](https://app.sipgatebasic.de/feature-store) or [simquadrat](https://app.simquadrat.de/feature-store) you can book packages in your product's feature store.
If you are a _sipgate team_ user logged in with an admin account you can find the option under **Account Administration**&nbsp;>&nbsp;**Plans & Packages**.


## How sipgate.io webhooks work

### What is a webhook?
A webhook is a POST request that sipgate.io makes to a predefined URL when a certain event occurs.
These requests contain information about the event that occurred in `application/x-www-form-urlencoded` format.

This is an example payload converted from `application/x-www-form-urlencoded` to json:
```json
{
  "event": "newCall",
  "direction": "in",
  "from": "492111234567",
  "to": "4915791234567",
  "callId":"12345678",
  "origCallId":"12345678",
  "user": [ "Alice" ],
  "xcid": "123abc456def789",
  "diversion": "1a2b3d4e5f"
}
```


### sipgate.io webhook events
sipgate.io offers webhooks for the following events:

- **newCall:** is triggered when a new incoming or outgoing call occurs 
- **onAnswer:** is triggered when a call is answered – either by a person or an automatic voicemail
- **onHangup:** is triggered when a call is hung up
- **dtmf:** is triggered when a user makes an entry of digits during a call

**Note:** Per default sipgate.io only sends webhooks for **newCall** events.
To subscribe to other event types you can reply to the **newCall** event with an XML response.
This response includes the event types you would like to receive webhooks for as well as the respective URL they should be directed to.
You can find more information about the XML response here:
https://developer.sipgate.io/push-api/api-reference/#the-xml-response


## Configure webhooks for sipgate.io 
You can configure webhooks for sipgate.io as follows:

1. Navigate to [console.sipgate.com](https://console.sipgate.com/) and login with your sipgate account credentials.
2. Select the **Webhooks**&nbsp;>&nbsp;**URLs** tab in the left side menu
3. Click the gear icon of the **Incoming** or **Outgoing** entry
4. Fill in your webhook URL and click save. **Note:** your webhook URL has to be accessible from the internet. (See the section [Making your computer accessible from the internet](#making-your-computer-accessible-from-the-internet)) 
5. In the **sources** section you can select what phonelines and groups should trigger webhooks.


## Making your computer accessible from the internet
There are many possibilities to obtain an externally accessible address for your computer.
In this example we use the service [localhost.run](localhost.run) which sets up a reverse ssh tunnel that forwards traffic from a public URL to your localhost.
The following command creates a subdomain at localhost.run and sets up a tunnel between the public port 80 on their server and your localhost:8080:

```bash
$ ssh -R 80:localhost:8080 ssh.localhost.run
```
If you run this example on a server which can already be reached from the internet, you do not need the forwarding.
In that case, the webhook URL needs to be adjusted accordingly.

## Configuration

Create the `.env` by copying the [`.env.example`](.env.example) and set the value according to the comment above. For more information read [Configure webhooks for sipgate.io](#configure-webhooks-for-sipgateio) and [Making your computer accessible from the internet](#making-your-computer-accessible-from-the-internet).

## Install dependencies:
Navigate to the project's root directory and run:
```bash
npm install
```


## Execution
Run the application:
```bash
node index.js 
```

## Deployment to Google Cloud App Engine

To deploy this project to Google Cloud App Engine, you might use our [sipgateio-google-deployer](https://github.com/sipgate-io/sipgateio-google-deployer).

## How It Works
At first we create an HTTP server using the _Express_ framework:
```javascript
const express = require('express');
...
const app = express();
```
We then attach a middleware that converts the urlencoded payload of incoming webhooks to JavaScript objects making it accessible as `request.body`.
The necessary function is also provided by the _Express_ framework.
The option `extended: true` enables the correct mapping of object structures, such as arrays.
```javascript
app.use(express.urlencoded({ extended: true }));
```
The `post()` method on the `app` object registers a callback function that is executed when receiving a POST request on the route `/`.
After logging the request body to the console the server should send a response without content.
```javascript
app.post('/', (request, response) => {
	console.log(request.body);
	response.end();
});
```
Lastly, the _Express_ `app` should listen on the specified port:
```javascript
...
const port = process.env.WEBHOOK_PORT;
...
app.listen(port, () => {
	console.log('Server listening on: http://localhost:%s', port);
});
```


## Common Issues

### web app displays "Feature sipgate.io not booked."
Possible reasons are:
- the sipgate.io feature is not booked for your account

See the section [Enabling sipgate.io for your sipgate account](#enabling-sipgateio-for-your-sipgate-account) for instruction on how to book sipgate.io


### "Error: listen EADDRINUSE: address already in use :::{port}"
Possible reasons are:
- another instance of the application is already running
- the specified port is in use by another application


### "Error: listen EACCES: permission denied 0.0.0.0:{port}"
Possible reasons are:
- you do not have permission to bind to the specified port.
  This usually occurs if you try to use port 80, 443 or another well-known port which can only be bound with superuser privileges


### Call happened but no webhook was received 
Possible reasons are:
- the configured webhook URL is incorrect
- the SSH tunnel connection broke
- webhooks are not enabled for the phoneline that received the call


## Related
- [Express](https://expressjs.com/)


## Contact Us
Please let us know how we can improve this example.
If you have a specific feature request or found a bug, please use **Issues** or fork this repository and send a **pull request** with your improvements.


## License
This project is licensed under **The Unlicense** (see [LICENSE file](./LICENSE)).


## External Libraries
This code uses the following external libraries

- _Express_:
  - Licensed under the [MIT License](https://opensource.org/licenses/MIT)
  - Website: https://expressjs.com/


---

[sipgate.io](https://www.sipgate.io) | [@sipgateio](https://twitter.com/sipgateio) | [API-doc](https://api.sipgate.com/v2/doc)
