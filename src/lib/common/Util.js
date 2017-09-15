import constants from '../table/Defaults';

export default {

  /**
   * Sorts an array on a sort field, order and an optional sortFunction.
   * @param {array} [anArray] - this is name description.
   * @param {sortField} [anArray] - this is name description.
   */
  sort(anArray, sortField, order, sortFunc) {
      anArray.sort((aa, bb) => {
        if (sortFunc) {
          return sortFunc(aa, bb, order);
        } else {
          if (order === constants.SORT_DESC) {
            return aa[sortField] > bb[sortField] ? -1 : ((aa[sortField] < bb[sortField]) ? 1 : 0);
          } else {
            return aa[sortField] < bb[sortField] ? -1 : ((aa[sortField] > bb[sortField]) ? 1 : 0);
          }
        }
      });

    return anArray;
  },

  /**
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * N milliseconds. If `immediate` is passed, trigger the function on the
   * leading edge, instead of the trailing.
   */
  debounce(func, wait, immediate) {
    let timeout;
    const debounced = function() {
      const context = this;
      const args = arguments;
      const later = function() {
        if (!immediate) {
          //console.log('fired debounce WITH wait!');
          func.apply(context, args);
        }
      };
      const callNow = (immediate && !timeout);
      if(timeout){
        //console.log('Clear timeout:: ' + timeout);
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, wait);
      //console.log('Set timeout:: ' + timeout);
      if (callNow) {
        //console.log('fired debounce NO wait!');
        func.apply(context, args);
      }
    };

    debounced.cancel = function() {
      //console.log('Cancelling debounce:: ' + timeout);
      if(timeout){
        clearTimeout(timeout);
        timeout = null;
      }
    };

    return debounced;

  },

  /**
  * Returns a nested key from an object.
  * @param obj Object to search on.
  * @param path  path string like foo.bar.baz
  * @param splitter character to use for splitting. Defaults to dot '.'
  **/
  getDescendantProp(obj, path, splitter='.') {
    return path.split(splitter).reduce((acc, part) => acc && acc[part], obj);
  },

  /*
  * Util.bindFunctions.call(this, [
      'foo',
      'bar',
      'baz'
    ]);
  */

  bindFunctions(functions) {
    functions.forEach(f => this[f] = this[f].bind(this));
  },
};
