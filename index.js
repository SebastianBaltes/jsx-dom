import { __assign } from "tslib";

var keys = Object.keys;
function isBoolean(val) {
  return typeof val === "boolean";
}
function isElement(val) {
  return val && typeof val.nodeType === "number";
}
function isString(val) {
  return typeof val === "string";
}
function isNumber(val) {
  return typeof val === "number";
}
function isObject(val) {
  return typeof val === "object" ? val !== null : isFunction(val);
}
// tslint:disable-next-line:ban-types
function isFunction(val) {
  return typeof val === "function";
}
function isArrayLike(obj) {
  return (
    isObject(obj) &&
    typeof obj.length === "number" &&
    typeof obj.nodeType !== "number"
  );
}

function createRef() {
  return Object.seal({ current: null });
}
function isRef(maybeRef) {
  return isObject(maybeRef) && "current" in maybeRef;
}

var SVGNamespace = "http://www.w3.org/2000/svg";
function preventDefault(event) {
  event.preventDefault();
  return event;
}
function stopPropagation(event) {
  event.stopPropagation();
  return event;
}
// https://facebook.github.io/react/docs/jsx-in-depth.html#booleans-null-and-undefined-are-ignored
// Emulate JSX Expression logic to ignore certain type of children or className.
function isVisibleChild(value) {
  return !isBoolean(value) && value != null;
}
/**
 * Convert a `value` to a className string.
 * `value` can be a string, an array or a `Dictionary<boolean>`.
 */
function className(value) {
  if (Array.isArray(value)) {
    return value
      .map(className)
      .filter(Boolean)
      .join(" ");
  } else if (isObject(value)) {
    return keys(value)
      .filter(function(k) {
        return value[k];
      })
      .join(" ");
  } else if (isVisibleChild(value)) {
    return "" + value;
  } else {
    return "";
  }
}
function Fragment(attr) {
  var fragment = document.createDocumentFragment();
  appendChildren(attr.children, fragment);
  return fragment;
}
function createElement(tag, attr) {
  var children = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    children[_i - 2] = arguments[_i];
  }
  attr = attr || {};
  var node;
  if (isString(tag)) {
    node = attr.namespaceURI
      ? document.createElementNS(attr.namespaceURI, tag)
      : document.createElement(tag);
    attributes(attr, node);
    appendChildren(children, node);
  } else if (isFunction(tag)) {
    // Custom elements.
    node = tag(__assign({}, attr, { children: children }));
  }
  if (isRef(attr.ref)) {
    attr.ref.current = node;
  } else if (isFunction(attr.ref)) {
    attr.ref(node);
  }
  return node;
}
function appendChild(child, node) {
  if (isArrayLike(child)) {
    appendChildren(child, node);
  } else if (isString(child) || isNumber(child)) {
    node.appendChild(document.createTextNode(child));
  } else if (child === null) {
    node.appendChild(document.createComment(""));
  } else if (isElement(child)) {
    node.appendChild(child);
  }
}
function appendChildren(children, node) {
  for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
    var child = children_1[_i];
    appendChild(child, node);
  }
  return node;
}
function attribute(key, value, node) {
  switch (key) {
    case "dataset":
      for (var _i = 0, _a = keys(value || {}); _i < _a.length; _i++) {
        var dataKey = _a[_i];
        var dataValue = value[dataKey];
        if (dataValue != null) {
          node.dataset[dataKey] = dataValue;
        }
      }
      return;
    case "innerHTML":
    case "innerText":
    case "textContent":
      node[key] = value;
      return;
    case "spellCheck":
      node.spellcheck = value;
      return;
    case "class":
    case "className":
      node.setAttribute("class", className(value));
      return;
    case "ref":
    case "namespaceURI":
      return;
    case "style":
      if (isObject(value)) {
        __assign(node.style, value);
        return;
      }
    // fallthrough
  }
  if (isFunction(value)) {
    if (key[0] === "o" && key[1] === "n") {
      var name = key.slice(2).toLowerCase();
      listen(node, name, value);
    }
  } else if (value === true) {
    node.setAttribute(key, "");
  } else if (value !== false && value != null) {
    node.setAttribute(key, value);
  }
}
function attributes(attr, node) {
  for (var _i = 0, _a = keys(attr); _i < _a.length; _i++) {
    var key = _a[_i];
    attribute(key, attr[key], node);
  }
  return node;
}
function listen(node, eventName, callback) {
  node.addEventListener(eventName, callback);
  return node;
}

export {
  SVGNamespace,
  preventDefault,
  stopPropagation,
  Fragment,
  createElement as h,
  createElement,
  createRef
};
