---
layout: post
author: Joseph
---

A few small tools I wrote to help with work at Underwater Audio:

### SensorTest

[Link to the SensorTest GitHub repo](https://github.com/josephweissig/SensorTest)

A simple app with two debug screens, one that displays a list of all the sensors the app is able to see with the granted permissions and hardware configuration, and a screen with gyroscopic and accelerometer details with x-, y-, and z-axis datapoints. 

I wrote this app as a sort of sanity check for reported hardware issues on the Delphin. Our lap tracking app used the accelerometer and gyroscope to monitor users' swim and count laps in real time, but we had a few users report that their devices counted zero laps after a swim. I tracked down the problems to a specific version of our firmware, and that the lap tracker couldn't initialize the sensors during the swim. I used this app to confirm that we couldn't access sensor data through software, and later issue a firmware update that fixed it.

### TOTPTest

[Link to the TOTPTest GitHub repo](https://github.com/josephweissig/TOTPTest)

Another extremely simple app, TOTPTest was an exploration into how single-use code screens work, and how our custom keyboard on the Delphin handled TOTP input. Our keyboard is pretty unique as far as keyboards go, built to take advantage of the small screen of the Delphin better than the stock QWERTY keyboard, and we wanted to confirm it worked as expected when faced with OTP input screens, as users would frequently encounter them when signing into services like Spotify or Audible.

This is a pretty rudimentary example of how apps implement OTP screens, with four unique TextEdit elements that shift focus to the next element when they receive an input, with the last one reporting the complete entry. Of course, this code doesn't connect to any service, but acts as a repeatble playground to test input. Luckily, our custom keyboard handled the change in element focus well, and we were able to continue development with confidence that users wouldn't need to worry about selecting each TextEdit element individually when signing into their preferred services.
