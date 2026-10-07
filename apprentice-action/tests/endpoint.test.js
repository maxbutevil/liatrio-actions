const axios = require("axios");
const chai = require("chai");
const { assert, expect } = chai;
const dockerBridgeIP = "172.17.0.1";

describe("Tests to the \"/\" endpoint", () => {
    it("should return a 200 status code", async () => {
        const res = await axios(`http://${dockerBridgeIP}:80/`);
        expect(res.status).to.equal(200);
    });

    it("should return a JSON object with a Message", async () => {
        const res = await axios(`http://${dockerBridgeIP}:80/`);
        expect(res.data).to.haveOwnProperty("message");
    });

    it("should return a JSON object with a Timestamp", async () => {
        const res = await axios(`http://${dockerBridgeIP}:80/`);
        expect(res.data).to.haveOwnProperty("timestamp");
    });

    it("should return a Message saying \"My name is ...\"", async () => {
        const res = await axios(`http://${dockerBridgeIP}:80/`);
        expect(res.data.message).to.contain("My name is");
    });

    it("should return a UNIX style timestamp (numerical values only)", async () => {
        const res = await axios(`http://${dockerBridgeIP}:80/`);
        expect(res.data.timestamp).to.be.a("number");
    });
    it("should return a timestamp within a few seconds of now", async () => {
        const res = await axios(`http://${dockerBridgeIP}:80/`);
        const now = Date.now();
        expect(res.data.timestamp).to.be.within(now - 5000, now);
    });
    it("should return a minified JSON object.", async () => {
        // this regex approach has a couple quirks:
        // - doesn't allow escaped quotes in string fields
        // - only allows string and numeric fields
        const res = await axios(`http://${dockerBridgeIP}:80/`, { transformResponse: data => data });
        const regex = /^{("\w+":("[^"]+"|\d+),)*"\w+":("[^"]+"|\d+)}$/g;
        assert(res.data.match(regex));
    });
});
