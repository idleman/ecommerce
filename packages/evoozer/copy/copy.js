/**
* Try too copy the object and return it without losing any property descriptor and make use of the object.copy if available.
*
* @method copy
* @param {Object} Object to be copy(ed).
* @param {Boolean} [shallow=false] If true, do only a shallow (not deep) copy.
* @return {Object} copyd object.
*/
const IE = (function(){
	try {
		if(typeof window === 'undefined') {
			return;
		}
		var undef,
				v = 3,
				div = document.createElement('div'),
				all = div.getElementsByTagName('i');

		while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]
			);

		return v > 4 ? v : undef;
	} catch(err) {
		return;
	}
}());

export default function copy(obj, shallow) {
  switch(typeof obj) {
		case 'object':
			if(obj === null) {
				return obj;
			}

			if(Array.isArray(obj)) {
				return obj.map(copy);
			}

			if(typeof obj.clone === 'function') {
				return obj.clone();
			}

      // IE 8 performance trix
      if(IE && IE < 9) {
        let clone = {};
        Object.getOwnPropertyNames(obj).forEach(function(name) {
					clone[name] = ((shallow)? obj[name] : copy(obj[name]));
        });
        return clone;
      }

			var prototype = Object.getPrototypeOf(obj),
			    properties = {};


			Object.getOwnPropertyNames(obj).forEach(function(name) {
        //  we do not use Object.getOwnPropertyDescriptor(obj, name) because it may interfere with
        //  a object both having accessor and being writable, providing the error:
        //  "A property cannot both have accessors [...]"

        var descriptor = {
            value: ((shallow)? obj[name] : copy(obj[name])),
            writable: true,
            enumerable: obj.propertyIsEnumerable(name),
            configurable: true
        };
        properties[name] = descriptor;
      });

			return Object.create(prototype, properties);
		default:
			return obj;
	}
};