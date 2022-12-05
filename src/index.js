
// the UserInterface Logic file

// After I've made use of Promises, I would like to make use of 


import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
// importing the WeatherService and CountryWeatherService class that we need in the UI logic file

import { WeatherService } from "./services/weather-service.js";
// importing GiphyServie too
import { GiphyService } from "./services/giphy-service.js";

// separation of logic code 

// importing app logo IMage

import jsBadgeImage from "./assets/images/js-badge.svg";





// a function for clearing out the form fields and other things from the DOM(Document Object Module)
// function clearFields() {
//     $("#location").val("");
//     $(".showErrors").text("");
//     $(".showHumidity").text("");
//     $(".showTemp").text("");
//     $(".showTempCelsius").text("");
//     $(".showTempFahrenheit").text("");
// }

// clearFields() updated to reflect changed HTML.
function clearFields() {
    // everytime My user enters in a value, I want to clear out the fields so my user knows his request is being processed
    $('#location').val("");
    $('.weather-description').text("");
    $('.show-gif').html("");
    $('.show-errors').text("");
}

// having our functions before $(document).ready make them global, and the variables we define in them also become global
// but thanks to webpack this global variables and functions are prevented


// The three remaining UI functions make our code more modular. We'll discuss them soon.

function displayWeatherDescription(description) {
    $('.weather-description').text(`The weather is ${description}!`);
}

function displayGif(response) {
    const url = response.data[0].images.downsized.url;
    $('.show-gif').html(`<img src='${url}'>`);
}

function displayErrors(error) {
    // this function is used for both of our API calls(the one for Giphy and the one for OpenWeather); that makes our code DRY
    $('.show-errors').text(`${error}`);
}

$(document).ready(function () {
    // working with images for webpack
    let myImg = $(".appImg");
    myImg.attr('href', jsBadgeImage);
    
    $('#weatherLocation').click(function () {
        let city = $('#location').val();
        clearFields();

        // We start by calling our WeatherService static method. Because this returns a promise, we can use Promise.prototype.then() with it.


        WeatherService.getWeather(city)
        // key things to note: if we had used a semicolon(;) at the end of the above line of code, the .then() afterwards will throw an error

            // For the error handling part we've added more robust error handling. If our static method throws an error, control will revert to the catch block in the static method. But we don't want to just throw an error for developers to see. We want our users to see an error message, too. While we could technically just do so in the catch block of our weather service, that's not good separation of code. If there's an error in the API call, our weather service should just return an error. It shouldn't know or care about the UI at all.
            // So now when we call Promise.prototype.then() in our UI, it will return either the data from the API or an error object. We can check to see if it returned an error with the following conditional: if (weatherResponse instanceof Error)
            // As we discussed in Exception Handling in JavaScript, instanceof is actually an operator and it's very helpful for checking to see whether or not something is a certain type of object. In this case, if weatherResponse is an instance of an Error object, we need to throw another error. This one will revert control to the nearest catch block - which actually comes at the end of our chained promise. That catch block will call a displayErrors() function which will display an error for the user.


            .then(function (weatherResponse) {
                if (weatherResponse instanceof Error) {
                    throw Error(`OpenWeather API error: ${weatherResponse.message}`);
                }
                // THis part of the code works when everything goes well with our OpenWeather API
                // don't forget; it is the success of OPenWeather that will determine the success of Giphy API and this is because both of them work hand in hand
                // First we parse the description property from the response data. Then we have another callback - all the displayWeatherDescription() function does is display the weather description to the user. Why do it here instead of later? Well, there's no reason for users to wait until the Giphy API call is resolved for them to get some data. That's a huge advantage of asynchronous code and something you'll see often online - sites like Facebook and Twitter will give you some data now even as they are loading more data to show you later. We don't want to wait for everything to load all at once. Also, if the Giphy API call were to fail, we'd still get data from the OpenWeather API.

                const weatherDescription = weatherResponse.weather[0].description;
                displayWeatherDescription(weatherDescription);
                // where we made use of the return keyword to prevent .then() from being undefined
                // also, because we want to chain another promise to it, we used the return keyword
                // In this case, we return our next API call to the Giphy API.If there's an error, our code will go through the same process as it does with the OpenWeather API. If it's successful, there will be another callback to a UI function called displayGif();. We don't need to return anything from this method because there are no further promises chained to it. In fact, this final method just has side effects. A method or function that alters something elsewhere in the code (instead of adding or returning a value to it) this code is said to have side effects. Side effects are common with functions related to the UI - though when it comes to business logic, they should generally be avoided. Well, we did avoid them in our service logic because we made sure to keep our UI logic separate.

                return GiphyService.getGif(weatherDescription);
            })
            .then(function (giphyResponse) {
                if (giphyResponse instanceof Error) {
                    throw Error(`Giphy API error: ${giphyResponse.message}`);
                }
                displayGif(giphyResponse);
            })
            .catch(function (error) {
                displayErrors(error.message);
                // If it seems like we are throwing this error all over the place, we are. But that's common in coding - think about a time when you've made an error in a JavaScript application that uses webpack. The application will fail to compile and there will be a stack trace. It's often not just one error, but an entire cascade of errors that the first one triggers.

                // In this particular application, there are several advantages to the approach we're taking here. First, we wouldn't want to call displayErrors() in our services. It has to do with our UI and services shouldn't know or care about our UI. On the other hand, it makes complete sense for our service to either return data or throw an error. We could use this service anywhere in any application and handle the error as needed - for instance, if we were also using this service in a backend Node application, we wouldn't want to display an error to a user - instead, we might print the error message to a server error log.
                // There's another big advantage. The chained promises in index.js are handling multiple API calls. We can use the same catch block to handle errors from either. We just need to have a slightly different error message so the user can see exactly what went wrong. In the case of the Weather API response. the message is OpenWeather API error: ${weatherResponse.message}. In the case of the Giphy response, that message will be Giphy API error: ${giphyResponse.message}. (If you want to see these error messages for yourself when you read the code, the easiest way is to trigger a 403 Unauthorized response by removing the API key or changing it to a bogus value like 1.)
                // So now we've set up our error handling so that messages related to the UI are in the correct place - and we can use the same catch block for errors related to both API calls, keeping our code DRY.
            })
        // Now for the big gotcha that trips students up.Promise.prototype.then() is a method.We know that, right ? Well, what's the basic rule about JavaScript methods/functions always returning something or their return will be undefined? That applies to Promise.prototype.then(), too. Because the syntax of chaining promises together looks confusing at first, it can be really easy to forget to add the return. You must return a value from Promise.prototype.then() if you want to chain another promise to it.

        
        // And that's it for the code. The most complex change is the error handling. And while it can seem daunting at first, if you think carefully about keeping code separate and using callbacks to make the code more modular, it's not so bad. We'll run into a lot more trouble (and generally bad code) if we just throw a lot of code inside Promise.prototype.then() without extracting as much as possible into separate functions.

        // finally we update our html code and its a rap
        

    });
});