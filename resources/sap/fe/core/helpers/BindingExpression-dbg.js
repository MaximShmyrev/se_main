sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  /**
   * @typedef BindingExpressionExpression
   */

  /**
   * An expression that evaluates to type T.
   *
   * @typedef Expression
   */

  /**
   * An expression that evaluates to type T, or a constant value of type T
   */

  /**
   * Check two expressions for (deep) equality.
   *
   * @param a	- expression
   * @param b - expression
   * @returns {boolean} true if the two expressions are equal
   */
  function expressionEquals(a, b) {
    if (a._type !== b._type) {
      return false;
    }

    switch (a._type) {
      case "Constant":
      case "EmbeddedBinding":
      case "EmbeddedExpressionBinding":
        return a.value === b.value;

      case "Not":
        return expressionEquals(a.operand, b.operand);

      case "Set":
        return a.operator === b.operator && a.operands.length === b.operands.length && a.operands.every(function (expression) {
          return b.operands.some(function (otherExpression) {
            return expressionEquals(expression, otherExpression);
          });
        });

      case "IfElse":
        return expressionEquals(a.condition, b.condition) && expressionEquals(a.onTrue, b.onTrue) && expressionEquals(a.onFalse, b.onFalse);

      case "Comparison":
        return a.operator == b.operator && expressionEquals(a.operand1, b.operand1) && expressionEquals(a.operand2, b.operand2);

      case "Concat":
        var aExpressions = a.expressions;
        var bExpressions = b.expressions;

        if (aExpressions.length !== bExpressions.length) {
          return false;
        }

        return aExpressions.every(function (expression, index) {
          return expressionEquals(expression, bExpressions[index]);
        });

      case "Binding":
        return a.modelName === b.modelName && a.path === b.path && a.targetEntitySet === b.targetEntitySet;

      case "DefaultBinding":
        return a.modelName === b.modelName && a.path === b.path;

      case "Formatter":
        return a.fn === b.fn && a.parameters.length === b.parameters.length && a.parameters.every(function (value, index) {
          return expressionEquals(b.parameters[index], value);
        });

      case "Function":
        var otherFunction = b;

        if (a.obj === undefined || otherFunction.obj === undefined) {
          return a.obj === otherFunction;
        }

        return a.fn === otherFunction.fn && expressionEquals(a.obj, otherFunction.obj) && a.parameters.length === otherFunction.parameters.length && a.parameters.every(function (value, index) {
          return expressionEquals(otherFunction.parameters[index], value);
        });

      case "Ref":
        return a.ref === b.ref;
    }
  }
  /**
   * Converts a nested SetExpression by inlining operands of type SetExpression with the same operator.
   *
   * @param expression - the expression to flatten
   * @returns {SetExpression} a new SetExpression with the same operator
   */


  _exports.expressionEquals = expressionEquals;

  function flattenSetExpression(expression) {
    return expression.operands.reduce(function (result, operand) {
      var candidatesForFlattening = operand._type === "Set" && operand.operator === expression.operator ? operand.operands : [operand];
      candidatesForFlattening.forEach(function (candidate) {
        if (result.operands.every(function (e) {
          return !expressionEquals(e, candidate);
        })) {
          result.operands.push(candidate);
        }
      });
      return result;
    }, {
      _type: "Set",
      operator: expression.operator,
      operands: []
    });
  }
  /**
   * Detects whether an array of boolean expressions contains an expression and its negation.
   *
   * @param expressions	- array of expressions
   * @returns {boolean}	true if the set of expressions contains an expression and its negation
   */


  function isTautology(expressions) {
    if (expressions.length < 2) {
      return false;
    }

    var i = expressions.length;

    while (i--) {
      var expression = expressions[i];
      var negatedExpression = not(expression);

      for (var j = 0; j < i; j++) {
        if (expressionEquals(expressions[j], negatedExpression)) {
          return true;
        }
      }
    }

    return false;
  }
  /**
   * Logical `and` expression.
   *
   * The expression is simplified to false if this can be decided statically (that is, if one operand is a constant
   * false or if the expression contains an operand and its negation).
   *
   * @param operands 	- expressions to connect by `and`
   * @returns {Expression<boolean>} expression evaluating to boolean
   */


  function and() {
    for (var _len = arguments.length, operands = new Array(_len), _key = 0; _key < _len; _key++) {
      operands[_key] = arguments[_key];
    }

    var expressions = flattenSetExpression({
      _type: "Set",
      operator: "&&",
      operands: operands.map(wrapPrimitive)
    }).operands;
    var isStaticFalse = false;
    var nonTrivialExpression = expressions.filter(function (expression) {
      if (isConstant(expression) && !expression.value) {
        isStaticFalse = true;
      }

      return !isConstant(expression);
    });

    if (isStaticFalse) {
      return constant(false);
    } else if (nonTrivialExpression.length === 0) {
      // Resolve the constant then
      var isValid = expressions.reduce(function (isValid, expression) {
        return isValid && isConstant(expression) && expression.value;
      }, true);
      return constant(isValid);
    } else if (nonTrivialExpression.length === 1) {
      return nonTrivialExpression[0];
    } else if (isTautology(nonTrivialExpression)) {
      return constant(false);
    } else {
      return {
        _type: "Set",
        operator: "&&",
        operands: nonTrivialExpression
      };
    }
  }
  /**
   * Logical `or` expression.
   *
   * The expression is simplified to true if this can be decided statically (that is, if one operand is a constant
   * true or if the expression contains an operand and its negation).
   *
   * @param operands 	- expressions to connect by `or`
   * @returns {Expression<boolean>} expression evaluating to boolean
   */


  _exports.and = and;

  function or() {
    for (var _len2 = arguments.length, operands = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      operands[_key2] = arguments[_key2];
    }

    var expressions = flattenSetExpression({
      _type: "Set",
      operator: "||",
      operands: operands.map(wrapPrimitive)
    }).operands;
    var isStaticTrue = false;
    var nonTrivialExpression = expressions.filter(function (expression) {
      if (isConstant(expression) && expression.value) {
        isStaticTrue = true;
      }

      return !isConstant(expression) || expression.value;
    });

    if (isStaticTrue) {
      return constant(true);
    } else if (nonTrivialExpression.length === 0) {
      // Resolve the constant then
      var isValid = expressions.reduce(function (isValid, expression) {
        return isValid && isConstant(expression) && expression.value;
      }, true);
      return constant(isValid);
    } else if (nonTrivialExpression.length === 1) {
      return nonTrivialExpression[0];
    } else if (isTautology(nonTrivialExpression)) {
      return constant(true);
    } else {
      return {
        _type: "Set",
        operator: "||",
        operands: nonTrivialExpression
      };
    }
  }
  /**
   * Logical `not` operator.
   *
   * @param operand 	- the expression to reverse
   * @returns {Expression<boolean>} the resulting expression that evaluates to boolean
   */


  _exports.or = or;

  function not(operand) {
    operand = wrapPrimitive(operand);

    if (isConstant(operand)) {
      return constant(!operand.value);
    } else if (typeof operand === "object" && operand._type === "Set" && operand.operator === "||" && operand.operands.every(function (expression) {
      return isConstant(expression) || isComparison(expression);
    })) {
      return and.apply(void 0, _toConsumableArray(operand.operands.map(function (expression) {
        return not(expression);
      })));
    } else if (typeof operand === "object" && operand._type === "Set" && operand.operator === "&&" && operand.operands.every(function (expression) {
      return isConstant(expression) || isComparison(expression);
    })) {
      return or.apply(void 0, _toConsumableArray(operand.operands.map(function (expression) {
        return not(expression);
      })));
    } else if (isComparison(operand)) {
      // Create the reverse comparison
      switch (operand.operator) {
        case "!==":
          return equal(operand.operand1, operand.operand2);

        case "<":
          return greaterOrEqual(operand.operand1, operand.operand2);

        case "<=":
          return greaterThan(operand.operand1, operand.operand2);

        case "===":
          return notEqual(operand.operand1, operand.operand2);

        case ">":
          return lessOrEqual(operand.operand1, operand.operand2);

        case ">=":
          return lessThan(operand.operand1, operand.operand2);
      }
    } else if (operand._type === "Not") {
      return operand.operand;
    } else {
      return {
        _type: "Not",
        operand: operand
      };
    }
  }
  /**
   * Creates a binding expression that will be evaluated by the corresponding model.
   *
   * @template TargetType
   * @param path the path on the model
   * @param [modelName] the name of the model
   * @param [visitedNavigationPaths] the paths from the root entitySet
   * @returns {BindingExpressionExpression<TargetType>} the default binding expression
   */


  _exports.not = not;

  function bindingExpression(path, modelName) {
    var visitedNavigationPaths = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var localPath = visitedNavigationPaths.concat();
    localPath.push(path);
    return {
      _type: "Binding",
      modelName: modelName,
      path: localPath.join("/")
    };
  }

  _exports.bindingExpression = bindingExpression;

  /**
   * Creates a constant expression based on a primitive value.
   *
   * @template T
   * @param value the constant to wrap in an expression
   * @returns {ConstantExpression<T>} the constant expression
   */
  function constant(value) {
    var constantValue;

    if (typeof value === "object" && value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        constantValue = value.map(wrapPrimitive);
      } else {
        var val = value;
        var obj = Object.keys(val).reduce(function (obj, key) {
          var value = wrapPrimitive(val[key]);

          if (value._type !== "Constant" || value.value !== undefined) {
            obj[key] = value;
          }

          return obj;
        }, {});
        constantValue = obj;
      }
    } else {
      constantValue = value;
    }

    return {
      _type: "Constant",
      value: constantValue
    };
  }

  _exports.constant = constant;

  function resolveBindingString(value, targetType) {
    if (value !== undefined && typeof value === "string" && value.startsWith("{")) {
      if (value.startsWith("{=")) {
        // Expression binding, we can just remove the outer binding things
        return {
          _type: "EmbeddedExpressionBinding",
          value: value
        };
      } else {
        return {
          _type: "EmbeddedBinding",
          value: value
        };
      }
    } else {
      switch (targetType) {
        case "boolean":
          if (typeof value === "string" && (value === "true" || value === "false")) {
            return constant(value === "true");
          }

          return constant(value);

        default:
          return constant(value);
      }
    }
  }
  /**
   * A named reference.
   *
   * @see fn
   *
   * @param ref	- Reference
   * @returns {ReferenceExpression}	the object reference binding part
   */


  _exports.resolveBindingString = resolveBindingString;

  function ref(ref) {
    return {
      _type: "Ref",
      ref: ref
    };
  }
  /**
   * Determine whether the type is an expression.
   *
   * Every object having a property named `_type` of some value is considered an expression, even if there is actually
   * no such expression type supported.
   *
   * @param something	- type to check
   * @returns {boolean}	`true` if the type is considered to be an expression
   */


  _exports.ref = ref;

  function isExpression(something) {
    return something !== null && typeof something === "object" && something._type !== undefined;
  }
  /**
   * Wrap a primitive into a constant expression if it is not already an expression.
   *
   * @template T
   * @param something 	- the object to wrap in a Constant expression
   * @returns {Expression<T>} either the original object or the wrapped one depending on the case
   */


  function wrapPrimitive(something) {
    if (isExpression(something)) {
      return something;
    }

    return constant(something);
  }
  /**
   * Check if the expression or value provided is a constant or not.
   *
   * @template T
   * @param  maybeConstant 	- the expression or primitive value to check
   * @returns {boolean} true if it is a constant
   */


  function isConstant(maybeConstant) {
    return typeof maybeConstant !== "object" || maybeConstant._type === "Constant";
  }
  /**
   * Check if the expression provided is a comparison or not.
   *
   * @template T
   * @param expression 	- the expression
   * @returns {boolean} true if the expression is a ComparisonExpression
   */


  _exports.isConstant = isConstant;

  function isComparison(expression) {
    return expression._type === "Comparison";
  }

  /**
   * Check if the passed annotation expression is a ComplexAnnotationExpression.
   *
   * @template T
   * @param  annotationExpression 	- the annotation expression to evaluate
   * @returns {boolean} true if the object is a {ComplexAnnotationExpression}
   */
  function isComplexAnnotationExpression(annotationExpression) {
    return typeof annotationExpression === "object";
  }
  /**
   * Generate the corresponding expression for a given annotation expression.
   *
   * @template T
   * @param annotationExpression 		- the source annotation expression
   * @param visitedNavigationPaths 	- the path from the root entity set
   * @param defaultValue 				- default value if the annotationExpression is undefined
   * @returns {Expression<T>} the expression equivalent to that annotation expression
   */


  function annotationExpression(annotationExpression) {
    var visitedNavigationPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var defaultValue = arguments.length > 2 ? arguments[2] : undefined;

    if (annotationExpression === undefined) {
      return wrapPrimitive(defaultValue);
    }

    if (!isComplexAnnotationExpression(annotationExpression)) {
      return constant(annotationExpression);
    } else {
      switch (annotationExpression.type) {
        case "Path":
          return bindingExpression(annotationExpression.path, undefined, visitedNavigationPaths);

        case "If":
          return annotationIfExpression(annotationExpression.If);

        case "Apply":
          return annotationApplyExpression(annotationExpression, visitedNavigationPaths);
      }
    }
  }
  /**
   * Parse the annotation condition into an expression.
   *
   * @template T
   * @param annotationValue 	- the condition or value from the annotation
   * @returns {Expression<T>} an equivalent expression
   */


  _exports.annotationExpression = annotationExpression;

  function parseAnnotationCondition(annotationValue) {
    if (annotationValue === null || typeof annotationValue !== "object") {
      return constant(annotationValue);
    } else if (annotationValue.hasOwnProperty("$Or")) {
      return or.apply(void 0, _toConsumableArray(annotationValue.$Or.map(parseAnnotationCondition)));
    } else if (annotationValue.hasOwnProperty("$And")) {
      return and.apply(void 0, _toConsumableArray(annotationValue.$And.map(parseAnnotationCondition)));
    } else if (annotationValue.hasOwnProperty("$Not")) {
      return not(parseAnnotationCondition(annotationValue.$Not[0]));
    } else if (annotationValue.hasOwnProperty("$Eq")) {
      return equal(parseAnnotationCondition(annotationValue.$Eq[0]), parseAnnotationCondition(annotationValue.$Eq[1]));
    } else if (annotationValue.hasOwnProperty("$Ne")) {
      return notEqual(parseAnnotationCondition(annotationValue.$Ne[0]), parseAnnotationCondition(annotationValue.$Ne[1]));
    } else if (annotationValue.hasOwnProperty("$Gt")) {
      return greaterThan(parseAnnotationCondition(annotationValue.$Gt[0]), parseAnnotationCondition(annotationValue.$Gt[1]));
    } else if (annotationValue.hasOwnProperty("$Ge")) {
      return greaterOrEqual(parseAnnotationCondition(annotationValue.$Ge[0]), parseAnnotationCondition(annotationValue.$Ge[1]));
    } else if (annotationValue.hasOwnProperty("$Lt")) {
      return lessThan(parseAnnotationCondition(annotationValue.$Lt[0]), parseAnnotationCondition(annotationValue.$Lt[1]));
    } else if (annotationValue.hasOwnProperty("$Le")) {
      return lessOrEqual(parseAnnotationCondition(annotationValue.$Le[0]), parseAnnotationCondition(annotationValue.$Le[1]));
    } else if (annotationValue.hasOwnProperty("$Path")) {
      return bindingExpression(annotationValue.$Path);
    } else if (annotationValue.hasOwnProperty("$Apply")) {
      return annotationExpression({
        type: "Apply",
        Function: annotationValue.$Function,
        Apply: annotationValue.$Apply
      });
    } else if (annotationValue.hasOwnProperty("$If")) {
      return annotationExpression({
        type: "If",
        If: annotationValue.$If
      });
    } else {
      return constant(false);
    }
  }
  /**
   * Process the {IfAnnotationExpressionValue} into an expression.
   *
   * @template T
   * @param annotationIfExpression 	- an If expression returning the type T
   * @returns {Expression<T>} the equivalent expression
   */


  function annotationIfExpression(annotationIfExpression) {
    return ifElse(parseAnnotationCondition(annotationIfExpression[0]), parseAnnotationCondition(annotationIfExpression[1]), parseAnnotationCondition(annotationIfExpression[2]));
  }

  _exports.annotationIfExpression = annotationIfExpression;

  function annotationApplyExpression(annotationApplyExpression, visitedNavigationPaths) {
    switch (annotationApplyExpression.Function) {
      case "odata.concat":
        return concat.apply(void 0, _toConsumableArray(annotationApplyExpression.Apply.map(function (applyParam) {
          var applyParamConverted = applyParam;

          if (applyParam.hasOwnProperty("$Path")) {
            applyParamConverted = {
              type: "Path",
              path: applyParam.$Path
            };
          } else if (applyParam.hasOwnProperty("$If")) {
            applyParamConverted = {
              type: "If",
              If: applyParam.$If
            };
          } else if (applyParam.hasOwnProperty("$Apply")) {
            applyParamConverted = {
              type: "Apply",
              Function: applyParam.$Function,
              Apply: applyParam.$Apply
            };
          }

          return annotationExpression(applyParamConverted, visitedNavigationPaths);
        })));
        break;
    }
  }
  /**
   * Generic helper for the comparison operations (equal, notEqual, ...).
   *
   * @template T
   * @param operator 		- the operator to apply
   * @param leftOperand 	- the operand on the left side of the operator
   * @param rightOperand 	- the operand on the right side of the operator
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.annotationApplyExpression = annotationApplyExpression;

  function comparison(operator, leftOperand, rightOperand) {
    var leftExpression = wrapPrimitive(leftOperand);
    var rightExpression = wrapPrimitive(rightOperand);

    if (isConstant(leftExpression) && isConstant(rightExpression)) {
      if (leftExpression.value === undefined || rightExpression.value === undefined) {
        return constant(leftExpression.value === rightExpression.value);
      }

      switch (operator) {
        case "!==":
          return constant(leftExpression.value !== rightExpression.value);

        case "<":
          return constant(leftExpression.value < rightExpression.value);

        case "<=":
          return constant(leftExpression.value <= rightExpression.value);

        case ">":
          return constant(leftExpression.value > rightExpression.value);

        case ">=":
          return constant(leftExpression.value >= rightExpression.value);

        case "===":
        default:
          return constant(leftExpression.value === rightExpression.value);
      }
    } else {
      return {
        _type: "Comparison",
        operator: operator,
        operand1: leftExpression,
        operand2: rightExpression
      };
    }
  }
  /**
   * Comparison: "equal" (===).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  function equal(leftOperand, rightOperand) {
    var leftExpression = wrapPrimitive(leftOperand);
    var rightExpression = wrapPrimitive(rightOperand);

    if (expressionEquals(leftExpression, rightExpression)) {
      return constant(true);
    }

    if (leftExpression._type === "IfElse" && expressionEquals(leftExpression.onTrue, rightExpression)) {
      return leftExpression.condition;
    } else if (leftExpression._type === "IfElse" && expressionEquals(leftExpression.onFalse, rightExpression)) {
      return not(leftExpression.condition);
    }

    return comparison("===", leftExpression, rightExpression);
  }
  /**
   * Comparison: "not equal" (!==).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.equal = equal;

  function notEqual(leftOperand, rightOperand) {
    var leftExpression = wrapPrimitive(leftOperand);
    var rightExpression = wrapPrimitive(rightOperand);

    if (expressionEquals(leftExpression, rightExpression)) {
      return constant(false);
    }

    if (leftExpression._type === "IfElse" && expressionEquals(leftExpression.onTrue, rightExpression)) {
      return not(leftExpression.condition);
    } else if (leftExpression._type === "IfElse" && expressionEquals(leftExpression.onFalse, rightExpression)) {
      return leftExpression.condition;
    }

    return comparison("!==", leftExpression, rightExpression);
  }
  /**
   * Comparison: "greater or equal" (>=).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.notEqual = notEqual;

  function greaterOrEqual(leftOperand, rightOperand) {
    return comparison(">=", leftOperand, rightOperand);
  }
  /**
   * Comparison: "greater than" (>).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.greaterOrEqual = greaterOrEqual;

  function greaterThan(leftOperand, rightOperand) {
    return comparison(">", leftOperand, rightOperand);
  }
  /**
   * Comparison: "less or equal" (<=).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.greaterThan = greaterThan;

  function lessOrEqual(leftOperand, rightOperand) {
    return comparison("<=", leftOperand, rightOperand);
  }
  /**
   * Comparison: "less than" (<).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.lessOrEqual = lessOrEqual;

  function lessThan(leftOperand, rightOperand) {
    return comparison("<", leftOperand, rightOperand);
  }
  /**
   * If-then-else expression.
   *
   * Evaluates to onTrue if the condition evaluates to true, else evaluates to onFalse.
   *
   * @template T
   * @param condition - the condition to evaluate
   * @param onTrue 	- expression result if the condition evaluates to true
   * @param onFalse 	- expression result if the condition evaluates to false
   * @returns {Expression<T>} the expression that represents this conditional check
   */


  _exports.lessThan = lessThan;

  function ifElse(condition, onTrue, onFalse) {
    var conditionExpression = wrapPrimitive(condition);
    var onTrueExpression = wrapPrimitive(onTrue);
    var onFalseExpression = wrapPrimitive(onFalse); // swap branches if the condition is a negation

    if (conditionExpression._type === "Not") {
      // ifElse(not(X), a, b) --> ifElse(X, b, a)
      var _ref = [onFalseExpression, onTrueExpression];
      onTrueExpression = _ref[0];
      onFalseExpression = _ref[1];
      conditionExpression = not(conditionExpression);
    } // inline nested if-else expressions: onTrue branch
    // ifElse(X, ifElse(X, a, b), c) ==> ifElse(X, a, c)


    if (onTrueExpression._type === "IfElse" && expressionEquals(conditionExpression, onTrueExpression.condition)) {
      onTrueExpression = onTrueExpression.onTrue;
    } // inline nested if-else expressions: onFalse branch
    // ifElse(X, a, ifElse(X, b, c)) ==> ifElse(X, a, c)


    if (onFalseExpression._type === "IfElse" && expressionEquals(conditionExpression, onFalseExpression.condition)) {
      onFalseExpression = onFalseExpression.onFalse;
    } // inline nested if-else expressions: condition


    if (conditionExpression._type === "IfElse") {
      if (isConstant(conditionExpression.onFalse) && !conditionExpression.onFalse.value && isConstant(conditionExpression.onTrue) && conditionExpression.onTrue.value) {
        // ifElse(ifElse(X, true, false), a, b) ==> ifElse(X, a, b)
        conditionExpression = conditionExpression.condition;
      } else if (isConstant(conditionExpression.onFalse) && conditionExpression.onFalse.value && isConstant(conditionExpression.onTrue) && !conditionExpression.onTrue.value) {
        // ifElse(ifElse(X, false, true), a, b) ==> ifElse(not(X), a, b)
        conditionExpression = not(conditionExpression.condition);
      } else if (isConstant(conditionExpression.onTrue) && !conditionExpression.onTrue.value && !isConstant(conditionExpression.onFalse)) {
        // ifElse(ifElse(X, false, a), b, c) ==> ifElse(and(not(X), a), b, c)
        conditionExpression = and(not(conditionExpression.condition), conditionExpression.onFalse);
      }
    } // again swap branches if needed (in case one of the optimizations above led to a negated condition)


    if (conditionExpression._type === "Not") {
      // ifElse(not(X), a, b) --> ifElse(X, b, a)
      var _ref2 = [onFalseExpression, onTrueExpression];
      onTrueExpression = _ref2[0];
      onFalseExpression = _ref2[1];
      conditionExpression = not(conditionExpression);
    } // compute expression result for constant conditions


    if (isConstant(conditionExpression)) {
      return conditionExpression.value ? onTrueExpression : onFalseExpression;
    } // compute expression result if onTrue and onFalse branches are equal


    if (expressionEquals(onTrueExpression, onFalseExpression)) {
      return onTrueExpression;
    } // If either trueExpression or falseExpression is a value equals to false the expression can be simplified
    // If(Condition) Then XXX Else False -> Condition && XXX


    if (isConstant(onFalseExpression) && onFalseExpression.value === false) {
      return and(conditionExpression, onTrueExpression);
    } // If(Condition) Then False Else XXX -> !Condition && XXX


    if (isConstant(onTrueExpression) && onTrueExpression.value === false) {
      return and(not(conditionExpression), onFalseExpression);
    }

    return {
      _type: "IfElse",
      condition: conditionExpression,
      onTrue: onTrueExpression,
      onFalse: onFalseExpression
    };
  }
  /**
   * Checks whether the current expression has a reference to the default model (undefined).
   *
   * @param expression 	- the expression to evaluate
   * @returns {boolean} true if there is a reference to the default context
   */


  _exports.ifElse = ifElse;

  function hasReferenceToDefaultContext(expression) {
    switch (expression._type) {
      case "Constant":
      case "Formatter":
        return false;

      case "Set":
        return expression.operands.some(hasReferenceToDefaultContext);

      case "Binding":
        return expression.modelName === undefined;

      case "Comparison":
        return hasReferenceToDefaultContext(expression.operand1) || hasReferenceToDefaultContext(expression.operand2);

      case "DefaultBinding":
        return true;

      case "IfElse":
        return hasReferenceToDefaultContext(expression.condition) || hasReferenceToDefaultContext(expression.onTrue) || hasReferenceToDefaultContext(expression.onFalse);

      case "Not":
        return hasReferenceToDefaultContext(expression.operand);

      default:
        return false;
    }
  }

  /**
   * Calls a formatter function to process the parameters.
   * If requireContext is set to true and no context is passed a default context will be added automatically.
   *
   * @template T
   * @template U
   * @param parameters the list of parameter that should match the type and number of the formatter function
   * @param formatterFunction the function to call
   * @param [contextEntityType] the context entity type to consider
   * @returns {Expression<T>} the corresponding expression
   */
  function formatResult(parameters, formatterFunction, contextEntityType) {
    var parameterExpressions = parameters.map(wrapPrimitive); // If there is only one parameter and it is a constant and we don't expect the context then return the constant

    if (parameterExpressions.length === 1 && isConstant(parameterExpressions[0]) && !contextEntityType) {
      return parameterExpressions[0];
    } else if (!!contextEntityType) {
      // Otherwise, if the context is required and no context is provided make sure to add the default binding
      if (!parameterExpressions.some(hasReferenceToDefaultContext)) {
        contextEntityType.keys.forEach(function (key) {
          return parameterExpressions.push(bindingExpression(key.name, ""));
        });
      }
    } // FormatterName can be of format sap.fe.core.xxx#methodName to have multiple formatter in one class


    var _formatterFunction$__ = formatterFunction.__functionName.split("#"),
        _formatterFunction$__2 = _slicedToArray(_formatterFunction$__, 2),
        formatterClass = _formatterFunction$__2[0],
        formatterName = _formatterFunction$__2[1];

    if (!!formatterName && formatterName.length > 0) {
      parameterExpressions.unshift(constant(formatterName));
    }

    return {
      _type: "Formatter",
      fn: formatterClass,
      parameters: parameterExpressions
    };
  }
  /**
   * Function call, optionally with arguments.
   *
   * @param fn			- Function name or reference to function
   * @param parameters	- Arguments
   * @param on			- Object to call the function on
   * @returns {FunctionExpression<T>} - Expression representing the function call (not the result of the function call!)
   */


  _exports.formatResult = formatResult;

  function fn(fn, parameters, on) {
    var functionName = typeof fn === "string" ? fn : fn.__functionName;
    return {
      _type: "Function",
      obj: on !== undefined ? wrapPrimitive(on) : undefined,
      fn: functionName,
      parameters: parameters.map(wrapPrimitive)
    };
  }
  /**
   * Shortcut function to determine if a binding value is null, undefined or empty.
   *
   * @param expression
   * @returns a boolean expression evaluating the fact that the current element is empty
   */


  _exports.fn = fn;

  function isEmpty(expression) {
    if (expression._type === "Concat") {
      return or.apply(void 0, _toConsumableArray(expression.expressions.map(isEmpty)));
    }

    return or(equal(expression, ""), equal(expression, undefined), equal(expression, null));
  }

  _exports.isEmpty = isEmpty;

  function concat() {
    for (var _len3 = arguments.length, inExpressions = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      inExpressions[_key3] = arguments[_key3];
    }

    var expressions = inExpressions.map(wrapPrimitive);

    if (expressions.every(isConstant)) {
      return constant(expressions.reduce(function (concatenated, value) {
        return concatenated + value.value.toString();
      }, ""));
    }

    return {
      _type: "Concat",
      expressions: expressions
    };
  }

  _exports.concat = concat;

  function transformRecursively(inExpression, expressionType, transformFunction) {
    var expression = inExpression;

    if (expressionType === expression._type) {
      expression = transformFunction(inExpression);
    } else {
      switch (expression._type) {
        case "Function":
          expression.parameters = expression.parameters.map(function (expression) {
            return transformRecursively(expression, expressionType, transformFunction);
          });
          break;

        case "Concat":
          expression.expressions = expression.expressions.map(function (expression) {
            return transformRecursively(expression, expressionType, transformFunction);
          });
          break;

        case "Formatter":
          expression.parameters = expression.parameters.map(function (expression) {
            return transformRecursively(expression, expressionType, transformFunction);
          });
          break;

        case "IfElse":
          expression.onTrue = transformRecursively(expression.onTrue, expressionType, transformFunction);
          expression.onFalse = transformRecursively(expression.onFalse, expressionType, transformFunction); // expression.condition = transformRecursively(expression.condition, expressionType, transformFunction);

          break;

        case "Not":
          // expression.operand = transformRecursively(expression.operand, expressionType, transformFunction);
          break;

        case "Set":
          // expression.operands = expression.operands.map(expression =>
          // 	transformRecursively(expression, expressionType, transformFunction)
          // );
          break;

        case "Comparison":
          // expression.operand1 = transformRecursively(expression.operand1, expressionType, transformFunction);
          // expression.operand2 = transformRecursively(expression.operand2, expressionType, transformFunction);
          break;

        case "DefaultBinding":
        case "Ref":
        case "Binding":
        case "Constant":
          // Do nothing
          break;
      }
    }

    return expression;
  }

  _exports.transformRecursively = transformRecursively;

  /**
   * Compile an expression into an expression binding.
   *
   * @template T
   * @param expression			- the expression to compile
   * @param embeddedInBinding 	- whether the expression to compile is embedded into another expression
   * @returns {BindingExpression<T>} the corresponding expression binding
   */
  function compileBinding(expression) {
    var embeddedInBinding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var expr = wrapPrimitive(expression);

    switch (expr._type) {
      case "Constant":
        if (expr.value === null) {
          return "null";
        }

        if (expr.value === undefined) {
          return "undefined";
        }

        if (typeof expr.value === "object") {
          if (Array.isArray(expr.value)) {
            var entries = expr.value.map(function (expression) {
              return compileBinding(expression, true);
            });
            return "[".concat(entries.join(", "), "]");
          } else {
            // Objects
            var o = expr.value;
            var properties = Object.keys(o).map(function (key) {
              var value = o[key];
              return "".concat(key, ": ").concat(compileBinding(value, true));
            });
            return "{".concat(properties.join(", "), "}");
          }
        }

        if (embeddedInBinding) {
          switch (typeof expr.value) {
            case "number":
            case "bigint":
            case "boolean":
              return expr.value.toString();

            case "string":
              return "'".concat(expr.value.toString(), "'");

            default:
              return "";
          }
        } else {
          return expr.value.toString();
        }

      case "Ref":
        return expr.ref || "null";

      case "Function":
        var argumentString = "".concat(expr.parameters.map(function (arg) {
          return compileBinding(arg, true);
        }).join(", "));
        return expr.obj === undefined ? "".concat(expr.fn, "(").concat(argumentString, ")") : "".concat(compileBinding(expr.obj, true), ".").concat(expr.fn, "(").concat(argumentString, ")");

      case "EmbeddedExpressionBinding":
        if (embeddedInBinding) {
          return "(".concat(expr.value.substr(2, expr.value.length - 3), ")");
        } else {
          return "".concat(expr.value);
        }

      case "EmbeddedBinding":
        if (embeddedInBinding) {
          return "%".concat(expr.value);
        } else {
          return "".concat(expr.value);
        }

      case "DefaultBinding":
      case "Binding":
        if (expr.type) {
          if (embeddedInBinding) {
            return "%{path:'".concat(expr.modelName ? "".concat(expr.modelName, ">") : "").concat(expr.path, "', type: '").concat(expr.type, "', formatOptions: ").concat(compileBinding(expr.constraints || {}), "}");
          } else {
            return "{path:'".concat(expr.modelName ? "".concat(expr.modelName, ">") : "").concat(expr.path, "', type: '").concat(expr.type, "', constraints: ").concat(compileBinding(expr.constraints || {}), "}");
          }
        } else {
          if (embeddedInBinding) {
            return "%{".concat(expr.modelName ? "".concat(expr.modelName, ">") : "").concat(expr.path, "}");
          } else {
            return "{".concat(expr.modelName ? "".concat(expr.modelName, ">") : "").concat(expr.path, "}");
          }
        }

      case "Comparison":
        var comparisonPart = "".concat(compileBinding(expr.operand1, true), " ").concat(expr.operator, " ").concat(compileBinding(expr.operand2, true));

        if (embeddedInBinding) {
          return comparisonPart;
        }

        return "{= ".concat(comparisonPart, "}");

      case "IfElse":
        if (embeddedInBinding) {
          return "(".concat(compileBinding(expr.condition, true), " ? ").concat(compileBinding(expr.onTrue, true), " : ").concat(compileBinding(expr.onFalse, true), ")");
        } else {
          return "{= ".concat(compileBinding(expr.condition, true), " ? ").concat(compileBinding(expr.onTrue, true), " : ").concat(compileBinding(expr.onFalse, true), "}");
        }

      case "Set":
        if (embeddedInBinding) {
          return "(".concat(expr.operands.map(function (expression) {
            return compileBinding(expression, true);
          }).join(" ".concat(expr.operator, " ")), ")");
        } else {
          return "{= (".concat(expr.operands.map(function (expression) {
            return compileBinding(expression, true);
          }).join(" ".concat(expr.operator, " ")), ")}");
        }

      case "Concat":
        if (embeddedInBinding) {
          return "".concat(expr.expressions.map(function (expression) {
            return compileBinding(expression, true);
          }).join(" + "));
        } else {
          return "{= ".concat(expr.expressions.map(function (expression) {
            return compileBinding(expression, true);
          }).join(" + "), " }");
        }

      case "Not":
        if (embeddedInBinding) {
          return "!".concat(compileBinding(expr.operand, true));
        } else {
          return "{= !".concat(compileBinding(expr.operand, true), "}");
        }

      case "Formatter":
        var outProperty = "";

        if (expr.parameters.length === 1) {
          outProperty += "{".concat(compilePathParameter(expr.parameters[0], true), ", formatter: '").concat(expr.fn, "'}");
        } else {
          outProperty += "{parts:[".concat(expr.parameters.map(function (param) {
            return compilePathParameter(param);
          }).join(","), "], formatter: '").concat(expr.fn, "'}");
        }

        if (embeddedInBinding) {
          outProperty = "$".concat(outProperty);
        }

        return outProperty;

      default:
        return "";
    }
  }
  /**
   * Compile the path parameter of a formatter call.
   *
   * @param expression 	- the binding part to evaluate
   * @param singlePath 	- whether there is one or multiple path to consider
   * @returns {string} the string snippet to include in the overall binding definition
   */


  _exports.compileBinding = compileBinding;

  function compilePathParameter(expression) {
    var singlePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var outValue = "";

    switch (expression._type) {
      case "Constant":
        switch (typeof expression.value) {
          case "number":
          case "bigint":
            outValue = "value: ".concat(expression.value.toString());
            break;

          case "string":
          case "boolean":
            outValue = "value: '".concat(expression.value.toString(), "'");
            break;

          default:
            outValue = "value: ''";
            break;
        }

        if (singlePath) {
          return outValue;
        }

        return "{".concat(outValue, "}");

      case "DefaultBinding":
      case "Binding":
        outValue = "path:'".concat(expression.modelName ? "".concat(expression.modelName, ">") : "").concat(expression.path, "'");

        if (expression.type) {
          outValue += ", type : '".concat(expression.type, "'");
        } else {
          outValue += ", targetType : 'any'";
        }

        if (expression.constraints && Object.keys(expression.constraints).length > 0) {
          outValue += ", constraints: ".concat(compileBinding(expression.constraints));
        }

        if (singlePath) {
          return outValue;
        }

        return "{".concat(outValue, "}");

      default:
        return "";
    }
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJpbmRpbmdFeHByZXNzaW9uLnRzIl0sIm5hbWVzIjpbImV4cHJlc3Npb25FcXVhbHMiLCJhIiwiYiIsIl90eXBlIiwidmFsdWUiLCJvcGVyYW5kIiwib3BlcmF0b3IiLCJvcGVyYW5kcyIsImxlbmd0aCIsImV2ZXJ5IiwiZXhwcmVzc2lvbiIsInNvbWUiLCJvdGhlckV4cHJlc3Npb24iLCJjb25kaXRpb24iLCJvblRydWUiLCJvbkZhbHNlIiwib3BlcmFuZDEiLCJvcGVyYW5kMiIsImFFeHByZXNzaW9ucyIsImV4cHJlc3Npb25zIiwiYkV4cHJlc3Npb25zIiwiaW5kZXgiLCJtb2RlbE5hbWUiLCJwYXRoIiwidGFyZ2V0RW50aXR5U2V0IiwiZm4iLCJwYXJhbWV0ZXJzIiwib3RoZXJGdW5jdGlvbiIsIm9iaiIsInVuZGVmaW5lZCIsInJlZiIsImZsYXR0ZW5TZXRFeHByZXNzaW9uIiwicmVkdWNlIiwicmVzdWx0IiwiY2FuZGlkYXRlc0ZvckZsYXR0ZW5pbmciLCJmb3JFYWNoIiwiY2FuZGlkYXRlIiwiZSIsInB1c2giLCJpc1RhdXRvbG9neSIsImkiLCJuZWdhdGVkRXhwcmVzc2lvbiIsIm5vdCIsImoiLCJhbmQiLCJtYXAiLCJ3cmFwUHJpbWl0aXZlIiwiaXNTdGF0aWNGYWxzZSIsIm5vblRyaXZpYWxFeHByZXNzaW9uIiwiZmlsdGVyIiwiaXNDb25zdGFudCIsImNvbnN0YW50IiwiaXNWYWxpZCIsIm9yIiwiaXNTdGF0aWNUcnVlIiwiaXNDb21wYXJpc29uIiwiZXF1YWwiLCJncmVhdGVyT3JFcXVhbCIsImdyZWF0ZXJUaGFuIiwibm90RXF1YWwiLCJsZXNzT3JFcXVhbCIsImxlc3NUaGFuIiwiYmluZGluZ0V4cHJlc3Npb24iLCJ2aXNpdGVkTmF2aWdhdGlvblBhdGhzIiwibG9jYWxQYXRoIiwiY29uY2F0Iiwiam9pbiIsImNvbnN0YW50VmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJ2YWwiLCJPYmplY3QiLCJrZXlzIiwia2V5IiwicmVzb2x2ZUJpbmRpbmdTdHJpbmciLCJ0YXJnZXRUeXBlIiwic3RhcnRzV2l0aCIsImlzRXhwcmVzc2lvbiIsInNvbWV0aGluZyIsIm1heWJlQ29uc3RhbnQiLCJpc0NvbXBsZXhBbm5vdGF0aW9uRXhwcmVzc2lvbiIsImFubm90YXRpb25FeHByZXNzaW9uIiwiZGVmYXVsdFZhbHVlIiwidHlwZSIsImFubm90YXRpb25JZkV4cHJlc3Npb24iLCJJZiIsImFubm90YXRpb25BcHBseUV4cHJlc3Npb24iLCJwYXJzZUFubm90YXRpb25Db25kaXRpb24iLCJhbm5vdGF0aW9uVmFsdWUiLCJoYXNPd25Qcm9wZXJ0eSIsIiRPciIsIiRBbmQiLCIkTm90IiwiJEVxIiwiJE5lIiwiJEd0IiwiJEdlIiwiJEx0IiwiJExlIiwiJFBhdGgiLCJGdW5jdGlvbiIsIiRGdW5jdGlvbiIsIkFwcGx5IiwiJEFwcGx5IiwiJElmIiwiaWZFbHNlIiwiYXBwbHlQYXJhbSIsImFwcGx5UGFyYW1Db252ZXJ0ZWQiLCJjb21wYXJpc29uIiwibGVmdE9wZXJhbmQiLCJyaWdodE9wZXJhbmQiLCJsZWZ0RXhwcmVzc2lvbiIsInJpZ2h0RXhwcmVzc2lvbiIsImNvbmRpdGlvbkV4cHJlc3Npb24iLCJvblRydWVFeHByZXNzaW9uIiwib25GYWxzZUV4cHJlc3Npb24iLCJoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0IiwiZm9ybWF0UmVzdWx0IiwiZm9ybWF0dGVyRnVuY3Rpb24iLCJjb250ZXh0RW50aXR5VHlwZSIsInBhcmFtZXRlckV4cHJlc3Npb25zIiwibmFtZSIsIl9fZnVuY3Rpb25OYW1lIiwic3BsaXQiLCJmb3JtYXR0ZXJDbGFzcyIsImZvcm1hdHRlck5hbWUiLCJ1bnNoaWZ0Iiwib24iLCJmdW5jdGlvbk5hbWUiLCJpc0VtcHR5IiwiaW5FeHByZXNzaW9ucyIsImNvbmNhdGVuYXRlZCIsInRvU3RyaW5nIiwidHJhbnNmb3JtUmVjdXJzaXZlbHkiLCJpbkV4cHJlc3Npb24iLCJleHByZXNzaW9uVHlwZSIsInRyYW5zZm9ybUZ1bmN0aW9uIiwiY29tcGlsZUJpbmRpbmciLCJlbWJlZGRlZEluQmluZGluZyIsImV4cHIiLCJlbnRyaWVzIiwibyIsInByb3BlcnRpZXMiLCJhcmd1bWVudFN0cmluZyIsImFyZyIsInN1YnN0ciIsImNvbnN0cmFpbnRzIiwiY29tcGFyaXNvblBhcnQiLCJvdXRQcm9wZXJ0eSIsImNvbXBpbGVQYXRoUGFyYW1ldGVyIiwicGFyYW0iLCJzaW5nbGVQYXRoIiwib3V0VmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrRUE7Ozs7QUE2Q0E7Ozs7OztBQW9CQTs7OztBQUtBOzs7Ozs7O0FBT08sV0FBU0EsZ0JBQVQsQ0FBNkJDLENBQTdCLEVBQStDQyxDQUEvQyxFQUEwRTtBQUNoRixRQUFJRCxDQUFDLENBQUNFLEtBQUYsS0FBWUQsQ0FBQyxDQUFDQyxLQUFsQixFQUF5QjtBQUN4QixhQUFPLEtBQVA7QUFDQTs7QUFFRCxZQUFRRixDQUFDLENBQUNFLEtBQVY7QUFDQyxXQUFLLFVBQUw7QUFDQSxXQUFLLGlCQUFMO0FBQ0EsV0FBSywyQkFBTDtBQUNDLGVBQU9GLENBQUMsQ0FBQ0csS0FBRixLQUFhRixDQUFELENBQTZCRSxLQUFoRDs7QUFFRCxXQUFLLEtBQUw7QUFDQyxlQUFPSixnQkFBZ0IsQ0FBQ0MsQ0FBQyxDQUFDSSxPQUFILEVBQWFILENBQUQsQ0FBcUJHLE9BQWpDLENBQXZCOztBQUVELFdBQUssS0FBTDtBQUNDLGVBQ0NKLENBQUMsQ0FBQ0ssUUFBRixLQUFnQkosQ0FBRCxDQUFxQkksUUFBcEMsSUFDQUwsQ0FBQyxDQUFDTSxRQUFGLENBQVdDLE1BQVgsS0FBdUJOLENBQUQsQ0FBcUJLLFFBQXJCLENBQThCQyxNQURwRCxJQUVBUCxDQUFDLENBQUNNLFFBQUYsQ0FBV0UsS0FBWCxDQUFpQixVQUFBQyxVQUFVO0FBQUEsaUJBQ3pCUixDQUFELENBQXFCSyxRQUFyQixDQUE4QkksSUFBOUIsQ0FBbUMsVUFBQUMsZUFBZTtBQUFBLG1CQUFJWixnQkFBZ0IsQ0FBQ1UsVUFB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LFdBQVosQ0FBcEMsQ0FBUjtBQUNBOztBQUNELFlBQUlLLFVBQUosRUFBZ0I7QUFDZixpQkFBT0MsUUFBUDtBQUNBOztBQUNELDBCQUFXQSxRQUFYOztBQUNEO0FBQ0MsZUFBTyxFQUFQO0FBckNGO0FBdUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRBbmRDb25kaXRpb25hbEV4cHJlc3Npb24sXG5cdENvbmRpdGlvbmFsQ2hlY2tPclZhbHVlLFxuXHRFbnRpdHlUeXBlLFxuXHRFcUNvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0R2VDb25kaXRpb25hbEV4cHJlc3Npb24sXG5cdEd0Q29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHRJZkFubm90YXRpb25FeHByZXNzaW9uLFxuXHRJZkFubm90YXRpb25FeHByZXNzaW9uVmFsdWUsXG5cdExlQ29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHRMdENvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0TmVDb25kaXRpb25hbEV4cHJlc3Npb24sXG5cdE5vdENvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0T3JDb25kaXRpb25hbEV4cHJlc3Npb24sXG5cdFBhdGhDb25kaXRpb25FeHByZXNzaW9uLFxuXHRQcm9wZXJ0eUFubm90YXRpb25WYWx1ZVxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7IEFwcGx5QW5ub3RhdGlvbkV4cHJlc3Npb24sIFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy90eXBlcy9FZG1cIjtcbmltcG9ydCB7IEVudGl0eVNldCB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L0NvbnZlcnRlclwiO1xuXG50eXBlIFByaW1pdGl2ZVR5cGUgPSBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgb2JqZWN0IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxudHlwZSBCYXNlRXhwcmVzc2lvbjxUPiA9IHtcblx0X3R5cGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIENvbnN0YW50RXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJDb25zdGFudFwiO1xuXHR2YWx1ZTogVDtcbn07XG5cbnR5cGUgU2V0T3BlcmF0b3IgPSBcIiYmXCIgfCBcInx8XCI7XG5leHBvcnQgdHlwZSBTZXRFeHByZXNzaW9uID0gQmFzZUV4cHJlc3Npb248Ym9vbGVhbj4gJiB7XG5cdF90eXBlOiBcIlNldFwiO1xuXHRvcGVyYXRvcjogU2V0T3BlcmF0b3I7XG5cdG9wZXJhbmRzOiBFeHByZXNzaW9uPGJvb2xlYW4+W107XG59O1xuXG5leHBvcnQgdHlwZSBOb3RFeHByZXNzaW9uID0gQmFzZUV4cHJlc3Npb248Ym9vbGVhbj4gJiB7XG5cdF90eXBlOiBcIk5vdFwiO1xuXHRvcGVyYW5kOiBFeHByZXNzaW9uPGJvb2xlYW4+O1xufTtcblxuZXhwb3J0IHR5cGUgUmVmZXJlbmNlRXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPG9iamVjdD4gJiB7XG5cdF90eXBlOiBcIlJlZlwiO1xuXHRyZWY6IHN0cmluZyB8IG51bGw7XG59O1xuXG5leHBvcnQgdHlwZSBGb3JtYXR0ZXJFeHByZXNzaW9uPFQ+ID0gQmFzZUV4cHJlc3Npb248VD4gJiB7XG5cdF90eXBlOiBcIkZvcm1hdHRlclwiO1xuXHRmbjogc3RyaW5nO1xuXHRwYXJhbWV0ZXJzOiBFeHByZXNzaW9uPGFueT5bXTtcbn07XG5cbmV4cG9ydCB0eXBlIEZ1bmN0aW9uRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJGdW5jdGlvblwiO1xuXHRvYmo/OiBFeHByZXNzaW9uPG9iamVjdD47XG5cdGZuOiBzdHJpbmc7XG5cdHBhcmFtZXRlcnM6IEV4cHJlc3Npb248YW55PltdO1xufTtcblxuZXhwb3J0IHR5cGUgQ29uY2F0RXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPHN0cmluZz4gJiB7XG5cdF90eXBlOiBcIkNvbmNhdFwiO1xuXHRleHByZXNzaW9uczogRXhwcmVzc2lvbjxzdHJpbmc+W107XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvblxuICovXG5leHBvcnQgdHlwZSBCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248VD4gPSBCYXNlRXhwcmVzc2lvbjxUPiAmIHtcblx0X3R5cGU6IFwiQmluZGluZ1wiO1xuXHRtb2RlbE5hbWU/OiBzdHJpbmc7XG5cdHBhdGg6IHN0cmluZztcblx0dGFyZ2V0RW50aXR5U2V0PzogRW50aXR5U2V0O1xuXHR0eXBlPzogc3RyaW5nO1xuXHRjb25zdHJhaW50cz86IGFueTtcbn07XG5cbmV4cG9ydCB0eXBlIERlZmF1bHRCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248VD4gPSBCYXNlRXhwcmVzc2lvbjxUPiAmIHtcblx0X3R5cGU6IFwiRGVmYXVsdEJpbmRpbmdcIjtcblx0bW9kZWxOYW1lPzogc3RyaW5nO1xuXHRwYXRoOiBzdHJpbmc7XG5cdHR5cGU/OiBzdHJpbmc7XG5cdGNvbnN0cmFpbnRzPzogb2JqZWN0O1xufTtcblxuZXhwb3J0IHR5cGUgRW1iZWRkZWRCaW5kaW5nRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJFbWJlZGRlZEJpbmRpbmdcIjtcblx0dmFsdWU6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEVtYmVkZGVkRXhwcmVzc2lvbkJpbmRpbmdFeHByZXNzaW9uPFQ+ID0gQmFzZUV4cHJlc3Npb248VD4gJiB7XG5cdF90eXBlOiBcIkVtYmVkZGVkRXhwcmVzc2lvbkJpbmRpbmdcIjtcblx0dmFsdWU6IHN0cmluZztcbn07XG5cbnR5cGUgQ29tcGFyaXNvbk9wZXJhdG9yID0gXCI9PT1cIiB8IFwiIT09XCIgfCBcIj49XCIgfCBcIj5cIiB8IFwiPD1cIiB8IFwiPFwiO1xuZXhwb3J0IHR5cGUgQ29tcGFyaXNvbkV4cHJlc3Npb24gPSBCYXNlRXhwcmVzc2lvbjxib29sZWFuPiAmIHtcblx0X3R5cGU6IFwiQ29tcGFyaXNvblwiO1xuXHRvcGVyYXRvcjogQ29tcGFyaXNvbk9wZXJhdG9yO1xuXHRvcGVyYW5kMTogRXhwcmVzc2lvbjxhbnk+O1xuXHRvcGVyYW5kMjogRXhwcmVzc2lvbjxhbnk+O1xufTtcblxuZXhwb3J0IHR5cGUgSWZFbHNlRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJJZkVsc2VcIjtcblx0Y29uZGl0aW9uOiBFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHRvblRydWU6IEV4cHJlc3Npb248VD47XG5cdG9uRmFsc2U6IEV4cHJlc3Npb248VD47XG59O1xuXG4vKipcbiAqIEFuIGV4cHJlc3Npb24gdGhhdCBldmFsdWF0ZXMgdG8gdHlwZSBULlxuICpcbiAqIEB0eXBlZGVmIEV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IHR5cGUgRXhwcmVzc2lvbjxUPiA9XG5cdHwgQ29uc3RhbnRFeHByZXNzaW9uPFQ+XG5cdHwgU2V0RXhwcmVzc2lvblxuXHR8IE5vdEV4cHJlc3Npb25cblx0fCBDb25jYXRFeHByZXNzaW9uXG5cdHwgQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPFQ+XG5cdHwgRW1iZWRkZWRCaW5kaW5nRXhwcmVzc2lvbjxUPlxuXHR8IEVtYmVkZGVkRXhwcmVzc2lvbkJpbmRpbmdFeHByZXNzaW9uPFQ+XG5cdHwgRGVmYXVsdEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPlxuXHR8IENvbXBhcmlzb25FeHByZXNzaW9uXG5cdHwgSWZFbHNlRXhwcmVzc2lvbjxUPlxuXHR8IEZvcm1hdHRlckV4cHJlc3Npb248VD5cblx0fCBSZWZlcmVuY2VFeHByZXNzaW9uXG5cdHwgRnVuY3Rpb25FeHByZXNzaW9uPFQ+O1xuXG4vKipcbiAqIEFuIGV4cHJlc3Npb24gdGhhdCBldmFsdWF0ZXMgdG8gdHlwZSBULCBvciBhIGNvbnN0YW50IHZhbHVlIG9mIHR5cGUgVFxuICovXG5leHBvcnQgdHlwZSBFeHByZXNzaW9uT3JQcmltaXRpdmU8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+ID0gRXhwcmVzc2lvbjxUPiB8IFQ7XG5cbi8qKlxuICogQ2hlY2sgdHdvIGV4cHJlc3Npb25zIGZvciAoZGVlcCkgZXF1YWxpdHkuXG4gKlxuICogQHBhcmFtIGFcdC0gZXhwcmVzc2lvblxuICogQHBhcmFtIGIgLSBleHByZXNzaW9uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgdHdvIGV4cHJlc3Npb25zIGFyZSBlcXVhbFxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhwcmVzc2lvbkVxdWFsczxUPihhOiBFeHByZXNzaW9uPFQ+LCBiOiBFeHByZXNzaW9uPFQ+KTogYm9vbGVhbiB7XG5cdGlmIChhLl90eXBlICE9PSBiLl90eXBlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0c3dpdGNoIChhLl90eXBlKSB7XG5cdFx0Y2FzZSBcIkNvbnN0YW50XCI6XG5cdFx0Y2FzZSBcIkVtYmVkZGVkQmluZGluZ1wiOlxuXHRcdGNhc2UgXCJFbWJlZGRlZEV4cHJlc3Npb25CaW5kaW5nXCI6XG5cdFx0XHRyZXR1cm4gYS52YWx1ZSA9PT0gKGIgYXMgQ29uc3RhbnRFeHByZXNzaW9uPFQ+KS52YWx1ZTtcblxuXHRcdGNhc2UgXCJOb3RcIjpcblx0XHRcdHJldHVybiBleHByZXNzaW9uRXF1YWxzKGEub3BlcmFuZCwgKGIgYXMgTm90RXhwcmVzc2lvbikub3BlcmFuZCk7XG5cblx0XHRjYXNlIFwiU2V0XCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLm9wZXJhdG9yID09PSAoYiBhcyBTZXRFeHByZXNzaW9uKS5vcGVyYXRvciAmJlxuXHRcdFx0XHRhLm9wZXJhbmRzLmxlbmd0aCA9PT0gKGIgYXMgU2V0RXhwcmVzc2lvbikub3BlcmFuZHMubGVuZ3RoICYmXG5cdFx0XHRcdGEub3BlcmFuZHMuZXZlcnkoZXhwcmVzc2lvbiA9PlxuXHRcdFx0XHRcdChiIGFzIFNldEV4cHJlc3Npb24pLm9wZXJhbmRzLnNvbWUob3RoZXJFeHByZXNzaW9uID0+IGV4cHJlc3Npb25FcXVhbHMoZXhwcmVzc2lvbiwgb3RoZXJFeHByZXNzaW9uKSlcblx0XHRcdFx0KVxuXHRcdFx0KTtcblxuXHRcdGNhc2UgXCJJZkVsc2VcIjpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGV4cHJlc3Npb25FcXVhbHMoYS5jb25kaXRpb24sIChiIGFzIElmRWxzZUV4cHJlc3Npb248VD4pLmNvbmRpdGlvbikgJiZcblx0XHRcdFx0ZXhwcmVzc2lvbkVxdWFscyhhLm9uVHJ1ZSwgKGIgYXMgSWZFbHNlRXhwcmVzc2lvbjxUPikub25UcnVlKSAmJlxuXHRcdFx0XHRleHByZXNzaW9uRXF1YWxzKGEub25GYWxzZSwgKGIgYXMgSWZFbHNlRXhwcmVzc2lvbjxUPikub25GYWxzZSlcblx0XHRcdCk7XG5cblx0XHRjYXNlIFwiQ29tcGFyaXNvblwiOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0YS5vcGVyYXRvciA9PSAoYiBhcyBDb21wYXJpc29uRXhwcmVzc2lvbikub3BlcmF0b3IgJiZcblx0XHRcdFx0ZXhwcmVzc2lvbkVxdWFscyhhLm9wZXJhbmQxLCAoYiBhcyBDb21wYXJpc29uRXhwcmVzc2lvbikub3BlcmFuZDEpICYmXG5cdFx0XHRcdGV4cHJlc3Npb25FcXVhbHMoYS5vcGVyYW5kMiwgKGIgYXMgQ29tcGFyaXNvbkV4cHJlc3Npb24pLm9wZXJhbmQyKVxuXHRcdFx0KTtcblxuXHRcdGNhc2UgXCJDb25jYXRcIjpcblx0XHRcdGNvbnN0IGFFeHByZXNzaW9ucyA9IGEuZXhwcmVzc2lvbnM7XG5cdFx0XHRjb25zdCBiRXhwcmVzc2lvbnMgPSAoYiBhcyBDb25jYXRFeHByZXNzaW9uKS5leHByZXNzaW9ucztcblx0XHRcdGlmIChhRXhwcmVzc2lvbnMubGVuZ3RoICE9PSBiRXhwcmVzc2lvbnMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhRXhwcmVzc2lvbnMuZXZlcnkoKGV4cHJlc3Npb24sIGluZGV4KSA9PiB7XG5cdFx0XHRcdHJldHVybiBleHByZXNzaW9uRXF1YWxzKGV4cHJlc3Npb24sIGJFeHByZXNzaW9uc1tpbmRleF0pO1xuXHRcdFx0fSk7XG5cblx0XHRjYXNlIFwiQmluZGluZ1wiOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0YS5tb2RlbE5hbWUgPT09IChiIGFzIEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPikubW9kZWxOYW1lICYmXG5cdFx0XHRcdGEucGF0aCA9PT0gKGIgYXMgQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPFQ+KS5wYXRoICYmXG5cdFx0XHRcdGEudGFyZ2V0RW50aXR5U2V0ID09PSAoYiBhcyBCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248VD4pLnRhcmdldEVudGl0eVNldFxuXHRcdFx0KTtcblxuXHRcdGNhc2UgXCJEZWZhdWx0QmluZGluZ1wiOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0YS5tb2RlbE5hbWUgPT09IChiIGFzIERlZmF1bHRCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248VD4pLm1vZGVsTmFtZSAmJlxuXHRcdFx0XHRhLnBhdGggPT09IChiIGFzIERlZmF1bHRCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248VD4pLnBhdGhcblx0XHRcdCk7XG5cblx0XHRjYXNlIFwiRm9ybWF0dGVyXCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLmZuID09PSAoYiBhcyBGb3JtYXR0ZXJFeHByZXNzaW9uPFQ+KS5mbiAmJlxuXHRcdFx0XHRhLnBhcmFtZXRlcnMubGVuZ3RoID09PSAoYiBhcyBGb3JtYXR0ZXJFeHByZXNzaW9uPFQ+KS5wYXJhbWV0ZXJzLmxlbmd0aCAmJlxuXHRcdFx0XHRhLnBhcmFtZXRlcnMuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gZXhwcmVzc2lvbkVxdWFscygoYiBhcyBGb3JtYXR0ZXJFeHByZXNzaW9uPFQ+KS5wYXJhbWV0ZXJzW2luZGV4XSwgdmFsdWUpKVxuXHRcdFx0KTtcblxuXHRcdGNhc2UgXCJGdW5jdGlvblwiOlxuXHRcdFx0Y29uc3Qgb3RoZXJGdW5jdGlvbiA9IGIgYXMgRnVuY3Rpb25FeHByZXNzaW9uPFQ+O1xuXHRcdFx0aWYgKGEub2JqID09PSB1bmRlZmluZWQgfHwgb3RoZXJGdW5jdGlvbi5vYmogPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4gYS5vYmogPT09IG90aGVyRnVuY3Rpb247XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGEuZm4gPT09IG90aGVyRnVuY3Rpb24uZm4gJiZcblx0XHRcdFx0ZXhwcmVzc2lvbkVxdWFscyhhLm9iaiwgb3RoZXJGdW5jdGlvbi5vYmopICYmXG5cdFx0XHRcdGEucGFyYW1ldGVycy5sZW5ndGggPT09IG90aGVyRnVuY3Rpb24ucGFyYW1ldGVycy5sZW5ndGggJiZcblx0XHRcdFx0YS5wYXJhbWV0ZXJzLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IGV4cHJlc3Npb25FcXVhbHMob3RoZXJGdW5jdGlvbi5wYXJhbWV0ZXJzW2luZGV4XSwgdmFsdWUpKVxuXHRcdFx0KTtcblxuXHRcdGNhc2UgXCJSZWZcIjpcblx0XHRcdHJldHVybiBhLnJlZiA9PT0gKGIgYXMgUmVmZXJlbmNlRXhwcmVzc2lvbikucmVmO1xuXHR9XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBuZXN0ZWQgU2V0RXhwcmVzc2lvbiBieSBpbmxpbmluZyBvcGVyYW5kcyBvZiB0eXBlIFNldEV4cHJlc3Npb24gd2l0aCB0aGUgc2FtZSBvcGVyYXRvci5cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiAtIHRoZSBleHByZXNzaW9uIHRvIGZsYXR0ZW5cbiAqIEByZXR1cm5zIHtTZXRFeHByZXNzaW9ufSBhIG5ldyBTZXRFeHByZXNzaW9uIHdpdGggdGhlIHNhbWUgb3BlcmF0b3JcbiAqL1xuZnVuY3Rpb24gZmxhdHRlblNldEV4cHJlc3Npb24oZXhwcmVzc2lvbjogU2V0RXhwcmVzc2lvbik6IFNldEV4cHJlc3Npb24ge1xuXHRyZXR1cm4gZXhwcmVzc2lvbi5vcGVyYW5kcy5yZWR1Y2UoXG5cdFx0KHJlc3VsdDogU2V0RXhwcmVzc2lvbiwgb3BlcmFuZCkgPT4ge1xuXHRcdFx0Y29uc3QgY2FuZGlkYXRlc0ZvckZsYXR0ZW5pbmcgPVxuXHRcdFx0XHRvcGVyYW5kLl90eXBlID09PSBcIlNldFwiICYmIG9wZXJhbmQub3BlcmF0b3IgPT09IGV4cHJlc3Npb24ub3BlcmF0b3IgPyBvcGVyYW5kLm9wZXJhbmRzIDogW29wZXJhbmRdO1xuXHRcdFx0Y2FuZGlkYXRlc0ZvckZsYXR0ZW5pbmcuZm9yRWFjaChjYW5kaWRhdGUgPT4ge1xuXHRcdFx0XHRpZiAocmVzdWx0Lm9wZXJhbmRzLmV2ZXJ5KGUgPT4gIWV4cHJlc3Npb25FcXVhbHMoZSwgY2FuZGlkYXRlKSkpIHtcblx0XHRcdFx0XHRyZXN1bHQub3BlcmFuZHMucHVzaChjYW5kaWRhdGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSxcblx0XHR7IF90eXBlOiBcIlNldFwiLCBvcGVyYXRvcjogZXhwcmVzc2lvbi5vcGVyYXRvciwgb3BlcmFuZHM6IFtdIH1cblx0KTtcbn1cblxuLyoqXG4gKiBEZXRlY3RzIHdoZXRoZXIgYW4gYXJyYXkgb2YgYm9vbGVhbiBleHByZXNzaW9ucyBjb250YWlucyBhbiBleHByZXNzaW9uIGFuZCBpdHMgbmVnYXRpb24uXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb25zXHQtIGFycmF5IG9mIGV4cHJlc3Npb25zXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cdHRydWUgaWYgdGhlIHNldCBvZiBleHByZXNzaW9ucyBjb250YWlucyBhbiBleHByZXNzaW9uIGFuZCBpdHMgbmVnYXRpb25cbiAqL1xuZnVuY3Rpb24gaXNUYXV0b2xvZ3koZXhwcmVzc2lvbnM6IEV4cHJlc3Npb248Ym9vbGVhbj5bXSk6IGJvb2xlYW4ge1xuXHRpZiAoZXhwcmVzc2lvbnMubGVuZ3RoIDwgMikge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGxldCBpID0gZXhwcmVzc2lvbnMubGVuZ3RoO1xuXHR3aGlsZSAoaS0tKSB7XG5cdFx0Y29uc3QgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb25zW2ldO1xuXHRcdGNvbnN0IG5lZ2F0ZWRFeHByZXNzaW9uID0gbm90KGV4cHJlc3Npb24pO1xuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XG5cdFx0XHRpZiAoZXhwcmVzc2lvbkVxdWFscyhleHByZXNzaW9uc1tqXSwgbmVnYXRlZEV4cHJlc3Npb24pKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogTG9naWNhbCBgYW5kYCBleHByZXNzaW9uLlxuICpcbiAqIFRoZSBleHByZXNzaW9uIGlzIHNpbXBsaWZpZWQgdG8gZmFsc2UgaWYgdGhpcyBjYW4gYmUgZGVjaWRlZCBzdGF0aWNhbGx5ICh0aGF0IGlzLCBpZiBvbmUgb3BlcmFuZCBpcyBhIGNvbnN0YW50XG4gKiBmYWxzZSBvciBpZiB0aGUgZXhwcmVzc2lvbiBjb250YWlucyBhbiBvcGVyYW5kIGFuZCBpdHMgbmVnYXRpb24pLlxuICpcbiAqIEBwYXJhbSBvcGVyYW5kcyBcdC0gZXhwcmVzc2lvbnMgdG8gY29ubmVjdCBieSBgYW5kYFxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IGV4cHJlc3Npb24gZXZhbHVhdGluZyB0byBib29sZWFuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbmQoLi4ub3BlcmFuZHM6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPltdKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGV4cHJlc3Npb25zID0gZmxhdHRlblNldEV4cHJlc3Npb24oe1xuXHRcdF90eXBlOiBcIlNldFwiLFxuXHRcdG9wZXJhdG9yOiBcIiYmXCIsXG5cdFx0b3BlcmFuZHM6IG9wZXJhbmRzLm1hcCh3cmFwUHJpbWl0aXZlKVxuXHR9KS5vcGVyYW5kcztcblxuXHRsZXQgaXNTdGF0aWNGYWxzZTogYm9vbGVhbiA9IGZhbHNlO1xuXHRjb25zdCBub25Ucml2aWFsRXhwcmVzc2lvbiA9IGV4cHJlc3Npb25zLmZpbHRlcihleHByZXNzaW9uID0+IHtcblx0XHRpZiAoaXNDb25zdGFudChleHByZXNzaW9uKSAmJiAhZXhwcmVzc2lvbi52YWx1ZSkge1xuXHRcdFx0aXNTdGF0aWNGYWxzZSA9IHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiAhaXNDb25zdGFudChleHByZXNzaW9uKTtcblx0fSk7XG5cdGlmIChpc1N0YXRpY0ZhbHNlKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGZhbHNlKTtcblx0fSBlbHNlIGlmIChub25Ucml2aWFsRXhwcmVzc2lvbi5sZW5ndGggPT09IDApIHtcblx0XHQvLyBSZXNvbHZlIHRoZSBjb25zdGFudCB0aGVuXG5cdFx0Y29uc3QgaXNWYWxpZCA9IGV4cHJlc3Npb25zLnJlZHVjZSgoaXNWYWxpZCwgZXhwcmVzc2lvbikgPT4ge1xuXHRcdFx0cmV0dXJuIGlzVmFsaWQgJiYgaXNDb25zdGFudChleHByZXNzaW9uKSAmJiBleHByZXNzaW9uLnZhbHVlO1xuXHRcdH0sIHRydWUpO1xuXHRcdHJldHVybiBjb25zdGFudChpc1ZhbGlkKTtcblx0fSBlbHNlIGlmIChub25Ucml2aWFsRXhwcmVzc2lvbi5sZW5ndGggPT09IDEpIHtcblx0XHRyZXR1cm4gbm9uVHJpdmlhbEV4cHJlc3Npb25bMF07XG5cdH0gZWxzZSBpZiAoaXNUYXV0b2xvZ3kobm9uVHJpdmlhbEV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGZhbHNlKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0X3R5cGU6IFwiU2V0XCIsXG5cdFx0XHRvcGVyYXRvcjogXCImJlwiLFxuXHRcdFx0b3BlcmFuZHM6IG5vblRyaXZpYWxFeHByZXNzaW9uXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIExvZ2ljYWwgYG9yYCBleHByZXNzaW9uLlxuICpcbiAqIFRoZSBleHByZXNzaW9uIGlzIHNpbXBsaWZpZWQgdG8gdHJ1ZSBpZiB0aGlzIGNhbiBiZSBkZWNpZGVkIHN0YXRpY2FsbHkgKHRoYXQgaXMsIGlmIG9uZSBvcGVyYW5kIGlzIGEgY29uc3RhbnRcbiAqIHRydWUgb3IgaWYgdGhlIGV4cHJlc3Npb24gY29udGFpbnMgYW4gb3BlcmFuZCBhbmQgaXRzIG5lZ2F0aW9uKS5cbiAqXG4gKiBAcGFyYW0gb3BlcmFuZHMgXHQtIGV4cHJlc3Npb25zIHRvIGNvbm5lY3QgYnkgYG9yYFxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IGV4cHJlc3Npb24gZXZhbHVhdGluZyB0byBib29sZWFuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvciguLi5vcGVyYW5kczogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+W10pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgZXhwcmVzc2lvbnMgPSBmbGF0dGVuU2V0RXhwcmVzc2lvbih7XG5cdFx0X3R5cGU6IFwiU2V0XCIsXG5cdFx0b3BlcmF0b3I6IFwifHxcIixcblx0XHRvcGVyYW5kczogb3BlcmFuZHMubWFwKHdyYXBQcmltaXRpdmUpXG5cdH0pLm9wZXJhbmRzO1xuXHRsZXQgaXNTdGF0aWNUcnVlOiBib29sZWFuID0gZmFsc2U7XG5cdGNvbnN0IG5vblRyaXZpYWxFeHByZXNzaW9uID0gZXhwcmVzc2lvbnMuZmlsdGVyKGV4cHJlc3Npb24gPT4ge1xuXHRcdGlmIChpc0NvbnN0YW50KGV4cHJlc3Npb24pICYmIGV4cHJlc3Npb24udmFsdWUpIHtcblx0XHRcdGlzU3RhdGljVHJ1ZSA9IHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiAhaXNDb25zdGFudChleHByZXNzaW9uKSB8fCBleHByZXNzaW9uLnZhbHVlO1xuXHR9KTtcblx0aWYgKGlzU3RhdGljVHJ1ZSkge1xuXHRcdHJldHVybiBjb25zdGFudCh0cnVlKTtcblx0fSBlbHNlIGlmIChub25Ucml2aWFsRXhwcmVzc2lvbi5sZW5ndGggPT09IDApIHtcblx0XHQvLyBSZXNvbHZlIHRoZSBjb25zdGFudCB0aGVuXG5cdFx0Y29uc3QgaXNWYWxpZCA9IGV4cHJlc3Npb25zLnJlZHVjZSgoaXNWYWxpZCwgZXhwcmVzc2lvbikgPT4ge1xuXHRcdFx0cmV0dXJuIGlzVmFsaWQgJiYgaXNDb25zdGFudChleHByZXNzaW9uKSAmJiBleHByZXNzaW9uLnZhbHVlO1xuXHRcdH0sIHRydWUpO1xuXHRcdHJldHVybiBjb25zdGFudChpc1ZhbGlkKTtcblx0fSBlbHNlIGlmIChub25Ucml2aWFsRXhwcmVzc2lvbi5sZW5ndGggPT09IDEpIHtcblx0XHRyZXR1cm4gbm9uVHJpdmlhbEV4cHJlc3Npb25bMF07XG5cdH0gZWxzZSBpZiAoaXNUYXV0b2xvZ3kobm9uVHJpdmlhbEV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KHRydWUpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiB7XG5cdFx0XHRfdHlwZTogXCJTZXRcIixcblx0XHRcdG9wZXJhdG9yOiBcInx8XCIsXG5cdFx0XHRvcGVyYW5kczogbm9uVHJpdmlhbEV4cHJlc3Npb25cblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogTG9naWNhbCBgbm90YCBvcGVyYXRvci5cbiAqXG4gKiBAcGFyYW0gb3BlcmFuZCBcdC0gdGhlIGV4cHJlc3Npb24gdG8gcmV2ZXJzZVxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IHRoZSByZXN1bHRpbmcgZXhwcmVzc2lvbiB0aGF0IGV2YWx1YXRlcyB0byBib29sZWFuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3Qob3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+KTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdG9wZXJhbmQgPSB3cmFwUHJpbWl0aXZlKG9wZXJhbmQpO1xuXHRpZiAoaXNDb25zdGFudChvcGVyYW5kKSkge1xuXHRcdHJldHVybiBjb25zdGFudCghb3BlcmFuZC52YWx1ZSk7XG5cdH0gZWxzZSBpZiAoXG5cdFx0dHlwZW9mIG9wZXJhbmQgPT09IFwib2JqZWN0XCIgJiZcblx0XHRvcGVyYW5kLl90eXBlID09PSBcIlNldFwiICYmXG5cdFx0b3BlcmFuZC5vcGVyYXRvciA9PT0gXCJ8fFwiICYmXG5cdFx0b3BlcmFuZC5vcGVyYW5kcy5ldmVyeShleHByZXNzaW9uID0+IGlzQ29uc3RhbnQoZXhwcmVzc2lvbikgfHwgaXNDb21wYXJpc29uKGV4cHJlc3Npb24pKVxuXHQpIHtcblx0XHRyZXR1cm4gYW5kKC4uLm9wZXJhbmQub3BlcmFuZHMubWFwKGV4cHJlc3Npb24gPT4gbm90KGV4cHJlc3Npb24pKSk7XG5cdH0gZWxzZSBpZiAoXG5cdFx0dHlwZW9mIG9wZXJhbmQgPT09IFwib2JqZWN0XCIgJiZcblx0XHRvcGVyYW5kLl90eXBlID09PSBcIlNldFwiICYmXG5cdFx0b3BlcmFuZC5vcGVyYXRvciA9PT0gXCImJlwiICYmXG5cdFx0b3BlcmFuZC5vcGVyYW5kcy5ldmVyeShleHByZXNzaW9uID0+IGlzQ29uc3RhbnQoZXhwcmVzc2lvbikgfHwgaXNDb21wYXJpc29uKGV4cHJlc3Npb24pKVxuXHQpIHtcblx0XHRyZXR1cm4gb3IoLi4ub3BlcmFuZC5vcGVyYW5kcy5tYXAoZXhwcmVzc2lvbiA9PiBub3QoZXhwcmVzc2lvbikpKTtcblx0fSBlbHNlIGlmIChpc0NvbXBhcmlzb24ob3BlcmFuZCkpIHtcblx0XHQvLyBDcmVhdGUgdGhlIHJldmVyc2UgY29tcGFyaXNvblxuXHRcdHN3aXRjaCAob3BlcmFuZC5vcGVyYXRvcikge1xuXHRcdFx0Y2FzZSBcIiE9PVwiOlxuXHRcdFx0XHRyZXR1cm4gZXF1YWwob3BlcmFuZC5vcGVyYW5kMSwgb3BlcmFuZC5vcGVyYW5kMik7XG5cdFx0XHRjYXNlIFwiPFwiOlxuXHRcdFx0XHRyZXR1cm4gZ3JlYXRlck9yRXF1YWwob3BlcmFuZC5vcGVyYW5kMSwgb3BlcmFuZC5vcGVyYW5kMik7XG5cdFx0XHRjYXNlIFwiPD1cIjpcblx0XHRcdFx0cmV0dXJuIGdyZWF0ZXJUaGFuKG9wZXJhbmQub3BlcmFuZDEsIG9wZXJhbmQub3BlcmFuZDIpO1xuXHRcdFx0Y2FzZSBcIj09PVwiOlxuXHRcdFx0XHRyZXR1cm4gbm90RXF1YWwob3BlcmFuZC5vcGVyYW5kMSwgb3BlcmFuZC5vcGVyYW5kMik7XG5cdFx0XHRjYXNlIFwiPlwiOlxuXHRcdFx0XHRyZXR1cm4gbGVzc09yRXF1YWwob3BlcmFuZC5vcGVyYW5kMSwgb3BlcmFuZC5vcGVyYW5kMik7XG5cdFx0XHRjYXNlIFwiPj1cIjpcblx0XHRcdFx0cmV0dXJuIGxlc3NUaGFuKG9wZXJhbmQub3BlcmFuZDEsIG9wZXJhbmQub3BlcmFuZDIpO1xuXHRcdH1cblx0fSBlbHNlIGlmIChvcGVyYW5kLl90eXBlID09PSBcIk5vdFwiKSB7XG5cdFx0cmV0dXJuIG9wZXJhbmQub3BlcmFuZDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0X3R5cGU6IFwiTm90XCIsXG5cdFx0XHRvcGVyYW5kOiBvcGVyYW5kXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBiaW5kaW5nIGV4cHJlc3Npb24gdGhhdCB3aWxsIGJlIGV2YWx1YXRlZCBieSB0aGUgY29ycmVzcG9uZGluZyBtb2RlbC5cbiAqXG4gKiBAdGVtcGxhdGUgVGFyZ2V0VHlwZVxuICogQHBhcmFtIHBhdGggdGhlIHBhdGggb24gdGhlIG1vZGVsXG4gKiBAcGFyYW0gW21vZGVsTmFtZV0gdGhlIG5hbWUgb2YgdGhlIG1vZGVsXG4gKiBAcGFyYW0gW3Zpc2l0ZWROYXZpZ2F0aW9uUGF0aHNdIHRoZSBwYXRocyBmcm9tIHRoZSByb290IGVudGl0eVNldFxuICogQHJldHVybnMge0JpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUYXJnZXRUeXBlPn0gdGhlIGRlZmF1bHQgYmluZGluZyBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kaW5nRXhwcmVzc2lvbjxUYXJnZXRUeXBlIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdHBhdGg6IHN0cmluZyxcblx0bW9kZWxOYW1lPzogc3RyaW5nLFxuXHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzOiBzdHJpbmdbXSA9IFtdXG4pOiBCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248VGFyZ2V0VHlwZT4ge1xuXHRjb25zdCBsb2NhbFBhdGggPSB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLmNvbmNhdCgpO1xuXHRsb2NhbFBhdGgucHVzaChwYXRoKTtcblx0cmV0dXJuIHtcblx0XHRfdHlwZTogXCJCaW5kaW5nXCIsXG5cdFx0bW9kZWxOYW1lOiBtb2RlbE5hbWUsXG5cdFx0cGF0aDogbG9jYWxQYXRoLmpvaW4oXCIvXCIpXG5cdH07XG59XG5cbnR5cGUgUGxhaW5FeHByZXNzaW9uT2JqZWN0ID0geyBbaW5kZXg6IHN0cmluZ106IEV4cHJlc3Npb248YW55PiB9O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjb25zdGFudCBleHByZXNzaW9uIGJhc2VkIG9uIGEgcHJpbWl0aXZlIHZhbHVlLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gdmFsdWUgdGhlIGNvbnN0YW50IHRvIHdyYXAgaW4gYW4gZXhwcmVzc2lvblxuICogQHJldHVybnMge0NvbnN0YW50RXhwcmVzc2lvbjxUPn0gdGhlIGNvbnN0YW50IGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnN0YW50PFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPih2YWx1ZTogVCk6IENvbnN0YW50RXhwcmVzc2lvbjxUPiB7XG5cdGxldCBjb25zdGFudFZhbHVlOiBUO1xuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0Y29uc3RhbnRWYWx1ZSA9IHZhbHVlLm1hcCh3cmFwUHJpbWl0aXZlKSBhcyBUO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCB2YWwgPSB2YWx1ZSBhcyB7IFtuYW1lOiBzdHJpbmddOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8YW55PiB9O1xuXHRcdFx0Y29uc3Qgb2JqID0gT2JqZWN0LmtleXModmFsKS5yZWR1Y2UoKG9iaiwga2V5KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gd3JhcFByaW1pdGl2ZSh2YWxba2V5XSk7XG5cdFx0XHRcdGlmICh2YWx1ZS5fdHlwZSAhPT0gXCJDb25zdGFudFwiIHx8IHZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRvYmpba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBvYmo7XG5cdFx0XHR9LCB7fSBhcyBQbGFpbkV4cHJlc3Npb25PYmplY3QpO1xuXG5cdFx0XHRjb25zdGFudFZhbHVlID0gb2JqIGFzIFQ7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnN0YW50VmFsdWUgPSB2YWx1ZTtcblx0fVxuXG5cdHJldHVybiB7IF90eXBlOiBcIkNvbnN0YW50XCIsIHZhbHVlOiBjb25zdGFudFZhbHVlIH07XG59XG5cbnR5cGUgRXZhbHVhdGlvblR5cGUgPSBcImJvb2xlYW5cIjtcbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlQmluZGluZ1N0cmluZzxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdHZhbHVlOiBzdHJpbmcgfCBib29sZWFuIHwgbnVtYmVyLFxuXHR0YXJnZXRUeXBlPzogRXZhbHVhdGlvblR5cGVcbik6IENvbnN0YW50RXhwcmVzc2lvbjxUPiB8IEVtYmVkZGVkQmluZGluZ0V4cHJlc3Npb248VD4gfCBFbWJlZGRlZEV4cHJlc3Npb25CaW5kaW5nRXhwcmVzc2lvbjxUPiB7XG5cdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZS5zdGFydHNXaXRoKFwie1wiKSkge1xuXHRcdGlmICh2YWx1ZS5zdGFydHNXaXRoKFwiez1cIikpIHtcblx0XHRcdC8vIEV4cHJlc3Npb24gYmluZGluZywgd2UgY2FuIGp1c3QgcmVtb3ZlIHRoZSBvdXRlciBiaW5kaW5nIHRoaW5nc1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0X3R5cGU6IFwiRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ1wiLFxuXHRcdFx0XHR2YWx1ZTogdmFsdWVcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdF90eXBlOiBcIkVtYmVkZGVkQmluZGluZ1wiLFxuXHRcdFx0XHR2YWx1ZTogdmFsdWVcblx0XHRcdH07XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHN3aXRjaCAodGFyZ2V0VHlwZSkge1xuXHRcdFx0Y2FzZSBcImJvb2xlYW5cIjpcblx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiAodmFsdWUgPT09IFwidHJ1ZVwiIHx8IHZhbHVlID09PSBcImZhbHNlXCIpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KHZhbHVlID09PSBcInRydWVcIikgYXMgQ29uc3RhbnRFeHByZXNzaW9uPFQ+O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBjb25zdGFudCh2YWx1ZSkgYXMgQ29uc3RhbnRFeHByZXNzaW9uPFQ+O1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KHZhbHVlKSBhcyBDb25zdGFudEV4cHJlc3Npb248VD47XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQSBuYW1lZCByZWZlcmVuY2UuXG4gKlxuICogQHNlZSBmblxuICpcbiAqIEBwYXJhbSByZWZcdC0gUmVmZXJlbmNlXG4gKiBAcmV0dXJucyB7UmVmZXJlbmNlRXhwcmVzc2lvbn1cdHRoZSBvYmplY3QgcmVmZXJlbmNlIGJpbmRpbmcgcGFydFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVmKHJlZjogc3RyaW5nIHwgbnVsbCk6IFJlZmVyZW5jZUV4cHJlc3Npb24ge1xuXHRyZXR1cm4geyBfdHlwZTogXCJSZWZcIiwgcmVmIH07XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHR5cGUgaXMgYW4gZXhwcmVzc2lvbi5cbiAqXG4gKiBFdmVyeSBvYmplY3QgaGF2aW5nIGEgcHJvcGVydHkgbmFtZWQgYF90eXBlYCBvZiBzb21lIHZhbHVlIGlzIGNvbnNpZGVyZWQgYW4gZXhwcmVzc2lvbiwgZXZlbiBpZiB0aGVyZSBpcyBhY3R1YWxseVxuICogbm8gc3VjaCBleHByZXNzaW9uIHR5cGUgc3VwcG9ydGVkLlxuICpcbiAqIEBwYXJhbSBzb21ldGhpbmdcdC0gdHlwZSB0byBjaGVja1xuICogQHJldHVybnMge2Jvb2xlYW59XHRgdHJ1ZWAgaWYgdGhlIHR5cGUgaXMgY29uc2lkZXJlZCB0byBiZSBhbiBleHByZXNzaW9uXG4gKi9cbmZ1bmN0aW9uIGlzRXhwcmVzc2lvbjxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oc29tZXRoaW5nOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4pOiBzb21ldGhpbmcgaXMgRXhwcmVzc2lvbjxUPiB7XG5cdHJldHVybiBzb21ldGhpbmcgIT09IG51bGwgJiYgdHlwZW9mIHNvbWV0aGluZyA9PT0gXCJvYmplY3RcIiAmJiAoc29tZXRoaW5nIGFzIEJhc2VFeHByZXNzaW9uPFQ+KS5fdHlwZSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFdyYXAgYSBwcmltaXRpdmUgaW50byBhIGNvbnN0YW50IGV4cHJlc3Npb24gaWYgaXQgaXMgbm90IGFscmVhZHkgYW4gZXhwcmVzc2lvbi5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHNvbWV0aGluZyBcdC0gdGhlIG9iamVjdCB0byB3cmFwIGluIGEgQ29uc3RhbnQgZXhwcmVzc2lvblxuICogQHJldHVybnMge0V4cHJlc3Npb248VD59IGVpdGhlciB0aGUgb3JpZ2luYWwgb2JqZWN0IG9yIHRoZSB3cmFwcGVkIG9uZSBkZXBlbmRpbmcgb24gdGhlIGNhc2VcbiAqL1xuZnVuY3Rpb24gd3JhcFByaW1pdGl2ZTxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oc29tZXRoaW5nOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4pOiBFeHByZXNzaW9uPFQ+IHtcblx0aWYgKGlzRXhwcmVzc2lvbihzb21ldGhpbmcpKSB7XG5cdFx0cmV0dXJuIHNvbWV0aGluZztcblx0fVxuXG5cdHJldHVybiBjb25zdGFudChzb21ldGhpbmcpO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBleHByZXNzaW9uIG9yIHZhbHVlIHByb3ZpZGVkIGlzIGEgY29uc3RhbnQgb3Igbm90LlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gIG1heWJlQ29uc3RhbnQgXHQtIHRoZSBleHByZXNzaW9uIG9yIHByaW1pdGl2ZSB2YWx1ZSB0byBjaGVja1xuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXQgaXMgYSBjb25zdGFudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDb25zdGFudDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4obWF5YmVDb25zdGFudDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+KTogbWF5YmVDb25zdGFudCBpcyBDb25zdGFudEV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gdHlwZW9mIG1heWJlQ29uc3RhbnQgIT09IFwib2JqZWN0XCIgfHwgKG1heWJlQ29uc3RhbnQgYXMgQmFzZUV4cHJlc3Npb248VD4pLl90eXBlID09PSBcIkNvbnN0YW50XCI7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGV4cHJlc3Npb24gcHJvdmlkZWQgaXMgYSBjb21wYXJpc29uIG9yIG5vdC5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIGV4cHJlc3Npb24gXHQtIHRoZSBleHByZXNzaW9uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZXhwcmVzc2lvbiBpcyBhIENvbXBhcmlzb25FeHByZXNzaW9uXG4gKi9cbmZ1bmN0aW9uIGlzQ29tcGFyaXNvbjxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oZXhwcmVzc2lvbjogRXhwcmVzc2lvbjxUPik6IGV4cHJlc3Npb24gaXMgQ29tcGFyaXNvbkV4cHJlc3Npb24ge1xuXHRyZXR1cm4gZXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJDb21wYXJpc29uXCI7XG59XG5cbnR5cGUgQ29tcGxleEFubm90YXRpb25FeHByZXNzaW9uPFA+ID0gUGF0aEFubm90YXRpb25FeHByZXNzaW9uPFA+IHwgQXBwbHlBbm5vdGF0aW9uRXhwcmVzc2lvbjxQPiB8IElmQW5ub3RhdGlvbkV4cHJlc3Npb248UD47XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHBhc3NlZCBhbm5vdGF0aW9uIGV4cHJlc3Npb24gaXMgYSBDb21wbGV4QW5ub3RhdGlvbkV4cHJlc3Npb24uXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSAgYW5ub3RhdGlvbkV4cHJlc3Npb24gXHQtIHRoZSBhbm5vdGF0aW9uIGV4cHJlc3Npb24gdG8gZXZhbHVhdGVcbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBvYmplY3QgaXMgYSB7Q29tcGxleEFubm90YXRpb25FeHByZXNzaW9ufVxuICovXG5mdW5jdGlvbiBpc0NvbXBsZXhBbm5vdGF0aW9uRXhwcmVzc2lvbjxUPihcblx0YW5ub3RhdGlvbkV4cHJlc3Npb246IFByb3BlcnR5QW5ub3RhdGlvblZhbHVlPFQ+XG4pOiBhbm5vdGF0aW9uRXhwcmVzc2lvbiBpcyBDb21wbGV4QW5ub3RhdGlvbkV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gdHlwZW9mIGFubm90YXRpb25FeHByZXNzaW9uID09PSBcIm9iamVjdFwiO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIHRoZSBjb3JyZXNwb25kaW5nIGV4cHJlc3Npb24gZm9yIGEgZ2l2ZW4gYW5ub3RhdGlvbiBleHByZXNzaW9uLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gYW5ub3RhdGlvbkV4cHJlc3Npb24gXHRcdC0gdGhlIHNvdXJjZSBhbm5vdGF0aW9uIGV4cHJlc3Npb25cbiAqIEBwYXJhbSB2aXNpdGVkTmF2aWdhdGlvblBhdGhzIFx0LSB0aGUgcGF0aCBmcm9tIHRoZSByb290IGVudGl0eSBzZXRcbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWUgXHRcdFx0XHQtIGRlZmF1bHQgdmFsdWUgaWYgdGhlIGFubm90YXRpb25FeHByZXNzaW9uIGlzIHVuZGVmaW5lZFxuICogQHJldHVybnMge0V4cHJlc3Npb248VD59IHRoZSBleHByZXNzaW9uIGVxdWl2YWxlbnQgdG8gdGhhdCBhbm5vdGF0aW9uIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRpb25FeHByZXNzaW9uPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0YW5ub3RhdGlvbkV4cHJlc3Npb246IFByb3BlcnR5QW5ub3RhdGlvblZhbHVlPFQ+LFxuXHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzOiBzdHJpbmdbXSA9IFtdLFxuXHRkZWZhdWx0VmFsdWU/OiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEV4cHJlc3Npb248VD4ge1xuXHRpZiAoYW5ub3RhdGlvbkV4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiB3cmFwUHJpbWl0aXZlKGRlZmF1bHRWYWx1ZSBhcyBUKTtcblx0fVxuXHRpZiAoIWlzQ29tcGxleEFubm90YXRpb25FeHByZXNzaW9uKGFubm90YXRpb25FeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBjb25zdGFudChhbm5vdGF0aW9uRXhwcmVzc2lvbik7XG5cdH0gZWxzZSB7XG5cdFx0c3dpdGNoIChhbm5vdGF0aW9uRXhwcmVzc2lvbi50eXBlKSB7XG5cdFx0XHRjYXNlIFwiUGF0aFwiOlxuXHRcdFx0XHRyZXR1cm4gYmluZGluZ0V4cHJlc3Npb24oYW5ub3RhdGlvbkV4cHJlc3Npb24ucGF0aCwgdW5kZWZpbmVkLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzKTtcblx0XHRcdGNhc2UgXCJJZlwiOlxuXHRcdFx0XHRyZXR1cm4gYW5ub3RhdGlvbklmRXhwcmVzc2lvbihhbm5vdGF0aW9uRXhwcmVzc2lvbi5JZik7XG5cdFx0XHRjYXNlIFwiQXBwbHlcIjpcblx0XHRcdFx0cmV0dXJuIGFubm90YXRpb25BcHBseUV4cHJlc3Npb24oXG5cdFx0XHRcdFx0YW5ub3RhdGlvbkV4cHJlc3Npb24gYXMgQXBwbHlBbm5vdGF0aW9uRXhwcmVzc2lvbjxzdHJpbmc+LFxuXHRcdFx0XHRcdHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHNcblx0XHRcdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBhbm5vdGF0aW9uIGNvbmRpdGlvbiBpbnRvIGFuIGV4cHJlc3Npb24uXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBhbm5vdGF0aW9uVmFsdWUgXHQtIHRoZSBjb25kaXRpb24gb3IgdmFsdWUgZnJvbSB0aGUgYW5ub3RhdGlvblxuICogQHJldHVybnMge0V4cHJlc3Npb248VD59IGFuIGVxdWl2YWxlbnQgZXhwcmVzc2lvblxuICovXG5mdW5jdGlvbiBwYXJzZUFubm90YXRpb25Db25kaXRpb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KGFubm90YXRpb25WYWx1ZTogQ29uZGl0aW9uYWxDaGVja09yVmFsdWUpOiBFeHByZXNzaW9uPFQ+IHtcblx0aWYgKGFubm90YXRpb25WYWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgYW5ub3RhdGlvblZhbHVlICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGFubm90YXRpb25WYWx1ZSBhcyBUKTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkT3JcIikpIHtcblx0XHRyZXR1cm4gb3IoXG5cdFx0XHQuLi4oKChhbm5vdGF0aW9uVmFsdWUgYXMgT3JDb25kaXRpb25hbEV4cHJlc3Npb24pLiRPci5tYXAocGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKSBhcyB1bmtub3duKSBhcyBFeHByZXNzaW9uPGJvb2xlYW4+W10pXG5cdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRBbmRcIikpIHtcblx0XHRyZXR1cm4gYW5kKFxuXHRcdFx0Li4uKCgoYW5ub3RhdGlvblZhbHVlIGFzIEFuZENvbmRpdGlvbmFsRXhwcmVzc2lvbikuJEFuZC5tYXAocGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKSBhcyB1bmtub3duKSBhcyBFeHByZXNzaW9uPGJvb2xlYW4+W10pXG5cdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiROb3RcIikpIHtcblx0XHRyZXR1cm4gbm90KHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIE5vdENvbmRpdGlvbmFsRXhwcmVzc2lvbikuJE5vdFswXSkpIGFzIEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJEVxXCIpKSB7XG5cdFx0cmV0dXJuIGVxdWFsKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgRXFDb25kaXRpb25hbEV4cHJlc3Npb24pLiRFcVswXSksXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBFcUNvbmRpdGlvbmFsRXhwcmVzc2lvbikuJEVxWzFdKVxuXHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkTmVcIikpIHtcblx0XHRyZXR1cm4gbm90RXF1YWwoXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBOZUNvbmRpdGlvbmFsRXhwcmVzc2lvbikuJE5lWzBdKSxcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIE5lQ29uZGl0aW9uYWxFeHByZXNzaW9uKS4kTmVbMV0pXG5cdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRHdFwiKSkge1xuXHRcdHJldHVybiBncmVhdGVyVGhhbihcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIEd0Q29uZGl0aW9uYWxFeHByZXNzaW9uKS4kR3RbMF0pLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgR3RDb25kaXRpb25hbEV4cHJlc3Npb24pLiRHdFsxXSlcblx0XHQpIGFzIEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJEdlXCIpKSB7XG5cdFx0cmV0dXJuIGdyZWF0ZXJPckVxdWFsKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgR2VDb25kaXRpb25hbEV4cHJlc3Npb24pLiRHZVswXSksXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBHZUNvbmRpdGlvbmFsRXhwcmVzc2lvbikuJEdlWzFdKVxuXHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkTHRcIikpIHtcblx0XHRyZXR1cm4gbGVzc1RoYW4oXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBMdENvbmRpdGlvbmFsRXhwcmVzc2lvbikuJEx0WzBdKSxcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIEx0Q29uZGl0aW9uYWxFeHByZXNzaW9uKS4kTHRbMV0pXG5cdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRMZVwiKSkge1xuXHRcdHJldHVybiBsZXNzT3JFcXVhbChcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIExlQ29uZGl0aW9uYWxFeHByZXNzaW9uKS4kTGVbMF0pLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgTGVDb25kaXRpb25hbEV4cHJlc3Npb24pLiRMZVsxXSlcblx0XHQpIGFzIEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJFBhdGhcIikpIHtcblx0XHRyZXR1cm4gYmluZGluZ0V4cHJlc3Npb24oKGFubm90YXRpb25WYWx1ZSBhcyBQYXRoQ29uZGl0aW9uRXhwcmVzc2lvbjxUPikuJFBhdGgpO1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRBcHBseVwiKSkge1xuXHRcdHJldHVybiBhbm5vdGF0aW9uRXhwcmVzc2lvbih7XG5cdFx0XHR0eXBlOiBcIkFwcGx5XCIsXG5cdFx0XHRGdW5jdGlvbjogKGFubm90YXRpb25WYWx1ZSBhcyBhbnkpLiRGdW5jdGlvbixcblx0XHRcdEFwcGx5OiAoYW5ub3RhdGlvblZhbHVlIGFzIGFueSkuJEFwcGx5XG5cdFx0fSBhcyBUKTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkSWZcIikpIHtcblx0XHRyZXR1cm4gYW5ub3RhdGlvbkV4cHJlc3Npb24oe1xuXHRcdFx0dHlwZTogXCJJZlwiLFxuXHRcdFx0SWY6IChhbm5vdGF0aW9uVmFsdWUgYXMgYW55KS4kSWZcblx0XHR9IGFzIFQpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBjb25zdGFudChmYWxzZSBhcyBUKTtcblx0fVxufVxuXG4vKipcbiAqIFByb2Nlc3MgdGhlIHtJZkFubm90YXRpb25FeHByZXNzaW9uVmFsdWV9IGludG8gYW4gZXhwcmVzc2lvbi5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIGFubm90YXRpb25JZkV4cHJlc3Npb24gXHQtIGFuIElmIGV4cHJlc3Npb24gcmV0dXJuaW5nIHRoZSB0eXBlIFRcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPFQ+fSB0aGUgZXF1aXZhbGVudCBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbm5vdGF0aW9uSWZFeHByZXNzaW9uPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihhbm5vdGF0aW9uSWZFeHByZXNzaW9uOiBJZkFubm90YXRpb25FeHByZXNzaW9uVmFsdWU8VD4pOiBFeHByZXNzaW9uPFQ+IHtcblx0cmV0dXJuIGlmRWxzZShcblx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvbklmRXhwcmVzc2lvblswXSksXG5cdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25JZkV4cHJlc3Npb25bMV0gYXMgYW55KSxcblx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvbklmRXhwcmVzc2lvblsyXSBhcyBhbnkpXG5cdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbm5vdGF0aW9uQXBwbHlFeHByZXNzaW9uKFxuXHRhbm5vdGF0aW9uQXBwbHlFeHByZXNzaW9uOiBBcHBseUFubm90YXRpb25FeHByZXNzaW9uPHN0cmluZz4sXG5cdHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHM6IHN0cmluZ1tdXG4pOiBFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRzd2l0Y2ggKGFubm90YXRpb25BcHBseUV4cHJlc3Npb24uRnVuY3Rpb24pIHtcblx0XHRjYXNlIFwib2RhdGEuY29uY2F0XCI6XG5cdFx0XHRyZXR1cm4gY29uY2F0KFxuXHRcdFx0XHQuLi5hbm5vdGF0aW9uQXBwbHlFeHByZXNzaW9uLkFwcGx5Lm1hcCgoYXBwbHlQYXJhbTogYW55KSA9PiB7XG5cdFx0XHRcdFx0bGV0IGFwcGx5UGFyYW1Db252ZXJ0ZWQgPSBhcHBseVBhcmFtO1xuXHRcdFx0XHRcdGlmIChhcHBseVBhcmFtLmhhc093blByb3BlcnR5KFwiJFBhdGhcIikpIHtcblx0XHRcdFx0XHRcdGFwcGx5UGFyYW1Db252ZXJ0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiUGF0aFwiLFxuXHRcdFx0XHRcdFx0XHRwYXRoOiBhcHBseVBhcmFtLiRQYXRoXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYXBwbHlQYXJhbS5oYXNPd25Qcm9wZXJ0eShcIiRJZlwiKSkge1xuXHRcdFx0XHRcdFx0YXBwbHlQYXJhbUNvbnZlcnRlZCA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJJZlwiLFxuXHRcdFx0XHRcdFx0XHRJZjogYXBwbHlQYXJhbS4kSWZcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChhcHBseVBhcmFtLmhhc093blByb3BlcnR5KFwiJEFwcGx5XCIpKSB7XG5cdFx0XHRcdFx0XHRhcHBseVBhcmFtQ29udmVydGVkID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIkFwcGx5XCIsXG5cdFx0XHRcdFx0XHRcdEZ1bmN0aW9uOiBhcHBseVBhcmFtLiRGdW5jdGlvbixcblx0XHRcdFx0XHRcdFx0QXBwbHk6IGFwcGx5UGFyYW0uJEFwcGx5XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gYW5ub3RhdGlvbkV4cHJlc3Npb24oYXBwbHlQYXJhbUNvbnZlcnRlZCwgdmlzaXRlZE5hdmlnYXRpb25QYXRocyk7XG5cdFx0XHRcdH0pXG5cdFx0XHQpO1xuXHRcdFx0YnJlYWs7XG5cdH1cbn1cblxuLyoqXG4gKiBHZW5lcmljIGhlbHBlciBmb3IgdGhlIGNvbXBhcmlzb24gb3BlcmF0aW9ucyAoZXF1YWwsIG5vdEVxdWFsLCAuLi4pLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gb3BlcmF0b3IgXHRcdC0gdGhlIG9wZXJhdG9yIHRvIGFwcGx5XG4gKiBAcGFyYW0gbGVmdE9wZXJhbmQgXHQtIHRoZSBvcGVyYW5kIG9uIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIG9wZXJhdG9yXG4gKiBAcGFyYW0gcmlnaHRPcGVyYW5kIFx0LSB0aGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgb3BlcmF0b3JcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBhbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY29tcGFyaXNvblxuICovXG5mdW5jdGlvbiBjb21wYXJpc29uPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0b3BlcmF0b3I6IENvbXBhcmlzb25PcGVyYXRvcixcblx0bGVmdE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPixcblx0cmlnaHRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRjb25zdCBsZWZ0RXhwcmVzc2lvbiA9IHdyYXBQcmltaXRpdmUobGVmdE9wZXJhbmQpO1xuXHRjb25zdCByaWdodEV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKHJpZ2h0T3BlcmFuZCk7XG5cblx0aWYgKGlzQ29uc3RhbnQobGVmdEV4cHJlc3Npb24pICYmIGlzQ29uc3RhbnQocmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdGlmIChsZWZ0RXhwcmVzc2lvbi52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHJpZ2h0RXhwcmVzc2lvbi52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gY29uc3RhbnQobGVmdEV4cHJlc3Npb24udmFsdWUgPT09IHJpZ2h0RXhwcmVzc2lvbi52YWx1ZSk7XG5cdFx0fVxuXG5cdFx0c3dpdGNoIChvcGVyYXRvcikge1xuXHRcdFx0Y2FzZSBcIiE9PVwiOlxuXHRcdFx0XHRyZXR1cm4gY29uc3RhbnQobGVmdEV4cHJlc3Npb24udmFsdWUgIT09IHJpZ2h0RXhwcmVzc2lvbi52YWx1ZSk7XG5cdFx0XHRjYXNlIFwiPFwiOlxuXHRcdFx0XHRyZXR1cm4gY29uc3RhbnQobGVmdEV4cHJlc3Npb24udmFsdWUgPCByaWdodEV4cHJlc3Npb24udmFsdWUpO1xuXHRcdFx0Y2FzZSBcIjw9XCI6XG5cdFx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSA8PSByaWdodEV4cHJlc3Npb24udmFsdWUpO1xuXHRcdFx0Y2FzZSBcIj5cIjpcblx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KGxlZnRFeHByZXNzaW9uLnZhbHVlID4gcmlnaHRFeHByZXNzaW9uLnZhbHVlKTtcblx0XHRcdGNhc2UgXCI+PVwiOlxuXHRcdFx0XHRyZXR1cm4gY29uc3RhbnQobGVmdEV4cHJlc3Npb24udmFsdWUgPj0gcmlnaHRFeHByZXNzaW9uLnZhbHVlKTtcblx0XHRcdGNhc2UgXCI9PT1cIjpcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSA9PT0gcmlnaHRFeHByZXNzaW9uLnZhbHVlKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdF90eXBlOiBcIkNvbXBhcmlzb25cIixcblx0XHRcdG9wZXJhdG9yOiBvcGVyYXRvcixcblx0XHRcdG9wZXJhbmQxOiBsZWZ0RXhwcmVzc2lvbixcblx0XHRcdG9wZXJhbmQyOiByaWdodEV4cHJlc3Npb25cblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogQ29tcGFyaXNvbjogXCJlcXVhbFwiICg9PT0pLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gbGVmdE9wZXJhbmQgXHQtIHRoZSBvcGVyYW5kIG9uIHRoZSBsZWZ0IHNpZGVcbiAqIEBwYXJhbSByaWdodE9wZXJhbmQgXHQtIHRoZSBvcGVyYW5kIG9uIHRoZSByaWdodCBzaWRlIG9mIHRoZSBjb21wYXJpc29uXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxib29sZWFuPn0gYW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGNvbXBhcmlzb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0bGVmdE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPixcblx0cmlnaHRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRjb25zdCBsZWZ0RXhwcmVzc2lvbiA9IHdyYXBQcmltaXRpdmUobGVmdE9wZXJhbmQpO1xuXHRjb25zdCByaWdodEV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKHJpZ2h0T3BlcmFuZCk7XG5cblx0aWYgKGV4cHJlc3Npb25FcXVhbHMobGVmdEV4cHJlc3Npb24sIHJpZ2h0RXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG5cdH1cblxuXHRpZiAobGVmdEV4cHJlc3Npb24uX3R5cGUgPT09IFwiSWZFbHNlXCIgJiYgZXhwcmVzc2lvbkVxdWFscyhsZWZ0RXhwcmVzc2lvbi5vblRydWUsIHJpZ2h0RXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gbGVmdEV4cHJlc3Npb24uY29uZGl0aW9uO1xuXHR9IGVsc2UgaWYgKGxlZnRFeHByZXNzaW9uLl90eXBlID09PSBcIklmRWxzZVwiICYmIGV4cHJlc3Npb25FcXVhbHMobGVmdEV4cHJlc3Npb24ub25GYWxzZSwgcmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBub3QobGVmdEV4cHJlc3Npb24uY29uZGl0aW9uKTtcblx0fVxuXG5cdHJldHVybiBjb21wYXJpc29uKFwiPT09XCIsIGxlZnRFeHByZXNzaW9uLCByaWdodEV4cHJlc3Npb24pO1xufVxuXG4vKipcbiAqIENvbXBhcmlzb246IFwibm90IGVxdWFsXCIgKCE9PSkuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBsZWZ0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGNvbXBhcmlzb25cbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBhbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY29tcGFyaXNvblxuICovXG5leHBvcnQgZnVuY3Rpb24gbm90RXF1YWw8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRsZWZ0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRyaWdodE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGxlZnRFeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShsZWZ0T3BlcmFuZCk7XG5cdGNvbnN0IHJpZ2h0RXhwcmVzc2lvbiA9IHdyYXBQcmltaXRpdmUocmlnaHRPcGVyYW5kKTtcblxuXHRpZiAoZXhwcmVzc2lvbkVxdWFscyhsZWZ0RXhwcmVzc2lvbiwgcmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBjb25zdGFudChmYWxzZSk7XG5cdH1cblxuXHRpZiAobGVmdEV4cHJlc3Npb24uX3R5cGUgPT09IFwiSWZFbHNlXCIgJiYgZXhwcmVzc2lvbkVxdWFscyhsZWZ0RXhwcmVzc2lvbi5vblRydWUsIHJpZ2h0RXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gbm90KGxlZnRFeHByZXNzaW9uLmNvbmRpdGlvbik7XG5cdH0gZWxzZSBpZiAobGVmdEV4cHJlc3Npb24uX3R5cGUgPT09IFwiSWZFbHNlXCIgJiYgZXhwcmVzc2lvbkVxdWFscyhsZWZ0RXhwcmVzc2lvbi5vbkZhbHNlLCByaWdodEV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIGxlZnRFeHByZXNzaW9uLmNvbmRpdGlvbjtcblx0fVxuXG5cdHJldHVybiBjb21wYXJpc29uKFwiIT09XCIsIGxlZnRFeHByZXNzaW9uLCByaWdodEV4cHJlc3Npb24pO1xufVxuXG4vKipcbiAqIENvbXBhcmlzb246IFwiZ3JlYXRlciBvciBlcXVhbFwiICg+PSkuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBsZWZ0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGNvbXBhcmlzb25cbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBhbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY29tcGFyaXNvblxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JlYXRlck9yRXF1YWw8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRsZWZ0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRyaWdodE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjb21wYXJpc29uKFwiPj1cIiwgbGVmdE9wZXJhbmQsIHJpZ2h0T3BlcmFuZCk7XG59XG5cbi8qKlxuICogQ29tcGFyaXNvbjogXCJncmVhdGVyIHRoYW5cIiAoPikuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBsZWZ0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGNvbXBhcmlzb25cbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBhbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY29tcGFyaXNvblxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JlYXRlclRoYW48VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRsZWZ0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRyaWdodE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjb21wYXJpc29uKFwiPlwiLCBsZWZ0T3BlcmFuZCwgcmlnaHRPcGVyYW5kKTtcbn1cblxuLyoqXG4gKiBDb21wYXJpc29uOiBcImxlc3Mgb3IgZXF1YWxcIiAoPD0pLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gbGVmdE9wZXJhbmQgXHQtIHRoZSBvcGVyYW5kIG9uIHRoZSBsZWZ0IHNpZGVcbiAqIEBwYXJhbSByaWdodE9wZXJhbmQgXHQtIHRoZSBvcGVyYW5kIG9uIHRoZSByaWdodCBzaWRlIG9mIHRoZSBjb21wYXJpc29uXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxib29sZWFuPn0gYW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGNvbXBhcmlzb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxlc3NPckVxdWFsPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0bGVmdE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPixcblx0cmlnaHRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gY29tcGFyaXNvbihcIjw9XCIsIGxlZnRPcGVyYW5kLCByaWdodE9wZXJhbmQpO1xufVxuXG4vKipcbiAqIENvbXBhcmlzb246IFwibGVzcyB0aGFuXCIgKDwpLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gbGVmdE9wZXJhbmQgXHQtIHRoZSBvcGVyYW5kIG9uIHRoZSBsZWZ0IHNpZGVcbiAqIEBwYXJhbSByaWdodE9wZXJhbmQgXHQtIHRoZSBvcGVyYW5kIG9uIHRoZSByaWdodCBzaWRlIG9mIHRoZSBjb21wYXJpc29uXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxib29sZWFuPn0gYW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGNvbXBhcmlzb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxlc3NUaGFuPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0bGVmdE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPixcblx0cmlnaHRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gY29tcGFyaXNvbihcIjxcIiwgbGVmdE9wZXJhbmQsIHJpZ2h0T3BlcmFuZCk7XG59XG5cbi8qKlxuICogSWYtdGhlbi1lbHNlIGV4cHJlc3Npb24uXG4gKlxuICogRXZhbHVhdGVzIHRvIG9uVHJ1ZSBpZiB0aGUgY29uZGl0aW9uIGV2YWx1YXRlcyB0byB0cnVlLCBlbHNlIGV2YWx1YXRlcyB0byBvbkZhbHNlLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gY29uZGl0aW9uIC0gdGhlIGNvbmRpdGlvbiB0byBldmFsdWF0ZVxuICogQHBhcmFtIG9uVHJ1ZSBcdC0gZXhwcmVzc2lvbiByZXN1bHQgaWYgdGhlIGNvbmRpdGlvbiBldmFsdWF0ZXMgdG8gdHJ1ZVxuICogQHBhcmFtIG9uRmFsc2UgXHQtIGV4cHJlc3Npb24gcmVzdWx0IGlmIHRoZSBjb25kaXRpb24gZXZhbHVhdGVzIHRvIGZhbHNlXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxUPn0gdGhlIGV4cHJlc3Npb24gdGhhdCByZXByZXNlbnRzIHRoaXMgY29uZGl0aW9uYWwgY2hlY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlmRWxzZTxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGNvbmRpdGlvbjogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+LFxuXHRvblRydWU6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPixcblx0b25GYWxzZTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+XG4pOiBFeHByZXNzaW9uPFQ+IHtcblx0bGV0IGNvbmRpdGlvbkV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKGNvbmRpdGlvbik7XG5cdGxldCBvblRydWVFeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShvblRydWUpO1xuXHRsZXQgb25GYWxzZUV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKG9uRmFsc2UpO1xuXG5cdC8vIHN3YXAgYnJhbmNoZXMgaWYgdGhlIGNvbmRpdGlvbiBpcyBhIG5lZ2F0aW9uXG5cdGlmIChjb25kaXRpb25FeHByZXNzaW9uLl90eXBlID09PSBcIk5vdFwiKSB7XG5cdFx0Ly8gaWZFbHNlKG5vdChYKSwgYSwgYikgLS0+IGlmRWxzZShYLCBiLCBhKVxuXHRcdFtvblRydWVFeHByZXNzaW9uLCBvbkZhbHNlRXhwcmVzc2lvbl0gPSBbb25GYWxzZUV4cHJlc3Npb24sIG9uVHJ1ZUV4cHJlc3Npb25dO1xuXHRcdGNvbmRpdGlvbkV4cHJlc3Npb24gPSBub3QoY29uZGl0aW9uRXhwcmVzc2lvbik7XG5cdH1cblxuXHQvLyBpbmxpbmUgbmVzdGVkIGlmLWVsc2UgZXhwcmVzc2lvbnM6IG9uVHJ1ZSBicmFuY2hcblx0Ly8gaWZFbHNlKFgsIGlmRWxzZShYLCBhLCBiKSwgYykgPT0+IGlmRWxzZShYLCBhLCBjKVxuXHRpZiAob25UcnVlRXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIiAmJiBleHByZXNzaW9uRXF1YWxzKGNvbmRpdGlvbkV4cHJlc3Npb24sIG9uVHJ1ZUV4cHJlc3Npb24uY29uZGl0aW9uKSkge1xuXHRcdG9uVHJ1ZUV4cHJlc3Npb24gPSBvblRydWVFeHByZXNzaW9uLm9uVHJ1ZTtcblx0fVxuXG5cdC8vIGlubGluZSBuZXN0ZWQgaWYtZWxzZSBleHByZXNzaW9uczogb25GYWxzZSBicmFuY2hcblx0Ly8gaWZFbHNlKFgsIGEsIGlmRWxzZShYLCBiLCBjKSkgPT0+IGlmRWxzZShYLCBhLCBjKVxuXHRpZiAob25GYWxzZUV4cHJlc3Npb24uX3R5cGUgPT09IFwiSWZFbHNlXCIgJiYgZXhwcmVzc2lvbkVxdWFscyhjb25kaXRpb25FeHByZXNzaW9uLCBvbkZhbHNlRXhwcmVzc2lvbi5jb25kaXRpb24pKSB7XG5cdFx0b25GYWxzZUV4cHJlc3Npb24gPSBvbkZhbHNlRXhwcmVzc2lvbi5vbkZhbHNlO1xuXHR9XG5cblx0Ly8gaW5saW5lIG5lc3RlZCBpZi1lbHNlIGV4cHJlc3Npb25zOiBjb25kaXRpb25cblx0aWYgKGNvbmRpdGlvbkV4cHJlc3Npb24uX3R5cGUgPT09IFwiSWZFbHNlXCIpIHtcblx0XHRpZiAoXG5cdFx0XHRpc0NvbnN0YW50KGNvbmRpdGlvbkV4cHJlc3Npb24ub25GYWxzZSkgJiZcblx0XHRcdCFjb25kaXRpb25FeHByZXNzaW9uLm9uRmFsc2UudmFsdWUgJiZcblx0XHRcdGlzQ29uc3RhbnQoY29uZGl0aW9uRXhwcmVzc2lvbi5vblRydWUpICYmXG5cdFx0XHRjb25kaXRpb25FeHByZXNzaW9uLm9uVHJ1ZS52YWx1ZVxuXHRcdCkge1xuXHRcdFx0Ly8gaWZFbHNlKGlmRWxzZShYLCB0cnVlLCBmYWxzZSksIGEsIGIpID09PiBpZkVsc2UoWCwgYSwgYilcblx0XHRcdGNvbmRpdGlvbkV4cHJlc3Npb24gPSBjb25kaXRpb25FeHByZXNzaW9uLmNvbmRpdGlvbjtcblx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0aXNDb25zdGFudChjb25kaXRpb25FeHByZXNzaW9uLm9uRmFsc2UpICYmXG5cdFx0XHRjb25kaXRpb25FeHByZXNzaW9uLm9uRmFsc2UudmFsdWUgJiZcblx0XHRcdGlzQ29uc3RhbnQoY29uZGl0aW9uRXhwcmVzc2lvbi5vblRydWUpICYmXG5cdFx0XHQhY29uZGl0aW9uRXhwcmVzc2lvbi5vblRydWUudmFsdWVcblx0XHQpIHtcblx0XHRcdC8vIGlmRWxzZShpZkVsc2UoWCwgZmFsc2UsIHRydWUpLCBhLCBiKSA9PT4gaWZFbHNlKG5vdChYKSwgYSwgYilcblx0XHRcdGNvbmRpdGlvbkV4cHJlc3Npb24gPSBub3QoY29uZGl0aW9uRXhwcmVzc2lvbi5jb25kaXRpb24pO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRpc0NvbnN0YW50KGNvbmRpdGlvbkV4cHJlc3Npb24ub25UcnVlKSAmJlxuXHRcdFx0IWNvbmRpdGlvbkV4cHJlc3Npb24ub25UcnVlLnZhbHVlICYmXG5cdFx0XHQhaXNDb25zdGFudChjb25kaXRpb25FeHByZXNzaW9uLm9uRmFsc2UpXG5cdFx0KSB7XG5cdFx0XHQvLyBpZkVsc2UoaWZFbHNlKFgsIGZhbHNlLCBhKSwgYiwgYykgPT0+IGlmRWxzZShhbmQobm90KFgpLCBhKSwgYiwgYylcblx0XHRcdGNvbmRpdGlvbkV4cHJlc3Npb24gPSBhbmQobm90KGNvbmRpdGlvbkV4cHJlc3Npb24uY29uZGl0aW9uKSwgY29uZGl0aW9uRXhwcmVzc2lvbi5vbkZhbHNlKTtcblx0XHR9XG5cdH1cblxuXHQvLyBhZ2FpbiBzd2FwIGJyYW5jaGVzIGlmIG5lZWRlZCAoaW4gY2FzZSBvbmUgb2YgdGhlIG9wdGltaXphdGlvbnMgYWJvdmUgbGVkIHRvIGEgbmVnYXRlZCBjb25kaXRpb24pXG5cdGlmIChjb25kaXRpb25FeHByZXNzaW9uLl90eXBlID09PSBcIk5vdFwiKSB7XG5cdFx0Ly8gaWZFbHNlKG5vdChYKSwgYSwgYikgLS0+IGlmRWxzZShYLCBiLCBhKVxuXHRcdFtvblRydWVFeHByZXNzaW9uLCBvbkZhbHNlRXhwcmVzc2lvbl0gPSBbb25GYWxzZUV4cHJlc3Npb24sIG9uVHJ1ZUV4cHJlc3Npb25dO1xuXHRcdGNvbmRpdGlvbkV4cHJlc3Npb24gPSBub3QoY29uZGl0aW9uRXhwcmVzc2lvbik7XG5cdH1cblxuXHQvLyBjb21wdXRlIGV4cHJlc3Npb24gcmVzdWx0IGZvciBjb25zdGFudCBjb25kaXRpb25zXG5cdGlmIChpc0NvbnN0YW50KGNvbmRpdGlvbkV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIGNvbmRpdGlvbkV4cHJlc3Npb24udmFsdWUgPyBvblRydWVFeHByZXNzaW9uIDogb25GYWxzZUV4cHJlc3Npb247XG5cdH1cblxuXHQvLyBjb21wdXRlIGV4cHJlc3Npb24gcmVzdWx0IGlmIG9uVHJ1ZSBhbmQgb25GYWxzZSBicmFuY2hlcyBhcmUgZXF1YWxcblx0aWYgKGV4cHJlc3Npb25FcXVhbHMob25UcnVlRXhwcmVzc2lvbiwgb25GYWxzZUV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIG9uVHJ1ZUV4cHJlc3Npb247XG5cdH1cblxuXHQvLyBJZiBlaXRoZXIgdHJ1ZUV4cHJlc3Npb24gb3IgZmFsc2VFeHByZXNzaW9uIGlzIGEgdmFsdWUgZXF1YWxzIHRvIGZhbHNlIHRoZSBleHByZXNzaW9uIGNhbiBiZSBzaW1wbGlmaWVkXG5cdC8vIElmKENvbmRpdGlvbikgVGhlbiBYWFggRWxzZSBGYWxzZSAtPiBDb25kaXRpb24gJiYgWFhYXG5cdGlmIChpc0NvbnN0YW50KG9uRmFsc2VFeHByZXNzaW9uKSAmJiBvbkZhbHNlRXhwcmVzc2lvbi52YWx1ZSA9PT0gZmFsc2UpIHtcblx0XHRyZXR1cm4gYW5kKGNvbmRpdGlvbkV4cHJlc3Npb24sIG9uVHJ1ZUV4cHJlc3Npb24gYXMgRXhwcmVzc2lvbjxib29sZWFuPikgYXMgRXhwcmVzc2lvbjxUPjtcblx0fVxuXHQvLyBJZihDb25kaXRpb24pIFRoZW4gRmFsc2UgRWxzZSBYWFggLT4gIUNvbmRpdGlvbiAmJiBYWFhcblx0aWYgKGlzQ29uc3RhbnQob25UcnVlRXhwcmVzc2lvbikgJiYgb25UcnVlRXhwcmVzc2lvbi52YWx1ZSA9PT0gZmFsc2UpIHtcblx0XHRyZXR1cm4gYW5kKG5vdChjb25kaXRpb25FeHByZXNzaW9uKSwgb25GYWxzZUV4cHJlc3Npb24gYXMgRXhwcmVzc2lvbjxib29sZWFuPikgYXMgRXhwcmVzc2lvbjxUPjtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0X3R5cGU6IFwiSWZFbHNlXCIsXG5cdFx0Y29uZGl0aW9uOiBjb25kaXRpb25FeHByZXNzaW9uLFxuXHRcdG9uVHJ1ZTogb25UcnVlRXhwcmVzc2lvbixcblx0XHRvbkZhbHNlOiBvbkZhbHNlRXhwcmVzc2lvblxuXHR9O1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IGV4cHJlc3Npb24gaGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBkZWZhdWx0IG1vZGVsICh1bmRlZmluZWQpLlxuICpcbiAqIEBwYXJhbSBleHByZXNzaW9uIFx0LSB0aGUgZXhwcmVzc2lvbiB0byBldmFsdWF0ZVxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIGRlZmF1bHQgY29udGV4dFxuICovXG5mdW5jdGlvbiBoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb246IEV4cHJlc3Npb248YW55Pik6IGJvb2xlYW4ge1xuXHRzd2l0Y2ggKGV4cHJlc3Npb24uX3R5cGUpIHtcblx0XHRjYXNlIFwiQ29uc3RhbnRcIjpcblx0XHRjYXNlIFwiRm9ybWF0dGVyXCI6XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0Y2FzZSBcIlNldFwiOlxuXHRcdFx0cmV0dXJuIGV4cHJlc3Npb24ub3BlcmFuZHMuc29tZShoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KTtcblx0XHRjYXNlIFwiQmluZGluZ1wiOlxuXHRcdFx0cmV0dXJuIGV4cHJlc3Npb24ubW9kZWxOYW1lID09PSB1bmRlZmluZWQ7XG5cdFx0Y2FzZSBcIkNvbXBhcmlzb25cIjpcblx0XHRcdHJldHVybiBoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb24ub3BlcmFuZDEpIHx8IGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbi5vcGVyYW5kMik7XG5cdFx0Y2FzZSBcIkRlZmF1bHRCaW5kaW5nXCI6XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRjYXNlIFwiSWZFbHNlXCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb24uY29uZGl0aW9uKSB8fFxuXHRcdFx0XHRoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb24ub25UcnVlKSB8fFxuXHRcdFx0XHRoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb24ub25GYWxzZSlcblx0XHRcdCk7XG5cdFx0Y2FzZSBcIk5vdFwiOlxuXHRcdFx0cmV0dXJuIGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbi5vcGVyYW5kKTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbnR5cGUgRm48VD4gPSAoKC4uLnBhcmFtczogYW55KSA9PiBUKSAmIHtcblx0X19mdW5jdGlvbk5hbWU6IHN0cmluZztcbn07XG5cbi8qKlxuICogQHR5cGVkZWYgV3JhcHBlZFR1cGxlXG4gKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbi8vIEB0cy1pZ25vcmVcbnR5cGUgV3JhcHBlZFR1cGxlPFQ+ID0geyBbSyBpbiBrZXlvZiBUXTogV3JhcHBlZFR1cGxlPFRbS10+IHwgRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFRbS10+IH07XG5cbi8vIFNvLCB0aGlzIHdvcmtzIGJ1dCBJIGNhbm5vdCBnZXQgaXQgdG8gY29tcGlsZSA6RCwgYnV0IGl0IHN0aWxsIGRvZXMgd2hhdCBpcyBleHBlY3RlZC4uLlxuXG4vKipcbiAqIEEgZnVuY3Rpb24gcmVmZXJlbmNlIG9yIGEgZnVuY3Rpb24gbmFtZS5cbiAqL1xudHlwZSBGdW5jdGlvbk9yTmFtZTxUPiA9IEZuPFQ+IHwgc3RyaW5nO1xuXG4vKipcbiAqIEZ1bmN0aW9uIHBhcmFtZXRlcnMsIGVpdGhlciBkZXJpdmVkIGZyb20gdGhlIGZ1bmN0aW9uIG9yIGFuIHVudHlwZWQgYXJyYXkuXG4gKi9cbnR5cGUgRnVuY3Rpb25QYXJhbWV0ZXJzPFQsIEYgZXh0ZW5kcyBGdW5jdGlvbk9yTmFtZTxUPj4gPSBGIGV4dGVuZHMgRm48VD4gPyBQYXJhbWV0ZXJzPEY+IDogYW55W107XG5cbi8qKlxuICogQ2FsbHMgYSBmb3JtYXR0ZXIgZnVuY3Rpb24gdG8gcHJvY2VzcyB0aGUgcGFyYW1ldGVycy5cbiAqIElmIHJlcXVpcmVDb250ZXh0IGlzIHNldCB0byB0cnVlIGFuZCBubyBjb250ZXh0IGlzIHBhc3NlZCBhIGRlZmF1bHQgY29udGV4dCB3aWxsIGJlIGFkZGVkIGF1dG9tYXRpY2FsbHkuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEB0ZW1wbGF0ZSBVXG4gKiBAcGFyYW0gcGFyYW1ldGVycyB0aGUgbGlzdCBvZiBwYXJhbWV0ZXIgdGhhdCBzaG91bGQgbWF0Y2ggdGhlIHR5cGUgYW5kIG51bWJlciBvZiB0aGUgZm9ybWF0dGVyIGZ1bmN0aW9uXG4gKiBAcGFyYW0gZm9ybWF0dGVyRnVuY3Rpb24gdGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSBbY29udGV4dEVudGl0eVR5cGVdIHRoZSBjb250ZXh0IGVudGl0eSB0eXBlIHRvIGNvbnNpZGVyXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxUPn0gdGhlIGNvcnJlc3BvbmRpbmcgZXhwcmVzc2lvblxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0UmVzdWx0PFQsIFUgZXh0ZW5kcyBGbjxUPj4oXG5cdHBhcmFtZXRlcnM6IFdyYXBwZWRUdXBsZTxQYXJhbWV0ZXJzPFU+Pixcblx0Zm9ybWF0dGVyRnVuY3Rpb246IFUsXG5cdGNvbnRleHRFbnRpdHlUeXBlPzogRW50aXR5VHlwZVxuKTogRXhwcmVzc2lvbjxUPiB7XG5cdGNvbnN0IHBhcmFtZXRlckV4cHJlc3Npb25zID0gKHBhcmFtZXRlcnMgYXMgYW55W10pLm1hcCh3cmFwUHJpbWl0aXZlKTtcblxuXHQvLyBJZiB0aGVyZSBpcyBvbmx5IG9uZSBwYXJhbWV0ZXIgYW5kIGl0IGlzIGEgY29uc3RhbnQgYW5kIHdlIGRvbid0IGV4cGVjdCB0aGUgY29udGV4dCB0aGVuIHJldHVybiB0aGUgY29uc3RhbnRcblx0aWYgKHBhcmFtZXRlckV4cHJlc3Npb25zLmxlbmd0aCA9PT0gMSAmJiBpc0NvbnN0YW50KHBhcmFtZXRlckV4cHJlc3Npb25zWzBdKSAmJiAhY29udGV4dEVudGl0eVR5cGUpIHtcblx0XHRyZXR1cm4gcGFyYW1ldGVyRXhwcmVzc2lvbnNbMF07XG5cdH0gZWxzZSBpZiAoISFjb250ZXh0RW50aXR5VHlwZSkge1xuXHRcdC8vIE90aGVyd2lzZSwgaWYgdGhlIGNvbnRleHQgaXMgcmVxdWlyZWQgYW5kIG5vIGNvbnRleHQgaXMgcHJvdmlkZWQgbWFrZSBzdXJlIHRvIGFkZCB0aGUgZGVmYXVsdCBiaW5kaW5nXG5cdFx0aWYgKCFwYXJhbWV0ZXJFeHByZXNzaW9ucy5zb21lKGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQpKSB7XG5cdFx0XHRjb250ZXh0RW50aXR5VHlwZS5rZXlzLmZvckVhY2goa2V5ID0+IHBhcmFtZXRlckV4cHJlc3Npb25zLnB1c2goYmluZGluZ0V4cHJlc3Npb24oa2V5Lm5hbWUsIFwiXCIpKSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gRm9ybWF0dGVyTmFtZSBjYW4gYmUgb2YgZm9ybWF0IHNhcC5mZS5jb3JlLnh4eCNtZXRob2ROYW1lIHRvIGhhdmUgbXVsdGlwbGUgZm9ybWF0dGVyIGluIG9uZSBjbGFzc1xuXHRjb25zdCBbZm9ybWF0dGVyQ2xhc3MsIGZvcm1hdHRlck5hbWVdID0gZm9ybWF0dGVyRnVuY3Rpb24uX19mdW5jdGlvbk5hbWUuc3BsaXQoXCIjXCIpO1xuXG5cdGlmICghIWZvcm1hdHRlck5hbWUgJiYgZm9ybWF0dGVyTmFtZS5sZW5ndGggPiAwKSB7XG5cdFx0cGFyYW1ldGVyRXhwcmVzc2lvbnMudW5zaGlmdChjb25zdGFudChmb3JtYXR0ZXJOYW1lKSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdF90eXBlOiBcIkZvcm1hdHRlclwiLFxuXHRcdGZuOiBmb3JtYXR0ZXJDbGFzcyxcblx0XHRwYXJhbWV0ZXJzOiBwYXJhbWV0ZXJFeHByZXNzaW9uc1xuXHR9O1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIGNhbGwsIG9wdGlvbmFsbHkgd2l0aCBhcmd1bWVudHMuXG4gKlxuICogQHBhcmFtIGZuXHRcdFx0LSBGdW5jdGlvbiBuYW1lIG9yIHJlZmVyZW5jZSB0byBmdW5jdGlvblxuICogQHBhcmFtIHBhcmFtZXRlcnNcdC0gQXJndW1lbnRzXG4gKiBAcGFyYW0gb25cdFx0XHQtIE9iamVjdCB0byBjYWxsIHRoZSBmdW5jdGlvbiBvblxuICogQHJldHVybnMge0Z1bmN0aW9uRXhwcmVzc2lvbjxUPn0gLSBFeHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgZnVuY3Rpb24gY2FsbCAobm90IHRoZSByZXN1bHQgb2YgdGhlIGZ1bmN0aW9uIGNhbGwhKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZm48VCwgVSBleHRlbmRzIEZ1bmN0aW9uT3JOYW1lPFQ+Pihcblx0Zm46IFUsXG5cdHBhcmFtZXRlcnM6IFdyYXBwZWRUdXBsZTxGdW5jdGlvblBhcmFtZXRlcnM8VCwgVT4+LFxuXHRvbj86IEV4cHJlc3Npb25PclByaW1pdGl2ZTxvYmplY3Q+XG4pOiBGdW5jdGlvbkV4cHJlc3Npb248VD4ge1xuXHRjb25zdCBmdW5jdGlvbk5hbWUgPSB0eXBlb2YgZm4gPT09IFwic3RyaW5nXCIgPyBmbiA6IChmbiBhcyBGbjxUPikuX19mdW5jdGlvbk5hbWU7XG5cdHJldHVybiB7XG5cdFx0X3R5cGU6IFwiRnVuY3Rpb25cIixcblx0XHRvYmo6IG9uICE9PSB1bmRlZmluZWQgPyB3cmFwUHJpbWl0aXZlKG9uKSA6IHVuZGVmaW5lZCxcblx0XHRmbjogZnVuY3Rpb25OYW1lLFxuXHRcdHBhcmFtZXRlcnM6IChwYXJhbWV0ZXJzIGFzIGFueVtdKS5tYXAod3JhcFByaW1pdGl2ZSlcblx0fTtcbn1cblxuLyoqXG4gKiBTaG9ydGN1dCBmdW5jdGlvbiB0byBkZXRlcm1pbmUgaWYgYSBiaW5kaW5nIHZhbHVlIGlzIG51bGwsIHVuZGVmaW5lZCBvciBlbXB0eS5cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvblxuICogQHJldHVybnMgYSBib29sZWFuIGV4cHJlc3Npb24gZXZhbHVhdGluZyB0aGUgZmFjdCB0aGF0IHRoZSBjdXJyZW50IGVsZW1lbnQgaXMgZW1wdHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRW1wdHkoZXhwcmVzc2lvbjogRXhwcmVzc2lvbjxzdHJpbmc+KTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGlmIChleHByZXNzaW9uLl90eXBlID09PSBcIkNvbmNhdFwiKSB7XG5cdFx0cmV0dXJuIG9yKC4uLmV4cHJlc3Npb24uZXhwcmVzc2lvbnMubWFwKGlzRW1wdHkpKTtcblx0fVxuXHRyZXR1cm4gb3IoZXF1YWwoZXhwcmVzc2lvbiwgXCJcIiksIGVxdWFsKGV4cHJlc3Npb24sIHVuZGVmaW5lZCksIGVxdWFsKGV4cHJlc3Npb24sIG51bGwpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdCguLi5pbkV4cHJlc3Npb25zOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8c3RyaW5nPltdKTogRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0Y29uc3QgZXhwcmVzc2lvbnMgPSBpbkV4cHJlc3Npb25zLm1hcCh3cmFwUHJpbWl0aXZlKTtcblx0aWYgKGV4cHJlc3Npb25zLmV2ZXJ5KGlzQ29uc3RhbnQpKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KFxuXHRcdFx0ZXhwcmVzc2lvbnMucmVkdWNlKChjb25jYXRlbmF0ZWQ6IHN0cmluZywgdmFsdWUpID0+IHtcblx0XHRcdFx0cmV0dXJuIGNvbmNhdGVuYXRlZCArICh2YWx1ZSBhcyBDb25zdGFudEV4cHJlc3Npb248YW55PikudmFsdWUudG9TdHJpbmcoKTtcblx0XHRcdH0sIFwiXCIpXG5cdFx0KTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdF90eXBlOiBcIkNvbmNhdFwiLFxuXHRcdGV4cHJlc3Npb25zOiBleHByZXNzaW9uc1xuXHR9O1xufVxuXG5leHBvcnQgdHlwZSBUcmFuc2Zvcm1GdW5jdGlvbiA9IDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZSB8IHVua25vd24+KGV4cHJlc3Npb25QYXJ0OiBhbnkpID0+IEV4cHJlc3Npb248VD47XG5leHBvcnQgdHlwZSBFeHByZXNzaW9uVHlwZSA9IFBpY2s8RXhwcmVzc2lvbjxhbnk+LCBcIl90eXBlXCI+W1wiX3R5cGVcIl07XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm1SZWN1cnNpdmVseTxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZSB8IHVua25vd24+KFxuXHRpbkV4cHJlc3Npb246IEV4cHJlc3Npb248VD4sXG5cdGV4cHJlc3Npb25UeXBlOiBFeHByZXNzaW9uVHlwZSxcblx0dHJhbnNmb3JtRnVuY3Rpb246IFRyYW5zZm9ybUZ1bmN0aW9uXG4pOiBFeHByZXNzaW9uPFQ+IHtcblx0bGV0IGV4cHJlc3Npb24gPSBpbkV4cHJlc3Npb247XG5cdGlmIChleHByZXNzaW9uVHlwZSA9PT0gZXhwcmVzc2lvbi5fdHlwZSkge1xuXHRcdGV4cHJlc3Npb24gPSB0cmFuc2Zvcm1GdW5jdGlvbihpbkV4cHJlc3Npb24pO1xuXHR9IGVsc2Uge1xuXHRcdHN3aXRjaCAoZXhwcmVzc2lvbi5fdHlwZSkge1xuXHRcdFx0Y2FzZSBcIkZ1bmN0aW9uXCI6XG5cdFx0XHRcdGV4cHJlc3Npb24ucGFyYW1ldGVycyA9IGV4cHJlc3Npb24ucGFyYW1ldGVycy5tYXAoZXhwcmVzc2lvbiA9PlxuXHRcdFx0XHRcdHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24sIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbilcblx0XHRcdFx0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiQ29uY2F0XCI6XG5cdFx0XHRcdGV4cHJlc3Npb24uZXhwcmVzc2lvbnMgPSBleHByZXNzaW9uLmV4cHJlc3Npb25zLm1hcChleHByZXNzaW9uID0+XG5cdFx0XHRcdFx0dHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbiwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uKVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcIkZvcm1hdHRlclwiOlxuXHRcdFx0XHRleHByZXNzaW9uLnBhcmFtZXRlcnMgPSBleHByZXNzaW9uLnBhcmFtZXRlcnMubWFwKGV4cHJlc3Npb24gPT5cblx0XHRcdFx0XHR0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24pXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiSWZFbHNlXCI6XG5cdFx0XHRcdGV4cHJlc3Npb24ub25UcnVlID0gdHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbi5vblRydWUsIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbik7XG5cdFx0XHRcdGV4cHJlc3Npb24ub25GYWxzZSA9IHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24ub25GYWxzZSwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uKTtcblx0XHRcdFx0Ly8gZXhwcmVzc2lvbi5jb25kaXRpb24gPSB0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLmNvbmRpdGlvbiwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiTm90XCI6XG5cdFx0XHRcdC8vIGV4cHJlc3Npb24ub3BlcmFuZCA9IHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24ub3BlcmFuZCwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiU2V0XCI6XG5cdFx0XHRcdC8vIGV4cHJlc3Npb24ub3BlcmFuZHMgPSBleHByZXNzaW9uLm9wZXJhbmRzLm1hcChleHByZXNzaW9uID0+XG5cdFx0XHRcdC8vIFx0dHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbiwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uKVxuXHRcdFx0XHQvLyApO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJDb21wYXJpc29uXCI6XG5cdFx0XHRcdC8vIGV4cHJlc3Npb24ub3BlcmFuZDEgPSB0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLm9wZXJhbmQxLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24pO1xuXHRcdFx0XHQvLyBleHByZXNzaW9uLm9wZXJhbmQyID0gdHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbi5vcGVyYW5kMiwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiRGVmYXVsdEJpbmRpbmdcIjpcblx0XHRcdGNhc2UgXCJSZWZcIjpcblx0XHRcdGNhc2UgXCJCaW5kaW5nXCI6XG5cdFx0XHRjYXNlIFwiQ29uc3RhbnRcIjpcblx0XHRcdFx0Ly8gRG8gbm90aGluZ1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0cmV0dXJuIGV4cHJlc3Npb247XG59XG5cbmV4cG9ydCB0eXBlIEJpbmRpbmdFeHByZXNzaW9uPFQ+ID0gVCB8IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDb21waWxlIGFuIGV4cHJlc3Npb24gaW50byBhbiBleHByZXNzaW9uIGJpbmRpbmcuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBleHByZXNzaW9uXHRcdFx0LSB0aGUgZXhwcmVzc2lvbiB0byBjb21waWxlXG4gKiBAcGFyYW0gZW1iZWRkZWRJbkJpbmRpbmcgXHQtIHdoZXRoZXIgdGhlIGV4cHJlc3Npb24gdG8gY29tcGlsZSBpcyBlbWJlZGRlZCBpbnRvIGFub3RoZXIgZXhwcmVzc2lvblxuICogQHJldHVybnMge0JpbmRpbmdFeHByZXNzaW9uPFQ+fSB0aGUgY29ycmVzcG9uZGluZyBleHByZXNzaW9uIGJpbmRpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVCaW5kaW5nPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0ZXhwcmVzc2lvbjogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRlbWJlZGRlZEluQmluZGluZzogYm9vbGVhbiA9IGZhbHNlXG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0Y29uc3QgZXhwciA9IHdyYXBQcmltaXRpdmUoZXhwcmVzc2lvbik7XG5cblx0c3dpdGNoIChleHByLl90eXBlKSB7XG5cdFx0Y2FzZSBcIkNvbnN0YW50XCI6XG5cdFx0XHRpZiAoZXhwci52YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gXCJudWxsXCI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZXhwci52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBcInVuZGVmaW5lZFwiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiBleHByLnZhbHVlID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KGV4cHIudmFsdWUpKSB7XG5cdFx0XHRcdFx0Y29uc3QgZW50cmllcyA9IGV4cHIudmFsdWUubWFwKGV4cHJlc3Npb24gPT4gY29tcGlsZUJpbmRpbmcoZXhwcmVzc2lvbiwgdHJ1ZSkpO1xuXHRcdFx0XHRcdHJldHVybiBgWyR7ZW50cmllcy5qb2luKFwiLCBcIil9XWA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gT2JqZWN0c1xuXHRcdFx0XHRcdGNvbnN0IG8gPSBleHByLnZhbHVlIGFzIFBsYWluRXhwcmVzc2lvbk9iamVjdDtcblx0XHRcdFx0XHRjb25zdCBwcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMobykubWFwKGtleSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IG9ba2V5XTtcblx0XHRcdFx0XHRcdHJldHVybiBgJHtrZXl9OiAke2NvbXBpbGVCaW5kaW5nKHZhbHVlLCB0cnVlKX1gO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJldHVybiBgeyR7cHJvcGVydGllcy5qb2luKFwiLCBcIil9fWA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdHN3aXRjaCAodHlwZW9mIGV4cHIudmFsdWUpIHtcblx0XHRcdFx0XHRjYXNlIFwibnVtYmVyXCI6XG5cdFx0XHRcdFx0Y2FzZSBcImJpZ2ludFwiOlxuXHRcdFx0XHRcdGNhc2UgXCJib29sZWFuXCI6XG5cdFx0XHRcdFx0XHRyZXR1cm4gZXhwci52YWx1ZS50b1N0cmluZygpO1xuXHRcdFx0XHRcdGNhc2UgXCJzdHJpbmdcIjpcblx0XHRcdFx0XHRcdHJldHVybiBgJyR7ZXhwci52YWx1ZS50b1N0cmluZygpfSdgO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGV4cHIudmFsdWUudG9TdHJpbmcoKTtcblx0XHRcdH1cblxuXHRcdGNhc2UgXCJSZWZcIjpcblx0XHRcdHJldHVybiBleHByLnJlZiB8fCBcIm51bGxcIjtcblxuXHRcdGNhc2UgXCJGdW5jdGlvblwiOlxuXHRcdFx0Y29uc3QgYXJndW1lbnRTdHJpbmcgPSBgJHtleHByLnBhcmFtZXRlcnMubWFwKGFyZyA9PiBjb21waWxlQmluZGluZyhhcmcsIHRydWUpKS5qb2luKFwiLCBcIil9YDtcblx0XHRcdHJldHVybiBleHByLm9iaiA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdD8gYCR7ZXhwci5mbn0oJHthcmd1bWVudFN0cmluZ30pYFxuXHRcdFx0XHQ6IGAke2NvbXBpbGVCaW5kaW5nKGV4cHIub2JqLCB0cnVlKX0uJHtleHByLmZufSgke2FyZ3VtZW50U3RyaW5nfSlgO1xuXHRcdGNhc2UgXCJFbWJlZGRlZEV4cHJlc3Npb25CaW5kaW5nXCI6XG5cdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0cmV0dXJuIGAoJHtleHByLnZhbHVlLnN1YnN0cigyLCBleHByLnZhbHVlLmxlbmd0aCAtIDMpfSlgO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGAke2V4cHIudmFsdWV9YDtcblx0XHRcdH1cblx0XHRjYXNlIFwiRW1iZWRkZWRCaW5kaW5nXCI6XG5cdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0cmV0dXJuIGBcXCUke2V4cHIudmFsdWV9YDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBgJHtleHByLnZhbHVlfWA7XG5cdFx0XHR9XG5cdFx0Y2FzZSBcIkRlZmF1bHRCaW5kaW5nXCI6XG5cdFx0Y2FzZSBcIkJpbmRpbmdcIjpcblx0XHRcdGlmIChleHByLnR5cGUpIHtcblx0XHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGBcXCV7cGF0aDonJHtleHByLm1vZGVsTmFtZSA/IGAke2V4cHIubW9kZWxOYW1lfT5gIDogXCJcIn0ke2V4cHIucGF0aH0nLCB0eXBlOiAnJHtcblx0XHRcdFx0XHRcdGV4cHIudHlwZVxuXHRcdFx0XHRcdH0nLCBmb3JtYXRPcHRpb25zOiAke2NvbXBpbGVCaW5kaW5nKGV4cHIuY29uc3RyYWludHMgfHwge30pfX1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBge3BhdGg6JyR7ZXhwci5tb2RlbE5hbWUgPyBgJHtleHByLm1vZGVsTmFtZX0+YCA6IFwiXCJ9JHtleHByLnBhdGh9JywgdHlwZTogJyR7XG5cdFx0XHRcdFx0XHRleHByLnR5cGVcblx0XHRcdFx0XHR9JywgY29uc3RyYWludHM6ICR7Y29tcGlsZUJpbmRpbmcoZXhwci5jb25zdHJhaW50cyB8fCB7fSl9fWA7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChlbWJlZGRlZEluQmluZGluZykge1xuXHRcdFx0XHRcdHJldHVybiBgXFwleyR7ZXhwci5tb2RlbE5hbWUgPyBgJHtleHByLm1vZGVsTmFtZX0+YCA6IFwiXCJ9JHtleHByLnBhdGh9fWA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGB7JHtleHByLm1vZGVsTmFtZSA/IGAke2V4cHIubW9kZWxOYW1lfT5gIDogXCJcIn0ke2V4cHIucGF0aH19YDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0Y2FzZSBcIkNvbXBhcmlzb25cIjpcblx0XHRcdGNvbnN0IGNvbXBhcmlzb25QYXJ0ID0gYCR7Y29tcGlsZUJpbmRpbmcoZXhwci5vcGVyYW5kMSwgdHJ1ZSl9ICR7ZXhwci5vcGVyYXRvcn0gJHtjb21waWxlQmluZGluZyhleHByLm9wZXJhbmQyLCB0cnVlKX1gO1xuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdHJldHVybiBjb21wYXJpc29uUGFydDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBgez0gJHtjb21wYXJpc29uUGFydH19YDtcblxuXHRcdGNhc2UgXCJJZkVsc2VcIjpcblx0XHRcdGlmIChlbWJlZGRlZEluQmluZGluZykge1xuXHRcdFx0XHRyZXR1cm4gYCgke2NvbXBpbGVCaW5kaW5nKGV4cHIuY29uZGl0aW9uLCB0cnVlKX0gPyAke2NvbXBpbGVCaW5kaW5nKGV4cHIub25UcnVlLCB0cnVlKX0gOiAke2NvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdGV4cHIub25GYWxzZSxcblx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdCl9KWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gYHs9ICR7Y29tcGlsZUJpbmRpbmcoZXhwci5jb25kaXRpb24sIHRydWUpfSA/ICR7Y29tcGlsZUJpbmRpbmcoZXhwci5vblRydWUsIHRydWUpfSA6ICR7Y29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdFx0ZXhwci5vbkZhbHNlLFxuXHRcdFx0XHRcdHRydWVcblx0XHRcdFx0KX19YDtcblx0XHRcdH1cblxuXHRcdGNhc2UgXCJTZXRcIjpcblx0XHRcdGlmIChlbWJlZGRlZEluQmluZGluZykge1xuXHRcdFx0XHRyZXR1cm4gYCgke2V4cHIub3BlcmFuZHMubWFwKGV4cHJlc3Npb24gPT4gY29tcGlsZUJpbmRpbmcoZXhwcmVzc2lvbiwgdHJ1ZSkpLmpvaW4oYCAke2V4cHIub3BlcmF0b3J9IGApfSlgO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGB7PSAoJHtleHByLm9wZXJhbmRzLm1hcChleHByZXNzaW9uID0+IGNvbXBpbGVCaW5kaW5nKGV4cHJlc3Npb24sIHRydWUpKS5qb2luKGAgJHtleHByLm9wZXJhdG9yfSBgKX0pfWA7XG5cdFx0XHR9XG5cblx0XHRjYXNlIFwiQ29uY2F0XCI6XG5cdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0cmV0dXJuIGAke2V4cHIuZXhwcmVzc2lvbnMubWFwKGV4cHJlc3Npb24gPT4gY29tcGlsZUJpbmRpbmcoZXhwcmVzc2lvbiwgdHJ1ZSkpLmpvaW4oYCArIGApfWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gYHs9ICR7ZXhwci5leHByZXNzaW9ucy5tYXAoZXhwcmVzc2lvbiA9PiBjb21waWxlQmluZGluZyhleHByZXNzaW9uLCB0cnVlKSkuam9pbihgICsgYCl9IH1gO1xuXHRcdFx0fVxuXG5cdFx0Y2FzZSBcIk5vdFwiOlxuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdHJldHVybiBgISR7Y29tcGlsZUJpbmRpbmcoZXhwci5vcGVyYW5kLCB0cnVlKX1gO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGB7PSAhJHtjb21waWxlQmluZGluZyhleHByLm9wZXJhbmQsIHRydWUpfX1gO1xuXHRcdFx0fVxuXG5cdFx0Y2FzZSBcIkZvcm1hdHRlclwiOlxuXHRcdFx0bGV0IG91dFByb3BlcnR5ID0gXCJcIjtcblx0XHRcdGlmIChleHByLnBhcmFtZXRlcnMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdG91dFByb3BlcnR5ICs9IGB7JHtjb21waWxlUGF0aFBhcmFtZXRlcihleHByLnBhcmFtZXRlcnNbMF0sIHRydWUpfSwgZm9ybWF0dGVyOiAnJHtleHByLmZufSd9YDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dFByb3BlcnR5ICs9IGB7cGFydHM6WyR7ZXhwci5wYXJhbWV0ZXJzLm1hcCgocGFyYW06IGFueSkgPT4gY29tcGlsZVBhdGhQYXJhbWV0ZXIocGFyYW0pKS5qb2luKFwiLFwiKX1dLCBmb3JtYXR0ZXI6ICcke1xuXHRcdFx0XHRcdGV4cHIuZm5cblx0XHRcdFx0fSd9YDtcblx0XHRcdH1cblx0XHRcdGlmIChlbWJlZGRlZEluQmluZGluZykge1xuXHRcdFx0XHRvdXRQcm9wZXJ0eSA9IGBcXCQke291dFByb3BlcnR5fWA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb3V0UHJvcGVydHk7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBcIlwiO1xuXHR9XG59XG5cbi8qKlxuICogQ29tcGlsZSB0aGUgcGF0aCBwYXJhbWV0ZXIgb2YgYSBmb3JtYXR0ZXIgY2FsbC5cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBcdC0gdGhlIGJpbmRpbmcgcGFydCB0byBldmFsdWF0ZVxuICogQHBhcmFtIHNpbmdsZVBhdGggXHQtIHdoZXRoZXIgdGhlcmUgaXMgb25lIG9yIG11bHRpcGxlIHBhdGggdG8gY29uc2lkZXJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBzdHJpbmcgc25pcHBldCB0byBpbmNsdWRlIGluIHRoZSBvdmVyYWxsIGJpbmRpbmcgZGVmaW5pdGlvblxuICovXG5mdW5jdGlvbiBjb21waWxlUGF0aFBhcmFtZXRlcihleHByZXNzaW9uOiBFeHByZXNzaW9uPGFueT4sIHNpbmdsZVBhdGg6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG5cdGxldCBvdXRWYWx1ZSA9IFwiXCI7XG5cdHN3aXRjaCAoZXhwcmVzc2lvbi5fdHlwZSkge1xuXHRcdGNhc2UgXCJDb25zdGFudFwiOlxuXHRcdFx0c3dpdGNoICh0eXBlb2YgZXhwcmVzc2lvbi52YWx1ZSkge1xuXHRcdFx0XHRjYXNlIFwibnVtYmVyXCI6XG5cdFx0XHRcdGNhc2UgXCJiaWdpbnRcIjpcblx0XHRcdFx0XHRvdXRWYWx1ZSA9IGB2YWx1ZTogJHtleHByZXNzaW9uLnZhbHVlLnRvU3RyaW5nKCl9YDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInN0cmluZ1wiOlxuXHRcdFx0XHRjYXNlIFwiYm9vbGVhblwiOlxuXHRcdFx0XHRcdG91dFZhbHVlID0gYHZhbHVlOiAnJHtleHByZXNzaW9uLnZhbHVlLnRvU3RyaW5nKCl9J2A7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0b3V0VmFsdWUgPSBcInZhbHVlOiAnJ1wiO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHNpbmdsZVBhdGgpIHtcblx0XHRcdFx0cmV0dXJuIG91dFZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGB7JHtvdXRWYWx1ZX19YDtcblxuXHRcdGNhc2UgXCJEZWZhdWx0QmluZGluZ1wiOlxuXHRcdGNhc2UgXCJCaW5kaW5nXCI6XG5cdFx0XHRvdXRWYWx1ZSA9IGBwYXRoOicke2V4cHJlc3Npb24ubW9kZWxOYW1lID8gYCR7ZXhwcmVzc2lvbi5tb2RlbE5hbWV9PmAgOiBcIlwifSR7ZXhwcmVzc2lvbi5wYXRofSdgO1xuXG5cdFx0XHRpZiAoZXhwcmVzc2lvbi50eXBlKSB7XG5cdFx0XHRcdG91dFZhbHVlICs9IGAsIHR5cGUgOiAnJHtleHByZXNzaW9uLnR5cGV9J2A7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdXRWYWx1ZSArPSBgLCB0YXJnZXRUeXBlIDogJ2FueSdgO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGV4cHJlc3Npb24uY29uc3RyYWludHMgJiYgT2JqZWN0LmtleXMoZXhwcmVzc2lvbi5jb25zdHJhaW50cykubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRvdXRWYWx1ZSArPSBgLCBjb25zdHJhaW50czogJHtjb21waWxlQmluZGluZyhleHByZXNzaW9uLmNvbnN0cmFpbnRzKX1gO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHNpbmdsZVBhdGgpIHtcblx0XHRcdFx0cmV0dXJuIG91dFZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGB7JHtvdXRWYWx1ZX19YDtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdH1cbn1cbiJdfQ==