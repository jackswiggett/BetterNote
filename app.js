"use strict"; // so we can use const, let, etc.

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connect to mongodb server
let db;

const url = 'mongodb://localhost:27017/notation-test';
MongoClient.connect(url, function(err, database) {
  if (err) {
    console.log(err);
    throw new Error("Unable to connect to database server.");
  }

  console.log("Connected correctly to database server.");
  db = database;

  app.listen(3001, function () {
    console.log('API server listening on port 3001.');
  });
});

app.use(bodyParser.json());
app.use(function(err, req, res, next) {
  if (err) {
    // TODO: determine if this error was the result of bad
    //       JSON sent to the server
    console.log(err);
    res.status(500).send({
      error: "A server error occurred."
    });
  } else {
    next();
  }
});

app.get('/api/test-logs', function (req, res) {
  const collection = db.collection("test-logs");
  collection.find({}).toArray(function (err, logs) {
    if (err) {
      console.log(err);
      res.status(500).send({
        error: "Unable to access database of test logs."
      });
    } else {
      console.log("Found " + logs.length + " test logs.");
      console.log(logs);
      res.status(200).send(logs);
    }
  });
});

app.post('/api/test-logs', function (req, res) {
  const collection = db.collection("test-logs");
  collection.insertOne(req.body, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).send({
        error: "Unable to insert test log into database."
      });
    } else {
      console.log("Saved new test log.");
      res.status(201).end("Test log successfully saved in database.");
    }
  });
});
