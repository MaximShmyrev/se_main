sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Path = function Path(pathExpression, targetName, annotationsTerm, annotationType, term) {
    _classCallCheck(this, Path);

    this.path = pathExpression.Path;
    this.type = "Path";
    this.$target = targetName;
    this.term = term, this.annotationType = annotationType, this.annotationsTerm = annotationsTerm;
  };

  var defaultReferences = [{
    alias: "Capabilities",
    namespace: "Org.OData.Capabilities.V1",
    uri: ""
  }, {
    alias: "Aggregation",
    namespace: "Org.OData.Aggregation.V1",
    uri: ""
  }, {
    alias: "Validation",
    namespace: "Org.OData.Validation.V1",
    uri: ""
  }, {
    namespace: "Org.OData.Core.V1",
    alias: "Core",
    uri: ""
  }, {
    namespace: "Org.OData.Measures.V1",
    alias: "Measures",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Common.v1",
    alias: "Common",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.UI.v1",
    alias: "UI",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Session.v1",
    alias: "Session",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Analytics.v1",
    alias: "Analytics",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.CodeList.v1",
    alias: "CodeList",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.PersonalData.v1",
    alias: "PersonalData",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Communication.v1",
    alias: "Communication",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.HTML5.v1",
    alias: "HTML5",
    uri: ""
  }];
  _exports.defaultReferences = defaultReferences;

  function alias(references, unaliasedValue) {
    if (!references.reverseReferenceMap) {
      references.reverseReferenceMap = references.reduce(function (map, reference) {
        map[reference.namespace] = reference;
        return map;
      }, {});
    }

    if (!unaliasedValue) {
      return unaliasedValue;
    }

    var lastDotIndex = unaliasedValue.lastIndexOf(".");
    var namespace = unaliasedValue.substr(0, lastDotIndex);
    var value = unaliasedValue.substr(lastDotIndex + 1);
    var reference = references.reverseReferenceMap[namespace];

    if (reference) {
      return "".concat(reference.alias, ".").concat(value);
    } else {
      // Try to see if it's an annotation Path like to_SalesOrder/@UI.LineItem
      if (unaliasedValue.indexOf("@") !== -1) {
        var _unaliasedValue$split = unaliasedValue.split("@"),
            _unaliasedValue$split2 = _toArray(_unaliasedValue$split),
            preAlias = _unaliasedValue$split2[0],
            postAlias = _unaliasedValue$split2.slice(1);

        return "".concat(preAlias, "@").concat(alias(references, postAlias.join("@")));
      } else {
        return unaliasedValue;
      }
    }
  }

  function unalias(references, aliasedValue) {
    if (!references.referenceMap) {
      references.referenceMap = references.reduce(function (map, reference) {
        map[reference.alias] = reference;
        return map;
      }, {});
    }

    if (!aliasedValue) {
      return aliasedValue;
    }

    var _aliasedValue$split = aliasedValue.split("."),
        _aliasedValue$split2 = _slicedToArray(_aliasedValue$split, 2),
        alias = _aliasedValue$split2[0],
        value = _aliasedValue$split2[1];

    var reference = references.referenceMap[alias];

    if (reference) {
      return "".concat(reference.namespace, ".").concat(value);
    } else {
      // Try to see if it's an annotation Path like to_SalesOrder/@UI.LineItem
      if (aliasedValue.indexOf("@") !== -1) {
        var _aliasedValue$split3 = aliasedValue.split("@"),
            _aliasedValue$split4 = _toArray(_aliasedValue$split3),
            preAlias = _aliasedValue$split4[0],
            postAlias = _aliasedValue$split4.slice(1);

        return "".concat(preAlias, "@").concat(unalias(references, postAlias.join("@")));
      } else {
        return aliasedValue;
      }
    }
  }

  function buildObjectMap(parserOutput) {
    var objectMap = {};

    if (parserOutput.schema.entityContainer && parserOutput.schema.entityContainer.fullyQualifiedName) {
      objectMap[parserOutput.schema.entityContainer.fullyQualifiedName] = parserOutput.schema.entityContainer;
    }

    parserOutput.schema.entitySets.forEach(function (entitySet) {
      objectMap[entitySet.fullyQualifiedName] = entitySet;
    });
    parserOutput.schema.actions.forEach(function (action) {
      objectMap[action.fullyQualifiedName] = action;
      objectMap[action.fullyQualifiedName.split("(")[0]] = action;
      action.parameters.forEach(function (parameter) {
        objectMap[parameter.fullyQualifiedName] = parameter;
      });
    });
    parserOutput.schema.complexTypes.forEach(function (complexType) {
      objectMap[complexType.fullyQualifiedName] = complexType;
      complexType.properties.forEach(function (property) {
        objectMap[property.fullyQualifiedName] = property;
      });
    });
    parserOutput.schema.entityTypes.forEach(function (entityType) {
      objectMap[entityType.fullyQualifiedName] = entityType;
      entityType.entityProperties.forEach(function (property) {
        objectMap[property.fullyQualifiedName] = property;

        if (property.type.indexOf("Edm") === -1) {
          // Handle complex types
          var complexTypeDefinition = objectMap[property.type];

          if (complexTypeDefinition && complexTypeDefinition.properties) {
            complexTypeDefinition.properties.forEach(function (complexTypeProp) {
              var complexTypePropTarget = Object.assign(complexTypeProp, {
                _type: "Property",
                fullyQualifiedName: property.fullyQualifiedName + "/" + complexTypeProp.name
              });
              objectMap[complexTypePropTarget.fullyQualifiedName] = complexTypePropTarget;
            });
          }
        }
      });
      entityType.navigationProperties.forEach(function (navProperty) {
        objectMap[navProperty.fullyQualifiedName] = navProperty;
      });
    });
    Object.keys(parserOutput.schema.annotations).forEach(function (annotationSource) {
      parserOutput.schema.annotations[annotationSource].forEach(function (annotationList) {
        var currentTargetName = unalias(parserOutput.references, annotationList.target);
        annotationList.annotations.forEach(function (annotation) {
          var annotationFQN = "".concat(currentTargetName, "@").concat(unalias(parserOutput.references, annotation.term));

          if (annotation.qualifier) {
            annotationFQN += "#".concat(annotation.qualifier);
          }

          objectMap[annotationFQN] = annotation;
          annotation.fullyQualifiedName = annotationFQN;
        });
      });
    });
    return objectMap;
  }

  function combinePath(currentTarget, path) {
    if (path.startsWith("@")) {
      return currentTarget + unalias(defaultReferences, path);
    } else {
      return currentTarget + "/" + path;
    }
  }

  function addAnnotationErrorMessage(path, oErrorMsg) {
    if (!ALL_ANNOTATION_ERRORS[path]) {
      ALL_ANNOTATION_ERRORS[path] = [oErrorMsg];
    } else {
      ALL_ANNOTATION_ERRORS[path].push(oErrorMsg);
    }
  }

  function resolveTarget(objectMap, currentTarget, path) {
    var pathOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var includeVisitedObjects = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var annotationType = arguments.length > 5 ? arguments[5] : undefined;
    var annotationsTerm = arguments.length > 6 ? arguments[6] : undefined;

    if (!path) {
      return undefined;
    } //const propertyPath = path;


    var aVisitedObjects = [];
    path = combinePath(currentTarget.fullyQualifiedName, path);
    var pathSplit = path.split("/");
    var currentPath = path;
    var target = pathSplit.reduce(function (currentValue, pathPart) {
      if (pathPart.length === 0) {
        return currentValue;
      }

      if (includeVisitedObjects && currentValue !== null) {
        aVisitedObjects.push(currentValue);
      }

      if (!currentValue) {
        currentPath = pathPart;
      } else if (currentValue._type === "EntitySet" && currentValue.entityType) {
        currentPath = combinePath(currentValue.entityTypeName, pathPart);
      } else if (currentValue._type === "NavigationProperty" && currentValue.targetTypeName) {
        currentPath = combinePath(currentValue.targetTypeName, pathPart);
      } else if (currentValue._type === "NavigationProperty" && currentValue.targetType) {
        currentPath = combinePath(currentValue.targetType.fullyQualifiedName, pathPart);
      } else if (currentValue._type === "Property") {
        if (currentValue.type.indexOf("Edm") === -1) {
          // This is a complex type
          currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);
        } else {
          currentPath = combinePath(currentTarget.fullyQualifiedName.substr(0, currentTarget.fullyQualifiedName.lastIndexOf("/")), pathPart);
        }
      } else if (currentValue._type === "Action" && currentValue.isBound) {
        currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);

        if (!objectMap[currentPath]) {
          currentPath = combinePath(currentValue.sourceType, pathPart);
        }
      } else if (currentValue._type === "ActionParameter" && currentValue.isEntitySet) {
        currentPath = combinePath(currentValue.type, pathPart);
      } else if (currentValue._type === "ActionParameter" && !currentValue.isEntitySet) {
        currentPath = combinePath(currentTarget.fullyQualifiedName.substr(0, currentTarget.fullyQualifiedName.lastIndexOf("/")), pathPart);

        if (!objectMap[currentPath]) {
          var lastIdx = currentTarget.fullyQualifiedName.lastIndexOf("/");

          if (lastIdx === -1) {
            lastIdx = currentTarget.fullyQualifiedName.length;
          }

          currentPath = combinePath(objectMap[currentTarget.fullyQualifiedName.substr(0, lastIdx)].sourceType, pathPart);
        }
      } else {
        currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);

        if (pathPart !== "name" && currentValue[pathPart] !== undefined) {
          return currentValue[pathPart];
        } else if (pathPart === "$AnnotationPath" && currentValue.$target) {
          return currentValue.$target;
        } else if (pathPart === "$Path" && currentValue.$target) {
          return currentValue.$target;
        } else if (pathPart.startsWith("$Path") && currentValue.$target) {
          var intermediateTarget = currentValue.$target;
          currentPath = combinePath(intermediateTarget.fullyQualifiedName, pathPart.substr(5));
        } else if (currentValue.hasOwnProperty("$Type")) {
          // This is now an annotation value
          var entityType = objectMap[currentValue.fullyQualifiedName.split("@")[0]];

          if (entityType) {
            currentPath = combinePath(entityType.fullyQualifiedName, pathPart);
          }
        }
      }

      return objectMap[currentPath];
    }, null);

    if (!target) {
      if (annotationsTerm && annotationType) {
        var oErrorMsg = {
          message: "Unable to resolve the path expression: " + "\n" + path + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + annotationsTerm + ">" + "\n" + "<Record Type = " + annotationType + ">" + "\n" + "<AnnotationPath = " + path + ">"
        };
        addAnnotationErrorMessage(path, oErrorMsg);
      } else {
        var oErrorMsg = {
          message: "Unable to resolve the path expression: " + path + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + pathSplit[0] + ">" + "\n" + "<PropertyValue  Path= " + pathSplit[1] + ">"
        };
        addAnnotationErrorMessage(path, oErrorMsg);
      } // console.log("Missing target " + path);

    }

    if (pathOnly) {
      return currentPath;
    }

    if (includeVisitedObjects) {
      return {
        visitedObjects: aVisitedObjects,
        target: target
      };
    }

    return target;
  }

  function isAnnotationPath(pathStr) {
    return pathStr.indexOf("@") !== -1;
  }

  function parseValue(propertyValue, valueFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm) {
    if (propertyValue === undefined) {
      return undefined;
    }

    switch (propertyValue.type) {
      case "String":
        return propertyValue.String;

      case "Int":
        return propertyValue.Int;

      case "Bool":
        return propertyValue.Bool;

      case "Decimal":
        return propertyValue.Decimal;

      case "Date":
        return propertyValue.Date;

      case "EnumMember":
        return alias(parserOutput.references, propertyValue.EnumMember);

      case "PropertyPath":
        return {
          type: "PropertyPath",
          value: propertyValue.PropertyPath,
          fullyQualifiedName: valueFQN,
          $target: resolveTarget(objectMap, currentTarget, propertyValue.PropertyPath, false, false, annotationType, annotationsTerm)
        };

      case "NavigationPropertyPath":
        return {
          type: "NavigationPropertyPath",
          value: propertyValue.NavigationPropertyPath,
          fullyQualifiedName: valueFQN,
          $target: resolveTarget(objectMap, currentTarget, propertyValue.NavigationPropertyPath, false, false, annotationType, annotationsTerm)
        };

      case "AnnotationPath":
        var annotationTarget = resolveTarget(objectMap, currentTarget, unalias(parserOutput.references, propertyValue.AnnotationPath), true, false, annotationType, annotationsTerm);
        var annotationPath = {
          type: "AnnotationPath",
          value: propertyValue.AnnotationPath,
          fullyQualifiedName: valueFQN,
          $target: annotationTarget,
          annotationType: annotationType,
          annotationsTerm: annotationsTerm,
          term: "",
          path: ""
        };
        toResolve.push(annotationPath);
        return annotationPath;

      case "Path":
        if (isAnnotationPath(propertyValue.Path)) {
          // If it's an anntoation that we can resolve, resolve it !
          var _$target = resolveTarget(objectMap, currentTarget, propertyValue.Path, false, false, annotationType, annotationsTerm);

          if (_$target) {
            return _$target;
          }
        }

        var $target = resolveTarget(objectMap, currentTarget, propertyValue.Path, true, false, annotationType, annotationsTerm);
        var path = new Path(propertyValue, $target, annotationsTerm, annotationType, "");
        toResolve.push(path);
        return path;

      case "Record":
        return parseRecord(propertyValue.Record, valueFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);

      case "Collection":
        return parseCollection(propertyValue.Collection, valueFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);

      case "Apply":
      case "If":
        return propertyValue;
    }
  }

  function parseRecord(recordDefinition, currentFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm) {
    var annotationTerm = {
      $Type: unalias(parserOutput.references, recordDefinition.type),
      fullyQualifiedName: currentFQN
    };
    var annotationContent = {};

    if (recordDefinition.annotations && Array.isArray(recordDefinition.annotations)) {
      var subAnnotationList = {
        target: currentFQN,
        annotations: recordDefinition.annotations,
        __source: annotationSource
      };
      unresolvedAnnotations.push(subAnnotationList);
    }

    recordDefinition.propertyValues.forEach(function (propertyValue) {
      annotationContent[propertyValue.name] = parseValue(propertyValue.value, "".concat(currentFQN, "/").concat(propertyValue.name), parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);

      if (propertyValue.annotations && Array.isArray(propertyValue.annotations)) {
        var _subAnnotationList = {
          target: "".concat(currentFQN, "/").concat(propertyValue.name),
          annotations: propertyValue.annotations,
          __source: annotationSource
        };
        unresolvedAnnotations.push(_subAnnotationList);
      }

      if (annotationContent.hasOwnProperty("Action") && (annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithAction")) {
        if (currentTarget.actions) {
          annotationContent.ActionTarget = currentTarget.actions[annotationContent.Action] || objectMap[annotationContent.Action];

          if (!annotationContent.ActionTarget) {
            // Add to diagnostics debugger;
            ANNOTATION_ERRORS.push({
              message: "Unable to resolve the action " + annotationContent.Action + " defined for " + annotationTerm.fullyQualifiedName
            });
          }
        }
      }
    });
    return Object.assign(annotationTerm, annotationContent);
  }

  function getOrInferCollectionType(collectionDefinition) {
    var type = collectionDefinition.type;

    if (type === undefined && collectionDefinition.length > 0) {
      var firstColItem = collectionDefinition[0];

      if (firstColItem.hasOwnProperty("PropertyPath")) {
        type = "PropertyPath";
      } else if (firstColItem.hasOwnProperty("Path")) {
        type = "Path";
      } else if (firstColItem.hasOwnProperty("AnnotationPath")) {
        type = "AnnotationPath";
      } else if (firstColItem.hasOwnProperty("NavigationPropertyPath")) {
        type = "NavigationPropertyPath";
      } else if (typeof firstColItem === "object" && (firstColItem.hasOwnProperty("type") || firstColItem.hasOwnProperty("propertyValues"))) {
        type = "Record";
      } else if (typeof firstColItem === "string") {
        type = "String";
      }
    } else if (type === undefined) {
      type = "EmptyCollection";
    }

    return type;
  }

  function parseCollection(collectionDefinition, parentFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm) {
    var collectionDefinitionType = getOrInferCollectionType(collectionDefinition);

    switch (collectionDefinitionType) {
      case "PropertyPath":
        return collectionDefinition.map(function (propertyPath, propertyIdx) {
          return {
            type: "PropertyPath",
            value: propertyPath.PropertyPath,
            fullyQualifiedName: "".concat(parentFQN, "/").concat(propertyIdx),
            $target: resolveTarget(objectMap, currentTarget, propertyPath.PropertyPath, false, false, annotationType, annotationsTerm)
          };
        });

      case "Path":
        return collectionDefinition.map(function (pathValue) {
          if (isAnnotationPath(pathValue.Path)) {
            // If it's an anntoation that we can resolve, resolve it !
            var _$target2 = resolveTarget(objectMap, currentTarget, pathValue.Path, false, false, annotationType, annotationsTerm);

            if (_$target2) {
              return _$target2;
            }
          }

          var $target = resolveTarget(objectMap, currentTarget, pathValue.Path, true, false, annotationType, annotationsTerm);
          var path = new Path(pathValue, $target, annotationsTerm, annotationType, "");
          toResolve.push(path);
          return path;
        });

      case "AnnotationPath":
        return collectionDefinition.map(function (annotationPath, annotationIdx) {
          var annotationTarget = resolveTarget(objectMap, currentTarget, annotationPath.AnnotationPath, true, false, annotationType, annotationsTerm);
          var annotationCollectionElement = {
            type: "AnnotationPath",
            value: annotationPath.AnnotationPath,
            fullyQualifiedName: "".concat(parentFQN, "/").concat(annotationIdx),
            $target: annotationTarget,
            annotationType: annotationType,
            annotationsTerm: annotationsTerm,
            term: "",
            path: ""
          };
          toResolve.push(annotationCollectionElement);
          return annotationCollectionElement;
        });

      case "NavigationPropertyPath":
        return collectionDefinition.map(function (navPropertyPath, navPropIdx) {
          return {
            type: "NavigationPropertyPath",
            value: navPropertyPath.NavigationPropertyPath,
            fullyQualifiedName: "".concat(parentFQN, "/").concat(navPropIdx),
            $target: resolveTarget(objectMap, currentTarget, navPropertyPath.NavigationPropertyPath, false, false, annotationType, annotationsTerm)
          };
        });

      case "Record":
        return collectionDefinition.map(function (recordDefinition, recordIdx) {
          return parseRecord(recordDefinition, "".concat(parentFQN, "/").concat(recordIdx), parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);
        });

      case "Apply":
        return collectionDefinition.map(function (ifValue) {
          return ifValue;
        });

      case "If":
        return collectionDefinition.map(function (ifValue) {
          return ifValue;
        });

      case "String":
        return collectionDefinition.map(function (stringValue) {
          return stringValue;
        });

      default:
        if (collectionDefinition.length === 0) {
          return [];
        }

        throw new Error("Unsupported case");
    }
  }

  function convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations) {
    if (annotation.record) {
      var annotationType = annotation.record.type ? annotation.record.type : "";
      var annotationTerm = {
        $Type: unalias(parserOutput.references, annotation.record.type),
        fullyQualifiedName: annotation.fullyQualifiedName,
        qualifier: annotation.qualifier
      };
      var annotationContent = {};
      annotation.record.propertyValues.forEach(function (propertyValue) {
        annotationContent[propertyValue.name] = parseValue(propertyValue.value, "".concat(annotation.fullyQualifiedName, "/").concat(propertyValue.name), parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotation.term);

        if (annotationContent.hasOwnProperty("Action") && (!annotation.record || annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithAction")) {
          if (currentTarget.actions) {
            annotationContent.ActionTarget = currentTarget.actions[annotationContent.Action] || objectMap[annotationContent.Action];

            if (!annotationContent.ActionTarget) {
              ANNOTATION_ERRORS.push({
                message: "Unable to resolve the action " + annotationContent.Action + " defined for " + annotation.fullyQualifiedName
              }); // Add to diagnostics
              // debugger;
            }
          }
        }
      });
      return Object.assign(annotationTerm, annotationContent);
    } else if (annotation.collection === undefined) {
      if (annotation.value) {
        return parseValue(annotation.value, annotation.fullyQualifiedName, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, "", annotation.term);
      } else {
        return true;
      }
    } else if (annotation.collection) {
      var collection = parseCollection(annotation.collection, annotation.fullyQualifiedName, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, "", annotation.term);
      collection.fullyQualifiedName = annotation.fullyQualifiedName;
      return collection;
    } else {
      throw new Error("Unsupported case");
    }
  }

  function createResolvePathFn(entityType, objectMap) {
    return function (relativePath, includeVisitedObjects) {
      var annotationTerm = "";
      var annotationType = "";
      return resolveTarget(objectMap, entityType, relativePath, false, includeVisitedObjects, annotationType, annotationTerm);
    };
  }

  function resolveNavigationProperties(entityTypes, associations, objectMap) {
    entityTypes.forEach(function (entityType) {
      entityType.navigationProperties = entityType.navigationProperties.map(function (navProp) {
        var outNavProp = {
          _type: "NavigationProperty",
          name: navProp.name,
          fullyQualifiedName: navProp.fullyQualifiedName,
          partner: navProp.hasOwnProperty("partner") ? navProp.partner : undefined,
          // targetTypeName: FullyQualifiedName;
          // targetType: EntityType;
          isCollection: navProp.hasOwnProperty("isCollection") ? navProp.isCollection : false,
          containsTarget: navProp.hasOwnProperty("containsTarget") ? navProp.containsTarget : false,
          referentialConstraint: navProp.referentialConstraint ? navProp.referentialConstraint : []
        };

        if (navProp.targetTypeName) {
          outNavProp.targetType = objectMap[navProp.targetTypeName];
        } else if (navProp.relationship) {
          var targetAssociation = associations.find(function (association) {
            return association.fullyQualifiedName === navProp.relationship;
          });

          if (targetAssociation) {
            var associationEnd = targetAssociation.associationEnd.find(function (end) {
              return end.role === navProp.toRole;
            });

            if (associationEnd) {
              outNavProp.targetType = objectMap[associationEnd.type];
              outNavProp.isCollection = associationEnd.multiplicity === "*";
            }
          }
        }

        if (outNavProp.targetType) {
          outNavProp.targetTypeName = outNavProp.targetType.fullyQualifiedName;
        }

        var outNavPropReq = outNavProp;
        objectMap[outNavPropReq.fullyQualifiedName] = outNavPropReq;
        return outNavPropReq;
      });
      entityType.resolvePath = createResolvePathFn(entityType, objectMap);
    });
  }

  function linkActionsToEntityType(namespace, actions, objectMap) {
    actions.forEach(function (action) {
      if (action.isBound) {
        var sourceEntityType = objectMap[action.sourceType];
        action.sourceEntityType = sourceEntityType;

        if (sourceEntityType) {
          if (!sourceEntityType.actions) {
            sourceEntityType.actions = {};
          }

          sourceEntityType.actions[action.name] = action;
          sourceEntityType.actions["".concat(namespace, ".").concat(action.name)] = action;
        }

        action.returnEntityType = objectMap[action.returnType];
      }
    });
  }

  function linkEntityTypeToEntitySet(entitySets, objectMap) {
    entitySets.forEach(function (entitySet) {
      entitySet.entityType = objectMap[entitySet.entityTypeName];

      if (!entitySet.annotations) {
        entitySet.annotations = {};
      }

      if (!entitySet.entityType.annotations) {
        entitySet.entityType.annotations = {};
      }

      entitySet.entityType.keys.forEach(function (keyProp) {
        keyProp.isKey = true;
      });
    });
  }

  function linkPropertiesToComplexTypes(entityTypes, objectMap) {
    entityTypes.forEach(function (entityType) {
      entityType.entityProperties.forEach(function (entityProperty) {
        if (entityProperty.type.indexOf("Edm") === -1) {
          var complexType = objectMap[entityProperty.type];

          if (complexType) {
            entityProperty.targetType = complexType;
          }
        }
      });
    });
  }

  function prepareComplexTypes(complexTypes, associations, objectMap) {
    complexTypes.forEach(function (complexType) {
      complexType.annotations = {};
      complexType.properties.forEach(function (property) {
        if (!property.annotations) {
          property.annotations = {};
        }
      });
      complexType.navigationProperties = complexType.navigationProperties.map(function (navProp) {
        if (!navProp.annotations) {
          navProp.annotations = {};
        }

        var outNavProp = {
          _type: "NavigationProperty",
          name: navProp.name,
          fullyQualifiedName: navProp.fullyQualifiedName,
          partner: navProp.hasOwnProperty("partner") ? navProp.partner : undefined,
          // targetTypeName: FullyQualifiedName;
          // targetType: EntityType;
          isCollection: navProp.hasOwnProperty("isCollection") ? navProp.isCollection : false,
          containsTarget: navProp.hasOwnProperty("containsTarget") ? navProp.containsTarget : false,
          referentialConstraint: navProp.referentialConstraint ? navProp.referentialConstraint : []
        };

        if (navProp.targetTypeName) {
          outNavProp.targetType = objectMap[navProp.targetTypeName];
        } else if (navProp.relationship) {
          var targetAssociation = associations.find(function (association) {
            return association.fullyQualifiedName === navProp.relationship;
          });

          if (targetAssociation) {
            var associationEnd = targetAssociation.associationEnd.find(function (end) {
              return end.role === navProp.toRole;
            });

            if (associationEnd) {
              outNavProp.targetType = objectMap[associationEnd.type];
              outNavProp.isCollection = associationEnd.multiplicity === "*";
            }
          }
        }

        if (outNavProp.targetType) {
          outNavProp.targetTypeName = outNavProp.targetType.fullyQualifiedName;
        }

        var outNavPropReq = outNavProp;
        objectMap[outNavPropReq.fullyQualifiedName] = outNavPropReq;
        return outNavPropReq;
      });
    });
  }

  function splitTerm(references, termValue) {
    var aliasedTerm = alias(references, termValue);
    var lastDot = aliasedTerm.lastIndexOf(".");
    var termAlias = aliasedTerm.substr(0, lastDot);
    var term = aliasedTerm.substr(lastDot + 1);
    return [termAlias, term];
  }

  var ANNOTATION_ERRORS = [];
  var ALL_ANNOTATION_ERRORS = {};

  function convertTypes(parserOutput) {
    ANNOTATION_ERRORS = [];
    var objectMap = buildObjectMap(parserOutput);
    resolveNavigationProperties(parserOutput.schema.entityTypes, parserOutput.schema.associations, objectMap);
    linkActionsToEntityType(parserOutput.schema.namespace, parserOutput.schema.actions, objectMap);
    linkEntityTypeToEntitySet(parserOutput.schema.entitySets, objectMap);
    linkPropertiesToComplexTypes(parserOutput.schema.entityTypes, objectMap);
    prepareComplexTypes(parserOutput.schema.complexTypes, parserOutput.schema.associations, objectMap);
    var toResolve = [];
    var unresolvedAnnotations = [];
    Object.keys(parserOutput.schema.annotations).forEach(function (annotationSource) {
      parserOutput.schema.annotations[annotationSource].forEach(function (annotationList) {
        var currentTargetName = unalias(parserOutput.references, annotationList.target);
        var currentTarget = objectMap[currentTargetName];

        if (!currentTarget) {
          if (currentTargetName.indexOf("@") !== -1) {
            annotationList.__source = annotationSource;
            unresolvedAnnotations.push(annotationList);
          }
        } else if (typeof currentTarget === "object") {
          if (!currentTarget.annotations) {
            currentTarget.annotations = {};
          }

          annotationList.annotations.forEach(function (annotation) {
            var _splitTerm = splitTerm(defaultReferences, annotation.term),
                _splitTerm2 = _slicedToArray(_splitTerm, 2),
                vocAlias = _splitTerm2[0],
                vocTerm = _splitTerm2[1];

            if (!currentTarget.annotations[vocAlias]) {
              currentTarget.annotations[vocAlias] = {};
            }

            if (!currentTarget.annotations._annotations) {
              currentTarget.annotations._annotations = {};
            }

            var vocTermWithQualifier = "".concat(vocTerm).concat(annotation.qualifier ? "#".concat(annotation.qualifier) : "");
            currentTarget.annotations[vocAlias][vocTermWithQualifier] = convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations);

            if (currentTarget.annotations[vocAlias][vocTermWithQualifier] !== null && typeof currentTarget.annotations[vocAlias][vocTermWithQualifier] === "object") {
              currentTarget.annotations[vocAlias][vocTermWithQualifier].term = unalias(defaultReferences, "".concat(vocAlias, ".").concat(vocTerm));
              currentTarget.annotations[vocAlias][vocTermWithQualifier].qualifier = annotation.qualifier;
              currentTarget.annotations[vocAlias][vocTermWithQualifier].__source = annotationSource;
            }

            var annotationTarget = "".concat(currentTargetName, "@").concat(unalias(defaultReferences, vocAlias + "." + vocTermWithQualifier));

            if (annotation.annotations && Array.isArray(annotation.annotations)) {
              var subAnnotationList = {
                target: annotationTarget,
                annotations: annotation.annotations,
                __source: annotationSource
              };
              unresolvedAnnotations.push(subAnnotationList);
            }

            currentTarget.annotations._annotations["".concat(vocAlias, ".").concat(vocTermWithQualifier)] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
            objectMap[annotationTarget] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
          });
        }
      });
    });
    var extraUnresolvedAnnotations = [];
    unresolvedAnnotations.forEach(function (annotationList) {
      var currentTargetName = unalias(parserOutput.references, annotationList.target);

      var _currentTargetName$sp = currentTargetName.split("@"),
          _currentTargetName$sp2 = _slicedToArray(_currentTargetName$sp, 2),
          baseObj = _currentTargetName$sp2[0],
          annotationPart = _currentTargetName$sp2[1];

      var targetSplit = annotationPart.split("/");
      baseObj = baseObj + "@" + targetSplit[0];
      var currentTarget = targetSplit.slice(1).reduce(function (currentObj, path) {
        if (!currentObj) {
          return null;
        }

        return currentObj[path];
      }, objectMap[baseObj]);

      if (!currentTarget) {
        ANNOTATION_ERRORS.push({
          message: "The following annotation target was not found on the service " + currentTargetName
        }); // console.log("Missing target again " + currentTargetName);
      } else if (typeof currentTarget === "object") {
        if (!currentTarget.annotations) {
          currentTarget.annotations = {};
        }

        annotationList.annotations.forEach(function (annotation) {
          var _splitTerm3 = splitTerm(defaultReferences, annotation.term),
              _splitTerm4 = _slicedToArray(_splitTerm3, 2),
              vocAlias = _splitTerm4[0],
              vocTerm = _splitTerm4[1];

          if (!currentTarget.annotations[vocAlias]) {
            currentTarget.annotations[vocAlias] = {};
          }

          if (!currentTarget.annotations._annotations) {
            currentTarget.annotations._annotations = {};
          }

          var vocTermWithQualifier = "".concat(vocTerm).concat(annotation.qualifier ? "#".concat(annotation.qualifier) : "");
          currentTarget.annotations[vocAlias][vocTermWithQualifier] = convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve, annotationList.__source, extraUnresolvedAnnotations);

          if (currentTarget.annotations[vocAlias][vocTermWithQualifier] !== null && typeof currentTarget.annotations[vocAlias][vocTermWithQualifier] === "object") {
            currentTarget.annotations[vocAlias][vocTermWithQualifier].term = unalias(defaultReferences, "".concat(vocAlias, ".").concat(vocTerm));
            currentTarget.annotations[vocAlias][vocTermWithQualifier].qualifier = annotation.qualifier;
            currentTarget.annotations[vocAlias][vocTermWithQualifier].__source = annotationList.__source;
          }

          currentTarget.annotations._annotations["".concat(vocAlias, ".").concat(vocTermWithQualifier)] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
          objectMap["".concat(currentTargetName, "@").concat(unalias(defaultReferences, vocAlias + "." + vocTermWithQualifier))] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
        });
      }
    });
    toResolve.forEach(function (resolveable) {
      var targetStr = resolveable.$target;
      var annotationsTerm = resolveable.annotationsTerm;
      var annotationType = resolveable.annotationType;
      resolveable.$target = objectMap[targetStr];
      delete resolveable.annotationType;
      delete resolveable.annotationsTerm;

      if (!resolveable.$target) {
        resolveable.targetString = targetStr;

        if (annotationsTerm && annotationType) {
          var oErrorMsg = {
            message: "Unable to resolve the path expression: " + targetStr + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + annotationsTerm + ">" + "\n" + "<Record Type = " + annotationType + ">" + "\n" + "<AnnotationPath = " + targetStr + ">"
          };
          addAnnotationErrorMessage(targetStr, oErrorMsg);
        } else {
          var _property = resolveable.term;
          var path = resolveable.path;
          var termInfo = targetStr ? targetStr.split("/")[0] : targetStr;
          var _oErrorMsg = {
            message: "Unable to resolve the path expression: " + targetStr + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + termInfo + ">" + "\n" + "<PropertyValue Property = " + _property + "        Path= " + path + ">"
          };
          addAnnotationErrorMessage(targetStr, _oErrorMsg);
        }
      }
    });

    for (var property in ALL_ANNOTATION_ERRORS) {
      ANNOTATION_ERRORS.push(ALL_ANNOTATION_ERRORS[property][0]);
    }

    parserOutput.entitySets = parserOutput.schema.entitySets;
    return {
      version: parserOutput.version,
      annotations: parserOutput.schema.annotations,
      namespace: parserOutput.schema.namespace,
      entityContainer: parserOutput.schema.entityContainer,
      actions: parserOutput.schema.actions,
      entitySets: parserOutput.schema.entitySets,
      entityTypes: parserOutput.schema.entityTypes,
      complexTypes: parserOutput.schema.complexTypes,
      references: defaultReferences,
      diagnostics: ANNOTATION_ERRORS.concat()
    };
  }

  _exports.convertTypes = convertTypes;

  function revertValueToGenericType(references, value) {
    var result;

    if (typeof value === "string") {
      var valueMatches = value.match(/(\w+)\.\w+\/.*/);

      if (valueMatches && references.find(function (ref) {
        return ref.alias === valueMatches[1];
      })) {
        result = {
          type: "EnumMember",
          EnumMember: value
        };
      } else {
        result = {
          type: "String",
          String: value
        };
      }
    } else if (Array.isArray(value)) {
      result = {
        type: "Collection",
        Collection: value.map(function (anno) {
          return revertCollectionItemToGenericType(references, anno);
        })
      };
    } else if (typeof value === "boolean") {
      result = {
        type: "Bool",
        Bool: value
      };
    } else if (typeof value === "number") {
      if (value.toString() === value.toFixed()) {
        result = {
          type: "Int",
          Int: value
        };
      } else {
        result = {
          type: "Decimal",
          Decimal: value
        };
      }
    } else if (typeof value === "object" && value.isDecimal && value.isDecimal()) {
      result = {
        type: "Decimal",
        Decimal: value.valueOf()
      };
    } else if (value.type === "Path") {
      result = {
        type: "Path",
        Path: value.path
      };
    } else if (value.type === "AnnotationPath") {
      result = {
        type: "AnnotationPath",
        AnnotationPath: value.value
      };
    } else if (value.type === "PropertyPath") {
      result = {
        type: "PropertyPath",
        PropertyPath: value.value
      };
    } else if (value.type === "NavigationPropertyPath") {
      result = {
        type: "NavigationPropertyPath",
        NavigationPropertyPath: value.value
      };
    } else if (Object.prototype.hasOwnProperty.call(value, "$Type")) {
      result = {
        type: "Record",
        Record: revertCollectionItemToGenericType(references, value)
      };
    }

    return result;
  }

  function revertCollectionItemToGenericType(references, collectionItem) {
    if (typeof collectionItem === "string") {
      return collectionItem;
    } else if (typeof collectionItem === "object") {
      if (collectionItem.hasOwnProperty("$Type")) {
        // Annotation Record
        var outItem = {
          type: collectionItem.$Type,
          propertyValues: []
        }; // Could validate keys and type based on $Type

        Object.keys(collectionItem).forEach(function (collectionKey) {
          if (collectionKey !== "$Type" && collectionKey !== "term" && collectionKey !== "__source" && collectionKey !== "qualifier" && collectionKey !== "ActionTarget" && collectionKey !== "fullyQualifiedName" && collectionKey !== "annotations") {
            var value = collectionItem[collectionKey];
            outItem.propertyValues.push({
              name: collectionKey,
              value: revertValueToGenericType(references, value)
            });
          } else if (collectionKey === "annotations") {
            var annotations = collectionItem[collectionKey];
            outItem.annotations = [];
            Object.keys(annotations).filter(function (key) {
              return key !== "_annotations";
            }).forEach(function (key) {
              Object.keys(annotations[key]).forEach(function (term) {
                var _outItem$annotations;

                var parsedAnnotation = revertTermToGenericType(references, annotations[key][term]);

                if (!parsedAnnotation.term) {
                  var unaliasedTerm = unalias(references, "".concat(key, ".").concat(term));

                  if (unaliasedTerm) {
                    var qualifiedSplit = unaliasedTerm.split("#");
                    parsedAnnotation.term = qualifiedSplit[0];

                    if (qualifiedSplit.length > 1) {
                      parsedAnnotation.qualifier = qualifiedSplit[1];
                    }
                  }
                }

                (_outItem$annotations = outItem.annotations) === null || _outItem$annotations === void 0 ? void 0 : _outItem$annotations.push(parsedAnnotation);
              });
            });
          }
        });
        return outItem;
      } else if (collectionItem.type === "PropertyPath") {
        return {
          type: "PropertyPath",
          PropertyPath: collectionItem.value
        };
      } else if (collectionItem.type === "AnnotationPath") {
        return {
          type: "AnnotationPath",
          AnnotationPath: collectionItem.value
        };
      } else if (collectionItem.type === "NavigationPropertyPath") {
        return {
          type: "NavigationPropertyPath",
          NavigationPropertyPath: collectionItem.value
        };
      }
    }
  }

  function revertTermToGenericType(references, annotation) {
    var baseAnnotation = {
      term: annotation.term,
      qualifier: annotation.qualifier
    };

    if (Array.isArray(annotation)) {
      // Collection
      return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
        collection: annotation.map(function (anno) {
          return revertCollectionItemToGenericType(references, anno);
        })
      });
    } else if (annotation.hasOwnProperty("$Type")) {
      return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
        record: revertCollectionItemToGenericType(references, annotation)
      });
    } else {
      return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
        value: revertValueToGenericType(references, annotation)
      });
    }
  }

  _exports.revertTermToGenericType = revertTermToGenericType;
  return _exports;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9zYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbW1vbi9Bbm5vdGF0aW9uQ29udmVydGVyLnRzIl0sIm5hbWVzIjpbIlBhdGgiLCJwYXRoRXhwcmVzc2lvbiIsInRhcmdldE5hbWUiLCJhbm5vdGF0aW9uc1Rlcm0iLCJhbm5vdGF0aW9uVHlwZSIsInRlcm0iLCJwYXRoIiwidHlwZSIsIiR0YXJnZXQiLCJkZWZhdWx0UmVmZXJlbmNlcyIsImFsaWFzIiwibmFtZXNwYWNlIiwidXJpIiwicmVmZXJlbmNlcyIsInVuYWxpYXNlZFZhbHVlIiwicmV2ZXJzZVJlZmVyZW5jZU1hcCIsInJlZHVjZSIsIm1hcCIsInJlZmVyZW5jZSIsImxhc3REb3RJbmRleCIsImxhc3RJbmRleE9mIiwic3Vic3RyIiwidmFsdWUiLCJpbmRleE9mIiwic3BsaXQiLCJwcmVBbGlhcyIsInBvc3RBbGlhcyIsImpvaW4iLCJ1bmFsaWFzIiwiYWxpYXNlZFZhbHVlIiwicmVmZXJlbmNlTWFwIiwiYnVpbGRPYmplY3RNYXAiLCJwYXJzZXJPdXRwdXQiLCJvYmplY3RNYXAiLCJzY2hlbWEiLCJlbnRpdHlDb250YWluZXIiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJlbnRpdHlTZXRzIiwiZm9yRWFjaCIsImVudGl0eVNldCIsImFjdGlvbnMiLCJhY3Rpb24iLCJwYXJhbWV0ZXJzIiwicGFyYW1ldGVyIiwiY29tcGxleFR5cGVzIiwiY29tcGxleFR5cGUiLCJwcm9wZXJ0aWVzIiwicHJvcGVydHkiLCJlbnRpdHlUeXBlcyIsImVudGl0eVR5cGUiLCJlbnRpdHlQcm9wZXJ0aWVzIiwiY29tcGxleFR5cGVEZWZpbml0aW9uIiwiY29tcGxleFR5cGVQcm9wIiwiY29tcGxleFR5cGVQcm9wVGFyZ2V0IiwiT2JqZWN0IiwiYXNzaWduIiwiX3R5cGUiLCJuYW1lIiwibmF2aWdhdGlvblByb3BlcnRpZXMiLCJuYXZQcm9wZXJ0eSIsImtleXMiLCJhbm5vdGF0aW9ucyIsImFubm90YXRpb25Tb3VyY2UiLCJhbm5vdGF0aW9uTGlzdCIsImN1cnJlbnRUYXJnZXROYW1lIiwidGFyZ2V0IiwiYW5ub3RhdGlvbiIsImFubm90YXRpb25GUU4iLCJxdWFsaWZpZXIiLCJjb21iaW5lUGF0aCIsImN1cnJlbnRUYXJnZXQiLCJzdGFydHNXaXRoIiwiYWRkQW5ub3RhdGlvbkVycm9yTWVzc2FnZSIsIm9FcnJvck1zZyIsIkFMTF9BTk5PVEFUSU9OX0VSUk9SUyIsInB1c2giLCJyZXNvbHZlVGFyZ2V0IiwicGF0aE9ubHkiLCJpbmNsdWRlVmlzaXRlZE9iamVjdHMiLCJ1bmRlZmluZWQiLCJhVmlzaXRlZE9iamVjdHMiLCJwYXRoU3BsaXQiLCJjdXJyZW50UGF0aCIsImN1cnJlbnRWYWx1ZSIsInBhdGhQYXJ0IiwibGVuZ3RoIiwiZW50aXR5VHlwZU5hbWUiLCJ0YXJnZXRUeXBlTmFtZSIsInRhcmdldFR5cGUiLCJpc0JvdW5kIiwic291cmNlVHlwZSIsImlzRW50aXR5U2V0IiwibGFzdElkeCIsImludGVybWVkaWF0ZVRhcmdldCIsImhhc093blByb3BlcnR5IiwibWVzc2FnZSIsInZpc2l0ZWRPYmplY3RzIiwiaXNBbm5vdGF0aW9uUGF0aCIsInBhdGhTdHIiLCJwYXJzZVZhbHVlIiwicHJvcGVydHlWYWx1ZSIsInZhbHVlRlFOIiwidG9SZXNvbHZlIiwidW5yZXNvbHZlZEFubm90YXRpb25zIiwiU3RyaW5nIiwiSW50IiwiQm9vbCIsIkRlY2ltYWwiLCJEYXRlIiwiRW51bU1lbWJlciIsIlByb3BlcnR5UGF0aCIsIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJhbm5vdGF0aW9uVGFyZ2V0IiwiQW5ub3RhdGlvblBhdGgiLCJhbm5vdGF0aW9uUGF0aCIsInBhcnNlUmVjb3JkIiwiUmVjb3JkIiwicGFyc2VDb2xsZWN0aW9uIiwiQ29sbGVjdGlvbiIsInJlY29yZERlZmluaXRpb24iLCJjdXJyZW50RlFOIiwiYW5ub3RhdGlvblRlcm0iLCIkVHlwZSIsImFubm90YXRpb25Db250ZW50IiwiQXJyYXkiLCJpc0FycmF5Iiwic3ViQW5ub3RhdGlvbkxpc3QiLCJfX3NvdXJjZSIsInByb3BlcnR5VmFsdWVzIiwiQWN0aW9uVGFyZ2V0IiwiQWN0aW9uIiwiQU5OT1RBVElPTl9FUlJPUlMiLCJnZXRPckluZmVyQ29sbGVjdGlvblR5cGUiLCJjb2xsZWN0aW9uRGVmaW5pdGlvbiIsImZpcnN0Q29sSXRlbSIsInBhcmVudEZRTiIsImNvbGxlY3Rpb25EZWZpbml0aW9uVHlwZSIsInByb3BlcnR5UGF0aCIsInByb3BlcnR5SWR4IiwicGF0aFZhbHVlIiwiYW5ub3RhdGlvbklkeCIsImFubm90YXRpb25Db2xsZWN0aW9uRWxlbWVudCIsIm5hdlByb3BlcnR5UGF0aCIsIm5hdlByb3BJZHgiLCJyZWNvcmRJZHgiLCJpZlZhbHVlIiwic3RyaW5nVmFsdWUiLCJFcnJvciIsImNvbnZlcnRBbm5vdGF0aW9uIiwicmVjb3JkIiwiY29sbGVjdGlvbiIsImNyZWF0ZVJlc29sdmVQYXRoRm4iLCJyZWxhdGl2ZVBhdGgiLCJyZXNvbHZlTmF2aWdhdGlvblByb3BlcnRpZXMiLCJhc3NvY2lhdGlvbnMiLCJuYXZQcm9wIiwib3V0TmF2UHJvcCIsInBhcnRuZXIiLCJpc0NvbGxlY3Rpb24iLCJjb250YWluc1RhcmdldCIsInJlZmVyZW50aWFsQ29uc3RyYWludCIsInJlbGF0aW9uc2hpcCIsInRhcmdldEFzc29jaWF0aW9uIiwiZmluZCIsImFzc29jaWF0aW9uIiwiYXNzb2NpYXRpb25FbmQiLCJlbmQiLCJyb2xlIiwidG9Sb2xlIiwibXVsdGlwbGljaXR5Iiwib3V0TmF2UHJvcFJlcSIsInJlc29sdmVQYXRoIiwibGlua0FjdGlvbnNUb0VudGl0eVR5cGUiLCJzb3VyY2VFbnRpdHlUeXBlIiwicmV0dXJuRW50aXR5VHlwZSIsInJldHVyblR5cGUiLCJsaW5rRW50aXR5VHlwZVRvRW50aXR5U2V0Iiwia2V5UHJvcCIsImlzS2V5IiwibGlua1Byb3BlcnRpZXNUb0NvbXBsZXhUeXBlcyIsImVudGl0eVByb3BlcnR5IiwicHJlcGFyZUNvbXBsZXhUeXBlcyIsInNwbGl0VGVybSIsInRlcm1WYWx1ZSIsImFsaWFzZWRUZXJtIiwibGFzdERvdCIsInRlcm1BbGlhcyIsImNvbnZlcnRUeXBlcyIsInZvY0FsaWFzIiwidm9jVGVybSIsIl9hbm5vdGF0aW9ucyIsInZvY1Rlcm1XaXRoUXVhbGlmaWVyIiwiZXh0cmFVbnJlc29sdmVkQW5ub3RhdGlvbnMiLCJiYXNlT2JqIiwiYW5ub3RhdGlvblBhcnQiLCJ0YXJnZXRTcGxpdCIsInNsaWNlIiwiY3VycmVudE9iaiIsInJlc29sdmVhYmxlIiwidGFyZ2V0U3RyIiwidGFyZ2V0U3RyaW5nIiwidGVybUluZm8iLCJ2ZXJzaW9uIiwiZGlhZ25vc3RpY3MiLCJjb25jYXQiLCJyZXZlcnRWYWx1ZVRvR2VuZXJpY1R5cGUiLCJyZXN1bHQiLCJ2YWx1ZU1hdGNoZXMiLCJtYXRjaCIsInJlZiIsImFubm8iLCJyZXZlcnRDb2xsZWN0aW9uSXRlbVRvR2VuZXJpY1R5cGUiLCJ0b1N0cmluZyIsInRvRml4ZWQiLCJpc0RlY2ltYWwiLCJ2YWx1ZU9mIiwicHJvdG90eXBlIiwiY2FsbCIsImNvbGxlY3Rpb25JdGVtIiwib3V0SXRlbSIsImNvbGxlY3Rpb25LZXkiLCJmaWx0ZXIiLCJrZXkiLCJwYXJzZWRBbm5vdGF0aW9uIiwicmV2ZXJ0VGVybVRvR2VuZXJpY1R5cGUiLCJ1bmFsaWFzZWRUZXJtIiwicXVhbGlmaWVkU3BsaXQiLCJiYXNlQW5ub3RhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFvQ01BLEksR0FRTCxjQUNDQyxjQURELEVBRUNDLFVBRkQsRUFHQ0MsZUFIRCxFQUlDQyxjQUpELEVBS0NDLElBTEQsRUFNRTtBQUFBOztBQUNELFNBQUtDLElBQUwsR0FBWUwsY0FBYyxDQUFDRCxJQUEzQjtBQUNBLFNBQUtPLElBQUwsR0FBWSxNQUFaO0FBQ0EsU0FBS0MsT0FBTCxHQUFlTixVQUFmO0FBQ0MsU0FBS0csSUFBTCxHQUFZQSxJQUFiLEVB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Y2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRBbm5vdGF0aW9uIGFzIEVkbUFubm90YXRpb24sXG5cdEFubm90YXRpb25MaXN0LFxuXHRBbm5vdGF0aW9uUmVjb3JkLFxuXHRBbm5vdGF0aW9uVGVybSxcblx0Q29udmVydGVyT3V0cHV0LFxuXHRFeHByZXNzaW9uLFxuXHRQYXJzZXJPdXRwdXQsXG5cdFBhdGhFeHByZXNzaW9uLFxuXHRQcm9wZXJ0eVBhdGgsXG5cdFByb3BlcnR5VmFsdWUsXG5cdEFubm90YXRpb25QYXRoRXhwcmVzc2lvbixcblx0TmF2aWdhdGlvblByb3BlcnR5UGF0aEV4cHJlc3Npb24sXG5cdFByb3BlcnR5UGF0aEV4cHJlc3Npb25cbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQge1xuXHRBc3NvY2lhdGlvbixcblx0R2VuZXJpY05hdmlnYXRpb25Qcm9wZXJ0eSxcblx0UmVmZXJlbmNlLFxuXHRQcm9wZXJ0eSBhcyBQYXJzZXJQcm9wZXJ0eSxcblx0RW50aXR5VHlwZSBhcyBQYXJzZXJFbnRpdHlUeXBlLFxuXHRDb21wbGV4VHlwZSBhcyBQYXJzZXJDb21wbGV4VHlwZSxcblx0VjJOYXZpZ2F0aW9uUHJvcGVydHksXG5cdFY0TmF2aWdhdGlvblByb3BlcnR5XG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L1BhcnNlclwiO1xuaW1wb3J0IHtcblx0QW5ub3RhdGlvbixcblx0RW50aXR5VHlwZSxcblx0Q29tcGxleFR5cGUsXG5cdEFjdGlvbixcblx0RW50aXR5U2V0LFxuXHRQcm9wZXJ0eSxcblx0TmF2aWdhdGlvblByb3BlcnR5LFxuXHRFbnRpdHlDb250YWluZXJcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvQ29udmVydGVyXCI7XG5cbmNsYXNzIFBhdGgge1xuXHRwYXRoOiBzdHJpbmc7XG5cdCR0YXJnZXQ6IHN0cmluZztcblx0dHlwZTogc3RyaW5nO1xuXHRhbm5vdGF0aW9uc1Rlcm06IHN0cmluZztcblx0YW5ub3RhdGlvblR5cGU6IHN0cmluZztcblx0dGVybTogc3RyaW5nO1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHBhdGhFeHByZXNzaW9uOiBQYXRoRXhwcmVzc2lvbixcblx0XHR0YXJnZXROYW1lOiBzdHJpbmcsXG5cdFx0YW5ub3RhdGlvbnNUZXJtOiBzdHJpbmcsXG5cdFx0YW5ub3RhdGlvblR5cGU6IHN0cmluZyxcblx0XHR0ZXJtOiBzdHJpbmdcblx0KSB7XG5cdFx0dGhpcy5wYXRoID0gcGF0aEV4cHJlc3Npb24uUGF0aDtcblx0XHR0aGlzLnR5cGUgPSBcIlBhdGhcIjtcblx0XHR0aGlzLiR0YXJnZXQgPSB0YXJnZXROYW1lO1xuXHRcdCh0aGlzLnRlcm0gPSB0ZXJtKSwgKHRoaXMuYW5ub3RhdGlvblR5cGUgPSBhbm5vdGF0aW9uVHlwZSksICh0aGlzLmFubm90YXRpb25zVGVybSA9IGFubm90YXRpb25zVGVybSk7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRSZWZlcmVuY2VzOiBSZWZlcmVuY2VzV2l0aE1hcCA9IFtcblx0eyBhbGlhczogXCJDYXBhYmlsaXRpZXNcIiwgbmFtZXNwYWNlOiBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjFcIiwgdXJpOiBcIlwiIH0sXG5cdHsgYWxpYXM6IFwiQWdncmVnYXRpb25cIiwgbmFtZXNwYWNlOiBcIk9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMVwiLCB1cmk6IFwiXCIgfSxcblx0eyBhbGlhczogXCJWYWxpZGF0aW9uXCIsIG5hbWVzcGFjZTogXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMVwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiT3JnLk9EYXRhLkNvcmUuVjFcIiwgYWxpYXM6IFwiQ29yZVwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiT3JnLk9EYXRhLk1lYXN1cmVzLlYxXCIsIGFsaWFzOiBcIk1lYXN1cmVzXCIsIHVyaTogXCJcIiB9LFxuXHR7IG5hbWVzcGFjZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjFcIiwgYWxpYXM6IFwiQ29tbW9uXCIsIHVyaTogXCJcIiB9LFxuXHR7IG5hbWVzcGFjZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MVwiLCBhbGlhczogXCJVSVwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuU2Vzc2lvbi52MVwiLCBhbGlhczogXCJTZXNzaW9uXCIsIHVyaTogXCJcIiB9LFxuXHR7IG5hbWVzcGFjZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5BbmFseXRpY3MudjFcIiwgYWxpYXM6IFwiQW5hbHl0aWNzXCIsIHVyaTogXCJcIiB9LFxuXHR7IG5hbWVzcGFjZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db2RlTGlzdC52MVwiLCBhbGlhczogXCJDb2RlTGlzdFwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxXCIsIGFsaWFzOiBcIlBlcnNvbmFsRGF0YVwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MVwiLCBhbGlhczogXCJDb21tdW5pY2F0aW9uXCIsIHVyaTogXCJcIiB9LFxuXHR7IG5hbWVzcGFjZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5IVE1MNS52MVwiLCBhbGlhczogXCJIVE1MNVwiLCB1cmk6IFwiXCIgfVxuXTtcblxudHlwZSBSZWZlcmVuY2VzV2l0aE1hcCA9IFJlZmVyZW5jZVtdICYge1xuXHRyZWZlcmVuY2VNYXA/OiBSZWNvcmQ8c3RyaW5nLCBSZWZlcmVuY2U+O1xuXHRyZXZlcnNlUmVmZXJlbmNlTWFwPzogUmVjb3JkPHN0cmluZywgUmVmZXJlbmNlPjtcbn07XG5cbmZ1bmN0aW9uIGFsaWFzKHJlZmVyZW5jZXM6IFJlZmVyZW5jZXNXaXRoTWFwLCB1bmFsaWFzZWRWYWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcblx0aWYgKCFyZWZlcmVuY2VzLnJldmVyc2VSZWZlcmVuY2VNYXApIHtcblx0XHRyZWZlcmVuY2VzLnJldmVyc2VSZWZlcmVuY2VNYXAgPSByZWZlcmVuY2VzLnJlZHVjZSgobWFwOiBSZWNvcmQ8c3RyaW5nLCBSZWZlcmVuY2U+LCByZWZlcmVuY2UpID0+IHtcblx0XHRcdG1hcFtyZWZlcmVuY2UubmFtZXNwYWNlXSA9IHJlZmVyZW5jZTtcblx0XHRcdHJldHVybiBtYXA7XG5cdFx0fSwge30pO1xuXHR9XG5cdGlmICghdW5hbGlhc2VkVmFsdWUpIHtcblx0XHRyZXR1cm4gdW5hbGlhc2VkVmFsdWU7XG5cdH1cblx0Y29uc3QgbGFzdERvdEluZGV4ID0gdW5hbGlhc2VkVmFsdWUubGFzdEluZGV4T2YoXCIuXCIpO1xuXHRjb25zdCBuYW1lc3BhY2UgPSB1bmFsaWFzZWRWYWx1ZS5zdWJzdHIoMCwgbGFzdERvdEluZGV4KTtcblx0Y29uc3QgdmFsdWUgPSB1bmFsaWFzZWRWYWx1ZS5zdWJzdHIobGFzdERvdEluZGV4ICsgMSk7XG5cdGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZXMucmV2ZXJzZVJlZmVyZW5jZU1hcFtuYW1lc3BhY2VdO1xuXHRpZiAocmVmZXJlbmNlKSB7XG5cdFx0cmV0dXJuIGAke3JlZmVyZW5jZS5hbGlhc30uJHt2YWx1ZX1gO1xuXHR9IGVsc2Uge1xuXHRcdC8vIFRyeSB0byBzZWUgaWYgaXQncyBhbiBhbm5vdGF0aW9uIFBhdGggbGlrZSB0b19TYWxlc09yZGVyL0BVSS5MaW5lSXRlbVxuXHRcdGlmICh1bmFsaWFzZWRWYWx1ZS5pbmRleE9mKFwiQFwiKSAhPT0gLTEpIHtcblx0XHRcdGNvbnN0IFtwcmVBbGlhcywgLi4ucG9zdEFsaWFzXSA9IHVuYWxpYXNlZFZhbHVlLnNwbGl0KFwiQFwiKTtcblx0XHRcdHJldHVybiBgJHtwcmVBbGlhc31AJHthbGlhcyhyZWZlcmVuY2VzLCBwb3N0QWxpYXMuam9pbihcIkBcIikpfWA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB1bmFsaWFzZWRWYWx1ZTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gdW5hbGlhcyhyZWZlcmVuY2VzOiBSZWZlcmVuY2VzV2l0aE1hcCwgYWxpYXNlZFZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRpZiAoIXJlZmVyZW5jZXMucmVmZXJlbmNlTWFwKSB7XG5cdFx0cmVmZXJlbmNlcy5yZWZlcmVuY2VNYXAgPSByZWZlcmVuY2VzLnJlZHVjZSgobWFwOiBSZWNvcmQ8c3RyaW5nLCBSZWZlcmVuY2U+LCByZWZlcmVuY2UpID0+IHtcblx0XHRcdG1hcFtyZWZlcmVuY2UuYWxpYXNdID0gcmVmZXJlbmNlO1xuXHRcdFx0cmV0dXJuIG1hcDtcblx0XHR9LCB7fSk7XG5cdH1cblx0aWYgKCFhbGlhc2VkVmFsdWUpIHtcblx0XHRyZXR1cm4gYWxpYXNlZFZhbHVlO1xuXHR9XG5cdGNvbnN0IFthbGlhcywgdmFsdWVdID0gYWxpYXNlZFZhbHVlLnNwbGl0KFwiLlwiKTtcblx0Y29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlcy5yZWZlcmVuY2VNYXBbYWxpYXNdO1xuXHRpZiAocmVmZXJlbmNlKSB7XG5cdFx0cmV0dXJuIGAke3JlZmVyZW5jZS5uYW1lc3BhY2V9LiR7dmFsdWV9YDtcblx0fSBlbHNlIHtcblx0XHQvLyBUcnkgdG8gc2VlIGlmIGl0J3MgYW4gYW5ub3RhdGlvbiBQYXRoIGxpa2UgdG9fU2FsZXNPcmRlci9AVUkuTGluZUl0ZW1cblx0XHRpZiAoYWxpYXNlZFZhbHVlLmluZGV4T2YoXCJAXCIpICE9PSAtMSkge1xuXHRcdFx0Y29uc3QgW3ByZUFsaWFzLCAuLi5wb3N0QWxpYXNdID0gYWxpYXNlZFZhbHVlLnNwbGl0KFwiQFwiKTtcblx0XHRcdHJldHVybiBgJHtwcmVBbGlhc31AJHt1bmFsaWFzKHJlZmVyZW5jZXMsIHBvc3RBbGlhcy5qb2luKFwiQFwiKSl9YDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGFsaWFzZWRWYWx1ZTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYnVpbGRPYmplY3RNYXAocGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcblx0Y29uc3Qgb2JqZWN0TWFwOiBhbnkgPSB7fTtcblx0aWYgKHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5Q29udGFpbmVyICYmIHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5Q29udGFpbmVyLmZ1bGx5UXVhbGlmaWVkTmFtZSkge1xuXHRcdG9iamVjdE1hcFtwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eUNvbnRhaW5lci5mdWxseVF1YWxpZmllZE5hbWVdID0gcGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlDb250YWluZXI7XG5cdH1cblx0cGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlTZXRzLmZvckVhY2goZW50aXR5U2V0ID0+IHtcblx0XHRvYmplY3RNYXBbZW50aXR5U2V0LmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBlbnRpdHlTZXQ7XG5cdH0pO1xuXHRwYXJzZXJPdXRwdXQuc2NoZW1hLmFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuXHRcdG9iamVjdE1hcFthY3Rpb24uZnVsbHlRdWFsaWZpZWROYW1lXSA9IGFjdGlvbjtcblx0XHRvYmplY3RNYXBbYWN0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZS5zcGxpdChcIihcIilbMF1dID0gYWN0aW9uO1xuXHRcdGFjdGlvbi5wYXJhbWV0ZXJzLmZvckVhY2gocGFyYW1ldGVyID0+IHtcblx0XHRcdG9iamVjdE1hcFtwYXJhbWV0ZXIuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHBhcmFtZXRlcjtcblx0XHR9KTtcblx0fSk7XG5cdHBhcnNlck91dHB1dC5zY2hlbWEuY29tcGxleFR5cGVzLmZvckVhY2goY29tcGxleFR5cGUgPT4ge1xuXHRcdG9iamVjdE1hcFtjb21wbGV4VHlwZS5mdWxseVF1YWxpZmllZE5hbWVdID0gY29tcGxleFR5cGU7XG5cdFx0Y29tcGxleFR5cGUucHJvcGVydGllcy5mb3JFYWNoKHByb3BlcnR5ID0+IHtcblx0XHRcdG9iamVjdE1hcFtwcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWVdID0gcHJvcGVydHk7XG5cdFx0fSk7XG5cdH0pO1xuXHRwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eVR5cGVzLmZvckVhY2goZW50aXR5VHlwZSA9PiB7XG5cdFx0b2JqZWN0TWFwW2VudGl0eVR5cGUuZnVsbHlRdWFsaWZpZWROYW1lXSA9IGVudGl0eVR5cGU7XG5cdFx0ZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzLmZvckVhY2gocHJvcGVydHkgPT4ge1xuXHRcdFx0b2JqZWN0TWFwW3Byb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBwcm9wZXJ0eTtcblx0XHRcdGlmIChwcm9wZXJ0eS50eXBlLmluZGV4T2YoXCJFZG1cIikgPT09IC0xKSB7XG5cdFx0XHRcdC8vIEhhbmRsZSBjb21wbGV4IHR5cGVzXG5cdFx0XHRcdGNvbnN0IGNvbXBsZXhUeXBlRGVmaW5pdGlvbiA9IG9iamVjdE1hcFtwcm9wZXJ0eS50eXBlXSBhcyBDb21wbGV4VHlwZTtcblx0XHRcdFx0aWYgKGNvbXBsZXhUeXBlRGVmaW5pdGlvbiAmJiBjb21wbGV4VHlwZURlZmluaXRpb24ucHJvcGVydGllcykge1xuXHRcdFx0XHRcdGNvbXBsZXhUeXBlRGVmaW5pdGlvbi5wcm9wZXJ0aWVzLmZvckVhY2goY29tcGxleFR5cGVQcm9wID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IGNvbXBsZXhUeXBlUHJvcFRhcmdldDogUGFyc2VyUHJvcGVydHkgPSBPYmplY3QuYXNzaWduKGNvbXBsZXhUeXBlUHJvcCwge1xuXHRcdFx0XHRcdFx0XHRfdHlwZTogXCJQcm9wZXJ0eVwiLFxuXHRcdFx0XHRcdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IHByb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZSArIFwiL1wiICsgY29tcGxleFR5cGVQcm9wLm5hbWVcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0b2JqZWN0TWFwW2NvbXBsZXhUeXBlUHJvcFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWVdID0gY29tcGxleFR5cGVQcm9wVGFyZ2V0O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0ZW50aXR5VHlwZS5uYXZpZ2F0aW9uUHJvcGVydGllcy5mb3JFYWNoKG5hdlByb3BlcnR5ID0+IHtcblx0XHRcdG9iamVjdE1hcFtuYXZQcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWVdID0gbmF2UHJvcGVydHk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdE9iamVjdC5rZXlzKHBhcnNlck91dHB1dC5zY2hlbWEuYW5ub3RhdGlvbnMpLmZvckVhY2goYW5ub3RhdGlvblNvdXJjZSA9PiB7XG5cdFx0cGFyc2VyT3V0cHV0LnNjaGVtYS5hbm5vdGF0aW9uc1thbm5vdGF0aW9uU291cmNlXS5mb3JFYWNoKGFubm90YXRpb25MaXN0ID0+IHtcblx0XHRcdGNvbnN0IGN1cnJlbnRUYXJnZXROYW1lID0gdW5hbGlhcyhwYXJzZXJPdXRwdXQucmVmZXJlbmNlcywgYW5ub3RhdGlvbkxpc3QudGFyZ2V0KTtcblx0XHRcdGFubm90YXRpb25MaXN0LmFubm90YXRpb25zLmZvckVhY2goYW5ub3RhdGlvbiA9PiB7XG5cdFx0XHRcdGxldCBhbm5vdGF0aW9uRlFOID0gYCR7Y3VycmVudFRhcmdldE5hbWV9QCR7dW5hbGlhcyhwYXJzZXJPdXRwdXQucmVmZXJlbmNlcywgYW5ub3RhdGlvbi50ZXJtKX1gO1xuXHRcdFx0XHRpZiAoYW5ub3RhdGlvbi5xdWFsaWZpZXIpIHtcblx0XHRcdFx0XHRhbm5vdGF0aW9uRlFOICs9IGAjJHthbm5vdGF0aW9uLnF1YWxpZmllcn1gO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG9iamVjdE1hcFthbm5vdGF0aW9uRlFOXSA9IGFubm90YXRpb247XG5cdFx0XHRcdChhbm5vdGF0aW9uIGFzIEFubm90YXRpb24pLmZ1bGx5UXVhbGlmaWVkTmFtZSA9IGFubm90YXRpb25GUU47XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiBvYmplY3RNYXA7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVQYXRoKGN1cnJlbnRUYXJnZXQ6IHN0cmluZywgcGF0aDogc3RyaW5nKTogc3RyaW5nIHtcblx0aWYgKHBhdGguc3RhcnRzV2l0aChcIkBcIikpIHtcblx0XHRyZXR1cm4gY3VycmVudFRhcmdldCArIHVuYWxpYXMoZGVmYXVsdFJlZmVyZW5jZXMsIHBhdGgpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBjdXJyZW50VGFyZ2V0ICsgXCIvXCIgKyBwYXRoO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGFkZEFubm90YXRpb25FcnJvck1lc3NhZ2UocGF0aDogc3RyaW5nLCBvRXJyb3JNc2c6IGFueSkge1xuXHRpZiAoIUFMTF9BTk5PVEFUSU9OX0VSUk9SU1twYXRoXSkge1xuXHRcdEFMTF9BTk5PVEFUSU9OX0VSUk9SU1twYXRoXSA9IFtvRXJyb3JNc2ddO1xuXHR9IGVsc2Uge1xuXHRcdEFMTF9BTk5PVEFUSU9OX0VSUk9SU1twYXRoXS5wdXNoKG9FcnJvck1zZyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVRhcmdldChcblx0b2JqZWN0TWFwOiBhbnksXG5cdGN1cnJlbnRUYXJnZXQ6IGFueSxcblx0cGF0aDogc3RyaW5nLFxuXHRwYXRoT25seTogYm9vbGVhbiA9IGZhbHNlLFxuXHRpbmNsdWRlVmlzaXRlZE9iamVjdHM6IGJvb2xlYW4gPSBmYWxzZSxcblx0YW5ub3RhdGlvblR5cGU6IHN0cmluZyxcblx0YW5ub3RhdGlvbnNUZXJtOiBzdHJpbmdcbikge1xuXHRpZiAoIXBhdGgpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cdC8vY29uc3QgcHJvcGVydHlQYXRoID0gcGF0aDtcblx0Y29uc3QgYVZpc2l0ZWRPYmplY3RzOiBhbnlbXSA9IFtdO1xuXHRwYXRoID0gY29tYmluZVBhdGgoY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGgpO1xuXG5cdGNvbnN0IHBhdGhTcGxpdCA9IHBhdGguc3BsaXQoXCIvXCIpO1xuXHRsZXQgY3VycmVudFBhdGggPSBwYXRoO1xuXHRjb25zdCB0YXJnZXQgPSBwYXRoU3BsaXQucmVkdWNlKChjdXJyZW50VmFsdWU6IGFueSwgcGF0aFBhcnQpID0+IHtcblx0XHRpZiAocGF0aFBhcnQubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gY3VycmVudFZhbHVlO1xuXHRcdH1cblx0XHRpZiAoaW5jbHVkZVZpc2l0ZWRPYmplY3RzICYmIGN1cnJlbnRWYWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0YVZpc2l0ZWRPYmplY3RzLnB1c2goY3VycmVudFZhbHVlKTtcblx0XHR9XG5cdFx0aWYgKCFjdXJyZW50VmFsdWUpIHtcblx0XHRcdGN1cnJlbnRQYXRoID0gcGF0aFBhcnQ7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiRW50aXR5U2V0XCIgJiYgY3VycmVudFZhbHVlLmVudGl0eVR5cGUpIHtcblx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoY3VycmVudFZhbHVlLmVudGl0eVR5cGVOYW1lLCBwYXRoUGFydCk7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIgJiYgY3VycmVudFZhbHVlLnRhcmdldFR5cGVOYW1lKSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlTmFtZSwgcGF0aFBhcnQpO1xuXHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiICYmIGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlKSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZSwgcGF0aFBhcnQpO1xuXHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSBcIlByb3BlcnR5XCIpIHtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUudHlwZS5pbmRleE9mKFwiRWRtXCIpID09PSAtMSkge1xuXHRcdFx0XHQvLyBUaGlzIGlzIGEgY29tcGxleCB0eXBlXG5cdFx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoY3VycmVudFZhbHVlLmZ1bGx5UXVhbGlmaWVkTmFtZSwgcGF0aFBhcnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3VycmVudFBhdGggPSBjb21iaW5lUGF0aChcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZS5zdWJzdHIoMCwgY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUubGFzdEluZGV4T2YoXCIvXCIpKSxcblx0XHRcdFx0XHRwYXRoUGFydFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSBcIkFjdGlvblwiICYmIGN1cnJlbnRWYWx1ZS5pc0JvdW5kKSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0KTtcblx0XHRcdGlmICghb2JqZWN0TWFwW2N1cnJlbnRQYXRoXSkge1xuXHRcdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5zb3VyY2VUeXBlLCBwYXRoUGFydCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiQWN0aW9uUGFyYW1ldGVyXCIgJiYgY3VycmVudFZhbHVlLmlzRW50aXR5U2V0KSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS50eXBlLCBwYXRoUGFydCk7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiQWN0aW9uUGFyYW1ldGVyXCIgJiYgIWN1cnJlbnRWYWx1ZS5pc0VudGl0eVNldCkge1xuXHRcdFx0Y3VycmVudFBhdGggPSBjb21iaW5lUGF0aChcblx0XHRcdFx0Y3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUuc3Vic3RyKDAsIGN1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lLmxhc3RJbmRleE9mKFwiL1wiKSksXG5cdFx0XHRcdHBhdGhQYXJ0XG5cdFx0XHQpO1xuXHRcdFx0aWYgKCFvYmplY3RNYXBbY3VycmVudFBhdGhdKSB7XG5cdFx0XHRcdGxldCBsYXN0SWR4ID0gY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUubGFzdEluZGV4T2YoXCIvXCIpO1xuXHRcdFx0XHRpZiAobGFzdElkeCA9PT0gLTEpIHtcblx0XHRcdFx0XHRsYXN0SWR4ID0gY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoXG5cdFx0XHRcdFx0KG9iamVjdE1hcFtjdXJyZW50VGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZS5zdWJzdHIoMCwgbGFzdElkeCldIGFzIEFjdGlvbikuc291cmNlVHlwZSxcblx0XHRcdFx0XHRwYXRoUGFydFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0KTtcblx0XHRcdGlmIChwYXRoUGFydCAhPT0gXCJuYW1lXCIgJiYgY3VycmVudFZhbHVlW3BhdGhQYXJ0XSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50VmFsdWVbcGF0aFBhcnRdO1xuXHRcdFx0fSBlbHNlIGlmIChwYXRoUGFydCA9PT0gXCIkQW5ub3RhdGlvblBhdGhcIiAmJiBjdXJyZW50VmFsdWUuJHRhcmdldCkge1xuXHRcdFx0XHRyZXR1cm4gY3VycmVudFZhbHVlLiR0YXJnZXQ7XG5cdFx0XHR9IGVsc2UgaWYgKHBhdGhQYXJ0ID09PSBcIiRQYXRoXCIgJiYgY3VycmVudFZhbHVlLiR0YXJnZXQpIHtcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRWYWx1ZS4kdGFyZ2V0O1xuXHRcdFx0fSBlbHNlIGlmIChwYXRoUGFydC5zdGFydHNXaXRoKFwiJFBhdGhcIikgJiYgY3VycmVudFZhbHVlLiR0YXJnZXQpIHtcblx0XHRcdFx0Y29uc3QgaW50ZXJtZWRpYXRlVGFyZ2V0ID0gY3VycmVudFZhbHVlLiR0YXJnZXQ7XG5cdFx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoaW50ZXJtZWRpYXRlVGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZSwgcGF0aFBhcnQuc3Vic3RyKDUpKTtcblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLmhhc093blByb3BlcnR5KFwiJFR5cGVcIikpIHtcblx0XHRcdFx0Ly8gVGhpcyBpcyBub3cgYW4gYW5ub3RhdGlvbiB2YWx1ZVxuXHRcdFx0XHRjb25zdCBlbnRpdHlUeXBlID0gb2JqZWN0TWFwW2N1cnJlbnRWYWx1ZS5mdWxseVF1YWxpZmllZE5hbWUuc3BsaXQoXCJAXCIpWzBdXTtcblx0XHRcdFx0aWYgKGVudGl0eVR5cGUpIHtcblx0XHRcdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGVudGl0eVR5cGUuZnVsbHlRdWFsaWZpZWROYW1lLCBwYXRoUGFydCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdE1hcFtjdXJyZW50UGF0aF07XG5cdH0sIG51bGwpO1xuXHRpZiAoIXRhcmdldCkge1xuXHRcdGlmIChhbm5vdGF0aW9uc1Rlcm0gJiYgYW5ub3RhdGlvblR5cGUpIHtcblx0XHRcdHZhciBvRXJyb3JNc2cgPSB7XG5cdFx0XHRcdG1lc3NhZ2U6XG5cdFx0XHRcdFx0XCJVbmFibGUgdG8gcmVzb2x2ZSB0aGUgcGF0aCBleHByZXNzaW9uOiBcIiArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0cGF0aCArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XCJIaW50OiBDaGVjayBhbmQgY29ycmVjdCB0aGUgcGF0aCB2YWx1ZXMgdW5kZXIgdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmUgaW4gdGhlIG1ldGFkYXRhIChhbm5vdGF0aW9uLnhtbCBmaWxlIG9yIENEUyBhbm5vdGF0aW9ucyBmb3IgdGhlIGFwcGxpY2F0aW9uKTogXFxuXFxuXCIgK1xuXHRcdFx0XHRcdFwiPEFubm90YXRpb24gVGVybSA9IFwiICtcblx0XHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm0gK1xuXHRcdFx0XHRcdFwiPlwiICtcblx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcIjxSZWNvcmQgVHlwZSA9IFwiICtcblx0XHRcdFx0XHRhbm5vdGF0aW9uVHlwZSArXG5cdFx0XHRcdFx0XCI+XCIgK1xuXHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFwiPEFubm90YXRpb25QYXRoID0gXCIgK1xuXHRcdFx0XHRcdHBhdGggK1xuXHRcdFx0XHRcdFwiPlwiXG5cdFx0XHR9O1xuXHRcdFx0YWRkQW5ub3RhdGlvbkVycm9yTWVzc2FnZShwYXRoLCBvRXJyb3JNc2cpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgb0Vycm9yTXNnID0ge1xuXHRcdFx0XHRtZXNzYWdlOlxuXHRcdFx0XHRcdFwiVW5hYmxlIHRvIHJlc29sdmUgdGhlIHBhdGggZXhwcmVzc2lvbjogXCIgK1xuXHRcdFx0XHRcdHBhdGggK1xuXHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFwiSGludDogQ2hlY2sgYW5kIGNvcnJlY3QgdGhlIHBhdGggdmFsdWVzIHVuZGVyIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlIGluIHRoZSBtZXRhZGF0YSAoYW5ub3RhdGlvbi54bWwgZmlsZSBvciBDRFMgYW5ub3RhdGlvbnMgZm9yIHRoZSBhcHBsaWNhdGlvbik6IFxcblxcblwiICtcblx0XHRcdFx0XHRcIjxBbm5vdGF0aW9uIFRlcm0gPSBcIiArXG5cdFx0XHRcdFx0cGF0aFNwbGl0WzBdICtcblx0XHRcdFx0XHRcIj5cIiArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XCI8UHJvcGVydHlWYWx1ZSAgUGF0aD0gXCIgK1xuXHRcdFx0XHRcdHBhdGhTcGxpdFsxXSArXG5cdFx0XHRcdFx0XCI+XCJcblx0XHRcdH07XG5cdFx0XHRhZGRBbm5vdGF0aW9uRXJyb3JNZXNzYWdlKHBhdGgsIG9FcnJvck1zZyk7XG5cdFx0fVxuXHRcdC8vIGNvbnNvbGUubG9nKFwiTWlzc2luZyB0YXJnZXQgXCIgKyBwYXRoKTtcblx0fVxuXHRpZiAocGF0aE9ubHkpIHtcblx0XHRyZXR1cm4gY3VycmVudFBhdGg7XG5cdH1cblx0aWYgKGluY2x1ZGVWaXNpdGVkT2JqZWN0cykge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2aXNpdGVkT2JqZWN0czogYVZpc2l0ZWRPYmplY3RzLFxuXHRcdFx0dGFyZ2V0OiB0YXJnZXRcblx0XHR9O1xuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGlzQW5ub3RhdGlvblBhdGgocGF0aFN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiBwYXRoU3RyLmluZGV4T2YoXCJAXCIpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZShcblx0cHJvcGVydHlWYWx1ZTogRXhwcmVzc2lvbixcblx0dmFsdWVGUU46IHN0cmluZyxcblx0cGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQsXG5cdGN1cnJlbnRUYXJnZXQ6IGFueSxcblx0b2JqZWN0TWFwOiBhbnksXG5cdHRvUmVzb2x2ZTogUmVzb2x2ZWFibGVbXSxcblx0YW5ub3RhdGlvblNvdXJjZTogc3RyaW5nLFxuXHR1bnJlc29sdmVkQW5ub3RhdGlvbnM6IEFubm90YXRpb25MaXN0W10sXG5cdGFubm90YXRpb25UeXBlOiBzdHJpbmcsXG5cdGFubm90YXRpb25zVGVybTogc3RyaW5nXG4pIHtcblx0aWYgKHByb3BlcnR5VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0c3dpdGNoIChwcm9wZXJ0eVZhbHVlLnR5cGUpIHtcblx0XHRjYXNlIFwiU3RyaW5nXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5TdHJpbmc7XG5cdFx0Y2FzZSBcIkludFwiOlxuXHRcdFx0cmV0dXJuIHByb3BlcnR5VmFsdWUuSW50O1xuXHRcdGNhc2UgXCJCb29sXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5Cb29sO1xuXHRcdGNhc2UgXCJEZWNpbWFsXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5EZWNpbWFsO1xuXHRcdGNhc2UgXCJEYXRlXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5EYXRlO1xuXHRcdGNhc2UgXCJFbnVtTWVtYmVyXCI6XG5cdFx0XHRyZXR1cm4gYWxpYXMocGFyc2VyT3V0cHV0LnJlZmVyZW5jZXMsIHByb3BlcnR5VmFsdWUuRW51bU1lbWJlcik7XG5cdFx0Y2FzZSBcIlByb3BlcnR5UGF0aFwiOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHlwZTogXCJQcm9wZXJ0eVBhdGhcIixcblx0XHRcdFx0dmFsdWU6IHByb3BlcnR5VmFsdWUuUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IHZhbHVlRlFOLFxuXHRcdFx0XHQkdGFyZ2V0OiByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdHByb3BlcnR5VmFsdWUuUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRcdGFubm90YXRpb25zVGVybVxuXHRcdFx0XHQpXG5cdFx0XHR9O1xuXHRcdGNhc2UgXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCI6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XHRcdFx0dmFsdWU6IHByb3BlcnR5VmFsdWUuTmF2aWdhdGlvblByb3BlcnR5UGF0aCxcblx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiB2YWx1ZUZRTixcblx0XHRcdFx0JHRhcmdldDogcmVzb2x2ZVRhcmdldChcblx0XHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlLk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdClcblx0XHRcdH07XG5cdFx0Y2FzZSBcIkFubm90YXRpb25QYXRoXCI6XG5cdFx0XHRjb25zdCBhbm5vdGF0aW9uVGFyZ2V0ID0gcmVzb2x2ZVRhcmdldChcblx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHR1bmFsaWFzKHBhcnNlck91dHB1dC5yZWZlcmVuY2VzLCBwcm9wZXJ0eVZhbHVlLkFubm90YXRpb25QYXRoKSBhcyBzdHJpbmcsXG5cdFx0XHRcdHRydWUsXG5cdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvblBhdGggPSB7XG5cdFx0XHRcdHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIixcblx0XHRcdFx0dmFsdWU6IHByb3BlcnR5VmFsdWUuQW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogdmFsdWVGUU4sXG5cdFx0XHRcdCR0YXJnZXQ6IGFubm90YXRpb25UYXJnZXQsXG5cdFx0XHRcdGFubm90YXRpb25UeXBlOiBhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtOiBhbm5vdGF0aW9uc1Rlcm0sXG5cdFx0XHRcdHRlcm06IFwiXCIsXG5cdFx0XHRcdHBhdGg6IFwiXCJcblx0XHRcdH07XG5cdFx0XHR0b1Jlc29sdmUucHVzaChhbm5vdGF0aW9uUGF0aCk7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvblBhdGg7XG5cdFx0Y2FzZSBcIlBhdGhcIjpcblx0XHRcdGlmIChpc0Fubm90YXRpb25QYXRoKHByb3BlcnR5VmFsdWUuUGF0aCkpIHtcblx0XHRcdFx0Ly8gSWYgaXQncyBhbiBhbm50b2F0aW9uIHRoYXQgd2UgY2FuIHJlc29sdmUsIHJlc29sdmUgaXQgIVxuXHRcdFx0XHRjb25zdCAkdGFyZ2V0ID0gcmVzb2x2ZVRhcmdldChcblx0XHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlLlBhdGgsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGlmICgkdGFyZ2V0KSB7XG5cdFx0XHRcdFx0cmV0dXJuICR0YXJnZXQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNvbnN0ICR0YXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdHByb3BlcnR5VmFsdWUuUGF0aCxcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm1cblx0XHRcdCk7XG5cdFx0XHRjb25zdCBwYXRoID0gbmV3IFBhdGgocHJvcGVydHlWYWx1ZSwgJHRhcmdldCwgYW5ub3RhdGlvbnNUZXJtLCBhbm5vdGF0aW9uVHlwZSwgXCJcIik7XG5cdFx0XHR0b1Jlc29sdmUucHVzaChwYXRoKTtcblx0XHRcdHJldHVybiBwYXRoO1xuXG5cdFx0Y2FzZSBcIlJlY29yZFwiOlxuXHRcdFx0cmV0dXJuIHBhcnNlUmVjb3JkKFxuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlLlJlY29yZCxcblx0XHRcdFx0dmFsdWVGUU4sXG5cdFx0XHRcdHBhcnNlck91dHB1dCxcblx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHR0b1Jlc29sdmUsXG5cdFx0XHRcdGFubm90YXRpb25Tb3VyY2UsXG5cdFx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucyxcblx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdGFubm90YXRpb25zVGVybVxuXHRcdFx0KTtcblx0XHRjYXNlIFwiQ29sbGVjdGlvblwiOlxuXHRcdFx0cmV0dXJuIHBhcnNlQ29sbGVjdGlvbihcblx0XHRcdFx0cHJvcGVydHlWYWx1ZS5Db2xsZWN0aW9uLFxuXHRcdFx0XHR2YWx1ZUZRTixcblx0XHRcdFx0cGFyc2VyT3V0cHV0LFxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdHRvUmVzb2x2ZSxcblx0XHRcdFx0YW5ub3RhdGlvblNvdXJjZSxcblx0XHRcdFx0dW5yZXNvbHZlZEFubm90YXRpb25zLFxuXHRcdFx0XHRhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHQpO1xuXHRcdGNhc2UgXCJBcHBseVwiOlxuXHRcdGNhc2UgXCJJZlwiOlxuXHRcdFx0cmV0dXJuIHByb3BlcnR5VmFsdWU7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VSZWNvcmQoXG5cdHJlY29yZERlZmluaXRpb246IEFubm90YXRpb25SZWNvcmQsXG5cdGN1cnJlbnRGUU46IHN0cmluZyxcblx0cGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQsXG5cdGN1cnJlbnRUYXJnZXQ6IGFueSxcblx0b2JqZWN0TWFwOiBhbnksXG5cdHRvUmVzb2x2ZTogUmVzb2x2ZWFibGVbXSxcblx0YW5ub3RhdGlvblNvdXJjZTogc3RyaW5nLFxuXHR1bnJlc29sdmVkQW5ub3RhdGlvbnM6IEFubm90YXRpb25MaXN0W10sXG5cdGFubm90YXRpb25UeXBlOiBzdHJpbmcsXG5cdGFubm90YXRpb25zVGVybTogc3RyaW5nXG4pIHtcblx0Y29uc3QgYW5ub3RhdGlvblRlcm06IGFueSA9IHtcblx0XHQkVHlwZTogdW5hbGlhcyhwYXJzZXJPdXRwdXQucmVmZXJlbmNlcywgcmVjb3JkRGVmaW5pdGlvbi50eXBlKSxcblx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGN1cnJlbnRGUU5cblx0fTtcblx0Y29uc3QgYW5ub3RhdGlvbkNvbnRlbnQ6IGFueSA9IHt9O1xuXHRpZiAocmVjb3JkRGVmaW5pdGlvbi5hbm5vdGF0aW9ucyAmJiBBcnJheS5pc0FycmF5KHJlY29yZERlZmluaXRpb24uYW5ub3RhdGlvbnMpKSB7XG5cdFx0Y29uc3Qgc3ViQW5ub3RhdGlvbkxpc3QgPSB7XG5cdFx0XHR0YXJnZXQ6IGN1cnJlbnRGUU4sXG5cdFx0XHRhbm5vdGF0aW9uczogcmVjb3JkRGVmaW5pdGlvbi5hbm5vdGF0aW9ucyxcblx0XHRcdF9fc291cmNlOiBhbm5vdGF0aW9uU291cmNlXG5cdFx0fTtcblx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMucHVzaChzdWJBbm5vdGF0aW9uTGlzdCk7XG5cdH1cblx0cmVjb3JkRGVmaW5pdGlvbi5wcm9wZXJ0eVZhbHVlcy5mb3JFYWNoKChwcm9wZXJ0eVZhbHVlOiBQcm9wZXJ0eVZhbHVlKSA9PiB7XG5cdFx0YW5ub3RhdGlvbkNvbnRlbnRbcHJvcGVydHlWYWx1ZS5uYW1lXSA9IHBhcnNlVmFsdWUoXG5cdFx0XHRwcm9wZXJ0eVZhbHVlLnZhbHVlLFxuXHRcdFx0YCR7Y3VycmVudEZRTn0vJHtwcm9wZXJ0eVZhbHVlLm5hbWV9YCxcblx0XHRcdHBhcnNlck91dHB1dCxcblx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRvYmplY3RNYXAsXG5cdFx0XHR0b1Jlc29sdmUsXG5cdFx0XHRhbm5vdGF0aW9uU291cmNlLFxuXHRcdFx0dW5yZXNvbHZlZEFubm90YXRpb25zLFxuXHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRhbm5vdGF0aW9uc1Rlcm1cblx0XHQpO1xuXHRcdGlmIChwcm9wZXJ0eVZhbHVlLmFubm90YXRpb25zICYmIEFycmF5LmlzQXJyYXkocHJvcGVydHlWYWx1ZS5hbm5vdGF0aW9ucykpIHtcblx0XHRcdGNvbnN0IHN1YkFubm90YXRpb25MaXN0ID0ge1xuXHRcdFx0XHR0YXJnZXQ6IGAke2N1cnJlbnRGUU59LyR7cHJvcGVydHlWYWx1ZS5uYW1lfWAsXG5cdFx0XHRcdGFubm90YXRpb25zOiBwcm9wZXJ0eVZhbHVlLmFubm90YXRpb25zLFxuXHRcdFx0XHRfX3NvdXJjZTogYW5ub3RhdGlvblNvdXJjZVxuXHRcdFx0fTtcblx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucy5wdXNoKHN1YkFubm90YXRpb25MaXN0KTtcblx0XHR9XG5cdFx0aWYgKFxuXHRcdFx0YW5ub3RhdGlvbkNvbnRlbnQuaGFzT3duUHJvcGVydHkoXCJBY3Rpb25cIikgJiZcblx0XHRcdChhbm5vdGF0aW9uVGVybS4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBY3Rpb25cIiB8fFxuXHRcdFx0XHRhbm5vdGF0aW9uVGVybS4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoQWN0aW9uXCIpXG5cdFx0KSB7XG5cdFx0XHRpZiAoY3VycmVudFRhcmdldC5hY3Rpb25zKSB7XG5cdFx0XHRcdGFubm90YXRpb25Db250ZW50LkFjdGlvblRhcmdldCA9XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hY3Rpb25zW2Fubm90YXRpb25Db250ZW50LkFjdGlvbl0gfHwgb2JqZWN0TWFwW2Fubm90YXRpb25Db250ZW50LkFjdGlvbl07XG5cdFx0XHRcdGlmICghYW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uVGFyZ2V0KSB7XG5cdFx0XHRcdFx0Ly8gQWRkIHRvIGRpYWdub3N0aWNzIGRlYnVnZ2VyO1xuXHRcdFx0XHRcdEFOTk9UQVRJT05fRVJST1JTLnB1c2goe1xuXHRcdFx0XHRcdFx0bWVzc2FnZTpcblx0XHRcdFx0XHRcdFx0XCJVbmFibGUgdG8gcmVzb2x2ZSB0aGUgYWN0aW9uIFwiICtcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uICtcblx0XHRcdFx0XHRcdFx0XCIgZGVmaW5lZCBmb3IgXCIgK1xuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uVGVybS5mdWxseVF1YWxpZmllZE5hbWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cdHJldHVybiBPYmplY3QuYXNzaWduKGFubm90YXRpb25UZXJtLCBhbm5vdGF0aW9uQ29udGVudCk7XG59XG5cbmV4cG9ydCB0eXBlIENvbGxlY3Rpb25UeXBlID1cblx0fCBcIlByb3BlcnR5UGF0aFwiXG5cdHwgXCJQYXRoXCJcblx0fCBcIklmXCJcblx0fCBcIkFwcGx5XCJcblx0fCBcIkFubm90YXRpb25QYXRoXCJcblx0fCBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIlxuXHR8IFwiUmVjb3JkXCJcblx0fCBcIlN0cmluZ1wiXG5cdHwgXCJFbXB0eUNvbGxlY3Rpb25cIjtcblxuZnVuY3Rpb24gZ2V0T3JJbmZlckNvbGxlY3Rpb25UeXBlKGNvbGxlY3Rpb25EZWZpbml0aW9uOiBhbnlbXSk6IENvbGxlY3Rpb25UeXBlIHtcblx0bGV0IHR5cGU6IENvbGxlY3Rpb25UeXBlID0gKGNvbGxlY3Rpb25EZWZpbml0aW9uIGFzIGFueSkudHlwZTtcblx0aWYgKHR5cGUgPT09IHVuZGVmaW5lZCAmJiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5sZW5ndGggPiAwKSB7XG5cdFx0Y29uc3QgZmlyc3RDb2xJdGVtID0gY29sbGVjdGlvbkRlZmluaXRpb25bMF07XG5cdFx0aWYgKGZpcnN0Q29sSXRlbS5oYXNPd25Qcm9wZXJ0eShcIlByb3BlcnR5UGF0aFwiKSkge1xuXHRcdFx0dHlwZSA9IFwiUHJvcGVydHlQYXRoXCI7XG5cdFx0fSBlbHNlIGlmIChmaXJzdENvbEl0ZW0uaGFzT3duUHJvcGVydHkoXCJQYXRoXCIpKSB7XG5cdFx0XHR0eXBlID0gXCJQYXRoXCI7XG5cdFx0fSBlbHNlIGlmIChmaXJzdENvbEl0ZW0uaGFzT3duUHJvcGVydHkoXCJBbm5vdGF0aW9uUGF0aFwiKSkge1xuXHRcdFx0dHlwZSA9IFwiQW5ub3RhdGlvblBhdGhcIjtcblx0XHR9IGVsc2UgaWYgKGZpcnN0Q29sSXRlbS5oYXNPd25Qcm9wZXJ0eShcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdHR5cGUgPSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIjtcblx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0dHlwZW9mIGZpcnN0Q29sSXRlbSA9PT0gXCJvYmplY3RcIiAmJlxuXHRcdFx0KGZpcnN0Q29sSXRlbS5oYXNPd25Qcm9wZXJ0eShcInR5cGVcIikgfHwgZmlyc3RDb2xJdGVtLmhhc093blByb3BlcnR5KFwicHJvcGVydHlWYWx1ZXNcIikpXG5cdFx0KSB7XG5cdFx0XHR0eXBlID0gXCJSZWNvcmRcIjtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBmaXJzdENvbEl0ZW0gPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHR5cGUgPSBcIlN0cmluZ1wiO1xuXHRcdH1cblx0fSBlbHNlIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcblx0XHR0eXBlID0gXCJFbXB0eUNvbGxlY3Rpb25cIjtcblx0fVxuXHRyZXR1cm4gdHlwZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VDb2xsZWN0aW9uKFxuXHRjb2xsZWN0aW9uRGVmaW5pdGlvbjogYW55W10sXG5cdHBhcmVudEZRTjogc3RyaW5nLFxuXHRwYXJzZXJPdXRwdXQ6IFBhcnNlck91dHB1dCxcblx0Y3VycmVudFRhcmdldDogYW55LFxuXHRvYmplY3RNYXA6IGFueSxcblx0dG9SZXNvbHZlOiBSZXNvbHZlYWJsZVtdLFxuXHRhbm5vdGF0aW9uU291cmNlOiBzdHJpbmcsXG5cdHVucmVzb2x2ZWRBbm5vdGF0aW9uczogQW5ub3RhdGlvbkxpc3RbXSxcblx0YW5ub3RhdGlvblR5cGU6IHN0cmluZyxcblx0YW5ub3RhdGlvbnNUZXJtOiBzdHJpbmdcbikge1xuXHRjb25zdCBjb2xsZWN0aW9uRGVmaW5pdGlvblR5cGUgPSBnZXRPckluZmVyQ29sbGVjdGlvblR5cGUoY29sbGVjdGlvbkRlZmluaXRpb24pO1xuXHRzd2l0Y2ggKGNvbGxlY3Rpb25EZWZpbml0aW9uVHlwZSkge1xuXHRcdGNhc2UgXCJQcm9wZXJ0eVBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoKHByb3BlcnR5UGF0aCwgcHJvcGVydHlJZHgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR0eXBlOiBcIlByb3BlcnR5UGF0aFwiLFxuXHRcdFx0XHRcdHZhbHVlOiBwcm9wZXJ0eVBhdGguUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7cGFyZW50RlFOfS8ke3Byb3BlcnR5SWR4fWAsXG5cdFx0XHRcdFx0JHRhcmdldDogcmVzb2x2ZVRhcmdldChcblx0XHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdFx0XHRwcm9wZXJ0eVBhdGguUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIlBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAocGF0aFZhbHVlID0+IHtcblx0XHRcdFx0aWYgKGlzQW5ub3RhdGlvblBhdGgocGF0aFZhbHVlLlBhdGgpKSB7XG5cdFx0XHRcdFx0Ly8gSWYgaXQncyBhbiBhbm50b2F0aW9uIHRoYXQgd2UgY2FuIHJlc29sdmUsIHJlc29sdmUgaXQgIVxuXHRcdFx0XHRcdGNvbnN0ICR0YXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0XHRcdHBhdGhWYWx1ZS5QYXRoLFxuXHRcdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRpZiAoJHRhcmdldCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICR0YXJnZXQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0ICR0YXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdHBhdGhWYWx1ZS5QYXRoLFxuXHRcdFx0XHRcdHRydWUsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGNvbnN0IHBhdGggPSBuZXcgUGF0aChwYXRoVmFsdWUsICR0YXJnZXQsIGFubm90YXRpb25zVGVybSwgYW5ub3RhdGlvblR5cGUsIFwiXCIpO1xuXHRcdFx0XHR0b1Jlc29sdmUucHVzaChwYXRoKTtcblx0XHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0XHR9KTtcblx0XHRjYXNlIFwiQW5ub3RhdGlvblBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoKGFubm90YXRpb25QYXRoLCBhbm5vdGF0aW9uSWR4KSA9PiB7XG5cdFx0XHRcdGNvbnN0IGFubm90YXRpb25UYXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoLkFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdHRydWUsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGNvbnN0IGFubm90YXRpb25Db2xsZWN0aW9uRWxlbWVudCA9IHtcblx0XHRcdFx0XHR0eXBlOiBcIkFubm90YXRpb25QYXRoXCIsXG5cdFx0XHRcdFx0dmFsdWU6IGFubm90YXRpb25QYXRoLkFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7cGFyZW50RlFOfS8ke2Fubm90YXRpb25JZHh9YCxcblx0XHRcdFx0XHQkdGFyZ2V0OiBhbm5vdGF0aW9uVGFyZ2V0LFxuXHRcdFx0XHRcdGFubm90YXRpb25UeXBlOiBhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm06IGFubm90YXRpb25zVGVybSxcblx0XHRcdFx0XHR0ZXJtOiBcIlwiLFxuXHRcdFx0XHRcdHBhdGg6IFwiXCJcblx0XHRcdFx0fTtcblx0XHRcdFx0dG9SZXNvbHZlLnB1c2goYW5ub3RhdGlvbkNvbGxlY3Rpb25FbGVtZW50KTtcblx0XHRcdFx0cmV0dXJuIGFubm90YXRpb25Db2xsZWN0aW9uRWxlbWVudDtcblx0XHRcdH0pO1xuXHRcdGNhc2UgXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCI6XG5cdFx0XHRyZXR1cm4gY29sbGVjdGlvbkRlZmluaXRpb24ubWFwKChuYXZQcm9wZXJ0eVBhdGgsIG5hdlByb3BJZHgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR0eXBlOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XHRcdFx0XHR2YWx1ZTogbmF2UHJvcGVydHlQYXRoLk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBgJHtwYXJlbnRGUU59LyR7bmF2UHJvcElkeH1gLFxuXHRcdFx0XHRcdCR0YXJnZXQ6IHJlc29sdmVUYXJnZXQoXG5cdFx0XHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdFx0bmF2UHJvcGVydHlQYXRoLk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm1cblx0XHRcdFx0XHQpXG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblx0XHRjYXNlIFwiUmVjb3JkXCI6XG5cdFx0XHRyZXR1cm4gY29sbGVjdGlvbkRlZmluaXRpb24ubWFwKChyZWNvcmREZWZpbml0aW9uLCByZWNvcmRJZHgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHBhcnNlUmVjb3JkKFxuXHRcdFx0XHRcdHJlY29yZERlZmluaXRpb24sXG5cdFx0XHRcdFx0YCR7cGFyZW50RlFOfS8ke3JlY29yZElkeH1gLFxuXHRcdFx0XHRcdHBhcnNlck91dHB1dCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHR0b1Jlc29sdmUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblNvdXJjZSxcblx0XHRcdFx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblx0XHRjYXNlIFwiQXBwbHlcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoaWZWYWx1ZSA9PiB7XG5cdFx0XHRcdHJldHVybiBpZlZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIklmXCI6XG5cdFx0XHRyZXR1cm4gY29sbGVjdGlvbkRlZmluaXRpb24ubWFwKGlmVmFsdWUgPT4ge1xuXHRcdFx0XHRyZXR1cm4gaWZWYWx1ZTtcblx0XHRcdH0pO1xuXHRcdGNhc2UgXCJTdHJpbmdcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoc3RyaW5nVmFsdWUgPT4ge1xuXHRcdFx0XHRyZXR1cm4gc3RyaW5nVmFsdWU7XG5cdFx0XHR9KTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0aWYgKGNvbGxlY3Rpb25EZWZpbml0aW9uLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBjYXNlXCIpO1xuXHR9XG59XG5cbnR5cGUgUmVzb2x2ZWFibGUgPSB7XG5cdCR0YXJnZXQ6IHN0cmluZztcblx0dGFyZ2V0U3RyaW5nPzogc3RyaW5nO1xuXHRhbm5vdGF0aW9uc1Rlcm06IHN0cmluZztcblx0YW5ub3RhdGlvblR5cGU6IHN0cmluZztcblx0dGVybTogc3RyaW5nO1xuXHRwYXRoOiBzdHJpbmc7XG59O1xuXG5mdW5jdGlvbiBjb252ZXJ0QW5ub3RhdGlvbihcblx0YW5ub3RhdGlvbjogQW5ub3RhdGlvbixcblx0cGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQsXG5cdGN1cnJlbnRUYXJnZXQ6IGFueSxcblx0b2JqZWN0TWFwOiBhbnksXG5cdHRvUmVzb2x2ZTogUmVzb2x2ZWFibGVbXSxcblx0YW5ub3RhdGlvblNvdXJjZTogc3RyaW5nLFxuXHR1bnJlc29sdmVkQW5ub3RhdGlvbnM6IEFubm90YXRpb25MaXN0W11cbik6IGFueSB7XG5cdGlmIChhbm5vdGF0aW9uLnJlY29yZCkge1xuXHRcdGNvbnN0IGFubm90YXRpb25UeXBlID0gYW5ub3RhdGlvbi5yZWNvcmQudHlwZSA/IGFubm90YXRpb24ucmVjb3JkLnR5cGUgOiBcIlwiO1xuXHRcdGNvbnN0IGFubm90YXRpb25UZXJtOiBhbnkgPSB7XG5cdFx0XHQkVHlwZTogdW5hbGlhcyhwYXJzZXJPdXRwdXQucmVmZXJlbmNlcywgYW5ub3RhdGlvbi5yZWNvcmQudHlwZSksXG5cdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdFx0cXVhbGlmaWVyOiBhbm5vdGF0aW9uLnF1YWxpZmllclxuXHRcdH07XG5cdFx0Y29uc3QgYW5ub3RhdGlvbkNvbnRlbnQ6IGFueSA9IHt9O1xuXHRcdGFubm90YXRpb24ucmVjb3JkLnByb3BlcnR5VmFsdWVzLmZvckVhY2goKHByb3BlcnR5VmFsdWU6IFByb3BlcnR5VmFsdWUpID0+IHtcblx0XHRcdGFubm90YXRpb25Db250ZW50W3Byb3BlcnR5VmFsdWUubmFtZV0gPSBwYXJzZVZhbHVlKFxuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlLnZhbHVlLFxuXHRcdFx0XHRgJHthbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZX0vJHtwcm9wZXJ0eVZhbHVlLm5hbWV9YCxcblx0XHRcdFx0cGFyc2VyT3V0cHV0LFxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdHRvUmVzb2x2ZSxcblx0XHRcdFx0YW5ub3RhdGlvblNvdXJjZSxcblx0XHRcdFx0dW5yZXNvbHZlZEFubm90YXRpb25zLFxuXHRcdFx0XHRhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0YW5ub3RhdGlvbi50ZXJtXG5cdFx0XHQpO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRhbm5vdGF0aW9uQ29udGVudC5oYXNPd25Qcm9wZXJ0eShcIkFjdGlvblwiKSAmJlxuXHRcdFx0XHQoIWFubm90YXRpb24ucmVjb3JkIHx8XG5cdFx0XHRcdFx0YW5ub3RhdGlvblRlcm0uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCIgfHxcblx0XHRcdFx0XHRhbm5vdGF0aW9uVGVybS4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoQWN0aW9uXCIpXG5cdFx0XHQpIHtcblx0XHRcdFx0aWYgKGN1cnJlbnRUYXJnZXQuYWN0aW9ucykge1xuXHRcdFx0XHRcdGFubm90YXRpb25Db250ZW50LkFjdGlvblRhcmdldCA9XG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFjdGlvbnNbYW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uXSB8fCBvYmplY3RNYXBbYW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uXTtcblx0XHRcdFx0XHRpZiAoIWFubm90YXRpb25Db250ZW50LkFjdGlvblRhcmdldCkge1xuXHRcdFx0XHRcdFx0QU5OT1RBVElPTl9FUlJPUlMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2U6XG5cdFx0XHRcdFx0XHRcdFx0XCJVbmFibGUgdG8gcmVzb2x2ZSB0aGUgYWN0aW9uIFwiICtcblx0XHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uQ29udGVudC5BY3Rpb24gK1xuXHRcdFx0XHRcdFx0XHRcdFwiIGRlZmluZWQgZm9yIFwiICtcblx0XHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHQvLyBBZGQgdG8gZGlhZ25vc3RpY3Ncblx0XHRcdFx0XHRcdC8vIGRlYnVnZ2VyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKGFubm90YXRpb25UZXJtLCBhbm5vdGF0aW9uQ29udGVudCk7XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbi5jb2xsZWN0aW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRpZiAoYW5ub3RhdGlvbi52YWx1ZSkge1xuXHRcdFx0cmV0dXJuIHBhcnNlVmFsdWUoXG5cdFx0XHRcdGFubm90YXRpb24udmFsdWUsXG5cdFx0XHRcdGFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdFx0XHRwYXJzZXJPdXRwdXQsXG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0dG9SZXNvbHZlLFxuXHRcdFx0XHRhbm5vdGF0aW9uU291cmNlLFxuXHRcdFx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMsXG5cdFx0XHRcdFwiXCIsXG5cdFx0XHRcdGFubm90YXRpb24udGVybVxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKGFubm90YXRpb24uY29sbGVjdGlvbikge1xuXHRcdGNvbnN0IGNvbGxlY3Rpb246IGFueSA9IHBhcnNlQ29sbGVjdGlvbihcblx0XHRcdGFubm90YXRpb24uY29sbGVjdGlvbixcblx0XHRcdGFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdFx0cGFyc2VyT3V0cHV0LFxuXHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdG9iamVjdE1hcCxcblx0XHRcdHRvUmVzb2x2ZSxcblx0XHRcdGFubm90YXRpb25Tb3VyY2UsXG5cdFx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMsXG5cdFx0XHRcIlwiLFxuXHRcdFx0YW5ub3RhdGlvbi50ZXJtXG5cdFx0KTtcblx0XHRjb2xsZWN0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSA9IGFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lO1xuXHRcdHJldHVybiBjb2xsZWN0aW9uO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGNhc2VcIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlUmVzb2x2ZVBhdGhGbihlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLCBvYmplY3RNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uKHJlbGF0aXZlUGF0aDogc3RyaW5nLCBpbmNsdWRlVmlzaXRlZE9iamVjdHM6IGJvb2xlYW4pOiBhbnkge1xuXHRcdGNvbnN0IGFubm90YXRpb25UZXJtOiBzdHJpbmcgPSBcIlwiO1xuXHRcdGNvbnN0IGFubm90YXRpb25UeXBlOiBzdHJpbmcgPSBcIlwiO1xuXHRcdHJldHVybiByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0ZW50aXR5VHlwZSxcblx0XHRcdHJlbGF0aXZlUGF0aCxcblx0XHRcdGZhbHNlLFxuXHRcdFx0aW5jbHVkZVZpc2l0ZWRPYmplY3RzLFxuXHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRhbm5vdGF0aW9uVGVybVxuXHRcdCk7XG5cdH07XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVOYXZpZ2F0aW9uUHJvcGVydGllcyhcblx0ZW50aXR5VHlwZXM6IFBhcnNlckVudGl0eVR5cGVbXSxcblx0YXNzb2NpYXRpb25zOiBBc3NvY2lhdGlvbltdLFxuXHRvYmplY3RNYXA6IFJlY29yZDxzdHJpbmcsIGFueT5cbik6IHZvaWQge1xuXHRlbnRpdHlUeXBlcy5mb3JFYWNoKGVudGl0eVR5cGUgPT4ge1xuXHRcdGVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMgPSBlbnRpdHlUeXBlLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLm1hcChuYXZQcm9wID0+IHtcblx0XHRcdGNvbnN0IG91dE5hdlByb3A6IFBhcnRpYWw8TmF2aWdhdGlvblByb3BlcnR5PiA9IHtcblx0XHRcdFx0X3R5cGU6IFwiTmF2aWdhdGlvblByb3BlcnR5XCIsXG5cdFx0XHRcdG5hbWU6IG5hdlByb3AubmFtZSxcblx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBuYXZQcm9wLmZ1bGx5UXVhbGlmaWVkTmFtZSxcblx0XHRcdFx0cGFydG5lcjogKG5hdlByb3AgYXMgYW55KS5oYXNPd25Qcm9wZXJ0eShcInBhcnRuZXJcIikgPyAobmF2UHJvcCBhcyBhbnkpLnBhcnRuZXIgOiB1bmRlZmluZWQsXG5cdFx0XHRcdC8vIHRhcmdldFR5cGVOYW1lOiBGdWxseVF1YWxpZmllZE5hbWU7XG5cdFx0XHRcdC8vIHRhcmdldFR5cGU6IEVudGl0eVR5cGU7XG5cdFx0XHRcdGlzQ29sbGVjdGlvbjogKG5hdlByb3AgYXMgYW55KS5oYXNPd25Qcm9wZXJ0eShcImlzQ29sbGVjdGlvblwiKSA/IChuYXZQcm9wIGFzIGFueSkuaXNDb2xsZWN0aW9uIDogZmFsc2UsXG5cdFx0XHRcdGNvbnRhaW5zVGFyZ2V0OiAobmF2UHJvcCBhcyBhbnkpLmhhc093blByb3BlcnR5KFwiY29udGFpbnNUYXJnZXRcIilcblx0XHRcdFx0XHQ/IChuYXZQcm9wIGFzIGFueSkuY29udGFpbnNUYXJnZXRcblx0XHRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHRyZWZlcmVudGlhbENvbnN0cmFpbnQ6IChuYXZQcm9wIGFzIGFueSkucmVmZXJlbnRpYWxDb25zdHJhaW50XG5cdFx0XHRcdFx0PyAobmF2UHJvcCBhcyBhbnkpLnJlZmVyZW50aWFsQ29uc3RyYWludFxuXHRcdFx0XHRcdDogW11cblx0XHRcdH07XG5cdFx0XHRpZiAoKG5hdlByb3AgYXMgR2VuZXJpY05hdmlnYXRpb25Qcm9wZXJ0eSkudGFyZ2V0VHlwZU5hbWUpIHtcblx0XHRcdFx0b3V0TmF2UHJvcC50YXJnZXRUeXBlID0gb2JqZWN0TWFwWyhuYXZQcm9wIGFzIFY0TmF2aWdhdGlvblByb3BlcnR5KS50YXJnZXRUeXBlTmFtZV07XG5cdFx0XHR9IGVsc2UgaWYgKChuYXZQcm9wIGFzIFYyTmF2aWdhdGlvblByb3BlcnR5KS5yZWxhdGlvbnNoaXApIHtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0QXNzb2NpYXRpb24gPSBhc3NvY2lhdGlvbnMuZmluZChcblx0XHRcdFx0XHRhc3NvY2lhdGlvbiA9PiBhc3NvY2lhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUgPT09IChuYXZQcm9wIGFzIFYyTmF2aWdhdGlvblByb3BlcnR5KS5yZWxhdGlvbnNoaXBcblx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKHRhcmdldEFzc29jaWF0aW9uKSB7XG5cdFx0XHRcdFx0Y29uc3QgYXNzb2NpYXRpb25FbmQgPSB0YXJnZXRBc3NvY2lhdGlvbi5hc3NvY2lhdGlvbkVuZC5maW5kKFxuXHRcdFx0XHRcdFx0ZW5kID0+IGVuZC5yb2xlID09PSAobmF2UHJvcCBhcyBWMk5hdmlnYXRpb25Qcm9wZXJ0eSkudG9Sb2xlXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRpZiAoYXNzb2NpYXRpb25FbmQpIHtcblx0XHRcdFx0XHRcdG91dE5hdlByb3AudGFyZ2V0VHlwZSA9IG9iamVjdE1hcFthc3NvY2lhdGlvbkVuZC50eXBlXTtcblx0XHRcdFx0XHRcdG91dE5hdlByb3AuaXNDb2xsZWN0aW9uID0gYXNzb2NpYXRpb25FbmQubXVsdGlwbGljaXR5ID09PSBcIipcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChvdXROYXZQcm9wLnRhcmdldFR5cGUpIHtcblx0XHRcdFx0b3V0TmF2UHJvcC50YXJnZXRUeXBlTmFtZSA9IG91dE5hdlByb3AudGFyZ2V0VHlwZS5mdWxseVF1YWxpZmllZE5hbWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBvdXROYXZQcm9wUmVxID0gb3V0TmF2UHJvcCBhcyBOYXZpZ2F0aW9uUHJvcGVydHk7XG5cdFx0XHRvYmplY3RNYXBbb3V0TmF2UHJvcFJlcS5mdWxseVF1YWxpZmllZE5hbWVdID0gb3V0TmF2UHJvcFJlcTtcblx0XHRcdHJldHVybiBvdXROYXZQcm9wUmVxO1xuXHRcdH0pO1xuXHRcdChlbnRpdHlUeXBlIGFzIEVudGl0eVR5cGUpLnJlc29sdmVQYXRoID0gY3JlYXRlUmVzb2x2ZVBhdGhGbihlbnRpdHlUeXBlIGFzIEVudGl0eVR5cGUsIG9iamVjdE1hcCk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBsaW5rQWN0aW9uc1RvRW50aXR5VHlwZShuYW1lc3BhY2U6IHN0cmluZywgYWN0aW9uczogQWN0aW9uW10sIG9iamVjdE1hcDogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWQge1xuXHRhY3Rpb25zLmZvckVhY2goYWN0aW9uID0+IHtcblx0XHRpZiAoYWN0aW9uLmlzQm91bmQpIHtcblx0XHRcdGNvbnN0IHNvdXJjZUVudGl0eVR5cGUgPSBvYmplY3RNYXBbYWN0aW9uLnNvdXJjZVR5cGVdO1xuXHRcdFx0YWN0aW9uLnNvdXJjZUVudGl0eVR5cGUgPSBzb3VyY2VFbnRpdHlUeXBlO1xuXHRcdFx0aWYgKHNvdXJjZUVudGl0eVR5cGUpIHtcblx0XHRcdFx0aWYgKCFzb3VyY2VFbnRpdHlUeXBlLmFjdGlvbnMpIHtcblx0XHRcdFx0XHRzb3VyY2VFbnRpdHlUeXBlLmFjdGlvbnMgPSB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzb3VyY2VFbnRpdHlUeXBlLmFjdGlvbnNbYWN0aW9uLm5hbWVdID0gYWN0aW9uO1xuXHRcdFx0XHRzb3VyY2VFbnRpdHlUeXBlLmFjdGlvbnNbYCR7bmFtZXNwYWNlfS4ke2FjdGlvbi5uYW1lfWBdID0gYWN0aW9uO1xuXHRcdFx0fVxuXHRcdFx0YWN0aW9uLnJldHVybkVudGl0eVR5cGUgPSBvYmplY3RNYXBbYWN0aW9uLnJldHVyblR5cGVdO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGxpbmtFbnRpdHlUeXBlVG9FbnRpdHlTZXQoZW50aXR5U2V0czogRW50aXR5U2V0W10sIG9iamVjdE1hcDogUmVjb3JkPHN0cmluZywgYW55Pik6IHZvaWQge1xuXHRlbnRpdHlTZXRzLmZvckVhY2goZW50aXR5U2V0ID0+IHtcblx0XHRlbnRpdHlTZXQuZW50aXR5VHlwZSA9IG9iamVjdE1hcFtlbnRpdHlTZXQuZW50aXR5VHlwZU5hbWVdO1xuXHRcdGlmICghZW50aXR5U2V0LmFubm90YXRpb25zKSB7XG5cdFx0XHRlbnRpdHlTZXQuYW5ub3RhdGlvbnMgPSB7fTtcblx0XHR9XG5cdFx0aWYgKCFlbnRpdHlTZXQuZW50aXR5VHlwZS5hbm5vdGF0aW9ucykge1xuXHRcdFx0ZW50aXR5U2V0LmVudGl0eVR5cGUuYW5ub3RhdGlvbnMgPSB7fTtcblx0XHR9XG5cdFx0ZW50aXR5U2V0LmVudGl0eVR5cGUua2V5cy5mb3JFYWNoKChrZXlQcm9wOiBQcm9wZXJ0eSkgPT4ge1xuXHRcdFx0a2V5UHJvcC5pc0tleSA9IHRydWU7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBsaW5rUHJvcGVydGllc1RvQ29tcGxleFR5cGVzKGVudGl0eVR5cGVzOiBFbnRpdHlUeXBlW10sIG9iamVjdE1hcDogUmVjb3JkPHN0cmluZywgYW55Pikge1xuXHRlbnRpdHlUeXBlcy5mb3JFYWNoKGVudGl0eVR5cGUgPT4ge1xuXHRcdGVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5mb3JFYWNoKGVudGl0eVByb3BlcnR5ID0+IHtcblx0XHRcdGlmIChlbnRpdHlQcm9wZXJ0eS50eXBlLmluZGV4T2YoXCJFZG1cIikgPT09IC0xKSB7XG5cdFx0XHRcdGNvbnN0IGNvbXBsZXhUeXBlID0gb2JqZWN0TWFwW2VudGl0eVByb3BlcnR5LnR5cGVdIGFzIENvbXBsZXhUeXBlO1xuXHRcdFx0XHRpZiAoY29tcGxleFR5cGUpIHtcblx0XHRcdFx0XHQoZW50aXR5UHJvcGVydHkgYXMgUHJvcGVydHkpLnRhcmdldFR5cGUgPSBjb21wbGV4VHlwZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gcHJlcGFyZUNvbXBsZXhUeXBlcyhcblx0Y29tcGxleFR5cGVzOiBQYXJzZXJDb21wbGV4VHlwZVtdLFxuXHRhc3NvY2lhdGlvbnM6IEFzc29jaWF0aW9uW10sXG5cdG9iamVjdE1hcDogUmVjb3JkPHN0cmluZywgYW55PlxuKSB7XG5cdGNvbXBsZXhUeXBlcy5mb3JFYWNoKGNvbXBsZXhUeXBlID0+IHtcblx0XHQoY29tcGxleFR5cGUgYXMgQ29tcGxleFR5cGUpLmFubm90YXRpb25zID0ge307XG5cdFx0Y29tcGxleFR5cGUucHJvcGVydGllcy5mb3JFYWNoKHByb3BlcnR5ID0+IHtcblx0XHRcdGlmICghKHByb3BlcnR5IGFzIFByb3BlcnR5KS5hbm5vdGF0aW9ucykge1xuXHRcdFx0XHQocHJvcGVydHkgYXMgUHJvcGVydHkpLmFubm90YXRpb25zID0ge307XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29tcGxleFR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMgPSBjb21wbGV4VHlwZS5uYXZpZ2F0aW9uUHJvcGVydGllcy5tYXAobmF2UHJvcCA9PiB7XG5cdFx0XHRpZiAoIShuYXZQcm9wIGFzIE5hdmlnYXRpb25Qcm9wZXJ0eSkuYW5ub3RhdGlvbnMpIHtcblx0XHRcdFx0KG5hdlByb3AgYXMgTmF2aWdhdGlvblByb3BlcnR5KS5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgb3V0TmF2UHJvcDogUGFydGlhbDxOYXZpZ2F0aW9uUHJvcGVydHk+ID0ge1xuXHRcdFx0XHRfdHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlcIixcblx0XHRcdFx0bmFtZTogbmF2UHJvcC5uYW1lLFxuXHRcdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IG5hdlByb3AuZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdFx0XHRwYXJ0bmVyOiAobmF2UHJvcCBhcyBhbnkpLmhhc093blByb3BlcnR5KFwicGFydG5lclwiKSA/IChuYXZQcm9wIGFzIGFueSkucGFydG5lciA6IHVuZGVmaW5lZCxcblx0XHRcdFx0Ly8gdGFyZ2V0VHlwZU5hbWU6IEZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRcdFx0Ly8gdGFyZ2V0VHlwZTogRW50aXR5VHlwZTtcblx0XHRcdFx0aXNDb2xsZWN0aW9uOiAobmF2UHJvcCBhcyBhbnkpLmhhc093blByb3BlcnR5KFwiaXNDb2xsZWN0aW9uXCIpID8gKG5hdlByb3AgYXMgYW55KS5pc0NvbGxlY3Rpb24gOiBmYWxzZSxcblx0XHRcdFx0Y29udGFpbnNUYXJnZXQ6IChuYXZQcm9wIGFzIGFueSkuaGFzT3duUHJvcGVydHkoXCJjb250YWluc1RhcmdldFwiKVxuXHRcdFx0XHRcdD8gKG5hdlByb3AgYXMgYW55KS5jb250YWluc1RhcmdldFxuXHRcdFx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdHJlZmVyZW50aWFsQ29uc3RyYWludDogKG5hdlByb3AgYXMgYW55KS5yZWZlcmVudGlhbENvbnN0cmFpbnRcblx0XHRcdFx0XHQ/IChuYXZQcm9wIGFzIGFueSkucmVmZXJlbnRpYWxDb25zdHJhaW50XG5cdFx0XHRcdFx0OiBbXVxuXHRcdFx0fTtcblx0XHRcdGlmICgobmF2UHJvcCBhcyBHZW5lcmljTmF2aWdhdGlvblByb3BlcnR5KS50YXJnZXRUeXBlTmFtZSkge1xuXHRcdFx0XHRvdXROYXZQcm9wLnRhcmdldFR5cGUgPSBvYmplY3RNYXBbKG5hdlByb3AgYXMgVjROYXZpZ2F0aW9uUHJvcGVydHkpLnRhcmdldFR5cGVOYW1lXTtcblx0XHRcdH0gZWxzZSBpZiAoKG5hdlByb3AgYXMgVjJOYXZpZ2F0aW9uUHJvcGVydHkpLnJlbGF0aW9uc2hpcCkge1xuXHRcdFx0XHRjb25zdCB0YXJnZXRBc3NvY2lhdGlvbiA9IGFzc29jaWF0aW9ucy5maW5kKFxuXHRcdFx0XHRcdGFzc29jaWF0aW9uID0+IGFzc29jaWF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSA9PT0gKG5hdlByb3AgYXMgVjJOYXZpZ2F0aW9uUHJvcGVydHkpLnJlbGF0aW9uc2hpcFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAodGFyZ2V0QXNzb2NpYXRpb24pIHtcblx0XHRcdFx0XHRjb25zdCBhc3NvY2lhdGlvbkVuZCA9IHRhcmdldEFzc29jaWF0aW9uLmFzc29jaWF0aW9uRW5kLmZpbmQoXG5cdFx0XHRcdFx0XHRlbmQgPT4gZW5kLnJvbGUgPT09IChuYXZQcm9wIGFzIFYyTmF2aWdhdGlvblByb3BlcnR5KS50b1JvbGVcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGlmIChhc3NvY2lhdGlvbkVuZCkge1xuXHRcdFx0XHRcdFx0b3V0TmF2UHJvcC50YXJnZXRUeXBlID0gb2JqZWN0TWFwW2Fzc29jaWF0aW9uRW5kLnR5cGVdO1xuXHRcdFx0XHRcdFx0b3V0TmF2UHJvcC5pc0NvbGxlY3Rpb24gPSBhc3NvY2lhdGlvbkVuZC5tdWx0aXBsaWNpdHkgPT09IFwiKlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKG91dE5hdlByb3AudGFyZ2V0VHlwZSkge1xuXHRcdFx0XHRvdXROYXZQcm9wLnRhcmdldFR5cGVOYW1lID0gb3V0TmF2UHJvcC50YXJnZXRUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IG91dE5hdlByb3BSZXEgPSBvdXROYXZQcm9wIGFzIE5hdmlnYXRpb25Qcm9wZXJ0eTtcblx0XHRcdG9iamVjdE1hcFtvdXROYXZQcm9wUmVxLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBvdXROYXZQcm9wUmVxO1xuXHRcdFx0cmV0dXJuIG91dE5hdlByb3BSZXE7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzcGxpdFRlcm0ocmVmZXJlbmNlczogUmVmZXJlbmNlc1dpdGhNYXAsIHRlcm1WYWx1ZTogc3RyaW5nKSB7XG5cdGNvbnN0IGFsaWFzZWRUZXJtID0gYWxpYXMocmVmZXJlbmNlcywgdGVybVZhbHVlKTtcblx0Y29uc3QgbGFzdERvdCA9IGFsaWFzZWRUZXJtLmxhc3RJbmRleE9mKFwiLlwiKTtcblx0bGV0IHRlcm1BbGlhcyA9IGFsaWFzZWRUZXJtLnN1YnN0cigwLCBsYXN0RG90KTtcblx0bGV0IHRlcm0gPSBhbGlhc2VkVGVybS5zdWJzdHIobGFzdERvdCArIDEpO1xuXHRyZXR1cm4gW3Rlcm1BbGlhcywgdGVybV07XG59XG5cbmxldCBBTk5PVEFUSU9OX0VSUk9SUzogeyBtZXNzYWdlOiBzdHJpbmcgfVtdID0gW107XG5sZXQgQUxMX0FOTk9UQVRJT05fRVJST1JTOiBhbnkgPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUeXBlcyhwYXJzZXJPdXRwdXQ6IFBhcnNlck91dHB1dCk6IENvbnZlcnRlck91dHB1dCB7XG5cdEFOTk9UQVRJT05fRVJST1JTID0gW107XG5cdGNvbnN0IG9iamVjdE1hcCA9IGJ1aWxkT2JqZWN0TWFwKHBhcnNlck91dHB1dCk7XG5cdHJlc29sdmVOYXZpZ2F0aW9uUHJvcGVydGllcyhcblx0XHRwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eVR5cGVzIGFzIEVudGl0eVR5cGVbXSxcblx0XHRwYXJzZXJPdXRwdXQuc2NoZW1hLmFzc29jaWF0aW9ucyxcblx0XHRvYmplY3RNYXBcblx0KTtcblx0bGlua0FjdGlvbnNUb0VudGl0eVR5cGUocGFyc2VyT3V0cHV0LnNjaGVtYS5uYW1lc3BhY2UsIHBhcnNlck91dHB1dC5zY2hlbWEuYWN0aW9ucyBhcyBBY3Rpb25bXSwgb2JqZWN0TWFwKTtcblx0bGlua0VudGl0eVR5cGVUb0VudGl0eVNldChwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eVNldHMgYXMgRW50aXR5U2V0W10sIG9iamVjdE1hcCk7XG5cdGxpbmtQcm9wZXJ0aWVzVG9Db21wbGV4VHlwZXMocGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlUeXBlcyBhcyBFbnRpdHlUeXBlW10sIG9iamVjdE1hcCk7XG5cdHByZXBhcmVDb21wbGV4VHlwZXMocGFyc2VyT3V0cHV0LnNjaGVtYS5jb21wbGV4VHlwZXMgYXMgQ29tcGxleFR5cGVbXSwgcGFyc2VyT3V0cHV0LnNjaGVtYS5hc3NvY2lhdGlvbnMsIG9iamVjdE1hcCk7XG5cdGNvbnN0IHRvUmVzb2x2ZTogUmVzb2x2ZWFibGVbXSA9IFtdO1xuXHRjb25zdCB1bnJlc29sdmVkQW5ub3RhdGlvbnM6IEFubm90YXRpb25MaXN0W10gPSBbXTtcblxuXHRPYmplY3Qua2V5cyhwYXJzZXJPdXRwdXQuc2NoZW1hLmFubm90YXRpb25zKS5mb3JFYWNoKGFubm90YXRpb25Tb3VyY2UgPT4ge1xuXHRcdHBhcnNlck91dHB1dC5zY2hlbWEuYW5ub3RhdGlvbnNbYW5ub3RhdGlvblNvdXJjZV0uZm9yRWFjaChhbm5vdGF0aW9uTGlzdCA9PiB7XG5cdFx0XHRjb25zdCBjdXJyZW50VGFyZ2V0TmFtZSA9IHVuYWxpYXMocGFyc2VyT3V0cHV0LnJlZmVyZW5jZXMsIGFubm90YXRpb25MaXN0LnRhcmdldCkgYXMgc3RyaW5nO1xuXHRcdFx0Y29uc3QgY3VycmVudFRhcmdldCA9IG9iamVjdE1hcFtjdXJyZW50VGFyZ2V0TmFtZV07XG5cdFx0XHRpZiAoIWN1cnJlbnRUYXJnZXQpIHtcblx0XHRcdFx0aWYgKGN1cnJlbnRUYXJnZXROYW1lLmluZGV4T2YoXCJAXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdChhbm5vdGF0aW9uTGlzdCBhcyBhbnkpLl9fc291cmNlID0gYW5ub3RhdGlvblNvdXJjZTtcblx0XHRcdFx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMucHVzaChhbm5vdGF0aW9uTGlzdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGN1cnJlbnRUYXJnZXQgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0aWYgKCFjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zKSB7XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFubm90YXRpb25MaXN0LmFubm90YXRpb25zLmZvckVhY2goYW5ub3RhdGlvbiA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgW3ZvY0FsaWFzLCB2b2NUZXJtXSA9IHNwbGl0VGVybShkZWZhdWx0UmVmZXJlbmNlcywgYW5ub3RhdGlvbi50ZXJtKTtcblx0XHRcdFx0XHRpZiAoIWN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdKSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXSA9IHt9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIWN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMuX2Fubm90YXRpb25zKSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zLl9hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbnN0IHZvY1Rlcm1XaXRoUXVhbGlmaWVyID0gYCR7dm9jVGVybX0ke2Fubm90YXRpb24ucXVhbGlmaWVyID8gYCMke2Fubm90YXRpb24ucXVhbGlmaWVyfWAgOiBcIlwifWA7XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdID0gY29udmVydEFubm90YXRpb24oXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uIGFzIEFubm90YXRpb24sXG5cdFx0XHRcdFx0XHRwYXJzZXJPdXRwdXQsXG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRcdFx0dG9SZXNvbHZlLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvblNvdXJjZSxcblx0XHRcdFx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9uc1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdICE9PSBudWxsICYmXG5cdFx0XHRcdFx0XHR0eXBlb2YgY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdID09PSBcIm9iamVjdFwiXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0udGVybSA9IHVuYWxpYXMoXG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRSZWZlcmVuY2VzLFxuXHRcdFx0XHRcdFx0XHRgJHt2b2NBbGlhc30uJHt2b2NUZXJtfWBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0ucXVhbGlmaWVyID0gYW5ub3RhdGlvbi5xdWFsaWZpZXI7XG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0uX19zb3VyY2UgPSBhbm5vdGF0aW9uU291cmNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb25zdCBhbm5vdGF0aW9uVGFyZ2V0ID0gYCR7Y3VycmVudFRhcmdldE5hbWV9QCR7dW5hbGlhcyhcblx0XHRcdFx0XHRcdGRlZmF1bHRSZWZlcmVuY2VzLFxuXHRcdFx0XHRcdFx0dm9jQWxpYXMgKyBcIi5cIiArIHZvY1Rlcm1XaXRoUXVhbGlmaWVyXG5cdFx0XHRcdFx0KX1gO1xuXHRcdFx0XHRcdGlmIChhbm5vdGF0aW9uLmFubm90YXRpb25zICYmIEFycmF5LmlzQXJyYXkoYW5ub3RhdGlvbi5hbm5vdGF0aW9ucykpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHN1YkFubm90YXRpb25MaXN0ID0ge1xuXHRcdFx0XHRcdFx0XHR0YXJnZXQ6IGFubm90YXRpb25UYXJnZXQsXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25zOiBhbm5vdGF0aW9uLmFubm90YXRpb25zLFxuXHRcdFx0XHRcdFx0XHRfX3NvdXJjZTogYW5ub3RhdGlvblNvdXJjZVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucy5wdXNoKHN1YkFubm90YXRpb25MaXN0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnNbYCR7dm9jQWxpYXN9LiR7dm9jVGVybVdpdGhRdWFsaWZpZXJ9YF0gPVxuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdO1xuXHRcdFx0XHRcdG9iamVjdE1hcFthbm5vdGF0aW9uVGFyZ2V0XSA9IGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHRjb25zdCBleHRyYVVucmVzb2x2ZWRBbm5vdGF0aW9uczogQW5ub3RhdGlvbkxpc3RbXSA9IFtdO1xuXHR1bnJlc29sdmVkQW5ub3RhdGlvbnMuZm9yRWFjaChhbm5vdGF0aW9uTGlzdCA9PiB7XG5cdFx0Y29uc3QgY3VycmVudFRhcmdldE5hbWUgPSB1bmFsaWFzKHBhcnNlck91dHB1dC5yZWZlcmVuY2VzLCBhbm5vdGF0aW9uTGlzdC50YXJnZXQpIGFzIHN0cmluZztcblx0XHRsZXQgW2Jhc2VPYmosIGFubm90YXRpb25QYXJ0XSA9IGN1cnJlbnRUYXJnZXROYW1lLnNwbGl0KFwiQFwiKTtcblx0XHRjb25zdCB0YXJnZXRTcGxpdCA9IGFubm90YXRpb25QYXJ0LnNwbGl0KFwiL1wiKTtcblx0XHRiYXNlT2JqID0gYmFzZU9iaiArIFwiQFwiICsgdGFyZ2V0U3BsaXRbMF07XG5cdFx0Y29uc3QgY3VycmVudFRhcmdldCA9IHRhcmdldFNwbGl0LnNsaWNlKDEpLnJlZHVjZSgoY3VycmVudE9iaiwgcGF0aCkgPT4ge1xuXHRcdFx0aWYgKCFjdXJyZW50T2JqKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGN1cnJlbnRPYmpbcGF0aF07XG5cdFx0fSwgb2JqZWN0TWFwW2Jhc2VPYmpdKTtcblx0XHRpZiAoIWN1cnJlbnRUYXJnZXQpIHtcblx0XHRcdEFOTk9UQVRJT05fRVJST1JTLnB1c2goe1xuXHRcdFx0XHRtZXNzYWdlOiBcIlRoZSBmb2xsb3dpbmcgYW5ub3RhdGlvbiB0YXJnZXQgd2FzIG5vdCBmb3VuZCBvbiB0aGUgc2VydmljZSBcIiArIGN1cnJlbnRUYXJnZXROYW1lXG5cdFx0XHR9KTtcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwiTWlzc2luZyB0YXJnZXQgYWdhaW4gXCIgKyBjdXJyZW50VGFyZ2V0TmFtZSk7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgY3VycmVudFRhcmdldCA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0aWYgKCFjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zKSB7XG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMgPSB7fTtcblx0XHRcdH1cblx0XHRcdGFubm90YXRpb25MaXN0LmFubm90YXRpb25zLmZvckVhY2goYW5ub3RhdGlvbiA9PiB7XG5cdFx0XHRcdGNvbnN0IFt2b2NBbGlhcywgdm9jVGVybV0gPSBzcGxpdFRlcm0oZGVmYXVsdFJlZmVyZW5jZXMsIGFubm90YXRpb24udGVybSk7XG5cdFx0XHRcdGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc10pIHtcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXSA9IHt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnMpIHtcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zLl9hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgdm9jVGVybVdpdGhRdWFsaWZpZXIgPSBgJHt2b2NUZXJtfSR7YW5ub3RhdGlvbi5xdWFsaWZpZXIgPyBgIyR7YW5ub3RhdGlvbi5xdWFsaWZpZXJ9YCA6IFwiXCJ9YDtcblx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdID0gY29udmVydEFubm90YXRpb24oXG5cdFx0XHRcdFx0YW5ub3RhdGlvbiBhcyBBbm5vdGF0aW9uLFxuXHRcdFx0XHRcdHBhcnNlck91dHB1dCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHR0b1Jlc29sdmUsXG5cdFx0XHRcdFx0KGFubm90YXRpb25MaXN0IGFzIGFueSkuX19zb3VyY2UsXG5cdFx0XHRcdFx0ZXh0cmFVbnJlc29sdmVkQW5ub3RhdGlvbnNcblx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSAhPT0gbnVsbCAmJlxuXHRcdFx0XHRcdHR5cGVvZiBjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0gPT09IFwib2JqZWN0XCJcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdLnRlcm0gPSB1bmFsaWFzKFxuXHRcdFx0XHRcdFx0ZGVmYXVsdFJlZmVyZW5jZXMsXG5cdFx0XHRcdFx0XHRgJHt2b2NBbGlhc30uJHt2b2NUZXJtfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXS5xdWFsaWZpZXIgPSBhbm5vdGF0aW9uLnF1YWxpZmllcjtcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVtcblx0XHRcdFx0XHRcdHZvY1Rlcm1XaXRoUXVhbGlmaWVyXG5cdFx0XHRcdFx0XS5fX3NvdXJjZSA9IChhbm5vdGF0aW9uTGlzdCBhcyBhbnkpLl9fc291cmNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMuX2Fubm90YXRpb25zW2Ake3ZvY0FsaWFzfS4ke3ZvY1Rlcm1XaXRoUXVhbGlmaWVyfWBdID1cblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl07XG5cdFx0XHRcdG9iamVjdE1hcFtgJHtjdXJyZW50VGFyZ2V0TmFtZX1AJHt1bmFsaWFzKGRlZmF1bHRSZWZlcmVuY2VzLCB2b2NBbGlhcyArIFwiLlwiICsgdm9jVGVybVdpdGhRdWFsaWZpZXIpfWBdID1cblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl07XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xuXHR0b1Jlc29sdmUuZm9yRWFjaChyZXNvbHZlYWJsZSA9PiB7XG5cdFx0Y29uc3QgdGFyZ2V0U3RyID0gcmVzb2x2ZWFibGUuJHRhcmdldDtcblx0XHRjb25zdCBhbm5vdGF0aW9uc1Rlcm0gPSByZXNvbHZlYWJsZS5hbm5vdGF0aW9uc1Rlcm07XG5cdFx0Y29uc3QgYW5ub3RhdGlvblR5cGUgPSByZXNvbHZlYWJsZS5hbm5vdGF0aW9uVHlwZTtcblx0XHRyZXNvbHZlYWJsZS4kdGFyZ2V0ID0gb2JqZWN0TWFwW3RhcmdldFN0cl07XG5cdFx0ZGVsZXRlIHJlc29sdmVhYmxlLmFubm90YXRpb25UeXBlO1xuXHRcdGRlbGV0ZSByZXNvbHZlYWJsZS5hbm5vdGF0aW9uc1Rlcm07XG5cdFx0aWYgKCFyZXNvbHZlYWJsZS4kdGFyZ2V0KSB7XG5cdFx0XHRyZXNvbHZlYWJsZS50YXJnZXRTdHJpbmcgPSB0YXJnZXRTdHI7XG5cdFx0XHRpZiAoYW5ub3RhdGlvbnNUZXJtICYmIGFubm90YXRpb25UeXBlKSB7XG5cdFx0XHRcdGNvbnN0IG9FcnJvck1zZyA9IHtcblx0XHRcdFx0XHRtZXNzYWdlOlxuXHRcdFx0XHRcdFx0XCJVbmFibGUgdG8gcmVzb2x2ZSB0aGUgcGF0aCBleHByZXNzaW9uOiBcIiArXG5cdFx0XHRcdFx0XHR0YXJnZXRTdHIgK1xuXHRcdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcdFwiSGludDogQ2hlY2sgYW5kIGNvcnJlY3QgdGhlIHBhdGggdmFsdWVzIHVuZGVyIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlIGluIHRoZSBtZXRhZGF0YSAoYW5ub3RhdGlvbi54bWwgZmlsZSBvciBDRFMgYW5ub3RhdGlvbnMgZm9yIHRoZSBhcHBsaWNhdGlvbik6IFxcblxcblwiICtcblx0XHRcdFx0XHRcdFwiPEFubm90YXRpb24gVGVybSA9IFwiICtcblx0XHRcdFx0XHRcdGFubm90YXRpb25zVGVybSArXG5cdFx0XHRcdFx0XHRcIj5cIiArXG5cdFx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcdFwiPFJlY29yZCBUeXBlID0gXCIgK1xuXHRcdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUgK1xuXHRcdFx0XHRcdFx0XCI+XCIgK1xuXHRcdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XHRcIjxBbm5vdGF0aW9uUGF0aCA9IFwiICtcblx0XHRcdFx0XHRcdHRhcmdldFN0ciArXG5cdFx0XHRcdFx0XHRcIj5cIlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhZGRBbm5vdGF0aW9uRXJyb3JNZXNzYWdlKHRhcmdldFN0ciwgb0Vycm9yTXNnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHByb3BlcnR5ID0gcmVzb2x2ZWFibGUudGVybTtcblx0XHRcdFx0Y29uc3QgcGF0aCA9IHJlc29sdmVhYmxlLnBhdGg7XG5cdFx0XHRcdGNvbnN0IHRlcm1JbmZvID0gdGFyZ2V0U3RyID8gdGFyZ2V0U3RyLnNwbGl0KFwiL1wiKVswXSA6IHRhcmdldFN0cjtcblx0XHRcdFx0Y29uc3Qgb0Vycm9yTXNnID0ge1xuXHRcdFx0XHRcdG1lc3NhZ2U6XG5cdFx0XHRcdFx0XHRcIlVuYWJsZSB0byByZXNvbHZlIHRoZSBwYXRoIGV4cHJlc3Npb246IFwiICtcblx0XHRcdFx0XHRcdHRhcmdldFN0ciArXG5cdFx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFx0XCJIaW50OiBDaGVjayBhbmQgY29ycmVjdCB0aGUgcGF0aCB2YWx1ZXMgdW5kZXIgdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmUgaW4gdGhlIG1ldGFkYXRhIChhbm5vdGF0aW9uLnhtbCBmaWxlIG9yIENEUyBhbm5vdGF0aW9ucyBmb3IgdGhlIGFwcGxpY2F0aW9uKTogXFxuXFxuXCIgK1xuXHRcdFx0XHRcdFx0XCI8QW5ub3RhdGlvbiBUZXJtID0gXCIgK1xuXHRcdFx0XHRcdFx0dGVybUluZm8gK1xuXHRcdFx0XHRcdFx0XCI+XCIgK1xuXHRcdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XHRcIjxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5ID0gXCIgK1xuXHRcdFx0XHRcdFx0cHJvcGVydHkgK1xuXHRcdFx0XHRcdFx0XCIgICAgICAgIFBhdGg9IFwiICtcblx0XHRcdFx0XHRcdHBhdGggK1xuXHRcdFx0XHRcdFx0XCI+XCJcblx0XHRcdFx0fTtcblx0XHRcdFx0YWRkQW5ub3RhdGlvbkVycm9yTWVzc2FnZSh0YXJnZXRTdHIsIG9FcnJvck1zZyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblx0Zm9yICh2YXIgcHJvcGVydHkgaW4gQUxMX0FOTk9UQVRJT05fRVJST1JTKSB7XG5cdFx0QU5OT1RBVElPTl9FUlJPUlMucHVzaChBTExfQU5OT1RBVElPTl9FUlJPUlNbcHJvcGVydHldWzBdKTtcblx0fVxuXHQocGFyc2VyT3V0cHV0IGFzIGFueSkuZW50aXR5U2V0cyA9IHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5U2V0cztcblxuXHRyZXR1cm4ge1xuXHRcdHZlcnNpb246IHBhcnNlck91dHB1dC52ZXJzaW9uLFxuXHRcdGFubm90YXRpb25zOiBwYXJzZXJPdXRwdXQuc2NoZW1hLmFubm90YXRpb25zLFxuXHRcdG5hbWVzcGFjZTogcGFyc2VyT3V0cHV0LnNjaGVtYS5uYW1lc3BhY2UsXG5cdFx0ZW50aXR5Q29udGFpbmVyOiBwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eUNvbnRhaW5lciBhcyBFbnRpdHlDb250YWluZXIsXG5cdFx0YWN0aW9uczogcGFyc2VyT3V0cHV0LnNjaGVtYS5hY3Rpb25zIGFzIEFjdGlvbltdLFxuXHRcdGVudGl0eVNldHM6IHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5U2V0cyBhcyBFbnRpdHlTZXRbXSxcblx0XHRlbnRpdHlUeXBlczogcGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlUeXBlcyBhcyBFbnRpdHlUeXBlW10sXG5cdFx0Y29tcGxleFR5cGVzOiBwYXJzZXJPdXRwdXQuc2NoZW1hLmNvbXBsZXhUeXBlcyBhcyBDb21wbGV4VHlwZVtdLFxuXHRcdHJlZmVyZW5jZXM6IGRlZmF1bHRSZWZlcmVuY2VzLFxuXHRcdGRpYWdub3N0aWNzOiBBTk5PVEFUSU9OX0VSUk9SUy5jb25jYXQoKVxuXHR9O1xufVxuXG5mdW5jdGlvbiByZXZlcnRWYWx1ZVRvR2VuZXJpY1R5cGUocmVmZXJlbmNlczogUmVmZXJlbmNlW10sIHZhbHVlOiBhbnkpOiBFeHByZXNzaW9uIHwgdW5kZWZpbmVkIHtcblx0bGV0IHJlc3VsdDogRXhwcmVzc2lvbiB8IHVuZGVmaW5lZDtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdGNvbnN0IHZhbHVlTWF0Y2hlcyA9IHZhbHVlLm1hdGNoKC8oXFx3KylcXC5cXHcrXFwvLiovKTtcblx0XHRpZiAodmFsdWVNYXRjaGVzICYmIHJlZmVyZW5jZXMuZmluZChyZWYgPT4gcmVmLmFsaWFzID09PSB2YWx1ZU1hdGNoZXNbMV0pKSB7XG5cdFx0XHRyZXN1bHQgPSB7XG5cdFx0XHRcdHR5cGU6IFwiRW51bU1lbWJlclwiLFxuXHRcdFx0XHRFbnVtTWVtYmVyOiB2YWx1ZVxuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0ge1xuXHRcdFx0XHR0eXBlOiBcIlN0cmluZ1wiLFxuXHRcdFx0XHRTdHJpbmc6IHZhbHVlXG5cdFx0XHR9O1xuXHRcdH1cblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiQ29sbGVjdGlvblwiLFxuXHRcdFx0Q29sbGVjdGlvbjogdmFsdWUubWFwKGFubm8gPT4gcmV2ZXJ0Q29sbGVjdGlvbkl0ZW1Ub0dlbmVyaWNUeXBlKHJlZmVyZW5jZXMsIGFubm8pKSBhcyBhbnlbXVxuXHRcdH07XG5cdH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIikge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiQm9vbFwiLFxuXHRcdFx0Qm9vbDogdmFsdWVcblx0XHR9O1xuXHR9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIikge1xuXHRcdGlmICh2YWx1ZS50b1N0cmluZygpID09PSB2YWx1ZS50b0ZpeGVkKCkpIHtcblx0XHRcdHJlc3VsdCA9IHtcblx0XHRcdFx0dHlwZTogXCJJbnRcIixcblx0XHRcdFx0SW50OiB2YWx1ZVxuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0ge1xuXHRcdFx0XHR0eXBlOiBcIkRlY2ltYWxcIixcblx0XHRcdFx0RGVjaW1hbDogdmFsdWVcblx0XHRcdH07XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZS5pc0RlY2ltYWwgJiYgdmFsdWUuaXNEZWNpbWFsKCkpIHtcblx0XHRyZXN1bHQgPSB7XG5cdFx0XHR0eXBlOiBcIkRlY2ltYWxcIixcblx0XHRcdERlY2ltYWw6IHZhbHVlLnZhbHVlT2YoKVxuXHRcdH07XG5cdH0gZWxzZSBpZiAodmFsdWUudHlwZSA9PT0gXCJQYXRoXCIpIHtcblx0XHRyZXN1bHQgPSB7XG5cdFx0XHR0eXBlOiBcIlBhdGhcIixcblx0XHRcdFBhdGg6IHZhbHVlLnBhdGhcblx0XHR9O1xuXHR9IGVsc2UgaWYgKHZhbHVlLnR5cGUgPT09IFwiQW5ub3RhdGlvblBhdGhcIikge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIixcblx0XHRcdEFubm90YXRpb25QYXRoOiB2YWx1ZS52YWx1ZVxuXHRcdH07XG5cdH0gZWxzZSBpZiAodmFsdWUudHlwZSA9PT0gXCJQcm9wZXJ0eVBhdGhcIikge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiUHJvcGVydHlQYXRoXCIsXG5cdFx0XHRQcm9wZXJ0eVBhdGg6IHZhbHVlLnZhbHVlXG5cdFx0fTtcblx0fSBlbHNlIGlmICh2YWx1ZS50eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIikge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiLFxuXHRcdFx0TmF2aWdhdGlvblByb3BlcnR5UGF0aDogdmFsdWUudmFsdWVcblx0XHR9O1xuXHR9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgXCIkVHlwZVwiKSkge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiUmVjb3JkXCIsXG5cdFx0XHRSZWNvcmQ6IHJldmVydENvbGxlY3Rpb25JdGVtVG9HZW5lcmljVHlwZShyZWZlcmVuY2VzLCB2YWx1ZSkgYXMgQW5ub3RhdGlvblJlY29yZFxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcmV2ZXJ0Q29sbGVjdGlvbkl0ZW1Ub0dlbmVyaWNUeXBlKFxuXHRyZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSxcblx0Y29sbGVjdGlvbkl0ZW06IGFueVxuKTpcblx0fCBBbm5vdGF0aW9uUmVjb3JkXG5cdHwgc3RyaW5nXG5cdHwgUHJvcGVydHlQYXRoRXhwcmVzc2lvblxuXHR8IFBhdGhFeHByZXNzaW9uXG5cdHwgTmF2aWdhdGlvblByb3BlcnR5UGF0aEV4cHJlc3Npb25cblx0fCBBbm5vdGF0aW9uUGF0aEV4cHJlc3Npb25cblx0fCB1bmRlZmluZWQge1xuXHRpZiAodHlwZW9mIGNvbGxlY3Rpb25JdGVtID09PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGNvbGxlY3Rpb25JdGVtO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBjb2xsZWN0aW9uSXRlbSA9PT0gXCJvYmplY3RcIikge1xuXHRcdGlmIChjb2xsZWN0aW9uSXRlbS5oYXNPd25Qcm9wZXJ0eShcIiRUeXBlXCIpKSB7XG5cdFx0XHQvLyBBbm5vdGF0aW9uIFJlY29yZFxuXHRcdFx0Y29uc3Qgb3V0SXRlbTogQW5ub3RhdGlvblJlY29yZCA9IHtcblx0XHRcdFx0dHlwZTogY29sbGVjdGlvbkl0ZW0uJFR5cGUsXG5cdFx0XHRcdHByb3BlcnR5VmFsdWVzOiBbXSBhcyBhbnlbXVxuXHRcdFx0fTtcblx0XHRcdC8vIENvdWxkIHZhbGlkYXRlIGtleXMgYW5kIHR5cGUgYmFzZWQgb24gJFR5cGVcblx0XHRcdE9iamVjdC5rZXlzKGNvbGxlY3Rpb25JdGVtKS5mb3JFYWNoKGNvbGxlY3Rpb25LZXkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0Y29sbGVjdGlvbktleSAhPT0gXCIkVHlwZVwiICYmXG5cdFx0XHRcdFx0Y29sbGVjdGlvbktleSAhPT0gXCJ0ZXJtXCIgJiZcblx0XHRcdFx0XHRjb2xsZWN0aW9uS2V5ICE9PSBcIl9fc291cmNlXCIgJiZcblx0XHRcdFx0XHRjb2xsZWN0aW9uS2V5ICE9PSBcInF1YWxpZmllclwiICYmXG5cdFx0XHRcdFx0Y29sbGVjdGlvbktleSAhPT0gXCJBY3Rpb25UYXJnZXRcIiAmJlxuXHRcdFx0XHRcdGNvbGxlY3Rpb25LZXkgIT09IFwiZnVsbHlRdWFsaWZpZWROYW1lXCIgJiZcblx0XHRcdFx0XHRjb2xsZWN0aW9uS2V5ICE9PSBcImFubm90YXRpb25zXCJcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBjb2xsZWN0aW9uSXRlbVtjb2xsZWN0aW9uS2V5XTtcblx0XHRcdFx0XHRvdXRJdGVtLnByb3BlcnR5VmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0bmFtZTogY29sbGVjdGlvbktleSxcblx0XHRcdFx0XHRcdHZhbHVlOiByZXZlcnRWYWx1ZVRvR2VuZXJpY1R5cGUocmVmZXJlbmNlcywgdmFsdWUpIGFzIEV4cHJlc3Npb25cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIGlmIChjb2xsZWN0aW9uS2V5ID09PSBcImFubm90YXRpb25zXCIpIHtcblx0XHRcdFx0XHRjb25zdCBhbm5vdGF0aW9ucyA9IGNvbGxlY3Rpb25JdGVtW2NvbGxlY3Rpb25LZXldO1xuXHRcdFx0XHRcdG91dEl0ZW0uYW5ub3RhdGlvbnMgPSBbXTtcblx0XHRcdFx0XHRPYmplY3Qua2V5cyhhbm5vdGF0aW9ucylcblx0XHRcdFx0XHRcdC5maWx0ZXIoa2V5ID0+IGtleSAhPT0gXCJfYW5ub3RhdGlvbnNcIilcblx0XHRcdFx0XHRcdC5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRcdFx0XHRcdE9iamVjdC5rZXlzKGFubm90YXRpb25zW2tleV0pLmZvckVhY2godGVybSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgcGFyc2VkQW5ub3RhdGlvbiA9IHJldmVydFRlcm1Ub0dlbmVyaWNUeXBlKHJlZmVyZW5jZXMsIGFubm90YXRpb25zW2tleV1bdGVybV0pO1xuXHRcdFx0XHRcdFx0XHRcdGlmICghcGFyc2VkQW5ub3RhdGlvbi50ZXJtKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB1bmFsaWFzZWRUZXJtID0gdW5hbGlhcyhyZWZlcmVuY2VzLCBgJHtrZXl9LiR7dGVybX1gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh1bmFsaWFzZWRUZXJtKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHF1YWxpZmllZFNwbGl0ID0gdW5hbGlhc2VkVGVybS5zcGxpdChcIiNcIik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlZEFubm90YXRpb24udGVybSA9IHF1YWxpZmllZFNwbGl0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAocXVhbGlmaWVkU3BsaXQubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlZEFubm90YXRpb24ucXVhbGlmaWVyID0gcXVhbGlmaWVkU3BsaXRbMV07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0b3V0SXRlbS5hbm5vdGF0aW9ucz8ucHVzaChwYXJzZWRBbm5vdGF0aW9uKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gb3V0SXRlbTtcblx0XHR9IGVsc2UgaWYgKGNvbGxlY3Rpb25JdGVtLnR5cGUgPT09IFwiUHJvcGVydHlQYXRoXCIpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IFwiUHJvcGVydHlQYXRoXCIsXG5cdFx0XHRcdFByb3BlcnR5UGF0aDogY29sbGVjdGlvbkl0ZW0udmFsdWVcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmIChjb2xsZWN0aW9uSXRlbS50eXBlID09PSBcIkFubm90YXRpb25QYXRoXCIpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIixcblx0XHRcdFx0QW5ub3RhdGlvblBhdGg6IGNvbGxlY3Rpb25JdGVtLnZhbHVlXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAoY29sbGVjdGlvbkl0ZW0udHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiLFxuXHRcdFx0XHROYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBjb2xsZWN0aW9uSXRlbS52YWx1ZVxuXHRcdFx0fTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldmVydFRlcm1Ub0dlbmVyaWNUeXBlKHJlZmVyZW5jZXM6IFJlZmVyZW5jZVtdLCBhbm5vdGF0aW9uOiBBbm5vdGF0aW9uVGVybTxhbnk+KTogRWRtQW5ub3RhdGlvbiB7XG5cdGNvbnN0IGJhc2VBbm5vdGF0aW9uID0ge1xuXHRcdHRlcm06IGFubm90YXRpb24udGVybSxcblx0XHRxdWFsaWZpZXI6IGFubm90YXRpb24ucXVhbGlmaWVyXG5cdH07XG5cdGlmIChBcnJheS5pc0FycmF5KGFubm90YXRpb24pKSB7XG5cdFx0Ly8gQ29sbGVjdGlvblxuXHRcdHJldHVybiB7XG5cdFx0XHQuLi5iYXNlQW5ub3RhdGlvbixcblx0XHRcdGNvbGxlY3Rpb246IGFubm90YXRpb24ubWFwKGFubm8gPT4gcmV2ZXJ0Q29sbGVjdGlvbkl0ZW1Ub0dlbmVyaWNUeXBlKHJlZmVyZW5jZXMsIGFubm8pKSBhcyBhbnlbXVxuXHRcdH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbi5oYXNPd25Qcm9wZXJ0eShcIiRUeXBlXCIpKSB7XG5cdFx0cmV0dXJuIHsgLi4uYmFzZUFubm90YXRpb24sIHJlY29yZDogcmV2ZXJ0Q29sbGVjdGlvbkl0ZW1Ub0dlbmVyaWNUeXBlKHJlZmVyZW5jZXMsIGFubm90YXRpb24pIGFzIGFueSB9O1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiB7IC4uLmJhc2VBbm5vdGF0aW9uLCB2YWx1ZTogcmV2ZXJ0VmFsdWVUb0dlbmVyaWNUeXBlKHJlZmVyZW5jZXMsIGFubm90YXRpb24pIH07XG5cdH1cbn1cbiJdfQ==