/**
 * Created by azu on 2014/04/20.
 * LICENSE : MIT
 */
"use strict";
var assert = require("assert");
var Promise = require("ypromise");
var shouldFulfilled = require("../lib/promise-test-helper").shouldFulfilled;
var shouldRejected = require("../lib/promise-test-helper").shouldRejected;

var resolvedPromiseValue = "value",
    rejectedPromiseUnwrapValue = "error";
describe("promise-test-helper", function () {
    beforeEach(function () {
        this.fulfilledPromise = Promise.resolve(resolvedPromiseValue);
        this.rejectedPromise = Promise.reject(new Error(rejectedPromiseUnwrapValue));
    });
    describe("#shouldFulfilled", function () {
        context("when argument is not promise", function () {
            it("should be failed", function () {
                assert.throws(function () {
                    shouldFulfilled("string");
                }, Error);
            });
        });
        // fulfilledPromise => then
        context("when promise is fulfilled", function () {
            it("should be passed", function () {
                return shouldFulfilled(this.fulfilledPromise).then(function (value) {
                    assert(value === "value");
                })
            });
        });
        // rejectedPromise
        context("when promise is rejected", function () {
            it("should be failed", function () {
                return shouldFulfilled(this.rejectedPromise).then().catch(function (error) {
                    assert(error instanceof Error);
                    assert.equal(error.message, "error");
                });
            });
        });
        context("when use `catch` as method chain", function () {
            it("should be failed - assert error", function () {
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
        context("when use `then` as method chain", function () {
            it("should be failed - assert error", function () {
                return shouldRejected(this.fulfilledPromise).then().catch(function (error) {
                    assert(error instanceof Error);
                    assert.equal(error.message, "Expected promise to be rejected so you should use `shouldRejected(promise).catch`");
                })
            });
        });
        context("when promise is fulfilled", function () {
            it("should be failed and show `resolvedPromiseValue`", function (done) {
                shouldRejected(this.fulfilledPromise).catch(function (error) {
                    done(new Error("shouldRejected(this.fulfilledPromise) should not call catch"))
                }).catch(function (error) {// expected helper return rejected promise
                    assert(error instanceof Error);
                    assert.equal(error.message, "Expected promise to be rejected but it was fulfilled: " + resolvedPromiseValue);
                }).then(done, done);
            });
            context("and promise fulfilled undefined", function () {
                it("should be failed", function (done) {
                    shouldRejected(Promise.resolve()).catch(function (error) {
                        done(new Error("shouldRejected(this.fulfilledPromise) should not call catch"))
                    }).catch(function (error) {// expected helper return rejected promise
                        assert(error instanceof Error);
                        assert.equal(error.message, "Expected promise to be rejected but it was fulfilled");
                    }).then(done, done);
                });

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