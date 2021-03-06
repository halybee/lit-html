/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />

import {guard} from '../../directives/guard.js';
import {render} from '../../lib/render.js';
import {html} from '../../lit-html.js';
import {stripExpressionMarkers} from '../test-utils/strip-markers.js';

const assert = chai.assert;

suite('guard', () => {
  let container: HTMLDivElement;

  function renderGuarded(expression: any, value: () => any) {
    render(html`<div>${guard(expression, value)}</div>`, container);
  }

  setup(() => {
    container = document.createElement('div');
  });

  test('re-renders only on identity changes', () => {
    let callCount = 0;
    let renderCount = 0;

    const guardedTemplate = () => {
      callCount += 1;
      return html`Template ${renderCount}`;
    };

    renderCount += 1;
    renderGuarded('foo', guardedTemplate);
    assert.equal(
        stripExpressionMarkers(container.innerHTML), '<div>Template 1</div>');

    renderCount += 1;
    renderGuarded('foo', guardedTemplate);
    assert.equal(
        stripExpressionMarkers(container.innerHTML), '<div>Template 1</div>');

    renderCount += 1;
    renderGuarded('bar', guardedTemplate);
    assert.equal(
        stripExpressionMarkers(container.innerHTML), '<div>Template 3</div>');

    assert.equal(callCount, 2);
  });

  test('dirty checks non-primitive values', () => {
    let callCount = 0;
    let items = ['foo', 'bar'];

    const guardedTemplate = () => {
      callCount += 1;
      return html`<ul>${items.map((i) => html`<li>${i}</li>`)}`;
    };

    renderGuarded(items, guardedTemplate);
    assert.equal(
        stripExpressionMarkers(container.innerHTML),
        '<div><ul><li>foo</li><li>bar</li></ul></div>');
    items.push('baz');

    renderGuarded(items, guardedTemplate);
    assert.equal(
        stripExpressionMarkers(container.innerHTML),
        '<div><ul><li>foo</li><li>bar</li></ul></div>');

    items = [...items];
    renderGuarded(items, guardedTemplate);
    assert.equal(
        stripExpressionMarkers(container.innerHTML),
        '<div><ul><li>foo</li><li>bar</li><li>baz</li></ul></div>');

    assert.equal(callCount, 2);
  });
});
