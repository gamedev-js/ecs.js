function _getClassParser(typename) {
  return function (app, data) {
    let ctor = app.getClass(typename);
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

    return instantiate(app, ctor, data);
  };
}

function _getArrayParser(elementParser) {
  if (elementParser) {
    return function (app, data) {
      let result = new Array(data.length);

      for (let i = 0; i < data.length; ++i) {
        result[i] = elementParser(app, data[i]);
      }

      return result;
    };
  }

  return function (app, data) {
    return data;
  };
}

function _getParser(app, propInfo) {
  if (propInfo.parse) {
    return propInfo.parse;
  }

  let parser = null;

  // get parser
  let typeInfo = app.getType(propInfo.type);
  if (typeInfo) {
    parser = typeInfo.parse || null;
  } else {
    parser = _getClassParser(propInfo.type);
  }

  // if this is an array, get array parser
  if (propInfo.array) {
    return _getArrayParser(parser);
  }

  return parser;
}

function _wrapSet(app, name, propInfo, parser) {
  // if we have parser
  if (parser) {
    // if we have set
    if (propInfo.set) {
      return function (val) {
        propInfo.set.call(this, parser(app, val, propInfo));
      };
    }

    // default
    return function (val) {
      this[name] = parser(app, val, propInfo);
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

function _wrapGet(app, name, propInfo) {
  // if we have get
  if (propInfo.get) {
    return propInfo.get;
  }

  // default
  return function () {
    return this[name];
  };
}

function createPrototypeAccessors(app, schema) {
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
      // propInfo.array = Array.isArray(propInfo.default);
      propInfo.array = false;
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
      let typeInfo = app.getType(propInfo.type);
      if (typeInfo) {
        propInfo.default = typeInfo.default;
      } else {
        propInfo.default = null;
      }
    }

    // get parser
    let parser = _getParser(app, propInfo);

    // create get & set function
    let interName = `_${name}`;
    let getFn = _wrapGet(app, interName, propInfo);
    let setFn = _wrapSet(app, interName, propInfo, parser);

    prototypeAccessors[name] = {
      configurable: true,
      enumerable: true,
      get: getFn,
      set: setFn,
    };
  }

  return prototypeAccessors;
}

function instantiate(app, ctor, data) {
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
      let parser = _getParser(app, propInfo);
      let value = data[name];
      if (value === undefined) {
        value = propInfo.default;
      }

      //
      if (parser) {
        let result = parser(app, value, propInfo);
        obj[interName] = result;
      } else {
        obj[interName] = value;
      }
    }

    proto = Object.getPrototypeOf(proto);
  }

  return obj;
}

export default {
  createPrototypeAccessors,
  instantiate,
};