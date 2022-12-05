// A Business Logic File For Weather API CALL

// So now we have two services(for giphyservice and for weatherservice). Each returns either a promise that will resolve with API data or, if something goes wrong, returns an Error object.


// the main reason why we now have a service folder that houses our 2 service files(giphy-service.js and weather-service.js)
// is for the purpose of separation of logic and microservices
// This is a software design pattern where applications are built around lots of smaller services that communicate with each other. In contrast, there's the monolithic approach which can have lots and lots of closely entangled code - which means that when things break, they really break. Microservices allow code to be loosely coupled, which means it isn't too dependent on other code. By separating out our API calls in two different services, they are fully decoupled and don't know about each other. If there's an error in one of our services, it won't break the other service (though it will certainly break any code that does depend on the broken service).

export class GiphyService {
    static getGif(query) {
        return fetch(`http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${process.env.GIPHY_API_KEY}&limit=5`)
            .then(function (giphyResponse) {
                if (!giphyResponse.ok) {
                    throw Error(giphyResponse.status);
                }
                // a function must always return something otherwise it becomes undefined
                return giphyResponse.json();
            })
            .catch(function (error) {
                return Error(error);
            })
    }
}

// this code looks similar to the one we've written before but there are some slight differences, 1. the environmental variable name for our API Key was changed and this is because in this application we are going to be making use of two API key's and the two API keys must be given their respective descriptive names
// the 2nd thing that was changed was the parameter to "query". And this just means to ask for informaton. Also we could use this API call anywhere in our application for thngs other than weather --- so we don't need to call it something constricting like currentweather
// the last change; If our application has any errors, our catch block will return an Error(an Error object)
