// so far, PE is limited. It'll update the markup when you update the data source's strings. More soon.
export default function pe (data, dataStrName){
  if( data === undefined || dataStrName  === undefined ){
    throw('data and a string name of the data both required');
  }

  let path = [];

  let validator = {
    get(target, key) {
      if (typeof target[key] === 'object' && target[key] !== null) {
        // weak check for array index to wrap, otherwise use a dot
        path.push((!isNaN(key) ? '[' : '.'  ) + key + (!isNaN(key) ? ']' : ''  ));
        return new Proxy(target[key], validator)
      } else {
        return target[key];
      }
    },
    set(target, prop, val) {
      // update target data source
      target[prop] = val;
      let selectorPath = dataStrName + path.join('') + ( prop ? "." + prop : '' );
      console.log(selectorPath);
      document.querySelectorAll(`[data-pe-text='${selectorPath}'`).forEach(elem => {
        elem.textContent = val;
      });
      path = [];
      return true;
    }
  };

  this.data = new Proxy(data, validator);
  return this;
}
