# Custom Twilio Verify Extension

[**Install the extension using this link**](https://console.firebase.google.com/project/_/extensions/install?ref=nikkothari22/custom-twilio-verify-extension@0.0.2)

**Author**: Nikhil Kothari (**[https://github.com/nikkothari22](https://github.com/nikkothari22)**)

**Description**: Functions to send users one time passwords and verify them using Twilio Verify. (Not an official extension)

**This is not an official Twilio extension and the author is not associated with Twilio or Firebase in any manner whatsoever. All trademarks and copyrights belong to the respective companies.**

**Details**: Use this extension to send one time verification codes to your users and verify them. The extension uses [Twilio's Verify service](https://www.twilio.com/verify) to send and check codes.

There are two functions in the extension - one to send the code and the other validate the code. Both of these are meant to be called from your app (they are onCall() functions).

The function `twilioSendOTP` needs to be called with two variables: `channel` ("sms" or "call") and `number` - a phone number in E.164 format. On calling, the function checks for authentication depending on the configuration of the extension. If the function is called without authentication from your Firebase app and the extension is configured to only allow authenticated calls, it will throw an error.

If successful, the function will return an object with `status` - which can be either "approved", "pending" or "canceled". 

Here's a basic example how you can call this function from your app to send a one time verification code:

```js
functions.httpsCallable('ext-${EXT_INSTANCE_ID}-twilioSendOTP')({
  number: "+919898989898", //E.164 Formatted number
  channel: "sms" //Can be "sms" or "call"
}).then(result => console.log(result.data.status))
```

The function `twilioCheckOTP` needs to be called with two variables: `code` - the verification code entered by the user, and `number` - a phone number in E.164 format. On calling, the function checks for authentication depending on the configuration of the extension. If the function is called without authentication from your Firebase app and the extension is configured to only allow authenticated calls, it will throw an error.

The function will authenticate the code with Twilio Verify and then return an object with `status` - which can be either "approved", "pending" or "canceled". 

Here's a basic example how you can call this function from your app to verify a one time verification code:

```js
functions.httpsCallable('ext-${EXT_INSTANCE_ID}twilioCheckOTP')({
  number: "+919898989898", //E.164 Formatted number
  code: "123456" //Code entered by the user
}).then(result => console.log(result.data.status))
```

***EXT_INSTANCE_ID* is the instance ID of the extension and will be shown to you post installation.**

When you configure this extension, you'll need to provide your **Twilio Account SID, Auth Token and a Twilio Verify Service SID**. You can sign up and configure Twilio [here](https://www.twilio.com/verify).

#### Other Configuration Options
- Cloud Function Location (default : Iowa (us-central1))
- User authentication required? - Whether function should only run for authenticated users or anyone.

#### Billing
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s free tier:
  - Cloud Functions (Node.js 12+ runtime. [See FAQs](https://firebase.google.com/support/faq#expandable-24))

Usage of this extension also requires a Twilio account with the Twilio Verify service. You are responsible for any associated costs with your usage of Twilio.




**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your customers. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Twilio Account SID: You can find your Twilio Account SID in the [Twilio Console](https://www.twilio.com/console)

* Twilio Auth Token: You can find your Twilio Auth Token in the [Twilio Console](https://www.twilio.com/console)

* Twilio Verify Service SID: Add your Twilio Verification Service SID here. If you do not have an existing Service, you need to create one in the [Twilio Verify Console](https://www.twilio.com/console/verify/services).

* Only allow requests from authenticated users?: The extension creates two cloud functions which are meant to be called from your apps. If set to yes, only authenticated requests will be served.



**Cloud Functions:**

* **twilioCheckOTP:** Function which checks the one time verification code/token using Twilio's Verify API and returns the status back to the client. To be called from the app (onCall()).

* **twilioSendOTP:** Function which sends a one time verification code to the phone number using Twilio's Verify API and returns the status back to the client. To be called from the app (onCall()).
