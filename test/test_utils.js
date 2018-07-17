/* Utils for tests. */

import React from "react";
import sinon from "sinon";
import { renderIntoDocument } from "react-dom/test-utils";
import { findDOMNode } from "react-dom";

export function createComponent(Component, props) {
  const comp = renderIntoDocument(<Component {...props} />);
  return findDOMNode(comp);
}

export function createSandbox() {
  const sandbox = sinon.createSandbox();
  // Ensure we catch any React warning and mark them as test failures.
  sandbox.stub(console, "error").callsFake((...args) => {
    throw new Error(args);
  });
  return sandbox;
}
