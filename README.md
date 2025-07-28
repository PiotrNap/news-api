# news-api
Node.js API application for fetching global news 

## How to run it?

1. clone the repository
2. navigate to this project with `cd news-api`
3. Run `yarn` (if you don't have Yarn installed yet run `npm -g i yarn`)
4. Run `yarn dev` to run the application

## How to test it? 

There are 4 endpoints available to you.

1. GET /help 
```
curl localhost:9000/help
```
This will give you a list of available endpoints and some explanation about available query values.

2. GET /news?q=<your-search-query>
```
curl "localhost:9000/news?q=android"
```
This will return you a list of 10 news, filtered by a given search query (q)

3. GET /news?q=<your-search-query>&max=<N>
```
curl "localhost:9000/news?q=android&max=2"
```
This will give you a list of N (max) news, searched by a given search query (q).
The maximum amount of news you can fetch is 100 and minimum 1.

4. GET /news?q=<your-search-query>&in=<title-name>
```
curl "localhost:9000/news?q=android&in=apple"
```
This will give you a list of news where the given search query (q) match news title.
