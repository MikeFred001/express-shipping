"use strict";

// const AxiosMockAdapter = require("axios-mock-adapter");
// const axios = require("axios");
// const axiosMock = new AxiosMockAdapter(axios);
// const { shipProduct } = require("../shipItApi");


const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789"
    });
    console.log("RESPONSE BODY>>>>>", resp.body);
    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error(s) if invalid request body", async function () {

    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: 999,
        name: 90,
        addr: "123 Fake St.",
        zip: "88888"
      });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: [
          "instance.productId must be greater than or equal to 1000",
          "instance.name is not of a type(s) string"
        ], status: 400 }});
  });
});


// async function shipProduct({ productId, name, addr, zip }) {
//   console.warn("Called our real shipProduct function");

//   const resp = await axios({
//     method: "POST",
//     url: SHIPIT_SHIP_URL,
//     data: {
//       itemId: productId,
//       name: name,
//       addr: addr,
//       zip: zip,
//       key: SHIPIT_API_KEY
//     },
//   });

//   return resp.data.receipt.shipId;
// }
