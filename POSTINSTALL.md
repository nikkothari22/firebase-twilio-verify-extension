## Before you use the extension

Before you can use this extension, follow these steps to make the functions deployed for this extension publicly accessible:
1. Go to the Cloud Functions dashboard for your project in the [Google Cloud console](https://console.cloud.google.com/functions/list).
2. Click the checkbox next to the function called "ext-${param:EXT_INSTANCE_ID}-twilioSendOTP".
3. If it's not already expanded, click **Show Info Panel** (in the top-right corner) to show the *Permissions* tab.
4. Click **Add Member**. Then, in the *New members* field, enter the user "allUsers".
5. Select the role **Cloud Functions Invoker** from the role dropdown list. You may need to type in this role's name to pull it into the list.
6. Click **Save**.
7. Repeat steps 2 to 6 for the function called "ext-${param:EXT_INSTANCE_ID}-twilioCheckOTP".

The above steps are required to prevent a CORS issue. Hence it is recommended, that you enforce authentication in the extension's configuration.


## Using the extension

You can test the functions right away!
(The code examples below use the Firebase JavaScript SDK. Please refer to the [documentation](https://firebase.google.com/docs/functions/callable) to call functions from your app.

#### Request the OTP

1. Call the `ext-${param:EXT_INSTANCE_ID}-twilioSendOTP` function from your app like this:

```js
functions.httpsCallable('ext-${param:EXT_INSTANCE_ID}-twilioSendOTP')({
  number: "+919898989898", //E.164 Formatted number
  channel: "sms" //Can be "sms" or "call"
}).then(result => console.log(result.data.status))
```

#### Validate the OTP

2. When you receive the code, you can then call the `ext-${param:EXT_INSTANCE_ID}-twilioCheckOTP` function like this:

```js
functions.httpsCallable('ext-${param:EXT_INSTANCE_ID}-twilioCheckOTP')({
  number: "+919898989898", //E.164 Formatted number
  code: "123456" //Code entered by the user
}).then(result => console.log(result.data.status))
```

The function will authenticate the code with Twilio Verify and then return an object with `status` - which can be either "approved", "pending" or "canceled". 

Usage of this extension also requires a Twilio account with the Twilio Verify service. You are responsible for any associated costs with your usage of Twilio and Firebase.

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.