import { expect } from "chai";
import sinon from "sinon";
import { Simulate } from "react-addons-test-utils";

import { createSandbox, createComponent } from "../test_utils";
import HomePage from "../../scripts/components/HomePage";


describe("HomePage component", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("Not authenticated", () => {
    describe("Authentication types", () => {
      let node, setup, navigateToExternalAuth;

      beforeEach(() => {
        setup = sandbox.spy();
        navigateToExternalAuth = sandbox.spy();
        node = createComponent(HomePage, {
          setup,
          history: ["http://server.test/v1"],
          navigateToExternalAuth,
          session: {authenticated: false},
        });
      });

      it("should render a setup form", () => {
        expect(node.querySelector("form")).to.exist;
      });

      describe("Basic Auth", () => {
        it("should submit setup data", () => {
          Simulate.change(node.querySelector("#root_server"), {
            target: {value: "http://test.server/v1"}
          });
          Simulate.change(node.querySelector("#root_credentials_username"), {
            target: {value: "user"}
          });
          Simulate.change(node.querySelector("#root_credentials_password"), {
            target: {value: "pass"}
          });

          return new Promise(setImmediate).then(() => {
            Simulate.submit(node.querySelector("form"));
            sinon.assert.calledWithExactly(setup, {
              server: "http://test.server/v1",
              authType: "basicauth",
              credentials: {
                username: "user",
                password: "pass",
              },
              redirectURL: undefined,
            });
          });
        });
      });

      describe("FxA", () => {
        it("should navigate to external auth URL", () => {
          Simulate.change(node.querySelector("#root_server"), {
            target: {value: "http://test.server/v1"}
          });
          Simulate.change(node.querySelectorAll("[type=radio]")[1], {
            target: {value: "fxa"}
          });

          return new Promise(setImmediate).then(() => {
            Simulate.submit(node.querySelector("form"));
            sinon.assert.calledWithExactly(navigateToExternalAuth, {
              server: "http://test.server/v1",
              authType: "fxa",
              redirectURL: undefined,
            });
          });
        });
      });
    });

    describe("History support", () => {
      it("should set the server field value using latest entry from history", () => {
        const node = createComponent(HomePage, {
          history: [],
          session: {authenticated: false},
        });

        expect(node.querySelector("#root_server").value)
          .eql("https://kinto.dev.mozaws.net/v1/");
      });

      it("should set the server field value using latest entry from history", () => {
        const node = createComponent(HomePage, {
          history: ["http://server.test/v1"],
          session: {authenticated: false},
        });

        expect(node.querySelector("#root_server").value)
          .eql("http://server.test/v1");
      });
    });
  });

  describe("Authenticated", () => {
    let node;

    beforeEach(() => {
      node = createComponent(HomePage, {
        session: {
          authenticated: true,
          server: "http://test.server/v1",
          username: "user",
          password: "pass",
          serverInfo: {
            foo: {
              bar: "plop"
            }
          }
        },
      });
    });

    it("should render server information heading", () => {
      expect(node.querySelector(".panel-heading").textContent)
        .eql("Server information");
    });

    it("should render server information table", () => {
      expect([].map.call(node.querySelectorAll("th"), x => x.textContent))
        .eql(["foo", "bar"]);
    });
  });
});
