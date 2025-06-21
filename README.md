-----
# 🌦️ React Weather App - Powered by OpenWeatherMap

## ✨ [https://dhruvdesai407.github.io/weather/](https://dhruvdesai407.github.io/weather/) ✨

This is a simple yet stylish React-based weather application that fetches and displays current weather information for any city you search. It also tries to automatically detect your location on load (more on that journey below\! 😉).

## 🚀 Features

  * 🔍 **City Search:** Enter any city name to get the current temperature, humidity, wind speed, and a relevant weather icon.
  * 📍 **Auto Location (IP-based):** On initial load, the app attempts to detect your general location using your IP address, providing you with local weather without needing to search (special thanks to GeoJS\! 🙏).
  * 🎨 **Clean and Responsive UI:** Built with React and styled with Tailwind CSS, offering a modern and user-friendly experience across different devices.
  * 🌡️ **Metric Units:** Temperature is displayed in Celsius (°C), and wind speed in kilometers per hour (km/h).
  * 📅 **Dynamic Date and Time:** Shows the current date and time for the displayed location.

## 🛠️ Technologies Used

  * ⚛️ **React:** For building the user interface.
  * 🌬️ **Tailwind CSS:** For styling the application with a utility-first approach.
  * 🗺️ **OpenWeatherMap API:** To fetch real-time weather data and city coordinates.
  * 🌐 **GeoJS:** For initial IP-based location detection.
  * 📦 **Vite:** For a fast and efficient development and build process.
  * 🚀 **GitHub Pages:** For deployment.

## 😓 The Journey - A Tale of Weathering Challenges\!

Building this simple weather app was more of an adventure than initially anticipated\! Here's a little peek behind the scenes:

  * **Geolocation Headaches 🤕:** Initially, I wanted to use the browser's built-in `navigator.geolocation` API for automatic location detection. Oh boy, what a ride\! 🎢 Dealing with browser permission prompts (and users accidentally blocking them\!), the requirement for secure (HTTPS) contexts (even for local development - who knew?\!), and the general unreliability of getting a precise location quickly proved to be a significant hurdle. After much trial and error, and a few moments of pulling my hair out 🤯, I pivoted to a more stable IP-based geolocation service (GeoJS) for a smoother initial experience.
  * **The Case of the Missing Files 🕵️‍♀️:** In the flurry of setting up the project and getting things deployed, there was a brief moment of panic when a crucial configuration file (`vite.config.js`) went missing due to a slip of the fingers\! 🤦‍♂️ Thankfully, with a bit of recollection and careful re-creation, disaster was averted. Always double-check those file operations\! 😅
  * **Git (Almost) Got Me 😬:** The initial push to the GitHub repository didn't go as smoothly as planned, with only the README making its way online. It was a classic case of local and remote repository histories being out of sync. The wisdom of `git pull origin main --allow-unrelated-histories` saved the day, ensuring all the hard-earned code finally saw the light of the (digital) world.
  * **Deployment Delights (and Minor Hiccups) 🚀:** Deploying a Vite app to GitHub Pages requires a specific `base` configuration in `vite.config.js` and some custom scripts in `package.json`. Getting those just right took a little bit of reading and tweaking, but the satisfaction of seeing the live app made it all worthwhile\! 🎉

Despite these minor bumps in the road, the process was a great learning experience, and I'm excited to share this weather app with you\!

## ⚙️ Local Development

If you'd like to run this app locally:

1.  Clone the repository:
    ```bash
    git clone https://github.com/dhruvdesai407/Weather-app.git
    cd Weather-app
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Create a `.env` file in the root directory and add your OpenWeatherMap API key:
    ```
    VITE_APP_ID=YOUR_OPENWEATHERMAP_API_KEY
    ```
    (Replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key from [https://openweathermap.org/api](https://openweathermap.org/api))
4.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
5.  Open your browser and navigate to the address provided (usually `http://localhost:5173`).

## ☁️ Deployment

This app is deployed using GitHub Pages. The deployment process is automated through the `npm run deploy` script, which builds the project and pushes the generated `dist` folder to the `gh-pages` branch of this repository.

## 🙏 Acknowledgements

  * Thanks to [OpenWeatherMap](https://openweathermap.org/) for providing the weather data API.
  * Thanks to [GeoJS](https://get.geojs.io/) for the convenient IP-based geolocation service.
  * Built with the amazing [React](https://react.dev/) and styled with [Tailwind CSS](https://tailwindcss.com/).
  * Developed and built using the super-fast [Vite](https://vitejs.dev/).

Enjoy checking the weather\! ☀️🌧️💨
