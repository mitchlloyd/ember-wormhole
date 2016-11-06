import Ember from 'ember';
import layout from '../templates/components/ember-wormhole';
import {
  findElementById,
  getDOM
} from '../utils/dom';

const { Component, computed } = Ember;

export default Component.extend({
  layout,

  /*
   * Attrs
   */
  to: computed.alias('destinationElementId'),
  destinationElementId: null,
  destinationElement: computed('destinationElementId', 'renderInPlace', function() {
    if (this.get('renderInPlace')) {
      return this.element;
    }

    let id = this.get('destinationElementId');
    if (!id) {
      return null;
    }
    return findElementById(this._dom, id);
  }),
  renderInPlace: false,

  /*
   * Lifecycle
   */
  init() {
    this._super(...arguments);

    this._dom = getDOM(this);

    // A prop to help in the mocking of didInsertElement timing for Fastboot
    this._didInsert = false;
  },

  willRender() {
    this._super(...arguments);

    var destinationElement = this.get('destinationElement');
    if (!destinationElement) {
      var destinationElementId = this.get('destinationElementId');
      if (destinationElementId) {
        throw new Error(`ember-wormhole failed to render into '#${this.get('destinationElementId')}' because the element is not in the DOM`);
      }
      throw new Error('ember-wormhole failed to render content because the destinationElementId was set to an undefined or falsy value.');
    }
  },

  willDestroyElement: function() {
    this._super(...arguments);
    this._didInsert = false;
  }
});
