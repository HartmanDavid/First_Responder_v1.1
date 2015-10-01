// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.nothing.first_responder',
  version: '0.1',
  name: 'first_responder',
  description: 'Get emergency help with one click of the buttom',
  author: 'David Hartman',
  email: 'DontBotherMe@GoAway.com',
  website: 'http://Call911FAST.com'
  // content: "" **** fill this in when you know where you want everthing to start
});
// App.accessRule('https://localhost');
App.accessRule('*');  // add this to your mobile-config.js
App.icons({
  // iOS
  'iphone'      : 'resources/ios/Icon-60.png',
  'iphone_2x'   : 'resources/ios/Icon-60@2x.png',
  'ipad'        : 'resources/ios/Icon-76.png',
  'ipad_2x'     : 'resources/ios/Icon-76@2x.png',

  // Android
  'android_ldpi'  : 'resources/android/drawable-ldpi/ic_launcher.png',
  'android_mdpi'  : 'resources/android/drawable-mdpi/ic_launcher.png',
  'android_hdpi'  : 'resources/android/drawable-hdpi/ic_launcher.png',
  'android_xhdpi' : 'resources/android/drawable-xhdpi/ic_launcher.png'
});

App.launchScreens({
  // iOS
  'iphone'            : 'resources/ios/splash-icon.png',
  'iphone_2x'         : 'resources/ios/splash-icon.png',
  'iphone5'           : 'resources/ios/splash-icon.png',


  // Android
  'android_ldpi_portrait' : 'resources/android/playstore-icon.png',
  'android_mdpi_portrait' : 'resources/android/playstore-icon.png',
  'android_hdpi_portrait' : 'resources/android/playstore-icon.png',
  'android_xhdpi_portrait': 'resources/android/playstore-icon.png'

});

// Set PhoneGap/Cordova preferences
// App.setPreference("Fullscreen", false);
App.setPreference("Orientation", 'portrait');
// App.setPreference('BackgroundColor', '#737CA1');
App.setPreference('HideKeyboardFormAccessoryBar', false);

// // Pass preferences for a particular PhoneGap/Cordova plugin
// App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//   APP_ID: '1234567890',
//   API_KEY: 'supersecretapikey'
// });
