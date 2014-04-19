/**
 * Created by azu on 2014/04/20.
 * LICENSE : MIT
 */
"use strict";
var assert = require("assert");
var Promise = require("ypromise");
var shouldFulfilled = require("../lib/promise-test-helper").shouldFulfilled;
var shouldRejected = require("../lib/promise-test-helper").shouldRejected;
describe("promise-test-helper", function () {
    beforeEach(function () {
        this.fulfilledPromise = Promise.resolve("value");
        this.rejectedPromise = Promise.reject(new Error("error"));
    });
    describe("#shouldFulfilled", function () {
        context("when argument is not promise", function () {
            it("should be failed", function () {
                assert.throws(function () {
                    shouldFulfilled("string");
                }, Error);
            });
        });
        context("when promise is fulfilled", function () {
            it("should be passed", function () {
                return shouldFulfilled(this.fulfilledPromise).then(function (value) {
                    assert(value === "value");
                })
            });
        });
        context("when promise is rejected", function () {
            it("should be failed", function () {
                return shouldFulfilled(this.rejectedPromise).then().catch(function (error) {
                    assert(error instanceof Error);
                    assert.equal(error.message, "error");
                });
            });
            it("should be failed", function () {
                return shouldFulfilled(this.rejectedPromise).catch().catch(function (error) {
                    assert(error instanceof Error);
                    assert.equal(error.message, "Expected promise to be fulfilled so you should use `shouldFulfilled(promise).then`");
                });
            });
        });
    });
    describe("#shouldRejected", function () {
        context("when argument is not promise", function () {
            it("should be failed", function () {
                assert.throws(function () {
                    shouldRejected("string");
                }, Error);
            });
        });
        context("when promise is fulfilled", function () {
            it("should be failed", function () {
                return shouldRejected(this.fulfilledPromise).then().catch(function (error) {
                    assert(error instanceof Error);
                    assert.equal(error.message, "Expected promise to be rejected so you should use `shouldRejected(promise).catch`");
                })
            });
        });
        context("when promise is rejected", function () {
            it("should be passed", function () {
                return shouldRejected(this.rejectedPromise).catch(function (error) {
                    assert(error instanceof Error);
                });
            });
        });
    });
});