const express = require("express");
const Add = require("../database/models/add");
const { catchErrors } = require("../utils/catch_errors");
const router = express.Router();
const fs = require("fs");
