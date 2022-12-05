// A business Logic file -- For Weather API CALL
// We have now successfullyupdated our weather-servie.
// the 2 changes made in our giphy-service.js file were also made here; we've updated the name of the environmental variable and our catch block is now returning an error.

export class WeatherService {
    static getWeather(city) {
        // No try block here, there is only a .catch block
        // we return our fetch here; without having to use await and store in a variable
            return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}`)
                // before writing a .then() always remove the semicolon in the line before it
                .then(function (cityResponse) {
                    if (!cityResponse.ok) {
                        throw Error(cityResponse.statusText);
                    }
                    return cityResponse.json();
                })
        .catch (function(error) {
            return Error(error);
        });
    }
}
