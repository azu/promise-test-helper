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
    context("Pass good test", function () {
        context("when promise is fulfilled", function () {
            it("should be passed", function () {
                return shouldFulfilled(this.fulfilledPromise).then(function (value) {
                    assert(value === "value");
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
    describe("Detect bad test pattern", function () {
        context("when argument is not promise", function () {
            it("should be failed", function () {
                return shouldFulfilled("string");
            });
        });
        context("when promise is rejected", function () {
            it("should be failed", function () {
                return shouldFulfilled(this.rejectedPromise).catch(function (error) {
                    assert(error);// expect to fulfilled?
                });
            });
        });
        context("when argument is not promise", function () {
            it("should be failed", function () {
                return shouldRejected("string");
            });
        });
        context("when promise is fulfilled", function () {
            it("should be failed", function () {
                return shouldRejected(this.fulfilledPromise).then(function (value) {
                    assert(value);// expect to rejected?
                });
            });
        });
    });
});