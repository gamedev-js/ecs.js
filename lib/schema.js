function _getTypeParser(typename, types) {
  let typeInfo = types[typename];
  if (typeInfo && typeInfo.parse) {
    return typeInfo.parse;
  }

  return null;
}

function _getClassParser(typename, types, classes) {
  return function (data) {
    let ctor = classes[typename];
    if (ctor === undefined) {
      console.warn(`Can not find class ${typename}.`);
      return null;
    }

    data = data || {};

    if (data instanceof ctor) {
      return data;
    }

    if (data.constructor && data.constructor.__classname__) {
      console.warn(`Invalid class instance, it is not instanceof ${typename}.`);
      return null;
    }

    return instantiate(ctor, data, types, classes);
  };
}

function _getArrayParser(elementParser) {
  if (elementParser) {
    return function (data) {
      let result = new Array(data.length);

      for (let i = 0; i < data.length; ++i) {
        result[i] = elementParser(data[i]);
      }

      return result;
    };
  }

  return function (data) {
    return data;
  };
}

function _getParser(propInfo, types, classes) {
  if (propInfo.parse) {
    return propInfo.parse;
  }

  // get type parser
  let parser = _getTypeParser(propInfo.type, types);

  // if we don't have type parser, set it to class parser
  if (parser === null) {
    parser = _getClassParser(propInfo.type, types, classes);
  }

  // if this is an array, get array parser
  if (propInfo.array) {
    return _getArrayParser(parser);
  }

  return parser;
}

function _wrapSet(name, propInfo, parser) {
  // if we have parser
  if (parser) {
    // if we have set
    if (propInfo.set) {
      return function (val) {
        propInfo.set.call(this, parser(val));
      };
    }

    // default
    return function (val) {
      this[name] = parser(val);
    };
  }

  // if we have set
  if (propInfo.set) {
    return propInfo.set;
  }

  // default
  return function (val) {
    this[name] = val;
  };
}

function _wrapGet(name, propInfo) {
  // if we have get
  if (propInfo.get) {
    return propInfo.get;
  }

  // default
  return function () {
    return this[name];
  };
}

function createPrototypeAccessors(schema, types, classes) {
  let prototypeAccessors = {};

  for (let name in schema) {
    let propInfo = schema[name];

    // type & default syntax validation
    if (propInfo.type === undefined && propInfo.default === undefined) {
      console.warn(`Invalid property ${name}: you must provide 'default' or 'type'.`);
      continue;
    }

    // confirm array attributes in propInfo
    if (propInfo.array === undefined) {
      propInfo.array = Array.isArray(propInfo.default);
    }

    // array syntax validation
    if (propInfo.array && propInfo.type === undefined) {
      console.warn(`Invalid property ${name}: array value must have a 'type'.`);
      continue;
    }

    // confirm type attributes in propInfo
    let typename = propInfo.type;
    if (typename === undefined) {
      propInfo.type = typeof propInfo.default;
    }

    // confirm default attributes in propInfo
    if (propInfo.default === undefined) {
      let typeInfo = types[propInfo.type];
      if (typeInfo) {
        propInfo.default = typeInfo.default;
      } else {
        propInfo.default = null;
      }
    }

    // get parser
    let parser = _getParser(propInfo, types, classes);

    // create get & set function
    let interName = `_${name}`;
    let getFn = _wrapGet(interName, propInfo);
    let setFn = _wrapSet(interName, propInfo, parser);

    prototypeAccessors[name] = {
      configurable: true,
      enumerable: true,
      get: getFn,
      set: setFn,
    };
  }

  return prototypeAccessors;
}

function instantiate(ctor, data, types, classes) {
  let obj = new ctor();

  let proto = ctor;
  while (proto.__classname__ !== undefined) {
    if (proto.hasOwnProperty('schema') === false) {
      proto = Object.getPrototypeOf(proto);
      continue;
    }

    for (let name in proto.schema) {
      let interName = `_${name}`;
      if (obj[interName] !== undefined) {
        continue;
      }

      let propInfo = proto.schema[name];

      // get parser and parse value
      let parser = _getParser(propInfo, types, classes);
      let value = data[name];
      if (value === undefined) {
        value = propInfo.default;
      }

      //
      let result = parser(value);
      obj[interName] = result;
    }

    proto = Object.getPrototypeOf(proto);
  }

  return obj;
}

export default {
  createPrototypeAccessors,
  instantiate,
};