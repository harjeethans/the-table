export default {

  height(node) {
    const h = (node) ? node.clientHeight : 0;
    return h;
  },

  width(node) {
    const w = (node) ? node.clientWidth : 0;
    return w;
  },

  size(node) {
    return {
      w: this.width(node),
      h: this.height(node)
    };
  },

  addClass(node, cssClasses) {
    if(node && typeof cssClasses === 'string'){
      cssClasses.split(' ').map(function (klass) {
        node.className = node.className.replace(new RegExp(klass, 'g'), '');
        node.className = node.className + ' ' + klass;
      });
    }
  },

  removeClass(node, cssClasses) {
    if(node && typeof cssClasses === 'string'){
      cssClasses.split(' ').map(function (klass) {
        node.className = node.className.replace(new RegExp(klass, 'g'), '');
      });
    }
  }

};
