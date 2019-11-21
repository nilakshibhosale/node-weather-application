const path = require("path"); //to take files from different directory
const express = require("express");
const hbs = require("hbs");
const app = express();
const geocode = require("./utils/geocode");
const forcast = require("./utils/forcast");

const port = process.env.PORT || 3000 //for heroku(for local we can se using onst port = process.env.PORT || 3000)
const publicDirectoryPath = path.join(__dirname, "../public"); // it will set path to that directory

//use handlebar to use dyanamic content
app.set("view engine", "hbs");
//this returns HTML file
app.use(express.static(publicDirectoryPath)); // to use static files using express(serve static assets)
//customise the view folder name(put views folder name as templates folder)
const viewsPath = path.join(__dirname, "../templates/views");
app.set("views", viewsPath);

//create partial path(so that same header/footer or any part can use)
const partialPath = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partialPath);

//this is HTML from string

// app.get('', (req, res) => {
//     res.send("<h1>Welcome</h1>")
// })

//this app get help static page
// app.get('/help', (req, res) => {
//     res.send([{
//         name: 'nilakshi',
//         age: 26
//     }, {
//         name: 'shruti',
//         age: 22
//     }])
// })

// dynamic help page from views
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    message: "Get help from this file",
    name: "nilakshi"
  });
});
//this will render static page
// app.get('/about', (req, res) => {
//     res.send("<h1>About</h1>")
// })

// render dynamic page using hbs
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "nilakshi"
  });
});
//to get index page from views and delete static index.html from public folder
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "nilakshi"
  });
});

//query string for weather app
app.get("/weather", (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.send({
      error: 'enter address '
    })
  }
  //return geocode real data
  geocode(address, (error, {
    latitude,
    longitude,
    location
  } = {}) => {
    if (error) {
      return res.send({
        error
      })
    }
    forcast(latitude, longitude, (error, forcastData) => {
      if (error) {
        return res.send({
          error
        })
      }

      res.send({
        location: location,
        forcastData: forcastData,
        address: address
      })
    });
  });

  //returning static data
  // res.send({
  //   forcast: "35 degree Celcius",
  //   location: "Hyderabad",
  //   name: "nilakshi",
  //   address: address
  // });
});

//example of query string
app.get('/products', (req, res) => {
  // console.log(req.query)
  if (!req.query.search) {
    return res.send({
      error: 'not available'
    })
  }
  res.send({
    product: []
  })
})
//if we are having url like /help/test then use: (static)
// app.get("/help/*", (req, res) => {
//   res.send("help page not found");
// });

//404 page (if some random url user enter and it should always be in last(static))
// app.get("*", (req, res) => {
//   res.send("404 page");
// });

// dynamic(handlers) for 404 page
app.get("/help/*", (req, res) => {
  res.render("404-page", {
    title: "404",
    name: "nilakshi",
    msg: "help page not found"
  });
});

app.get("*", (req, res) => {
  res.render("404-page", {
    title: "404",
    name: "nilakshi",
    msg: "Page not found"
  });
});

//this is for local development
// app.listen(3000, () => {
//   console.log("server is up!");
// });

//for heroku
app.listen(port, () => {
  console.log("server is up!");
});