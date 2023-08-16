"use strict";

const express = require("express");
const jsonschema = require("jsonschema");
const shipItSchema = require("../schemas/shipItSchema.json");
const { BadRequestError } = require("../expressError");
const router = new express.Router();

const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Checks body for invalid inputs and returns errors if necessary
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  if (req.body === undefined) {
    throw new BadRequestError();
  }
  // TODO: Pass in error message

  console.log("SHIPMENT ROUTE BODY", req.body);

  const result = jsonschema.validate(req.body, shipItSchema, {required: true});

  if (!result.valid) {
    const errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }

  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });
  return res.json({ shipped: shipId });
});

module.exports = router;
