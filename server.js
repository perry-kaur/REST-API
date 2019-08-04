const express = require('express')
var bodyParser = require("body-parser");
const app = express()
const port = 3000
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var router = express.Router();
app.use('/api/v1', router);

var db = require('./db');

router.get("/pois", function(request, response) {
  var pois = db.getPoi(null);
  console.log(pois);
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify(pois));
});

router.get("/pois/:id", function(request, response) {

  var id = request.params.id
  console.log("id = " + id);
  var poi = db.getPoi(id);
  console.log(poi);
  if (poi) {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(poi));
      response.end();
  } else {
    response.status(404);
    response.send('Id not found');
  }


});

router.post("/pois", function(request, response) {
  console.log("Post");
  var params = request.body
  var createdPoi = db.createPoi(params)
  console.log(createdPoi);
  response.send(JSON.stringify(createdPoi));
});

router.put("/pois/:id", function(request, response) {
  var id = request.params.id
  console.log("id = " + id);
  var params = request.body;

  // Invalid data - return with code 400
  if (params.name == undefined || params.description == undefined || params.city == undefined || params.coordinates == undefined) {
    response.writeHead(400);
    response.end("");
    return;
  }

  var poi = db.getPoi(id);
  var params = request.body;

  // Id Already exists, just update the data
  if (poi) {
    var modifiedPoi = db.setPoi(id, params)

    response.writeHead(201, {
      "Content-Type": "application/json"
    });
    response.write(JSON.stringify(modifiedPoi));
    response.end();

  } else { // Create new entry if poi does not exist with given id
    var createdPoi = db.createPoi(params)
    console.log(createdPoi);
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(createdPoi));
  }
});

router.delete("/pois/:id", function(request, response) {
  var id = request.params.id
  console.log("id = " + id);

  var isEntryDeleted = db.deletePoi(id);
  if (isEntryDeleted) {
    response.status(204);
    response.send('Deleted');
  } else {
    response.status(404);
    response.send('Id not found');
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
