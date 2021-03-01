sap.ui.define(["sap/fe/core/converters/common/AnnotationConverter"], function (AnnotationConverter) {
  "use strict";

  var _exports = {};

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  var VOCABULARY_ALIAS = {
    "Org.OData.Capabilities.V1": "Capabilities",
    "Org.OData.Core.V1": "Core",
    "Org.OData.Measures.V1": "Measures",
    "com.sap.vocabularies.Common.v1": "Common",
    "com.sap.vocabularies.UI.v1": "UI",
    "com.sap.vocabularies.Session.v1": "Session",
    "com.sap.vocabularies.Analytics.v1": "Analytics",
    "com.sap.vocabularies.PersonalData.v1": "PersonalData",
    "com.sap.vocabularies.Communication.v1": "Communication"
  };
  var DefaultEnvironmentCapabilities = {
    Chart: true,
    MicroChart: true,
    UShell: true,
    IntentBasedNavigation: true
  };
  _exports.DefaultEnvironmentCapabilities = DefaultEnvironmentCapabilities;
  var MetaModelConverter = {
    parsePropertyValue: function (annotationObject, propertyKey, currentTarget, annotationsLists, oCapabilities) {
      var _this = this;

      var value;
      var currentPropertyTarget = currentTarget + "/" + propertyKey;

      if (annotationObject === null) {
        value = {
          type: "Null",
          Null: null
        };
      } else if (typeof annotationObject === "string") {
        value = {
          type: "String",
          String: annotationObject
        };
      } else if (typeof annotationObject === "boolean") {
        value = {
          type: "Bool",
          Bool: annotationObject
        };
      } else if (typeof annotationObject === "number") {
        value = {
          type: "Int",
          Int: annotationObject
        };
      } else if (Array.isArray(annotationObject)) {
        value = {
          type: "Collection",
          Collection: annotationObject.map(function (subAnnotationObject, subAnnotationObjectIndex) {
            return _this.parseAnnotationObject(subAnnotationObject, currentPropertyTarget + "/" + subAnnotationObjectIndex, annotationsLists, oCapabilities);
          })
        };

        if (annotationObject.length > 0) {
          if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
            value.Collection.type = "PropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$Path")) {
            value.Collection.type = "Path";
          } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
            value.Collection.type = "NavigationPropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
            value.Collection.type = "AnnotationPath";
          } else if (annotationObject[0].hasOwnProperty("$Type")) {
            value.Collection.type = "Record";
          } else if (annotationObject[0].hasOwnProperty("$If")) {
            value.Collection.type = "If";
          } else if (annotationObject[0].hasOwnProperty("$Apply")) {
            value.Collection.type = "Apply";
          } else if (typeof annotationObject[0] === "object") {
            // $Type is optional...
            value.Collection.type = "Record";
          } else {
            value.Collection.type = "String";
          }
        }
      } else if (annotationObject.$Path !== undefined) {
        value = {
          type: "Path",
          Path: annotationObject.$Path
        };
      } else if (annotationObject.$Decimal !== undefined) {
        value = {
          type: "Decimal",
          Decimal: parseFloat(annotationObject.$Decimal)
        };
      } else if (annotationObject.$PropertyPath !== undefined) {
        value = {
          type: "PropertyPath",
          PropertyPath: annotationObject.$PropertyPath
        };
      } else if (annotationObject.$NavigationPropertyPath !== undefined) {
        value = {
          type: "NavigationPropertyPath",
          NavigationPropertyPath: annotationObject.$NavigationPropertyPath
        };
      } else if (annotationObject.$If !== undefined) {
        value = {
          type: "If",
          If: annotationObject.$If
        };
      } else if (annotationObject.$Apply !== undefined) {
        value = {
          type: "Apply",
          Apply: annotationObject.$Apply,
          Function: annotationObject.$Function
        };
      } else if (annotationObject.$AnnotationPath !== undefined) {
        value = {
          type: "AnnotationPath",
          AnnotationPath: annotationObject.$AnnotationPath
        };
      } else if (annotationObject.$EnumMember !== undefined) {
        value = {
          type: "EnumMember",
          EnumMember: this.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
        };
      } else if (annotationObject.$Type) {
        value = {
          type: "Record",
          Record: this.parseAnnotationObject(annotationObject, currentTarget, annotationsLists, oCapabilities)
        };
      } else {
        value = {
          type: "Record",
          Record: this.parseAnnotationObject(annotationObject, currentTarget, annotationsLists, oCapabilities)
        };
      }

      return {
        name: propertyKey,
        value: value
      };
    },
    mapNameToAlias: function (annotationName) {
      var _annotationName$split = annotationName.split("@"),
          _annotationName$split2 = _slicedToArray(_annotationName$split, 2),
          pathPart = _annotationName$split2[0],
          annoPart = _annotationName$split2[1];

      if (!annoPart) {
        annoPart = pathPart;
        pathPart = "";
      } else {
        pathPart += "@";
      }

      var lastDot = annoPart.lastIndexOf(".");
      return pathPart + VOCABULARY_ALIAS[annoPart.substr(0, lastDot)] + "." + annoPart.substr(lastDot + 1);
    },
    parseAnnotationObject: function (annotationObject, currentObjectTarget, annotationsLists, oCapabilities) {
      var _this2 = this;

      var parsedAnnotationObject = {};

      if (annotationObject === null) {
        parsedAnnotationObject = {
          type: "Null",
          Null: null
        };
      } else if (typeof annotationObject === "string") {
        parsedAnnotationObject = {
          type: "String",
          String: annotationObject
        };
      } else if (typeof annotationObject === "boolean") {
        parsedAnnotationObject = {
          type: "Bool",
          Bool: annotationObject
        };
      } else if (typeof annotationObject === "number") {
        parsedAnnotationObject = {
          type: "Int",
          Int: annotationObject
        };
      } else if (annotationObject.$AnnotationPath !== undefined) {
        parsedAnnotationObject = {
          type: "AnnotationPath",
          AnnotationPath: annotationObject.$AnnotationPath
        };
      } else if (annotationObject.$Path !== undefined) {
        parsedAnnotationObject = {
          type: "Path",
          Path: annotationObject.$Path
        };
      } else if (annotationObject.$Decimal !== undefined) {
        parsedAnnotationObject = {
          type: "Decimal",
          Decimal: parseFloat(annotationObject.$Decimal)
        };
      } else if (annotationObject.$PropertyPath !== undefined) {
        parsedAnnotationObject = {
          type: "PropertyPath",
          PropertyPath: annotationObject.$PropertyPath
        };
      } else if (annotationObject.$If !== undefined) {
        parsedAnnotationObject = {
          type: "If",
          If: annotationObject.$If
        };
      } else if (annotationObject.$Apply !== undefined) {
        parsedAnnotationObject = {
          type: "Apply",
          Apply: annotationObject.$Apply,
          Function: annotationObject.$Function
        };
      } else if (annotationObject.$NavigationPropertyPath !== undefined) {
        parsedAnnotationObject = {
          type: "NavigationPropertyPath",
          NavigationPropertyPath: annotationObject.$NavigationPropertyPath
        };
      } else if (annotationObject.$EnumMember !== undefined) {
        parsedAnnotationObject = {
          type: "EnumMember",
          EnumMember: this.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
        };
      } else if (Array.isArray(annotationObject)) {
        var parsedAnnotationCollection = parsedAnnotationObject;
        parsedAnnotationCollection.collection = annotationObject.map(function (subAnnotationObject, subAnnotationIndex) {
          return _this2.parseAnnotationObject(subAnnotationObject, currentObjectTarget + "/" + subAnnotationIndex, annotationsLists, oCapabilities);
        });

        if (annotationObject.length > 0) {
          if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
            parsedAnnotationCollection.collection.type = "PropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$Path")) {
            parsedAnnotationCollection.collection.type = "Path";
          } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
            parsedAnnotationCollection.collection.type = "NavigationPropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
            parsedAnnotationCollection.collection.type = "AnnotationPath";
          } else if (annotationObject[0].hasOwnProperty("$Type")) {
            parsedAnnotationCollection.collection.type = "Record";
          } else if (annotationObject[0].hasOwnProperty("$If")) {
            parsedAnnotationCollection.collection.type = "If";
          } else if (annotationObject[0].hasOwnProperty("$Apply")) {
            parsedAnnotationCollection.collection.type = "Apply";
          } else if (typeof annotationObject[0] === "object") {
            parsedAnnotationCollection.collection.type = "Record";
          } else {
            parsedAnnotationCollection.collection.type = "String";
          }
        }
      } else {
        if (annotationObject.$Type) {
          var typeValue = annotationObject.$Type;
          parsedAnnotationObject.type = typeValue; //`${typeAlias}.${typeTerm}`;
        }

        var propertyValues = [];
        Object.keys(annotationObject).forEach(function (propertyKey) {
          if (propertyKey !== "$Type" && propertyKey !== "$If" && propertyKey !== "$Apply" && propertyKey !== "$Eq" && !propertyKey.startsWith("@")) {
            propertyValues.push(_this2.parsePropertyValue(annotationObject[propertyKey], propertyKey, currentObjectTarget, annotationsLists, oCapabilities));
          } else if (propertyKey.startsWith("@")) {
            // Annotation of annotation
            _this2.createAnnotationLists(_defineProperty({}, propertyKey, annotationObject[propertyKey]), currentObjectTarget, annotationsLists, oCapabilities);
          }
        });
        parsedAnnotationObject.propertyValues = propertyValues;
      }

      return parsedAnnotationObject;
    },
    getOrCreateAnnotationList: function (target, annotationsLists) {
      var potentialTarget = annotationsLists.find(function (annotationList) {
        return annotationList.target === target;
      });

      if (!potentialTarget) {
        potentialTarget = {
          target: target,
          annotations: []
        };
        annotationsLists.push(potentialTarget);
      }

      return potentialTarget;
    },
    createAnnotationLists: function (annotationObjects, annotationTarget, annotationLists, oCapabilities) {
      var _this3 = this;

      var outAnnotationObject = this.getOrCreateAnnotationList(annotationTarget, annotationLists);

      if (!oCapabilities.MicroChart) {
        delete annotationObjects["@com.sap.vocabularies.UI.v1.Chart"];
      }

      function removeChartAnnotations(annotationObject) {
        return annotationObject.filter(function (oRecord) {
          if (oRecord.Target && oRecord.Target.$AnnotationPath) {
            return oRecord.Target.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.Chart") === -1;
          } else {
            return true;
          }
        });
      }

      function removeIBNAnnotations(annotationObject) {
        return annotationObject.filter(function (oRecord) {
          return oRecord.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
        });
      }

      function handlePresentationVariant(annotationObject) {
        return annotationObject.filter(function (oRecord) {
          return oRecord.$AnnotationPath !== "@com.sap.vocabularies.UI.v1.Chart";
        });
      }

      Object.keys(annotationObjects).forEach(function (annotationKey) {
        var annotationObject = annotationObjects[annotationKey];

        switch (annotationKey) {
          case "@com.sap.vocabularies.UI.v1.HeaderFacets":
            if (!oCapabilities.MicroChart) {
              annotationObject = removeChartAnnotations(annotationObject);
            }

            break;

          case "@com.sap.vocabularies.UI.v1.Identification":
            if (!oCapabilities.IntentBasedNavigation) {
              annotationObject = removeIBNAnnotations(annotationObject);
            }

            break;

          case "@com.sap.vocabularies.UI.v1.LineItem":
            if (!oCapabilities.IntentBasedNavigation) {
              annotationObject = removeIBNAnnotations(annotationObject);
            }

            if (!oCapabilities.MicroChart) {
              annotationObject = removeChartAnnotations(annotationObject);
            }

            break;

          case "@com.sap.vocabularies.UI.v1.FieldGroup":
            if (!oCapabilities.IntentBasedNavigation) {
              annotationObject.Data = removeIBNAnnotations(annotationObject.Data);
            }

            if (!oCapabilities.MicroChart) {
              annotationObject.Data = removeChartAnnotations(annotationObject.Data);
            }

            break;

          case "@com.sap.vocabularies.UI.v1.PresentationVariant":
            if (!oCapabilities.Chart && annotationObject.Visualizations) {
              annotationObject.Visualizations = handlePresentationVariant(annotationObject.Visualizations);
            }

            break;

          default:
            break;
        }

        annotationObjects[annotationKey] = annotationObject;
        var currentOutAnnotationObject = outAnnotationObject;
        var annotationQualifierSplit = annotationKey.split("#");
        var qualifier = annotationQualifierSplit[1];
        annotationKey = annotationQualifierSplit[0]; // Check for annotation of annotation

        var annotationOfAnnotationSplit = annotationKey.split("@");

        if (annotationOfAnnotationSplit.length > 2) {
          currentOutAnnotationObject = _this3.getOrCreateAnnotationList(annotationTarget + "@" + annotationOfAnnotationSplit[1], annotationLists);
          annotationKey = annotationOfAnnotationSplit[2];
        } else {
          annotationKey = annotationOfAnnotationSplit[1];
        }

        var parsedAnnotationObject = {
          term: "".concat(annotationKey),
          qualifier: qualifier
        };
        var currentAnnotationTarget = annotationTarget + "@" + parsedAnnotationObject.term;

        if (qualifier) {
          currentAnnotationTarget += "#" + qualifier;
        }

        var isCollection = false;

        if (annotationObject === null) {
          parsedAnnotationObject.value = {
            type: "Bool",
            Bool: annotationObject
          };
        } else if (typeof annotationObject === "string") {
          parsedAnnotationObject.value = {
            type: "String",
            String: annotationObject
          };
        } else if (typeof annotationObject === "boolean") {
          parsedAnnotationObject.value = {
            type: "Bool",
            Bool: annotationObject
          };
        } else if (typeof annotationObject === "number") {
          parsedAnnotationObject.value = {
            type: "Int",
            Int: annotationObject
          };
        } else if (annotationObject.$If !== undefined) {
          parsedAnnotationObject.value = {
            type: "If",
            If: annotationObject.$If
          };
        } else if (annotationObject.$Apply !== undefined) {
          parsedAnnotationObject.value = {
            type: "Apply",
            Apply: annotationObject.$Apply,
            Function: annotationObject.$Function
          };
        } else if (annotationObject.$Path !== undefined) {
          parsedAnnotationObject.value = {
            type: "Path",
            Path: annotationObject.$Path
          };
        } else if (annotationObject.$AnnotationPath !== undefined) {
          parsedAnnotationObject.value = {
            type: "AnnotationPath",
            AnnotationPath: annotationObject.$AnnotationPath
          };
        } else if (annotationObject.$Decimal !== undefined) {
          parsedAnnotationObject.value = {
            type: "Decimal",
            Decimal: parseFloat(annotationObject.$Decimal)
          };
        } else if (annotationObject.$EnumMember !== undefined) {
          parsedAnnotationObject.value = {
            type: "EnumMember",
            EnumMember: _this3.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
          };
        } else if (Array.isArray(annotationObject)) {
          isCollection = true;
          parsedAnnotationObject.collection = annotationObject.map(function (subAnnotationObject, subAnnotationIndex) {
            return _this3.parseAnnotationObject(subAnnotationObject, currentAnnotationTarget + "/" + subAnnotationIndex, annotationLists, oCapabilities);
          });

          if (annotationObject.length > 0) {
            if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
              parsedAnnotationObject.collection.type = "PropertyPath";
            } else if (annotationObject[0].hasOwnProperty("$Path")) {
              parsedAnnotationObject.collection.type = "Path";
            } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
              parsedAnnotationObject.collection.type = "NavigationPropertyPath";
            } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
              parsedAnnotationObject.collection.type = "AnnotationPath";
            } else if (annotationObject[0].hasOwnProperty("$Type")) {
              parsedAnnotationObject.collection.type = "Record";
            } else if (annotationObject[0].hasOwnProperty("$If")) {
              parsedAnnotationObject.collection.type = "If";
            } else if (annotationObject[0].hasOwnProperty("$Apply")) {
              parsedAnnotationObject.collection.type = "Apply";
            } else if (typeof annotationObject[0] === "object") {
              parsedAnnotationObject.collection.type = "Record";
            } else {
              parsedAnnotationObject.collection.type = "String";
            }
          }
        } else {
          var record = {
            propertyValues: []
          };

          if (annotationObject.$Type) {
            var typeValue = annotationObject.$Type;
            record.type = "".concat(typeValue);
          }

          var propertyValues = [];
          Object.keys(annotationObject).forEach(function (propertyKey) {
            if (propertyKey !== "$Type" && !propertyKey.startsWith("@")) {
              propertyValues.push(_this3.parsePropertyValue(annotationObject[propertyKey], propertyKey, currentAnnotationTarget, annotationLists, oCapabilities));
            } else if (propertyKey.startsWith("@")) {
              // Annotation of record
              _this3.createAnnotationLists(_defineProperty({}, propertyKey, annotationObject[propertyKey]), currentAnnotationTarget, annotationLists, oCapabilities);
            }
          });
          record.propertyValues = propertyValues;
          parsedAnnotationObject.record = record;
        }

        parsedAnnotationObject.isCollection = isCollection;
        currentOutAnnotationObject.annotations.push(parsedAnnotationObject);
      });
    },
    parseProperty: function (oMetaModel, entityTypeObject, propertyName, annotationLists, oCapabilities) {
      var propertyAnnotation = oMetaModel.getObject("/".concat(entityTypeObject.fullyQualifiedName, "/").concat(propertyName, "@"));
      var propertyDefinition = oMetaModel.getObject("/".concat(entityTypeObject.fullyQualifiedName, "/").concat(propertyName));
      var propertyObject = {
        _type: "Property",
        name: propertyName,
        fullyQualifiedName: "".concat(entityTypeObject.fullyQualifiedName, "/").concat(propertyName),
        type: propertyDefinition.$Type,
        maxLength: propertyDefinition.$MaxLength,
        precision: propertyDefinition.$Precision,
        scale: propertyDefinition.$Scale,
        nullable: propertyDefinition.$Nullable
      };
      this.createAnnotationLists(propertyAnnotation, propertyObject.fullyQualifiedName, annotationLists, oCapabilities);
      return propertyObject;
    },
    parseNavigationProperty: function (oMetaModel, entityTypeObject, navPropertyName, annotationLists, oCapabilities) {
      var navPropertyAnnotation = oMetaModel.getObject("/".concat(entityTypeObject.fullyQualifiedName, "/").concat(navPropertyName, "@"));
      var navPropertyDefinition = oMetaModel.getObject("/".concat(entityTypeObject.fullyQualifiedName, "/").concat(navPropertyName));
      var referentialConstraint = [];

      if (navPropertyDefinition.$ReferentialConstraint) {
        referentialConstraint = Object.keys(navPropertyDefinition.$ReferentialConstraint).map(function (sourcePropertyName) {
          return {
            sourceTypeName: entityTypeObject.name,
            sourceProperty: sourcePropertyName,
            targetTypeName: navPropertyDefinition.$Type,
            targetProperty: navPropertyDefinition.$ReferentialConstraint[sourcePropertyName]
          };
        });
      }

      var navigationProperty = {
        _type: "NavigationProperty",
        name: navPropertyName,
        fullyQualifiedName: "".concat(entityTypeObject.fullyQualifiedName, "/").concat(navPropertyName),
        partner: navPropertyDefinition.$Partner,
        isCollection: navPropertyDefinition.$isCollection ? navPropertyDefinition.$isCollection : false,
        containsTarget: navPropertyDefinition.$ContainsTarget,
        targetTypeName: navPropertyDefinition.$Type,
        referentialConstraint: referentialConstraint
      };
      this.createAnnotationLists(navPropertyAnnotation, navigationProperty.fullyQualifiedName, annotationLists, oCapabilities);
      return navigationProperty;
    },
    parseEntitySet: function (oMetaModel, entitySetName, annotationLists, entityContainerName, oCapabilities) {
      var entitySetDefinition = oMetaModel.getObject("/".concat(entitySetName));
      var entitySetAnnotation = oMetaModel.getObject("/".concat(entitySetName, "@"));
      var entitySetObject = {
        _type: "EntitySet",
        name: entitySetName,
        navigationPropertyBinding: {},
        entityTypeName: entitySetDefinition.$Type,
        fullyQualifiedName: "".concat(entityContainerName, "/").concat(entitySetName)
      };
      this.createAnnotationLists(entitySetAnnotation, entitySetObject.fullyQualifiedName, annotationLists, oCapabilities);
      return entitySetObject;
    },
    parseEntityType: function (oMetaModel, entityTypeName, annotationLists, namespace, oCapabilities) {
      var _this4 = this;

      var entityTypeAnnotation = oMetaModel.getObject("/".concat(entityTypeName, "@"));
      var entityTypeDefinition = oMetaModel.getObject("/".concat(entityTypeName));
      var entityKeys = entityTypeDefinition.$Key || [];
      var entityTypeObject = {
        _type: "EntityType",
        name: entityTypeName.replace(namespace + ".", ""),
        fullyQualifiedName: entityTypeName,
        keys: [],
        entityProperties: [],
        navigationProperties: []
      };
      this.createAnnotationLists(entityTypeAnnotation, entityTypeObject.fullyQualifiedName, annotationLists, oCapabilities);
      var entityProperties = Object.keys(entityTypeDefinition).filter(function (propertyNameOrNot) {
        if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
          return entityTypeDefinition[propertyNameOrNot].$kind === "Property";
        }
      }).map(function (propertyName) {
        return _this4.parseProperty(oMetaModel, entityTypeObject, propertyName, annotationLists, oCapabilities);
      });
      var navigationProperties = Object.keys(entityTypeDefinition).filter(function (propertyNameOrNot) {
        if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
          return entityTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
        }
      }).map(function (navPropertyName) {
        return _this4.parseNavigationProperty(oMetaModel, entityTypeObject, navPropertyName, annotationLists, oCapabilities);
      });
      entityTypeObject.keys = entityKeys.map(function (entityKey) {
        return entityProperties.find(function (property) {
          return property.name === entityKey;
        });
      }).filter(function (property) {
        return property !== undefined;
      });
      entityTypeObject.entityProperties = entityProperties;
      entityTypeObject.navigationProperties = navigationProperties;
      return entityTypeObject;
    },
    parseComplexType: function (oMetaModel, complexTypeName, annotationLists, namespace, oCapabilities) {
      var _this5 = this;

      var complexTypeAnnotation = oMetaModel.getObject("/".concat(complexTypeName, "@"));
      var complexTypeDefinition = oMetaModel.getObject("/".concat(complexTypeName));
      var complexTypeObject = {
        _type: "ComplexType",
        name: complexTypeName.replace(namespace + ".", ""),
        fullyQualifiedName: complexTypeName,
        properties: [],
        navigationProperties: []
      };
      this.createAnnotationLists(complexTypeAnnotation, complexTypeObject.fullyQualifiedName, annotationLists, oCapabilities);
      var complexTypeProperties = Object.keys(complexTypeDefinition).filter(function (propertyNameOrNot) {
        if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
          return complexTypeDefinition[propertyNameOrNot].$kind === "Property";
        }
      }).map(function (propertyName) {
        return _this5.parseProperty(oMetaModel, complexTypeObject, propertyName, annotationLists, oCapabilities);
      });
      complexTypeObject.properties = complexTypeProperties;
      var complexTypeNavigationProperties = Object.keys(complexTypeDefinition).filter(function (propertyNameOrNot) {
        if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
          return complexTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
        }
      }).map(function (navPropertyName) {
        return _this5.parseNavigationProperty(oMetaModel, complexTypeObject, navPropertyName, annotationLists, oCapabilities);
      });
      complexTypeObject.navigationProperties = complexTypeNavigationProperties;
      return complexTypeObject;
    },
    parseAction: function (actionName, actionRawData, namespace, entityContainerName) {
      var actionEntityType = "";
      var actionFQN = "".concat(actionName);
      var actionShortName = actionName.substr(namespace.length + 1);

      if (actionRawData.$IsBound) {
        var bindingParameter = actionRawData.$Parameter[0];
        actionEntityType = bindingParameter.$Type;

        if (bindingParameter.$isCollection === true) {
          actionFQN = "".concat(actionName, "(Collection(").concat(actionEntityType, "))");
        } else {
          actionFQN = "".concat(actionName, "(").concat(actionEntityType, ")");
        }
      } else {
        actionFQN = "".concat(entityContainerName, "/").concat(actionShortName);
      }

      var parameters = actionRawData.$Parameter || [];
      return {
        _type: "Action",
        name: actionShortName,
        fullyQualifiedName: actionFQN,
        isBound: actionRawData.$IsBound,
        sourceType: actionEntityType,
        returnType: actionRawData.$ReturnType ? actionRawData.$ReturnType.$Type : "",
        parameters: parameters.map(function (param) {
          return {
            _type: "ActionParameter",
            isEntitySet: param.$Type === actionRawData.$EntitySetPath,
            fullyQualifiedName: "".concat(actionFQN, "/").concat(param.$Name),
            type: param.$Type // TODO missing properties ?

          };
        })
      };
    },
    parseEntityTypes: function (oMetaModel, oInCapabilities) {
      var _this6 = this;

      var oCapabilities;

      if (!oInCapabilities) {
        oCapabilities = DefaultEnvironmentCapabilities;
      } else {
        oCapabilities = oInCapabilities;
      }

      var oMetaModelData = oMetaModel.getObject("/$");
      var oEntitySets = oMetaModel.getObject("/");
      var annotationLists = [];
      var entityTypes = [];
      var entitySets = [];
      var complexTypes = [];
      var entityContainerName = oMetaModelData.$EntityContainer;
      var namespace = "";
      var schemaKeys = Object.keys(oMetaModelData).filter(function (metamodelKey) {
        return oMetaModelData[metamodelKey].$kind === "Schema";
      });

      if (schemaKeys && schemaKeys.length > 0) {
        namespace = schemaKeys[0].substr(0, schemaKeys[0].length - 1);
      } else if (entityTypes && entityTypes.length) {
        namespace = entityTypes[0].fullyQualifiedName.replace(entityTypes[0].name, "");
        namespace = namespace.substr(0, namespace.length - 1);
      }

      Object.keys(oMetaModelData).filter(function (entityTypeName) {
        return entityTypeName !== "$kind" && oMetaModelData[entityTypeName].$kind === "EntityType";
      }).forEach(function (entityTypeName) {
        var entityType = _this6.parseEntityType(oMetaModel, entityTypeName, annotationLists, namespace, oCapabilities);

        entityTypes.push(entityType);
      });
      Object.keys(oEntitySets).filter(function (entitySetName) {
        return entitySetName !== "$kind" && oEntitySets[entitySetName].$kind === "EntitySet";
      }).forEach(function (entitySetName) {
        var entitySet = _this6.parseEntitySet(oMetaModel, entitySetName, annotationLists, entityContainerName, oCapabilities);

        entitySets.push(entitySet);
      });
      Object.keys(oMetaModelData).filter(function (complexTypeName) {
        return complexTypeName !== "$kind" && oMetaModelData[complexTypeName].$kind === "ComplexType";
      }).forEach(function (complexTypeName) {
        var complexType = _this6.parseComplexType(oMetaModel, complexTypeName, annotationLists, namespace, oCapabilities);

        complexTypes.push(complexType);
      });
      var oEntityContainerName = Object.keys(oMetaModelData).find(function (entityContainerName) {
        return entityContainerName !== "$kind" && oMetaModelData[entityContainerName].$kind === "EntityContainer";
      });
      var entityContainer = {};

      if (oEntityContainerName) {
        entityContainer = {
          name: oEntityContainerName.replace(namespace + ".", ""),
          fullyQualifiedName: oEntityContainerName
        };
      }

      entitySets.forEach(function (entitySet) {
        var navPropertyBindings = oMetaModelData[entityContainerName][entitySet.name].$NavigationPropertyBinding;

        if (navPropertyBindings) {
          Object.keys(navPropertyBindings).forEach(function (navPropName) {
            var targetEntitySet = entitySets.find(function (entitySetName) {
              return entitySetName.name === navPropertyBindings[navPropName];
            });

            if (targetEntitySet) {
              entitySet.navigationPropertyBinding[navPropName] = targetEntitySet;
            }
          });
        }
      });
      var actions = Object.keys(oMetaModelData).filter(function (key) {
        return Array.isArray(oMetaModelData[key]) && oMetaModelData[key].length > 0 && oMetaModelData[key][0].$kind === "Action";
      }).reduce(function (outActions, actionName) {
        var actions = oMetaModelData[actionName];
        actions.forEach(function (action) {
          outActions.push(_this6.parseAction(actionName, action, namespace, entityContainerName));
        });
        return outActions;
      }, []); // FIXME Crappy code to deal with annotations for functions

      var annotations = oMetaModelData.$Annotations;
      var actionAnnotations = Object.keys(annotations).filter(function (target) {
        return target.indexOf("(") !== -1;
      });
      actionAnnotations.forEach(function (target) {
        _this6.createAnnotationLists(oMetaModelData.$Annotations[target], target, annotationLists, oCapabilities);
      });
      var entityContainerAnnotations = annotations[entityContainerName]; // Retrieve Entity Container annotations

      if (entityContainerAnnotations) {
        this.createAnnotationLists(entityContainerAnnotations, entityContainerName, annotationLists, oCapabilities);
      } // Sort by target length


      annotationLists = annotationLists.sort(function (a, b) {
        return a.target.length >= b.target.length ? 1 : -1;
      });
      var references = [];
      return {
        identification: "metamodelResult",
        version: "4.0",
        schema: {
          entityContainer: entityContainer,
          entitySets: entitySets,
          entityTypes: entityTypes,
          complexTypes: complexTypes,
          associations: [],
          actions: actions,
          namespace: namespace,
          annotations: {
            "metamodelResult": annotationLists
          }
        },
        references: references
      };
    }
  };
  var mMetaModelMap = {};
  /**
   * Convert the ODataMetaModel into another format that allow for easy manipulation of the annotations.
   *
   * @param {ODataMetaModel} oMetaModel the current oDataMetaModel
   * @param oCapabilities the current capabilities
   * @returns {ConverterOutput} an object containing object like annotation
   */

  function convertTypes(oMetaModel, oCapabilities) {
    var sMetaModelId = oMetaModel.id;

    if (!mMetaModelMap.hasOwnProperty(sMetaModelId)) {
      var parsedOutput = MetaModelConverter.parseEntityTypes(oMetaModel, oCapabilities);
      mMetaModelMap[sMetaModelId] = AnnotationConverter.convertTypes(parsedOutput);
    }

    return mMetaModelMap[sMetaModelId];
  }

  _exports.convertTypes = convertTypes;
  var pathBasedResolution = {};

  function convertMetaModelContext(oMetaModelContext) {
    var bIncludeVisitedObjects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var oConverterOutput = convertTypes(oMetaModelContext.getModel());
    var sPath = oMetaModelContext.getPath();

    if (!bIncludeVisitedObjects && pathBasedResolution.hasOwnProperty(sPath)) {
      return pathBasedResolution[sPath];
    }

    var aPathSplit = sPath.split("/");
    var targetEntitySet = oConverterOutput.entitySets.find(function (entitySet) {
      return entitySet.name === aPathSplit[1];
    });
    var relativePath = aPathSplit.slice(2).join("/");
    var localObjects = [targetEntitySet];

    var _loop = function () {
      var relativeSplit = relativePath.split("/");
      var targetNavProp = targetEntitySet.entityType.navigationProperties.find(function (navProp) {
        return navProp.name === relativeSplit[1];
      });

      if (targetNavProp) {
        localObjects.push(targetNavProp);
      }

      targetEntitySet = targetEntitySet.navigationPropertyBinding[relativeSplit[1]];
      localObjects.push(targetEntitySet);
      relativePath = relativeSplit.slice(2).join("/");
    };

    while (relativePath && relativePath.length > 0 && relativePath.startsWith("$NavigationPropertyBinding")) {
      _loop();
    }

    if (relativePath.startsWith("$Type")) {
      // We're anyway going to look on the entityType...
      relativePath = aPathSplit.slice(3).join("/");
    }

    if (targetEntitySet && relativePath.length) {
      var oTarget = targetEntitySet.entityType.resolvePath(relativePath, bIncludeVisitedObjects);

      if (oTarget) {
        if (bIncludeVisitedObjects) {
          oTarget.visitedObjects = localObjects.concat(oTarget.visitedObjects);
        } else {
          pathBasedResolution[sPath] = oTarget;
        }
      } else if (targetEntitySet.entityType && targetEntitySet.entityType.actions) {
        // if target is an action or an action parameter
        var actions = targetEntitySet.entityType && targetEntitySet.entityType.actions;
        var relativeSplit = relativePath.split("/");

        if (actions[relativeSplit[0]]) {
          var action = actions[relativeSplit[0]];

          if (relativeSplit[1] && action.parameters) {
            var parameterName = relativeSplit[1];
            var targetParameter = action.parameters.find(function (parameter) {
              return parameter.fullyQualifiedName.endsWith("/" + parameterName);
            });
            return targetParameter;
          } else if (relativePath.length === 1) {
            return action;
          }
        }
      }

      return oTarget;
    } else {
      if (bIncludeVisitedObjects) {
        return {
          target: targetEntitySet,
          visitedObjects: localObjects
        };
      } else {
        pathBasedResolution[sPath] = targetEntitySet;
      }

      return targetEntitySet;
    }
  }

  _exports.convertMetaModelContext = convertMetaModelContext;

  function getInvolvedDataModelObjects(oMetaModelContext, oEntitySetMetaModelContext) {
    var metaModelContext = convertMetaModelContext(oMetaModelContext, true);
    var targetEntitySetLocation;

    if (oEntitySetMetaModelContext && oEntitySetMetaModelContext.getPath() !== "/") {
      targetEntitySetLocation = getInvolvedDataModelObjects(oEntitySetMetaModelContext);
    }

    return getInvolvedDataModelObjectFromPath(metaModelContext, targetEntitySetLocation);
  }

  _exports.getInvolvedDataModelObjects = getInvolvedDataModelObjects;

  function getInvolvedDataModelObjectFromPath(metaModelContext, targetEntitySetLocation) {
    var dataModelObjects = metaModelContext.visitedObjects.filter(function (visitedObject) {
      return visitedObject && visitedObject.hasOwnProperty("_type") && visitedObject._type !== "EntityType";
    });

    if (metaModelContext.target && metaModelContext.target.hasOwnProperty("_type") && metaModelContext.target._type !== "EntityType") {
      dataModelObjects.push(metaModelContext.target);
    }

    var navigationProperties = [];
    var rootEntitySet = dataModelObjects[0];
    var currentEntitySet = rootEntitySet;
    var currentEntityType = rootEntitySet.entityType;
    var i = 1;
    var currentObject;
    var navigatedPaths = [];

    while (i < dataModelObjects.length) {
      currentObject = dataModelObjects[i++];

      if (currentObject._type === "NavigationProperty") {
        navigatedPaths.push(currentObject.name);
        navigationProperties.push(currentObject);
        currentEntityType = currentObject.targetType;

        if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
          currentEntitySet = currentEntitySet.navigationPropertyBinding[currentObject.name];
          navigatedPaths = [];
        }
      }

      if (currentObject._type === "EntitySet") {
        currentEntitySet = currentObject;
        currentEntityType = currentEntitySet.entityType;
      }
    }

    if (targetEntitySetLocation && targetEntitySetLocation.startingEntitySet !== rootEntitySet) {
      // In case the entityset is not starting from the same location it may mean that we are doing too much work earlier for some reason
      // As such we need to redefine the context source for the targetEntitySetLocation
      var startingIndex = dataModelObjects.indexOf(targetEntitySetLocation.startingEntitySet);

      if (startingIndex !== -1) {
        // If it's not found I don't know what we can do (probably nothing)
        var requiredDataModelObjects = dataModelObjects.slice(0, startingIndex);
        targetEntitySetLocation.startingEntitySet = rootEntitySet;
        targetEntitySetLocation.navigationProperties = requiredDataModelObjects.filter(function (object) {
          return object._type === "NavigationProperty";
        }).concat(targetEntitySetLocation.navigationProperties);
      }
    }

    var outDataModelPath = {
      startingEntitySet: rootEntitySet,
      targetEntitySet: currentEntitySet,
      targetEntityType: currentEntityType,
      targetObject: metaModelContext.target,
      navigationProperties: navigationProperties,
      contextLocation: targetEntitySetLocation
    };

    if (!outDataModelPath.contextLocation) {
      outDataModelPath.contextLocation = outDataModelPath;
    }

    return outDataModelPath;
  }

  _exports.getInvolvedDataModelObjectFromPath = getInvolvedDataModelObjectFromPath;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1ldGFNb2RlbENvbnZlcnRlci50cyJdLCJuYW1lcyI6WyJWT0NBQlVMQVJZX0FMSUFTIiwiRGVmYXVsdEVudmlyb25tZW50Q2FwYWJpbGl0aWVzIiwiQ2hhcnQiLCJNaWNyb0NoYXJ0IiwiVVNoZWxsIiwiSW50ZW50QmFzZWROYXZpZ2F0aW9uIiwiTWV0YU1vZGVsQ29udmVydGVyIiwicGFyc2VQcm9wZXJ0eVZhbHVlIiwiYW5ub3RhdGlvbk9iamVjdCIsInByb3BlcnR5S2V5IiwiY3VycmVudFRhcmdldCIsImFubm90YXRpb25zTGlzdHMiLCJvQ2FwYWJpbGl0aWVzIiwidmFsdWUiLCJjdXJyZW50UHJvcGVydHlUYXJnZXQiLCJ0eXBlIiwiTnVsbCIsIlN0cmluZyIsIkJvb2wiLCJJbnQiLCJBcnJheSIsImlzQXJyYXkiLCJDb2xsZWN0aW9uIiwibWFwIiwic3ViQW5ub3RhdGlvbk9iamVjdCIsInN1YkFubm90YXRpb25PYmplY3RJbmRleCIsInBhcnNlQW5ub3RhdGlvbk9iamVjdCIsImxlbmd0aCIsImhhc093blByb3BlcnR5IiwiJFBhdGgiLCJ1bmRlZmluZWQiLCJQYXRoIiwiJERlY2ltYWwiLCJEZWNpbWFsIiwicGFyc2VGbG9hdCIsIiRQcm9wZXJ0eVBhdGgiLCJQcm9wZXJ0eVBhdGgiLCIkTmF2aWdhdGlvblByb3BlcnR5UGF0aCIsIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCIkSWYiLCJJZiIsIiRBcHBseSIsIkFwcGx5IiwiRnVuY3Rpb24iLCIkRnVuY3Rpb24iLCIkQW5ub3RhdGlvblBhdGgiLCJBbm5vdGF0aW9uUGF0aCIsIiRFbnVtTWVtYmVyIiwiRW51bU1lbWJlciIsIm1hcE5hbWVUb0FsaWFzIiwic3BsaXQiLCIkVHlwZSIsIlJlY29yZCIsIm5hbWUiLCJhbm5vdGF0aW9uTmFtZSIsInBhdGhQYXJ0IiwiYW5ub1BhcnQiLCJsYXN0RG90IiwibGFzdEluZGV4T2YiLCJzdWJzdHIiLCJjdXJyZW50T2JqZWN0VGFyZ2V0IiwicGFyc2VkQW5ub3RhdGlvbk9iamVjdCIsInBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsInN1YkFubm90YXRpb25JbmRleCIsInR5cGVWYWx1ZSIsInByb3BlcnR5VmFsdWVzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJzdGFydHNXaXRoIiwicHVzaCIsImNyZWF0ZUFubm90YXRpb25MaXN0cyIsImdldE9yQ3JlYXRlQW5ub3RhdGlvbkxpc3QiLCJ0YXJnZXQiLCJwb3RlbnRpYWxUYXJnZXQiLCJmaW5kIiwiYW5ub3RhdGlvbkxpc3QiLCJhbm5vdGF0aW9ucyIsImFubm90YXRpb25PYmplY3RzIiwiYW5ub3RhdGlvblRhcmdldCIsImFubm90YXRpb25MaXN0cyIsIm91dEFubm90YXRpb25PYmplY3QiLCJyZW1vdmVDaGFydEFubm90YXRpb25zIiwiZmlsdGVyIiwib1JlY29yZCIsIlRhcmdldCIsImluZGV4T2YiLCJyZW1vdmVJQk5Bbm5vdGF0aW9ucyIsImhhbmRsZVByZXNlbnRhdGlvblZhcmlhbnQiLCJhbm5vdGF0aW9uS2V5IiwiRGF0YSIsIlZpc3VhbGl6YXRpb25zIiwiY3VycmVudE91dEFubm90YXRpb25PYmplY3QiLCJhbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXQiLCJxdWFsaWZpZXIiLCJhbm5vdGF0aW9uT2ZBbm5vdGF0aW9uU3BsaXQiLCJ0ZXJtIiwiY3VycmVudEFubm90YXRpb25UYXJnZXQiLCJpc0NvbGxlY3Rpb24iLCJyZWNvcmQiLCJwYXJzZVByb3BlcnR5Iiwib01ldGFNb2RlbCIsImVudGl0eVR5cGVPYmplY3QiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eUFubm90YXRpb24iLCJnZXRPYmplY3QiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJwcm9wZXJ0eURlZmluaXRpb24iLCJwcm9wZXJ0eU9iamVjdCIsIl90eXBlIiwibWF4TGVuZ3RoIiwiJE1heExlbmd0aCIsInByZWNpc2lvbiIsIiRQcmVjaXNpb24iLCJzY2FsZSIsIiRTY2FsZSIsIm51bGxhYmxlIiwiJE51bGxhYmxlIiwicGFyc2VOYXZpZ2F0aW9uUHJvcGVydHkiLCJuYXZQcm9wZXJ0eU5hbWUiLCJuYXZQcm9wZXJ0eUFubm90YXRpb24iLCJuYXZQcm9wZXJ0eURlZmluaXRpb24iLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCIkUmVmZXJlbnRpYWxDb25zdHJhaW50Iiwic291cmNlUHJvcGVydHlOYW1lIiwic291cmNlVHlwZU5hbWUiLCJzb3VyY2VQcm9wZXJ0eSIsInRhcmdldFR5cGVOYW1lIiwidGFyZ2V0UHJvcGVydHkiLCJuYXZpZ2F0aW9uUHJvcGVydHkiLCJwYXJ0bmVyIiwiJFBhcnRuZXIiLCIkaXNDb2xsZWN0aW9uIiwiY29udGFpbnNUYXJnZXQiLCIkQ29udGFpbnNUYXJnZXQiLCJwYXJzZUVudGl0eVNldCIsImVudGl0eVNldE5hbWUiLCJlbnRpdHlDb250YWluZXJOYW1lIiwiZW50aXR5U2V0RGVmaW5pdGlvbiIsImVudGl0eVNldEFubm90YXRpb24iLCJlbnRpdHlTZXRPYmplY3QiLCJuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nIiwiZW50aXR5VHlwZU5hbWUiLCJwYXJzZUVudGl0eVR5cGUiLCJuYW1lc3BhY2UiLCJlbnRpdHlUeXBlQW5ub3RhdGlvbiIsImVudGl0eVR5cGVEZWZpbml0aW9uIiwiZW50aXR5S2V5cyIsIiRLZXkiLCJyZXBsYWNlIiwiZW50aXR5UHJvcGVydGllcyIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwicHJvcGVydHlOYW1lT3JOb3QiLCIka2luZCIsImVudGl0eUtleSIsInByb3BlcnR5IiwicGFyc2VDb21wbGV4VHlwZSIsImNvbXBsZXhUeXBlTmFtZSIsImNvbXBsZXhUeXBlQW5ub3RhdGlvbiIsImNvbXBsZXhUeXBlRGVmaW5pdGlvbiIsImNvbXBsZXhUeXBlT2JqZWN0IiwicHJvcGVydGllcyIsImNvbXBsZXhUeXBlUHJvcGVydGllcyIsImNvbXBsZXhUeXBlTmF2aWdhdGlvblByb3BlcnRpZXMiLCJwYXJzZUFjdGlvbiIsImFjdGlvbk5hbWUiLCJhY3Rpb25SYXdEYXRhIiwiYWN0aW9uRW50aXR5VHlwZSIsImFjdGlvbkZRTiIsImFjdGlvblNob3J0TmFtZSIsIiRJc0JvdW5kIiwiYmluZGluZ1BhcmFtZXRlciIsIiRQYXJhbWV0ZXIiLCJwYXJhbWV0ZXJzIiwiaXNCb3VuZCIsInNvdXJjZVR5cGUiLCJyZXR1cm5UeXBlIiwiJFJldHVyblR5cGUiLCJwYXJhbSIsImlzRW50aXR5U2V0IiwiJEVudGl0eVNldFBhdGgiLCIkTmFtZSIsInBhcnNlRW50aXR5VHlwZXMiLCJvSW5DYXBhYmlsaXRpZXMiLCJvTWV0YU1vZGVsRGF0YSIsIm9FbnRpdHlTZXRzIiwiZW50aXR5VHlwZXMiLCJlbnRpdHlTZXRzIiwiY29tcGxleFR5cGVzIiwiJEVudGl0eUNvbnRhaW5lciIsInNjaGVtYUtleXMiLCJtZXRhbW9kZWxLZXkiLCJlbnRpdHlUeXBlIiwiZW50aXR5U2V0IiwiY29tcGxleFR5cGUiLCJvRW50aXR5Q29udGFpbmVyTmFtZSIsImVudGl0eUNvbnRhaW5lciIsIm5hdlByb3BlcnR5QmluZGluZ3MiLCIkTmF2aWdhdGlvblByb3BlcnR5QmluZGluZyIsIm5hdlByb3BOYW1lIiwidGFyZ2V0RW50aXR5U2V0IiwiYWN0aW9ucyIsImtleSIsInJlZHVjZSIsIm91dEFjdGlvbnMiLCJhY3Rpb24iLCIkQW5ub3RhdGlvbnMiLCJhY3Rpb25Bbm5vdGF0aW9ucyIsImVudGl0eUNvbnRhaW5lckFubm90YXRpb25zIiwic29ydCIsImEiLCJiIiwicmVmZXJlbmNlcyIsImlkZW50aWZpY2F0aW9uIiwidmVyc2lvbiIsInNjaGVtYSIsImFzc29jaWF0aW9ucyIsIm1NZXRhTW9kZWxNYXAiLCJjb252ZXJ0VHlwZXMiLCJzTWV0YU1vZGVsSWQiLCJpZCIsInBhcnNlZE91dHB1dCIsIkFubm90YXRpb25Db252ZXJ0ZXIiLCJwYXRoQmFzZWRSZXNvbHV0aW9uIiwiY29udmVydE1ldGFNb2RlbENvbnRleHQiLCJvTWV0YU1vZGVsQ29udGV4dCIsImJJbmNsdWRlVmlzaXRlZE9iamVjdHMiLCJvQ29udmVydGVyT3V0cHV0IiwiZ2V0TW9kZWwiLCJzUGF0aCIsImdldFBhdGgiLCJhUGF0aFNwbGl0IiwicmVsYXRpdmVQYXRoIiwic2xpY2UiLCJqb2luIiwibG9jYWxPYmplY3RzIiwicmVsYXRpdmVTcGxpdCIsInRhcmdldE5hdlByb3AiLCJuYXZQcm9wIiwib1RhcmdldCIsInJlc29sdmVQYXRoIiwidmlzaXRlZE9iamVjdHMiLCJjb25jYXQiLCJwYXJhbWV0ZXJOYW1lIiwidGFyZ2V0UGFyYW1ldGVyIiwicGFyYW1ldGVyIiwiZW5kc1dpdGgiLCJnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMiLCJvRW50aXR5U2V0TWV0YU1vZGVsQ29udGV4dCIsIm1ldGFNb2RlbENvbnRleHQiLCJ0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbiIsImdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0RnJvbVBhdGgiLCJkYXRhTW9kZWxPYmplY3RzIiwidmlzaXRlZE9iamVjdCIsInJvb3RFbnRpdHlTZXQiLCJjdXJyZW50RW50aXR5U2V0IiwiY3VycmVudEVudGl0eVR5cGUiLCJpIiwiY3VycmVudE9iamVjdCIsIm5hdmlnYXRlZFBhdGhzIiwidGFyZ2V0VHlwZSIsInN0YXJ0aW5nRW50aXR5U2V0Iiwic3RhcnRpbmdJbmRleCIsInJlcXVpcmVkRGF0YU1vZGVsT2JqZWN0cyIsIm9iamVjdCIsIm91dERhdGFNb2RlbFBhdGgiLCJ0YXJnZXRFbnRpdHlUeXBlIiwidGFyZ2V0T2JqZWN0IiwiY29udGV4dExvY2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JBLE1BQU1BLGdCQUFxQixHQUFHO0FBQzdCLGlDQUE2QixjQURBO0FBRTdCLHlCQUFxQixNQUZRO0FBRzdCLDZCQUF5QixVQUhJO0FBSTdCLHNDQUFrQyxRQUpMO0FBSzdCLGtDQUE4QixJQUxEO0FBTTdCLHVDQUFtQyxTQU5OO0FBTzdCLHlDQUFxQyxXQVBSO0FBUTdCLDRDQUF3QyxjQVJYO0FBUzdCLDZDQUF5QztBQVRaLEdBQTlCO0FBbUJPLE1BQU1DLDhCQUE4QixHQUFHO0FBQzdDQyxJQUFBQSxLQUFLLEVBQUUsSUFEc0M7QUFFN0NDLElBQUFBLFVBQVUsRUFBRSxJQUZpQztBQUc3Q0MsSUFBQUEsTUFBTSxFQUFFLElBSHFDO0FBSTdDQyxJQUFBQSxxQkFBcUIsRUFBRTtBQUpzQixHQUF2Qzs7QUF5QlAsTUFBTUMsa0JBQWtCLEdBQUc7QUFDMUJDLElBQUFBLGtCQUQwQixZQUV6QkMsZ0JBRnlCLEVBR3pCQyxXQUh5QixFQUl6QkMsYUFKeUIsRUFLekJDLGdCQUx5QixFQU16QkMsYUFOeUIsRUFPbkI7QUFBQTs7QUFDTixVQUFJQyxLQUFKO0FBQ0EsVUFBTUMscUJBQTZCLEdBQUdKLGFBQWEsR0FBRyxHQUFoQixHQUFzQkQsV0FBNUQ7O0FBQ0EsVUFBSUQsZ0JBQWdCLEtBQUssSUFBekIsRUFBK0I7QUFDOUJLLFFBQUFBLEtBQUssR0FBRztBQUFFRSxVQUFBQSxJQUFJLEVBQUUsTUFBUjtBQUFnQkMsVUFBQUEsSUFBSSxFQUFFO0FBQXRCLFNBQVI7QUFDQSxPQUZELE1BRU8sSUFBSSxPQUFPUixnQkFBUCxLQUE0QixRQUFoQyxFQUEwQztBQUNoREssUUFBQUEsS0FBSyxHQUFHO0FBQUVFLFVBQUFBLElBQUksRUFBRSxRQUFSO0FBQWtCRSxVQUFBQSxNQUFNLEVBQUVUO0FBQTFCLFNBQVI7QUFDQSxPQUZNLE1BRUEsSUFBSSxPQUFPQSxnQkFBUCxLQUE0QixTQUFoQyxFQUEyQztBQUNqREssUUFBQUEsS0FBSyxHQUFHO0FBQUVFLFVBQUFBLElBQUksRUFBRSxNQUFSO0FBQWdCRyxVQUFBQSxJQUFJLEVBQUVWO0FBQXRCLFNBQVI7QUFDQSxPQUZNLE1BRUEsSUFBSSxPQUFPQSxnQkFBUCxLQUE0QixRQUFoQyxFQUEwQztBQUNoREssUUFBQUEsS0FBSyxHQUFHO0FBQUVFLFVBQUFBLElBQUksRUFBRSxLQUFSO0FBQWVJLFVBQUFBLEdBQUcsRUFBRVg7QUFBcEIsU0FBUjtBQUNBLE9BRk0sTUFFQSxJQUFJWSxLQUFLLENBQUNDLE9BQU4sQ0FBY2IsZ0JBQWQsQ0FBSixFQUFxQztBQUMzQ0ssUUFBQUEsS0FBSyxHQUFHO0FBQ1BFLFVBQUFBLElBQUksRUFBRSxZQURDO0FBRVBPLFVBQUFBLFVBQVUsRUFBRWQsZ0JBQWdCLENBQUNlLEdBQWpCLENBQXFCLFVBQUNDLG1CQUFELEVBQXNCQyx3QkFBdEI7QUFBQSxtQkFDaEMsS0FBSSxDQUFDQyxxQkFBTCxDQUNDRixtQkFERCxFQUVDVixxQkFBcUIsR0FBRyxHQUF4QixHQUE4Qlcsd0JBRi9CLEVBR0NkLGdCQUhELEVBSUNDLGFBSkQsQ0FEZ0M7QUFBQSxXQUFyQjtBQUZMLFNBQVI7O0FBV0EsWUFBSUosZ0JBQWdCLENBQUNtQixNQUFqQixHQUEwQixDQUE5QixFQUFpQztBQUNoQyxjQUFJbkIsZ0JBQWdCLENBQUMsQ0FBRCxDQUFoQixDQUFvQm9CLGNBQXBCLENBQW1DLGVBQW5DLENBQUosRUFBeUQ7QUFDdkRmLFlBQUFBLEtBQUssQ0FBQ1MsVUFBUCxDQUEwQlAsSUFBMUIsR0FBaUMsY0FBakM7QUFDQSxXQUZELE1BRU8sSUFBSVAsZ0JBQWdCLENBQUMsQ0FBRCxDQUFoQixDQUFvQm9CLGNBQXBCLENBQW1DLE9BQW5DLENBQUosRUFBaUQ7QUFDdERmLFlBQUFBLEtBQUssQ0FBQ1MsVUFBUCxDQUEwQlAsSUFBMUIsR0FBaUMsTUFBakM7QUFDQSxXQUZNLE1BRUEsSUFBSVAsZ0JBQWdCLENBQUMsQ0FBRCxDQUFoQixDQUFvQm9CLGNBQXBCLENBQW1DLHlCQUFuQyxDQUFKLEVBQW1FO0FBQ3hFZixZQUFBQSxLQUFLLENBQUNTLFVBQVAsQ0FBMEJQLElBQTFCLEdBQWlDLHdCQUFqQztBQUNBLFdBRk0sTUFFQSxJQUFJUCxnQkFBZ0IsQ0FBQyxDQUFELENBQWhCLENBQW9Cb0IsY0FBcEIsQ0FBbUMsaUJBQW5DLENBQUosRUFBMkQ7QUFDaEVmLFlBQUFBLEtBQUssQ0FBQ1MsVUFBUCxDQUEwQlAsSUFBMUIsR0FBaUMsZ0JBQWpDO0FBQ0EsV0FGTSxNQUVBLElBQUlQLGdCQUFnQixDQUFDLENBQUQsQ0FBaEIsQ0FBb0JvQixjQUFwQixDQUFtQyxPQUFuQyxDQUFKLEVBQWlEO0FBQ3REZixZQUFBQSxLQUFLLENBQUNTLFVBQVAsQ0FBMEJQLElBQTFCLEdBQWlDLFFBQWpDO0FBQ0EsV0FGTSxNQUVBLElBQUlQLGdCQUFnQixDQUFDLENBQUQsQ0FBaEIsQ0FBb0JvQixjQUFwQixDQUFtQyxLQUFuQyxDQUFKLEVBQStDO0FBQ3BEZixZQUFBQSxLQUFLLENBQUNTLFVBQVAsQ0FBMEJQLElBQTFCLEdBQWlDLElBQWpDO0FBQ0EsV0FGTSxNQUVBLElBQUlQLGdCQUFnQixDQUFDLENBQUQsQ0FBaEIsQ0FBb0JvQixjQUFwQixDQUFtQyxRQUFuQyxDQUFKLEVBQWtEO0FBQ3ZEZixZQUFBQSxLQUFLLENBQUNTLFVBQVAsQ0FBMEJQLElBQTFCLEdBQWlDLE9BQWpDO0FBQ0EsV0FGTSxNQUVBLElBQUksT0FBT1AsZ0JBQWdCLENBQUMsQ0FBRCxDQUF2QixLQUErQixRQUFuQyxFQUE2QztBQUNuRDtBQUNDSyxZQUFBQSxLQUFLLENBQUNTLFVBQVAsQ0FBMEJQLElBQTFCLEdBQWlDLFFBQWpDO0FBQ0EsV0FITSxNQUdBO0FBQ0xGLFlBQUFBLEtBQUssQ0FBQ1MsVUFBUCxDQUEwQlAsSUFBMUIsR0FBaUMsUUFBakM7QUFDQTtBQUNEO0FBQ0QsT0FsQ00sTUFrQ0EsSUFBSVAsZ0JBQWdCLENBQUNxQixLQUFqQixLQUEyQkMsU0FBL0IsRUFBMEM7QUFDaERqQixRQUFBQSxLQUFLLEdBQUc7QUFBRUUsVUFBQUEsSUFBSSxFQUFFLE1BQVI7QUFBZ0JnQixVQUFBQSxJQUFJLEVBQUV2QixnQkFBZ0IsQ0FBQ3FCO0FBQXZDLFNBQVI7QUFDQSxPQUZNLE1BRUEsSUFBSXJCLGdCQUFnQixDQUFDd0IsUUFBakIsS0FBOEJGLFNBQWxDLEVBQTZDO0FBQ25EakIsUUFBQUEsS0FBSyxHQUFHO0FBQUVFLFVBQUFBLElBQUksRUFBRSxTQUFSO0FBQW1Ca0IsVUFBQUEsT0FBTyxFQUFFQyxVQUFVLENBQUMxQixnQkFBZ0IsQ0FBQ3dCLFFBQWxCO0FBQXRDLFNBQVI7QUFDQSxPQUZNLE1BRUEsSUFBSXhCLGdCQUFnQixDQUFDMkIsYUFBakIsS0FBbUNMLFNBQXZDLEVBQWtEO0FBQ3hEakIsUUFBQUEsS0FBSyxHQUFHO0FBQUVFLFVBQUFBLElBQUksRUFBRSxjQUFSO0FBQXdCcUIsVUFBQUEsWUFBWSxFQUFFNUIsZ0JBQWdCLENBQUMyQjtBQUF2RCxTQUFSO0FBQ0EsT0FGTSxNQUVBLElBQUkzQixnQkFBZ0IsQ0FBQzZCLHVCQUFqQixLQUE2Q1AsU0FBakQsRUFBNEQ7QUFDbEVqQixRQUFBQSxLQUFLLEdBQUc7QUFDUEUsVUFBQUEsSUFBSSxFQUFFLHdCQURDO0FBRVB1QixVQUFBQSxzQkFBc0IsRUFBRTlCLGdCQUFnQixDQUFDNkI7QUFGbEMsU0FBUjtBQUlBLE9BTE0sTUFLQSxJQUFJN0IsZ0JBQWdCLENBQUMrQixHQUFqQixLQUF5QlQsU0FBN0IsRUFBd0M7QUFDOUNqQixRQUFBQSxLQUFLLEdBQUc7QUFBRUUsVUFBQUEsSUFBSSxFQUFFLElBQVI7QUFBY3lCLFVBQUFBLEVBQUUsRUFBRWhDLGdCQUFnQixDQUFDK0I7QUFBbkMsU0FBUjtBQUNBLE9BRk0sTUFFQSxJQUFJL0IsZ0JBQWdCLENBQUNpQyxNQUFqQixLQUE0QlgsU0FBaEMsRUFBMkM7QUFDakRqQixRQUFBQSxLQUFLLEdBQUc7QUFBRUUsVUFBQUEsSUFBSSxFQUFFLE9BQVI7QUFBaUIyQixVQUFBQSxLQUFLLEVBQUVsQyxnQkFBZ0IsQ0FBQ2lDLE1BQXpDO0FBQWlERSxVQUFBQSxRQUFRLEVBQUVuQyxnQkFBZ0IsQ0FBQ29DO0FBQTVFLFNBQVI7QUFDQSxPQUZNLE1BRUEsSUFBSXBDLGdCQUFnQixDQUFDcUMsZUFBakIsS0FBcUNmLFNBQXpDLEVBQW9EO0FBQzFEakIsUUFBQUEsS0FBSyxHQUFHO0FBQUVFLFVBQUFBLElBQUksRUFBRSxnQkFBUjtBQUEwQitCLFVBQUFBLGNBQWMsRUFBRXRDLGdCQUFnQixDQUFDcUM7QUFBM0QsU0FBUjtBQUNBLE9BRk0sTUFFQSxJQUFJckMsZ0JBQWdCLENBQUN1QyxXQUFqQixLQUFpQ2pCLFNBQXJDLEVBQWdEO0FBQ3REakIsUUFBQUEsS0FBSyxHQUFHO0FBQ1BFLFVBQUFBLElBQUksRUFBRSxZQURDO0FBRVBpQyxVQUFBQSxVQUFVLEVBQ1QsS0FBS0MsY0FBTCxDQUFvQnpDLGdCQUFnQixDQUFDdUMsV0FBakIsQ0FBNkJHLEtBQTdCLENBQW1DLEdBQW5DLEVBQXdDLENBQXhDLENBQXBCLElBQWtFLEdBQWxFLEdBQXdFMUMsZ0JBQWdCLENBQUN1QyxXQUFqQixDQUE2QkcsS0FBN0IsQ0FBbUMsR0FBbkMsRUFBd0MsQ0FBeEM7QUFIbEUsU0FBUjtBQUtBLE9BTk0sTUFNQSxJQUFJMUMsZ0JBQWdCLENBQUMyQyxLQUFyQixFQUE0QjtBQUNsQ3RDLFFBQUFBLEtBQUssR0FBRztBQUNQRSxVQUFBQSxJQUFJLEVBQUUsUUFEQztBQUVQcUMsVUFBQUEsTUFBTSxFQUFFLEtBQUsxQixxQkFBTCxDQUEyQmxCLGdCQUEzQixFQUE2Q0UsYUFBN0MsRUFBNERDLGdCQUE1RCxFQUE4RUMsYUFBOUU7QUFGRCxTQUFSO0FBSUEsT0FMTSxNQUtBO0FBQ05DLFFBQUFBLEtBQUssR0FBRztBQUNQRSxVQUFBQSxJQUFJLEVBQUUsUUFEQztBQUVQcUMsVUFBQUEsTUFBTSxFQUFFLEtBQUsxQixxQkFBTCxDQUEyQmxCLGdCQUEzQixFQUE2Q0UsYUFBN0MsRUFBNERDLGdCQUE1RCxFQUE4RUMsYUFBOUU7QUFGRCxTQUFSO0FBSUE7O0FBRUQsYUFBTztBQUNOeUMsUUFBQUEsSUFBSSxFQUFFNUMsV0FEQTtBQUVOSSxRQUFBQSxLQUFLLEVBQUxBO0FBRk0sT0FBUDtBQUlBLEtBM0Z5QjtBQTRGMUJvQyxJQUFBQSxjQTVGMEIsWUE0RlhLLGNBNUZXLEVBNEZxQjtBQUFBLGtDQUNuQkEsY0FBYyxDQUFDSixLQUFmLENBQXFCLEdBQXJCLENBRG1CO0FBQUE7QUFBQSxVQUN6Q0ssUUFEeUM7QUFBQSxVQUMvQkMsUUFEK0I7O0FBRTlDLFVBQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ2RBLFFBQUFBLFFBQVEsR0FBR0QsUUFBWDtBQUNBQSxRQUFBQSxRQUFRLEdBQUcsRUFBWDtBQUNBLE9BSEQsTUFHTztBQUNOQSxRQUFBQSxRQUFRLElBQUksR0FBWjtBQUNBOztBQUNELFVBQU1FLE9BQU8sR0FBR0QsUUFBUSxDQUFDRSxXQUFULENBQXFCLEdBQXJCLENBQWhCO0FBQ0EsYUFBT0gsUUFBUSxHQUFHdkQsZ0JBQWdCLENBQUN3RCxRQUFRLENBQUNHLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUJGLE9BQW5CLENBQUQsQ0FBM0IsR0FBMkQsR0FBM0QsR0FBaUVELFFBQVEsQ0FBQ0csTUFBVCxDQUFnQkYsT0FBTyxHQUFHLENBQTFCLENBQXhFO0FBQ0EsS0F0R3lCO0FBdUcxQi9CLElBQUFBLHFCQXZHMEIsWUF3R3pCbEIsZ0JBeEd5QixFQXlHekJvRCxtQkF6R3lCLEVBMEd6QmpELGdCQTFHeUIsRUEyR3pCQyxhQTNHeUIsRUE0R29CO0FBQUE7O0FBQzdDLFVBQUlpRCxzQkFBMkIsR0FBRyxFQUFsQzs7QUFDQSxVQUFJckQsZ0JBQWdCLEtBQUssSUFBekIsRUFBK0I7QUFDOUJxRCxRQUFBQSxzQkFBc0IsR0FBRztBQUFFOUMsVUFBQUEsSUFBSSxFQUFFLE1BQVI7QUFBZ0JDLFVBQUFBLElBQUksRUFBRTtBQUF0QixTQUF6QjtBQUNBLE9BRkQsTUFFTyxJQUFJLE9BQU9SLGdCQUFQLEtBQTRCLFFBQWhDLEVBQTBDO0FBQ2hEcUQsUUFBQUEsc0JBQXNCLEdBQUc7QUFBRTlDLFVBQUFBLElBQUksRUFBRSxRQUFSO0FBQWtCRSxVQUFBQSxNQUFNLEVBQUVUO0FBQTFCLFNBQXpCO0FBQ0EsT0FGTSxNQUVBLElBQUksT0FBT0EsZ0JBQVAsS0FBNEIsU0FBaEMsRUFBMkM7QUFDakRxRCxRQUFBQSxzQkFBc0IsR0FBRztBQUFFOUMsVUFBQUEsSUFBSSxFQUFFLE1BQVI7QUFBZ0JHLFVBQUFBLElBQUksRUFBRVY7QUFBdEIsU0FBekI7QUFDQSxPQUZNLE1BRUEsSUFBSSxPQUFPQSxnQkFBUCxLQUE0QixRQUFoQyxFQUEwQztBQUNoRHFELFFBQUFBLHNCQUFzQixHQUFHO0FBQUU5QyxVQUFBQSxJQUFJLEVBQUUsS0FBUjtBQUFlSSxVQUFBQSxHQUFHLEVBQUVYO0FBQXBCLFNBQXpCO0FBQ0EsT0FGTSxNQUVBLElBQUlBLGdCQUFnQixDQUFDcUMsZUFBakIsS0FBcUNmLFNBQXpDLEVBQW9EO0FBQzFEK0IsUUFBQUEsc0JBQXNCLEdBQUc7QUFBRTlDLFVBQUFBLElBQUksRUFBRSxnQkFBUjtBQUEwQitCLFVBQUFBLGNBQWMsRUFBRXRDLGdCQUFnQixDQUFDcUM7QUFBM0QsU0FBekI7QUFDQSxPQUZNLE1BRUEsSUFBSXJDLGdCQUFnQixDQUFDcUIsS0FBakIsS0FBMkJDLFNBQS9CLEVBQTBDO0FBQ2hEK0IsUUFBQUEsc0JBQXNCLEdBQUc7QUFBRTlDLFVBQUFBLElBQUksRUFBRSxNQUFSO0FBQWdCZ0IsVUFBQUEsSUFBSSxFQUFFdkIsZ0JBQWdCLENBQUNxQjtBQUF2QyxTQUF6QjtBQUNBLE9BRk0sTUFFQSxJQUFJckIsZ0JBQWdCLENBQUN3QixRQUFqQixLQUE4QkYsU0FBbEMsRUFBNkM7QUFDbkQrQixRQUFBQSxzQkFBc0IsR0FBRztBQUFFOUMsVUFBQUEsSUFBSSxFQUFFLFNBQVI7QUFBbUJrQixVQUFBQSxPQUFPLEVBQUVDLFVBQVUsQ0FBQzFCLGdCQUFnQixDQUFDd0IsUUFBbEI7QUFBdEMsU0FBekI7QUFDQSxPQUZNLE1BRUEsSUFBSXhCLGdCQUFnQixDQUFDMkIsYUFBakIsS0FBbUNMLFNBQXZDLEVBQWtEO0FBQ3hEK0IsUUFBQUEsc0JBQXNCLEdBQUc7QUFBRTlDLFVBQUFBLElBQUksRUFBRSxjQUFSO0FBQXdCcUIsVUFBQUEsWUFBWSxFQUFFNUIsZ0JBQWdCLENBQUMyQjtBQUF2RCxTQUF6QjtBQUNBLE9BRk0sTUFFQSxJQUFJM0IsZ0JBQWdCLENBQUMrQixHQUFqQixLQUF5QlQsU0FBN0IsRUFBd0M7QUFDOUMrQixRQUFBQSxzQkFBc0IsR0FBRztBQUFFOUMsVUFBQUEsSUFBSSxFQUFFLElBQVI7QUFBY3lCLFVBQUFBLEVBQUUsRUFBRWhDLGdCQUFnQixDQUFDK0I7QUFBbkMsU0FBekI7QUFDQSxPQUZNLE1BRUEsSUFBSS9CLGdCQUFnQixDQUFDaUMsTUFBakIsS0FBNEJYLFNBQWhDLEVBQTJDO0FBQ2pEK0IsUUFBQUEsc0JBQXNCLEdBQUc7QUFBRTlDLFVBQUFBLElBQUksRUFBRSxPQUFSO0FBQWlCMkIsVUFBQUEsS0FBSyxFQUFFbEMsZ0JBQWdCLENBQUNpQyxNQUF6QztBQUFpREUsVUFBQUEsUUFBUSxFQUFFbkMsZ0JBQWdCLENBQUNvQztBQUE1RSxTQUF6QjtBQUNBLE9BRk0sTUFFQSxJQUFJcEMsZ0JBQWdCLENBQUM2Qix1QkFBakIsS0FBNkNQLFNBQWpELEVBQTREO0FBQ2xFK0IsUUFBQUEsc0JBQXNCLEdBQUc7QUFDeEI5QyxVQUFBQSxJQUFJLEVBQUUsd0JBRGtCO0FBRXhCdUIsVUFBQUEsc0JBQXNCLEVBQUU5QixnQkFBZ0IsQ0FBQzZCO0FBRmpCLFNBQXpCO0FBSUEsT0FMTSxNQUtBLElBQUk3QixnQkFBZ0IsQ0FBQ3VDLFdBQWpCLEtBQWlDakIsU0FBckMsRUFBZ0Q7QUFDdEQrQixRQUFBQSxzQkFBc0IsR0FBRztBQUN4QjlDLFVBQUFBLElBQUksRUFBRSxZQURrQjtBQUV4QmlDLFVBQUFBLFVBQVUsRUFDVCxLQUFLQyxjQUFMLENBQW9CekMsZ0JBQWdCLENBQUN1QyxXQUFqQixDQUE2QkcsS0FBN0IsQ0FBbUMsR0FBbkMsRUFBd0MsQ0FBeEMsQ0FBcEIsSUFBa0UsR0FBbEUsR0FBd0UxQyxnQkFBZ0IsQ0FBQ3VDLFdBQWpCLENBQTZCRyxLQUE3QixDQUFtQyxHQUFuQyxFQUF3QyxDQUF4QztBQUhqRCxTQUF6QjtBQUtBLE9BTk0sTUFNQSxJQUFJOUIsS0FBSyxDQUFDQyxPQUFOLENBQWNiLGdCQUFkLENBQUosRUFBcUM7QUFDM0MsWUFBTXNELDBCQUEwQixHQUFHRCxzQkFBbkM7QUFDQUMsUUFBQUEsMEJBQTBCLENBQUNDLFVBQTNCLEdBQXdDdkQsZ0JBQWdCLENBQUNlLEdBQWpCLENBQXFCLFVBQUNDLG1CQUFELEVBQXNCd0Msa0JBQXRCO0FBQUEsaUJBQzVELE1BQUksQ0FBQ3RDLHFCQUFMLENBQ0NGLG1CQURELEVBRUNvQyxtQkFBbUIsR0FBRyxHQUF0QixHQUE0Qkksa0JBRjdCLEVBR0NyRCxnQkFIRCxFQUlDQyxhQUpELENBRDREO0FBQUEsU0FBckIsQ0FBeEM7O0FBUUEsWUFBSUosZ0JBQWdCLENBQUNtQixNQUFqQixHQUEwQixDQUE5QixFQUFpQztBQUNoQyxjQUFJbkIsZ0JBQWdCLENBQUMsQ0FBRCxDQUFoQixDQUFvQm9CLGNBQXBCLENBQW1DLGVBQW5DLENBQUosRUFBeUQ7QUFDdkRrQyxZQUFBQSwwQkFBMEIsQ0FBQ0MsVUFBNUIsQ0FBK0NoRCxJQUEvQyxHQUFzRCxjQUF0RDtBQUNBLFdBRkQsTUFFTyxJQUFJUCxnQkFBZ0IsQ0FBQyxDQUFELENBQWhCLENBQW9Cb0IsY0FBcEIsQ0FBbUMsT0FBbkMsQ0FBSixFQUFpRDtBQUN0RGtDLFlBQUFBLDBCQUEwQixDQUFDQyxVQUE1QixDQUErQ2hELElBQS9DLEdBQXNELE1BQXREO0FBQ0EsV0FGTSxNQUVBLElBQUlQLGdCQUFnQixDQUFDLENBQUQsQ0FBaEIsQ0FBb0JvQixjQUFwQixDQUFtQyx5QkFBbkMsQ0FBSixFQUFtRTtBQUN4RWtDLFlBQUFBLDBCQUEwQixDQUFDQyxVQUE1QixDQUErQ2hELElBQS9DLEdBQXNELHdCQUF0RDtBQUNBLFdBRk0sTUFFQSxJQUFJUCxnQkFBZ0IsQ0FBQyxDQUFELENBQWhCLENBQW9Cb0IsY0FBcEIsQ0FBbUMsaUJBQW5DLENBQUosRUFBMkQ7QUFDaEVrQyxZQUFBQSwwQkFBMEIsQ0FBQ0MsVUFBNUIsQ0FBK0NoRCxJQUEvQyxHQUFzRCxnQkFBdEQ7QUFDQSxXQUZNLE1BRUEsSUFBSVAsZ0JBQWdCLENBQUMsQ0FBRCxDQUFoQixDQUFvQm9CLGNBQXBCLENBQW1DLE9BQW5DLENBQUosRUFBaUQ7QUFDdERrQyxZQUFBQSwwQkFBMEIsQ0FBQ0MsVUFBNUIsQ0FBK0NoRCxJQUEvQyxHQUFzRCxRQUF0RDtBQUNBLFdBRk0sTUFFQSxJQUFJUCxnQkFBZ0IsQ0FBQyxDQUFELENBQWhCLENBQW9Cb0IsY0FBcEIsQ0FBbUMsS0FBbkMsQ0FBSixFQUErQztBQUNwRGtDLFlBQUFBLDBCQUEwQixDQUFDQyxVQUE1QixDQUErQ2hELElBQS9DLEdBQXNELElBQXREO0FBQ0EsV0FGTSxNQUVBLElBQUlQLGdCQUFnQixDQUFDLENBQUQsQ0FBaEIsQ0FBb0JvQixjQUFwQixDQUFtQyxRQUFuQyxDQUFKLEVBQWtEO0FBQ3ZEa0MsWUFBQUEsMEJBQTBCLENBQUNDLFVBQTVCLENBQStDaEQsSUFBL0MsR0FBc0QsT0FBdEQ7QUFDQSxXQUZNLE1BRUEsSUFBSSxPQUFPUCxnQkFBZ0IsQ0FBQyxDQUFELENBQXZCLEtBQStCLFFBQW5DLEVBQTZDO0FBQ2xEc0QsWUFBQUEsMEJBQTBCLENBQUNDLFVBQTVCLENBQStDaEQsSUFBL0MsR0FBc0QsUUFBdEQ7QUFDQSxXQUZNLE1BRUE7QUFDTCtDLFlBQUFBLDBCQUEwQixDQUFDQyxVQUE1QixDQUErQ2hELElBQS9DLEdBQXNELFFBQXREO0FBQ0E7QUFDRDtBQUNELE9BL0JNLE1BK0JBO0FBQ04sWUFBSVAsZ0JBQWdCLENBQUMyQyxLQUFyQixFQUE0QjtBQUMzQixjQUFNYyxTQUFTLEdBQUd6RCxnQkFBZ0IsQ0FBQzJDLEtBQW5DO0FBQ0FVLFVBQUFBLHNCQUFzQixDQUFDOUMsSUFBdkIsR0FBOEJrRCxTQUE5QixDQUYyQixDQUVjO0FBQ3pDOztBQUNELFlBQU1DLGNBQW1CLEdBQUcsRUFBNUI7QUFDQUMsUUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVk1RCxnQkFBWixFQUE4QjZELE9BQTlCLENBQXNDLFVBQUE1RCxXQUFXLEVBQUk7QUFDcEQsY0FDQ0EsV0FBVyxLQUFLLE9BQWhCLElBQ0FBLFdBQVcsS0FBSyxLQURoQixJQUVBQSxXQUFXLEtBQUssUUFGaEIsSUFHQUEsV0FBVyxLQUFLLEtBSGhCLElBSUEsQ0FBQ0EsV0FBVyxDQUFDNkQsVUFBWixDQUF1QixHQUF2QixDQUxGLEVBTUU7QUFDREosWUFBQUEsY0FBYyxDQUFDSyxJQUFmLENBQ0MsTUFBSSxDQUFDaEUsa0JBQUwsQ0FDQ0MsZ0JBQWdCLENBQUNDLFdBQUQsQ0FEakIsRUFFQ0EsV0FGRCxFQUdDbUQsbUJBSEQsRUFJQ2pELGdCQUpELEVBS0NDLGFBTEQsQ0FERDtBQVNBLFdBaEJELE1BZ0JPLElBQUlILFdBQVcsQ0FBQzZELFVBQVosQ0FBdUIsR0FBdkIsQ0FBSixFQUFpQztBQUN2QztBQUNBLFlBQUEsTUFBSSxDQUFDRSxxQkFBTCxxQkFDSS9ELFdBREosRUFDa0JELGdCQUFnQixDQUFDQyxXQUFELENBRGxDLEdBRUNtRCxtQkFGRCxFQUdDakQsZ0JBSEQsRUFJQ0MsYUFKRDtBQU1BO0FBQ0QsU0ExQkQ7QUEyQkFpRCxRQUFBQSxzQkFBc0IsQ0FBQ0ssY0FBdkIsR0FBd0NBLGNBQXhDO0FBQ0E7O0FBQ0QsYUFBT0wsc0JBQVA7QUFDQSxLQWhOeUI7QUFpTjFCWSxJQUFBQSx5QkFqTjBCLFlBaU5BQyxNQWpOQSxFQWlOZ0IvRCxnQkFqTmhCLEVBaU5vRTtBQUM3RixVQUFJZ0UsZUFBZSxHQUFHaEUsZ0JBQWdCLENBQUNpRSxJQUFqQixDQUFzQixVQUFBQyxjQUFjO0FBQUEsZUFBSUEsY0FBYyxDQUFDSCxNQUFmLEtBQTBCQSxNQUE5QjtBQUFBLE9BQXBDLENBQXRCOztBQUNBLFVBQUksQ0FBQ0MsZUFBTCxFQUFzQjtBQUNyQkEsUUFBQUEsZUFBZSxHQUFHO0FBQ2pCRCxVQUFBQSxNQUFNLEVBQUVBLE1BRFM7QUFFakJJLFVBQUFBLFdBQVcsRUFBRTtBQUZJLFNBQWxCO0FBSUFuRSxRQUFBQSxnQkFBZ0IsQ0FBQzRELElBQWpCLENBQXNCSSxlQUF0QjtBQUNBOztBQUNELGFBQU9BLGVBQVA7QUFDQSxLQTNOeUI7QUE2TjFCSCxJQUFBQSxxQkE3TjBCLFlBOE56Qk8saUJBOU55QixFQStOekJDLGdCQS9OeUIsRUFnT3pCQyxlQWhPeUIsRUFpT3pCckUsYUFqT3lCLEVBa094QjtBQUFBOztBQUNELFVBQU1zRSxtQkFBbUIsR0FBRyxLQUFLVCx5QkFBTCxDQUErQk8sZ0JBQS9CLEVBQWlEQyxlQUFqRCxDQUE1Qjs7QUFDQSxVQUFJLENBQUNyRSxhQUFhLENBQUNULFVBQW5CLEVBQStCO0FBQzlCLGVBQU80RSxpQkFBaUIsQ0FBQyxtQ0FBRCxDQUF4QjtBQUNBOztBQUVELGVBQVNJLHNCQUFULENBQWdDM0UsZ0JBQWhDLEVBQXVEO0FBQ3RELGVBQU9BLGdCQUFnQixDQUFDNEUsTUFBakIsQ0FBd0IsVUFBQ0MsT0FBRCxFQUFrQjtBQUNoRCxjQUFJQSxPQUFPLENBQUNDLE1BQVIsSUFBa0JELE9BQU8sQ0FBQ0MsTUFBUixDQUFlekMsZUFBckMsRUFBc0Q7QUFDckQsbUJBQU93QyxPQUFPLENBQUNDLE1BQVIsQ0FBZXpDLGVBQWYsQ0FBK0IwQyxPQUEvQixDQUF1QyxtQ0FBdkMsTUFBZ0YsQ0FBQyxDQUF4RjtBQUNBLFdBRkQsTUFFTztBQUNOLG1CQUFPLElBQVA7QUFDQTtBQUNELFNBTk0sQ0FBUDtBQU9BOztBQUVELGVBQVNDLG9CQUFULENBQThCaEYsZ0JBQTlCLEVBQXFEO0FBQ3BELGVBQU9BLGdCQUFnQixDQUFDNEUsTUFBakIsQ0FBd0IsVUFBQ0MsT0FBRCxFQUFrQjtBQUNoRCxpQkFBT0EsT0FBTyxDQUFDbEMsS0FBUixLQUFrQiw4REFBekI7QUFDQSxTQUZNLENBQVA7QUFHQTs7QUFFRCxlQUFTc0MseUJBQVQsQ0FBbUNqRixnQkFBbkMsRUFBMEQ7QUFDekQsZUFBT0EsZ0JBQWdCLENBQUM0RSxNQUFqQixDQUF3QixVQUFDQyxPQUFELEVBQWtCO0FBQ2hELGlCQUFPQSxPQUFPLENBQUN4QyxlQUFSLEtBQTRCLG1DQUFuQztBQUNBLFNBRk0sQ0FBUDtBQUdBOztBQUVEc0IsTUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlXLGlCQUFaLEVBQStCVixPQUEvQixDQUF1QyxVQUFBcUIsYUFBYSxFQUFJO0FBQ3ZELFlBQUlsRixnQkFBZ0IsR0FBR3VFLGlCQUFpQixDQUFDVyxhQUFELENBQXhDOztBQUNBLGdCQUFRQSxhQUFSO0FBQ0MsZUFBSywwQ0FBTDtBQUNDLGdCQUFJLENBQUM5RSxhQUFhLENBQUNULFVBQW5CLEVBQStCO0FBQzlCSyxjQUFBQSxnQkFBZ0IsR0FBRzJFLHNCQUFzQixDQUFDM0UsZ0JBQUQsQ0FBekM7QUFDQTs7QUFDRDs7QUFDRCxlQUFLLDRDQUFMO0FBQ0MsZ0JBQUksQ0FBQ0ksYUFBYSxDQUFDUCxxQkFBbkIsRUFBMEM7QUFDekNHLGNBQUFBLGdCQUFnQixHQUFHZ0Ysb0JBQW9CLENBQUNoRixnQkFBRCxDQUF2QztBQUNBOztBQUNEOztBQUNELGVBQUssc0NBQUw7QUFDQyxnQkFBSSxDQUFDSSxhQUFhLENBQUNQLHFCQUFuQixFQUEwQztBQUN6Q0csY0FBQUEsZ0JBQWdCLEdBQUdnRixvQkFBb0IsQ0FBQ2hGLGdCQUFELENBQXZDO0FBQ0E7O0FBQ0QsZ0JBQUksQ0FBQ0ksYUFBYSxDQUFDVCxVQUFuQixFQUErQjtBQUM5QkssY0FBQUEsZ0JBQWdCLEdBQUcyRSxzQkFBc0IsQ0FBQzNFLGdCQUFELENBQXpDO0FBQ0E7O0FBQ0Q7O0FBQ0QsZUFBSyx3Q0FBTDtBQUNDLGdCQUFJLENBQUNJLGFBQWEsQ0FBQ1AscUJBQW5CLEVBQTBDO0FBQ3pDRyxjQUFBQSxnQkFBZ0IsQ0FBQ21GLElBQWpCLEdBQXdCSCxvQkFBb0IsQ0FBQ2hGLGdCQUFnQixDQUFDbUYsSUFBbEIsQ0FBNUM7QUFDQTs7QUFDRCxnQkFBSSxDQUFDL0UsYUFBYSxDQUFDVCxVQUFuQixFQUErQjtBQUM5QkssY0FBQUEsZ0JBQWdCLENBQUNtRixJQUFqQixHQUF3QlIsc0JBQXNCLENBQUMzRSxnQkFBZ0IsQ0FBQ21GLElBQWxCLENBQTlDO0FBQ0E7O0FBQ0Q7O0FBQ0QsZUFBSyxpREFBTDtBQUNDLGdCQUFJLENBQUMvRSxhQUFhLENBQUNWLEtBQWYsSUFBd0JNLGdCQUFnQixDQUFDb0YsY0FBN0MsRUFBNkQ7QUFDNURwRixjQUFBQSxnQkFBZ0IsQ0FBQ29GLGNBQWpCLEdBQWtDSCx5QkFBeUIsQ0FBQ2pGLGdCQUFnQixDQUFDb0YsY0FBbEIsQ0FBM0Q7QUFDQTs7QUFDRDs7QUFDRDtBQUNDO0FBakNGOztBQW1DQWIsUUFBQUEsaUJBQWlCLENBQUNXLGFBQUQsQ0FBakIsR0FBbUNsRixnQkFBbkM7QUFDQSxZQUFJcUYsMEJBQTBCLEdBQUdYLG1CQUFqQztBQUNBLFlBQU1ZLHdCQUF3QixHQUFHSixhQUFhLENBQUN4QyxLQUFkLENBQW9CLEdBQXBCLENBQWpDO0FBQ0EsWUFBTTZDLFNBQVMsR0FBR0Qsd0JBQXdCLENBQUMsQ0FBRCxDQUExQztBQUNBSixRQUFBQSxhQUFhLEdBQUdJLHdCQUF3QixDQUFDLENBQUQsQ0FBeEMsQ0F6Q3VELENBMEN2RDs7QUFDQSxZQUFNRSwyQkFBMkIsR0FBR04sYUFBYSxDQUFDeEMsS0FBZCxDQUFvQixHQUFwQixDQUFwQzs7QUFDQSxZQUFJOEMsMkJBQTJCLENBQUNyRSxNQUE1QixHQUFxQyxDQUF6QyxFQUE0QztBQUMzQ2tFLFVBQUFBLDBCQUEwQixHQUFHLE1BQUksQ0FBQ3BCLHlCQUFMLENBQzVCTyxnQkFBZ0IsR0FBRyxHQUFuQixHQUF5QmdCLDJCQUEyQixDQUFDLENBQUQsQ0FEeEIsRUFFNUJmLGVBRjRCLENBQTdCO0FBSUFTLFVBQUFBLGFBQWEsR0FBR00sMkJBQTJCLENBQUMsQ0FBRCxDQUEzQztBQUNBLFNBTkQsTUFNTztBQUNOTixVQUFBQSxhQUFhLEdBQUdNLDJCQUEyQixDQUFDLENBQUQsQ0FBM0M7QUFDQTs7QUFFRCxZQUFNbkMsc0JBQTJCLEdBQUc7QUFDbkNvQyxVQUFBQSxJQUFJLFlBQUtQLGFBQUwsQ0FEK0I7QUFFbkNLLFVBQUFBLFNBQVMsRUFBRUE7QUFGd0IsU0FBcEM7QUFJQSxZQUFJRyx1QkFBdUIsR0FBR2xCLGdCQUFnQixHQUFHLEdBQW5CLEdBQXlCbkIsc0JBQXNCLENBQUNvQyxJQUE5RTs7QUFDQSxZQUFJRixTQUFKLEVBQWU7QUFDZEcsVUFBQUEsdUJBQXVCLElBQUksTUFBTUgsU0FBakM7QUFDQTs7QUFDRCxZQUFJSSxZQUFZLEdBQUcsS0FBbkI7O0FBQ0EsWUFBSTNGLGdCQUFnQixLQUFLLElBQXpCLEVBQStCO0FBQzlCcUQsVUFBQUEsc0JBQXNCLENBQUNoRCxLQUF2QixHQUErQjtBQUFFRSxZQUFBQSxJQUFJLEVBQUUsTUFBUjtBQUFnQkcsWUFBQUEsSUFBSSxFQUFFVjtBQUF0QixXQUEvQjtBQUNBLFNBRkQsTUFFTyxJQUFJLE9BQU9BLGdCQUFQLEtBQTRCLFFBQWhDLEVBQTBDO0FBQ2hEcUQsVUFBQUEsc0JBQXNCLENBQUNoRCxLQUF2QixHQUErQjtBQUFFRSxZQUFBQSxJQUFJLEVBQUUsUUFBUjtBQUFrQkUsWUFBQUEsTUFBTSxFQUFFVDtBQUExQixXQUEvQjtBQUNBLFNBRk0sTUFFQSxJQUFJLE9BQU9BLGdCQUFQLEtBQTRCLFNBQWhDLEVBQTJDO0FBQ2pEcUQsVUFBQUEsc0JBQXNCLENBQUNoRCxLQUF2QixHQUErQjtBQUFFRSxZQUFBQSxJQUFJLEVBQUUsTUFBUjtBQUFnQkcsWUFBQUEsSUFBSSxFQUFFVjtBQUF0QixXQUEvQjtBQUNBLFNBRk0sTUFFQSxJQUFJLE9BQU9BLGdCQUFQLEtBQTRCLFFBQWhDLEVBQTBDO0FBQ2hEcUQsVUFBQUEsc0JBQXNCLENBQUNoRCxLQUF2QixHQUErQjtBQUFFRSxZQUFBQSxJQUFJLEVBQUUsS0FBUjtBQUFlSSxZQUFBQSxHQUFHLEVBQUVYO0FBQXBCLFdBQS9CO0FBQ0EsU0FGTSxNQUVBLElBQUlBLGdCQUFnQixDQUFDK0IsR0FBakIsS0FBeUJULFNBQTdCLEVBQXdDO0FBQzlDK0IsVUFBQUEsc0JBQXNCLENBQUNoRCxLQUF2QixHQUErQjtBQUFFRSxZQUFBQSxJQUFJLEVBQUUsSUFBUjtBQUFjeUIsWUFBQUEsRUFBRSxFQUFFaEMsZ0JBQWdCLENBQUMrQjtBQUFuQyxXQUEvQjtBQUNBLFNBRk0sTUFFQSxJQUFJL0IsZ0JBQWdCLENBQUNpQyxNQUFqQixLQUE0QlgsU0FBaEMsRUFBMkM7QUFDakQrQixVQUFBQSxzQkFBc0IsQ0FBQ2hELEtBQXZCLEdBQStCO0FBQUVFLFlBQUFBLElBQUksRUFBRSxPQUFSO0FBQWlCMkIsWUFBQUEsS0FBSyxFQUFFbEMsZ0JBQWdCLENBQUNpQyxNQUF6QztBQUFpREUsWUFBQUEsUUFBUSxFQUFFbkMsZ0JBQWdCLENBQUNvQztBQUE1RSxXQUEvQjtBQUNBLFNBRk0sTUFFQSxJQUFJcEMsZ0JBQWdCLENBQUNxQixLQUFqQixLQUEyQkMsU0FBL0IsRUFBMEM7QUFDaEQrQixVQUFBQSxzQkFBc0IsQ0FBQ2hELEtBQXZCLEdBQStCO0FBQUVFLFlBQUFBLElBQUksRUFBRSxNQUFSO0FBQWdCZ0IsWUFBQUEsSUFBSSxFQUFFdkIsZ0JBQWdCLENBQUNxQjtBQUF2QyxXQUEvQjtBQUNBLFNBRk0sTUFFQSxJQUFJckIsZ0JBQWdCLENBQUNxQyxlQUFqQixLQUFxQ2YsU0FBekMsRUFBb0Q7QUFDMUQrQixVQUFBQSxzQkFBc0IsQ0FBQ2hELEtBQXZCLEdBQStCO0FBQzlCRSxZQUFBQSxJQUFJLEVBQUUsZ0JBRHdCO0FBRTlCK0IsWUFBQUEsY0FBYyxFQUFFdEMsZ0JBQWdCLENBQUNxQztBQUZILFdBQS9CO0FBSUEsU0FMTSxNQUtBLElBQUlyQyxnQkFBZ0IsQ0FBQ3dCLFFBQWpCLEtBQThCRixTQUFsQyxFQUE2QztBQUNuRCtCLFVBQUFBLHNCQUFzQixDQUFDaEQsS0FBdkIsR0FBK0I7QUFBRUUsWUFBQUEsSUFBSSxFQUFFLFNBQVI7QUFBbUJrQixZQUFBQSxPQUFPLEVBQUVDLFVBQVUsQ0FBQzFCLGdCQUFnQixDQUFDd0IsUUFBbEI7QUFBdEMsV0FBL0I7QUFDQSxTQUZNLE1BRUEsSUFBSXhCLGdCQUFnQixDQUFDdUMsV0FBakIsS0FBaUNqQixTQUFyQyxFQUFnRDtBQUN0RCtCLFVBQUFBLHNCQUFzQixDQUFDaEQsS0FBdkIsR0FBK0I7QUFDOUJFLFlBQUFBLElBQUksRUFBRSxZQUR3QjtBQUU5QmlDLFlBQUFBLFVBQVUsRUFDVCxNQUFJLENBQUNDLGNBQUwsQ0FBb0J6QyxnQkFBZ0IsQ0FBQ3VDLFdBQWpCLENBQTZCRyxLQUE3QixDQUFtQyxHQUFuQyxFQUF3QyxDQUF4QyxDQUFwQixJQUFrRSxHQUFsRSxHQUF3RTFDLGdCQUFnQixDQUFDdUMsV0FBakIsQ0FBNkJHLEtBQTdCLENBQW1DLEdBQW5DLEVBQXdDLENBQXhDO0FBSDNDLFdBQS9CO0FBS0EsU0FOTSxNQU1BLElBQUk5QixLQUFLLENBQUNDLE9BQU4sQ0FBY2IsZ0JBQWQsQ0FBSixFQUFxQztBQUMzQzJGLFVBQUFBLFlBQVksR0FBRyxJQUFmO0FBQ0F0QyxVQUFBQSxzQkFBc0IsQ0FBQ0UsVUFBdkIsR0FBb0N2RCxnQkFBZ0IsQ0FBQ2UsR0FBakIsQ0FBcUIsVUFBQ0MsbUJBQUQsRUFBc0J3QyxrQkFBdEI7QUFBQSxtQkFDeEQsTUFBSSxDQUFDdEMscUJBQUwsQ0FDQ0YsbUJBREQsRUFFQzBFLHVCQUF1QixHQUFHLEdBQTFCLEdBQWdDbEMsa0JBRmpDLEVBR0NpQixlQUhELEVBSUNyRSxhQUpELENBRHdEO0FBQUEsV0FBckIsQ0FBcEM7O0FBUUEsY0FBSUosZ0JBQWdCLENBQUNtQixNQUFqQixHQUEwQixDQUE5QixFQUFpQztBQUNoQyxnQkFBSW5CLGdCQUFnQixDQUFDLENBQUQsQ0FBaEIsQ0FBb0JvQixjQUFwQixDQUFtQyxlQUFuQyxDQUFKLEVBQXlEO0FBQ3ZEaUMsY0FBQUEsc0JBQXNCLENBQUNFLFVBQXhCLENBQTJDaEQsSUFBM0MsR0FBa0QsY0FBbEQ7QUFDQSxhQUZELE1BRU8sSUFBSVAsZ0JBQWdCLENBQUMsQ0FBRCxDQUFoQixDQUFvQm9CLGNBQXBCLENBQW1DLE9BQW5DLENBQUosRUFBaUQ7QUFDdERpQyxjQUFBQSxzQkFBc0IsQ0FBQ0UsVUFBeEIsQ0FBMkNoRCxJQUEzQyxHQUFrRCxNQUFsRDtBQUNBLGFBRk0sTUFFQSxJQUFJUCxnQkFBZ0IsQ0FBQyxDQUFELENBQWhCLENBQW9Cb0IsY0FBcEIsQ0FBbUMseUJBQW5DLENBQUosRUFBbUU7QUFDeEVpQyxjQUFBQSxzQkFBc0IsQ0FBQ0UsVUFBeEIsQ0FBMkNoRCxJQUEzQyxHQUFrRCx3QkFBbEQ7QUFDQSxhQUZNLE1BRUEsSUFBSVAsZ0JBQWdCLENBQUMsQ0FBRCxDQUFoQixDQUFvQm9CLGNBQXBCLENBQW1DLGlCQUFuQyxDQUFKLEVBQTJEO0FBQ2hFaUMsY0FBQUEsc0JBQXNCLENBQUNFLFVBQXhCLENBQTJDaEQsSUFBM0MsR0FBa0QsZ0JBQWxEO0FBQ0EsYUFGTSxNQUVBLElBQUlQLGdCQUFnQixDQUFDLENBQUQsQ0FBaEIsQ0FBb0JvQixjQUFwQixDQUFtQyxPQUFuQyxDQUFKLEVBQWlEO0FBQ3REaUMsY0FBQUEsc0JBQXNCLENBQUNFLFVBQXhCLENBQTJDaEQsSUFBM0MsR0FBa0QsUUFBbEQ7QUFDQSxhQUZNLE1BRUEsSUFBSVAsZ0JBQWdCLENBQUMsQ0FBRCxDQUFoQixDQUFvQm9CLGNBQXBCLENBQW1DLEtBQW5DLENBQUosRUFBK0M7QUFDcERpQyxjQUFBQSxzQkFBc0IsQ0FBQ0UsVUFBeEIsQ0FBMkNoRCxJQUEzQyxHQUFrRCxJQUFsRDtBQUNBLGFBRk0sTUFFQSxJQUFJUCxnQkFBZ0IsQ0FBQyxDQUFELENBQWhCLENBQW9Cb0IsY0FBcEIsQ0FBbUMsUUFBbkMsQ0FBSixFQUFrRDtBQUN2RGlDLGNBQUFBLHNCQUFzQixDQUFDRSxVQUF4QixDQUEyQ2hELElBQTNDLEdBQWtELE9BQWxEO0FBQ0EsYUFGTSxNQUVBLElBQUksT0FBT1AsZ0JBQWdCLENBQUMsQ0FBRCxDQUF2QixLQUErQixRQUFuQyxFQUE2QztBQUNsRHFELGNBQUFBLHNCQUFzQixDQUFDRSxVQUF4QixDQUEyQ2hELElBQTNDLEdBQWtELFFBQWxEO0FBQ0EsYUFGTSxNQUVBO0FBQ0w4QyxjQUFBQSxzQkFBc0IsQ0FBQ0UsVUFBeEIsQ0FBMkNoRCxJQUEzQyxHQUFrRCxRQUFsRDtBQUNBO0FBQ0Q7QUFDRCxTQS9CTSxNQStCQTtBQUNOLGNBQU1xRixNQUF3QixHQUFHO0FBQ2hDbEMsWUFBQUEsY0FBYyxFQUFFO0FBRGdCLFdBQWpDOztBQUdBLGNBQUkxRCxnQkFBZ0IsQ0FBQzJDLEtBQXJCLEVBQTRCO0FBQzNCLGdCQUFNYyxTQUFTLEdBQUd6RCxnQkFBZ0IsQ0FBQzJDLEtBQW5DO0FBQ0FpRCxZQUFBQSxNQUFNLENBQUNyRixJQUFQLGFBQWlCa0QsU0FBakI7QUFDQTs7QUFDRCxjQUFNQyxjQUFxQixHQUFHLEVBQTlCO0FBQ0FDLFVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZNUQsZ0JBQVosRUFBOEI2RCxPQUE5QixDQUFzQyxVQUFBNUQsV0FBVyxFQUFJO0FBQ3BELGdCQUFJQSxXQUFXLEtBQUssT0FBaEIsSUFBMkIsQ0FBQ0EsV0FBVyxDQUFDNkQsVUFBWixDQUF1QixHQUF2QixDQUFoQyxFQUE2RDtBQUM1REosY0FBQUEsY0FBYyxDQUFDSyxJQUFmLENBQ0MsTUFBSSxDQUFDaEUsa0JBQUwsQ0FDQ0MsZ0JBQWdCLENBQUNDLFdBQUQsQ0FEakIsRUFFQ0EsV0FGRCxFQUdDeUYsdUJBSEQsRUFJQ2pCLGVBSkQsRUFLQ3JFLGFBTEQsQ0FERDtBQVNBLGFBVkQsTUFVTyxJQUFJSCxXQUFXLENBQUM2RCxVQUFaLENBQXVCLEdBQXZCLENBQUosRUFBaUM7QUFDdkM7QUFDQSxjQUFBLE1BQUksQ0FBQ0UscUJBQUwscUJBQ0kvRCxXQURKLEVBQ2tCRCxnQkFBZ0IsQ0FBQ0MsV0FBRCxDQURsQyxHQUVDeUYsdUJBRkQsRUFHQ2pCLGVBSEQsRUFJQ3JFLGFBSkQ7QUFNQTtBQUNELFdBcEJEO0FBcUJBd0YsVUFBQUEsTUFBTSxDQUFDbEMsY0FBUCxHQUF3QkEsY0FBeEI7QUFDQUwsVUFBQUEsc0JBQXNCLENBQUN1QyxNQUF2QixHQUFnQ0EsTUFBaEM7QUFDQTs7QUFDRHZDLFFBQUFBLHNCQUFzQixDQUFDc0MsWUFBdkIsR0FBc0NBLFlBQXRDO0FBQ0FOLFFBQUFBLDBCQUEwQixDQUFDZixXQUEzQixDQUF1Q1AsSUFBdkMsQ0FBNENWLHNCQUE1QztBQUNBLE9BNUpEO0FBNkpBLEtBM1p5QjtBQTRaMUJ3QyxJQUFBQSxhQTVaMEIsWUE2WnpCQyxVQTdaeUIsRUE4WnpCQyxnQkE5WnlCLEVBK1p6QkMsWUEvWnlCLEVBZ2F6QnZCLGVBaGF5QixFQWlhekJyRSxhQWpheUIsRUFrYWQ7QUFDWCxVQUFNNkYsa0JBQWtCLEdBQUdILFVBQVUsQ0FBQ0ksU0FBWCxZQUF5QkgsZ0JBQWdCLENBQUNJLGtCQUExQyxjQUFnRUgsWUFBaEUsT0FBM0I7QUFDQSxVQUFNSSxrQkFBa0IsR0FBR04sVUFBVSxDQUFDSSxTQUFYLFlBQXlCSCxnQkFBZ0IsQ0FBQ0ksa0JBQTFDLGNBQWdFSCxZQUFoRSxFQUEzQjtBQUVBLFVBQU1LLGNBQXdCLEdBQUc7QUFDaENDLFFBQUFBLEtBQUssRUFBRSxVQUR5QjtBQUVoQ3pELFFBQUFBLElBQUksRUFBRW1ELFlBRjBCO0FBR2hDRyxRQUFBQSxrQkFBa0IsWUFBS0osZ0JBQWdCLENBQUNJLGtCQUF0QixjQUE0Q0gsWUFBNUMsQ0FIYztBQUloQ3pGLFFBQUFBLElBQUksRUFBRTZGLGtCQUFrQixDQUFDekQsS0FKTztBQUtoQzRELFFBQUFBLFNBQVMsRUFBRUgsa0JBQWtCLENBQUNJLFVBTEU7QUFNaENDLFFBQUFBLFNBQVMsRUFBRUwsa0JBQWtCLENBQUNNLFVBTkU7QUFPaENDLFFBQUFBLEtBQUssRUFBRVAsa0JBQWtCLENBQUNRLE1BUE07QUFRaENDLFFBQUFBLFFBQVEsRUFBRVQsa0JBQWtCLENBQUNVO0FBUkcsT0FBakM7QUFXQSxXQUFLOUMscUJBQUwsQ0FBMkJpQyxrQkFBM0IsRUFBK0NJLGNBQWMsQ0FBQ0Ysa0JBQTlELEVBQWtGMUIsZUFBbEYsRUFBbUdyRSxhQUFuRztBQUVBLGFBQU9pRyxjQUFQO0FBQ0EsS0FwYnlCO0FBcWIxQlUsSUFBQUEsdUJBcmIwQixZQXNiekJqQixVQXRieUIsRUF1YnpCQyxnQkF2YnlCLEVBd2J6QmlCLGVBeGJ5QixFQXliekJ2QyxlQXpieUIsRUEwYnpCckUsYUExYnlCLEVBMmJGO0FBQ3ZCLFVBQU02RyxxQkFBcUIsR0FBR25CLFVBQVUsQ0FBQ0ksU0FBWCxZQUF5QkgsZ0JBQWdCLENBQUNJLGtCQUExQyxjQUFnRWEsZUFBaEUsT0FBOUI7QUFDQSxVQUFNRSxxQkFBcUIsR0FBR3BCLFVBQVUsQ0FBQ0ksU0FBWCxZQUF5QkgsZ0JBQWdCLENBQUNJLGtCQUExQyxjQUFnRWEsZUFBaEUsRUFBOUI7QUFFQSxVQUFJRyxxQkFBOEMsR0FBRyxFQUFyRDs7QUFDQSxVQUFJRCxxQkFBcUIsQ0FBQ0Usc0JBQTFCLEVBQWtEO0FBQ2pERCxRQUFBQSxxQkFBcUIsR0FBR3hELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZc0QscUJBQXFCLENBQUNFLHNCQUFsQyxFQUEwRHJHLEdBQTFELENBQThELFVBQUFzRyxrQkFBa0IsRUFBSTtBQUMzRyxpQkFBTztBQUNOQyxZQUFBQSxjQUFjLEVBQUV2QixnQkFBZ0IsQ0FBQ2xELElBRDNCO0FBRU4wRSxZQUFBQSxjQUFjLEVBQUVGLGtCQUZWO0FBR05HLFlBQUFBLGNBQWMsRUFBRU4scUJBQXFCLENBQUN2RSxLQUhoQztBQUlOOEUsWUFBQUEsY0FBYyxFQUFFUCxxQkFBcUIsQ0FBQ0Usc0JBQXRCLENBQTZDQyxrQkFBN0M7QUFKVixXQUFQO0FBTUEsU0FQdUIsQ0FBeEI7QUFRQTs7QUFDRCxVQUFNSyxrQkFBd0MsR0FBRztBQUNoRHBCLFFBQUFBLEtBQUssRUFBRSxvQkFEeUM7QUFFaER6RCxRQUFBQSxJQUFJLEVBQUVtRSxlQUYwQztBQUdoRGIsUUFBQUEsa0JBQWtCLFlBQUtKLGdCQUFnQixDQUFDSSxrQkFBdEIsY0FBNENhLGVBQTVDLENBSDhCO0FBSWhEVyxRQUFBQSxPQUFPLEVBQUVULHFCQUFxQixDQUFDVSxRQUppQjtBQUtoRGpDLFFBQUFBLFlBQVksRUFBRXVCLHFCQUFxQixDQUFDVyxhQUF0QixHQUFzQ1gscUJBQXFCLENBQUNXLGFBQTVELEdBQTRFLEtBTDFDO0FBTWhEQyxRQUFBQSxjQUFjLEVBQUVaLHFCQUFxQixDQUFDYSxlQU5VO0FBT2hEUCxRQUFBQSxjQUFjLEVBQUVOLHFCQUFxQixDQUFDdkUsS0FQVTtBQVFoRHdFLFFBQUFBLHFCQUFxQixFQUFyQkE7QUFSZ0QsT0FBakQ7QUFXQSxXQUFLbkQscUJBQUwsQ0FBMkJpRCxxQkFBM0IsRUFBa0RTLGtCQUFrQixDQUFDdkIsa0JBQXJFLEVBQXlGMUIsZUFBekYsRUFBMEdyRSxhQUExRztBQUVBLGFBQU9zSCxrQkFBUDtBQUNBLEtBeGR5QjtBQXlkMUJNLElBQUFBLGNBemQwQixZQTBkekJsQyxVQTFkeUIsRUEyZHpCbUMsYUEzZHlCLEVBNGR6QnhELGVBNWR5QixFQTZkekJ5RCxtQkE3ZHlCLEVBOGR6QjlILGFBOWR5QixFQStkYjtBQUNaLFVBQU0rSCxtQkFBbUIsR0FBR3JDLFVBQVUsQ0FBQ0ksU0FBWCxZQUF5QitCLGFBQXpCLEVBQTVCO0FBQ0EsVUFBTUcsbUJBQW1CLEdBQUd0QyxVQUFVLENBQUNJLFNBQVgsWUFBeUIrQixhQUF6QixPQUE1QjtBQUNBLFVBQU1JLGVBQTBCLEdBQUc7QUFDbEMvQixRQUFBQSxLQUFLLEVBQUUsV0FEMkI7QUFFbEN6RCxRQUFBQSxJQUFJLEVBQUVvRixhQUY0QjtBQUdsQ0ssUUFBQUEseUJBQXlCLEVBQUUsRUFITztBQUlsQ0MsUUFBQUEsY0FBYyxFQUFFSixtQkFBbUIsQ0FBQ3hGLEtBSkY7QUFLbEN3RCxRQUFBQSxrQkFBa0IsWUFBSytCLG1CQUFMLGNBQTRCRCxhQUE1QjtBQUxnQixPQUFuQztBQU9BLFdBQUtqRSxxQkFBTCxDQUEyQm9FLG1CQUEzQixFQUFnREMsZUFBZSxDQUFDbEMsa0JBQWhFLEVBQW9GMUIsZUFBcEYsRUFBcUdyRSxhQUFyRztBQUNBLGFBQU9pSSxlQUFQO0FBQ0EsS0EzZXlCO0FBNmUxQkcsSUFBQUEsZUE3ZTBCLFlBOGV6QjFDLFVBOWV5QixFQStlekJ5QyxjQS9leUIsRUFnZnpCOUQsZUFoZnlCLEVBaWZ6QmdFLFNBamZ5QixFQWtmekJySSxhQWxmeUIsRUFtZlo7QUFBQTs7QUFDYixVQUFNc0ksb0JBQW9CLEdBQUc1QyxVQUFVLENBQUNJLFNBQVgsWUFBeUJxQyxjQUF6QixPQUE3QjtBQUNBLFVBQU1JLG9CQUFvQixHQUFHN0MsVUFBVSxDQUFDSSxTQUFYLFlBQXlCcUMsY0FBekIsRUFBN0I7QUFDQSxVQUFNSyxVQUFVLEdBQUdELG9CQUFvQixDQUFDRSxJQUFyQixJQUE2QixFQUFoRDtBQUNBLFVBQU05QyxnQkFBNEIsR0FBRztBQUNwQ08sUUFBQUEsS0FBSyxFQUFFLFlBRDZCO0FBRXBDekQsUUFBQUEsSUFBSSxFQUFFMEYsY0FBYyxDQUFDTyxPQUFmLENBQXVCTCxTQUFTLEdBQUcsR0FBbkMsRUFBd0MsRUFBeEMsQ0FGOEI7QUFHcEN0QyxRQUFBQSxrQkFBa0IsRUFBRW9DLGNBSGdCO0FBSXBDM0UsUUFBQUEsSUFBSSxFQUFFLEVBSjhCO0FBS3BDbUYsUUFBQUEsZ0JBQWdCLEVBQUUsRUFMa0I7QUFNcENDLFFBQUFBLG9CQUFvQixFQUFFO0FBTmMsT0FBckM7QUFTQSxXQUFLaEYscUJBQUwsQ0FBMkIwRSxvQkFBM0IsRUFBaUQzQyxnQkFBZ0IsQ0FBQ0ksa0JBQWxFLEVBQXNGMUIsZUFBdEYsRUFBdUdyRSxhQUF2RztBQUNBLFVBQU0ySSxnQkFBZ0IsR0FBR3BGLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZK0Usb0JBQVosRUFDdkIvRCxNQUR1QixDQUNoQixVQUFBcUUsaUJBQWlCLEVBQUk7QUFDNUIsWUFBSUEsaUJBQWlCLElBQUksTUFBckIsSUFBK0JBLGlCQUFpQixJQUFJLE9BQXhELEVBQWlFO0FBQ2hFLGlCQUFPTixvQkFBb0IsQ0FBQ00saUJBQUQsQ0FBcEIsQ0FBd0NDLEtBQXhDLEtBQWtELFVBQXpEO0FBQ0E7QUFDRCxPQUx1QixFQU12Qm5JLEdBTnVCLENBTW5CLFVBQUFpRixZQUFZLEVBQUk7QUFDcEIsZUFBTyxNQUFJLENBQUNILGFBQUwsQ0FBbUJDLFVBQW5CLEVBQStCQyxnQkFBL0IsRUFBaURDLFlBQWpELEVBQStEdkIsZUFBL0QsRUFBZ0ZyRSxhQUFoRixDQUFQO0FBQ0EsT0FSdUIsQ0FBekI7QUFVQSxVQUFNNEksb0JBQW9CLEdBQUdyRixNQUFNLENBQUNDLElBQVAsQ0FBWStFLG9CQUFaLEVBQzNCL0QsTUFEMkIsQ0FDcEIsVUFBQXFFLGlCQUFpQixFQUFJO0FBQzVCLFlBQUlBLGlCQUFpQixJQUFJLE1BQXJCLElBQStCQSxpQkFBaUIsSUFBSSxPQUF4RCxFQUFpRTtBQUNoRSxpQkFBT04sb0JBQW9CLENBQUNNLGlCQUFELENBQXBCLENBQXdDQyxLQUF4QyxLQUFrRCxvQkFBekQ7QUFDQTtBQUNELE9BTDJCLEVBTTNCbkksR0FOMkIsQ0FNdkIsVUFBQWlHLGVBQWUsRUFBSTtBQUN2QixlQUFPLE1BQUksQ0FBQ0QsdUJBQUwsQ0FBNkJqQixVQUE3QixFQUF5Q0MsZ0JBQXpDLEVBQTJEaUIsZUFBM0QsRUFBNEV2QyxlQUE1RSxFQUE2RnJFLGFBQTdGLENBQVA7QUFDQSxPQVIyQixDQUE3QjtBQVVBMkYsTUFBQUEsZ0JBQWdCLENBQUNuQyxJQUFqQixHQUF3QmdGLFVBQVUsQ0FDaEM3SCxHQURzQixDQUNsQixVQUFDb0ksU0FBRDtBQUFBLGVBQXVCSixnQkFBZ0IsQ0FBQzNFLElBQWpCLENBQXNCLFVBQUNnRixRQUFEO0FBQUEsaUJBQXdCQSxRQUFRLENBQUN2RyxJQUFULEtBQWtCc0csU0FBMUM7QUFBQSxTQUF0QixDQUF2QjtBQUFBLE9BRGtCLEVBRXRCdkUsTUFGc0IsQ0FFZixVQUFDd0UsUUFBRDtBQUFBLGVBQXdCQSxRQUFRLEtBQUs5SCxTQUFyQztBQUFBLE9BRmUsQ0FBeEI7QUFHQXlFLE1BQUFBLGdCQUFnQixDQUFDZ0QsZ0JBQWpCLEdBQW9DQSxnQkFBcEM7QUFDQWhELE1BQUFBLGdCQUFnQixDQUFDaUQsb0JBQWpCLEdBQXdDQSxvQkFBeEM7QUFFQSxhQUFPakQsZ0JBQVA7QUFDQSxLQTVoQnlCO0FBNmhCMUJzRCxJQUFBQSxnQkE3aEIwQixZQThoQnpCdkQsVUE5aEJ5QixFQStoQnpCd0QsZUEvaEJ5QixFQWdpQnpCN0UsZUFoaUJ5QixFQWlpQnpCZ0UsU0FqaUJ5QixFQWtpQnpCckksYUFsaUJ5QixFQW1pQlg7QUFBQTs7QUFDZCxVQUFNbUoscUJBQXFCLEdBQUd6RCxVQUFVLENBQUNJLFNBQVgsWUFBeUJvRCxlQUF6QixPQUE5QjtBQUNBLFVBQU1FLHFCQUFxQixHQUFHMUQsVUFBVSxDQUFDSSxTQUFYLFlBQXlCb0QsZUFBekIsRUFBOUI7QUFDQSxVQUFNRyxpQkFBOEIsR0FBRztBQUN0Q25ELFFBQUFBLEtBQUssRUFBRSxhQUQrQjtBQUV0Q3pELFFBQUFBLElBQUksRUFBRXlHLGVBQWUsQ0FBQ1IsT0FBaEIsQ0FBd0JMLFNBQVMsR0FBRyxHQUFwQyxFQUF5QyxFQUF6QyxDQUZnQztBQUd0Q3RDLFFBQUFBLGtCQUFrQixFQUFFbUQsZUFIa0I7QUFJdENJLFFBQUFBLFVBQVUsRUFBRSxFQUowQjtBQUt0Q1YsUUFBQUEsb0JBQW9CLEVBQUU7QUFMZ0IsT0FBdkM7QUFRQSxXQUFLaEYscUJBQUwsQ0FBMkJ1RixxQkFBM0IsRUFBa0RFLGlCQUFpQixDQUFDdEQsa0JBQXBFLEVBQXdGMUIsZUFBeEYsRUFBeUdyRSxhQUF6RztBQUNBLFVBQU11SixxQkFBcUIsR0FBR2hHLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZNEYscUJBQVosRUFDNUI1RSxNQUQ0QixDQUNyQixVQUFBcUUsaUJBQWlCLEVBQUk7QUFDNUIsWUFBSUEsaUJBQWlCLElBQUksTUFBckIsSUFBK0JBLGlCQUFpQixJQUFJLE9BQXhELEVBQWlFO0FBQ2hFLGlCQUFPTyxxQkFBcUIsQ0FBQ1AsaUJBQUQsQ0FBckIsQ0FBeUNDLEtBQXpDLEtBQW1ELFVBQTFEO0FBQ0E7QUFDRCxPQUw0QixFQU01Qm5JLEdBTjRCLENBTXhCLFVBQUFpRixZQUFZLEVBQUk7QUFDcEIsZUFBTyxNQUFJLENBQUNILGFBQUwsQ0FBbUJDLFVBQW5CLEVBQStCMkQsaUJBQS9CLEVBQWtEekQsWUFBbEQsRUFBZ0V2QixlQUFoRSxFQUFpRnJFLGFBQWpGLENBQVA7QUFDQSxPQVI0QixDQUE5QjtBQVVBcUosTUFBQUEsaUJBQWlCLENBQUNDLFVBQWxCLEdBQStCQyxxQkFBL0I7QUFDQSxVQUFNQywrQkFBK0IsR0FBR2pHLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZNEYscUJBQVosRUFDdEM1RSxNQURzQyxDQUMvQixVQUFBcUUsaUJBQWlCLEVBQUk7QUFDNUIsWUFBSUEsaUJBQWlCLElBQUksTUFBckIsSUFBK0JBLGlCQUFpQixJQUFJLE9BQXhELEVBQWlFO0FBQ2hFLGlCQUFPTyxxQkFBcUIsQ0FBQ1AsaUJBQUQsQ0FBckIsQ0FBeUNDLEtBQXpDLEtBQW1ELG9CQUExRDtBQUNBO0FBQ0QsT0FMc0MsRUFNdENuSSxHQU5zQyxDQU1sQyxVQUFBaUcsZUFBZSxFQUFJO0FBQ3ZCLGVBQU8sTUFBSSxDQUFDRCx1QkFBTCxDQUE2QmpCLFVBQTdCLEVBQXlDMkQsaUJBQXpDLEVBQTREekMsZUFBNUQsRUFBNkV2QyxlQUE3RSxFQUE4RnJFLGFBQTlGLENBQVA7QUFDQSxPQVJzQyxDQUF4QztBQVNBcUosTUFBQUEsaUJBQWlCLENBQUNULG9CQUFsQixHQUF5Q1ksK0JBQXpDO0FBQ0EsYUFBT0gsaUJBQVA7QUFDQSxLQXJrQnlCO0FBc2tCMUJJLElBQUFBLFdBdGtCMEIsWUFza0JkQyxVQXRrQmMsRUFza0JNQyxhQXRrQk4sRUFza0JzQ3RCLFNBdGtCdEMsRUFza0J5RFAsbUJBdGtCekQsRUFza0I4RjtBQUN2SCxVQUFJOEIsZ0JBQXdCLEdBQUcsRUFBL0I7QUFDQSxVQUFJQyxTQUFTLGFBQU1ILFVBQU4sQ0FBYjtBQUNBLFVBQU1JLGVBQWUsR0FBR0osVUFBVSxDQUFDM0csTUFBWCxDQUFrQnNGLFNBQVMsQ0FBQ3RILE1BQVYsR0FBbUIsQ0FBckMsQ0FBeEI7O0FBQ0EsVUFBSTRJLGFBQWEsQ0FBQ0ksUUFBbEIsRUFBNEI7QUFDM0IsWUFBTUMsZ0JBQWdCLEdBQUdMLGFBQWEsQ0FBQ00sVUFBZCxDQUF5QixDQUF6QixDQUF6QjtBQUNBTCxRQUFBQSxnQkFBZ0IsR0FBR0ksZ0JBQWdCLENBQUN6SCxLQUFwQzs7QUFDQSxZQUFJeUgsZ0JBQWdCLENBQUN2QyxhQUFqQixLQUFtQyxJQUF2QyxFQUE2QztBQUM1Q29DLFVBQUFBLFNBQVMsYUFBTUgsVUFBTix5QkFBK0JFLGdCQUEvQixPQUFUO0FBQ0EsU0FGRCxNQUVPO0FBQ05DLFVBQUFBLFNBQVMsYUFBTUgsVUFBTixjQUFvQkUsZ0JBQXBCLE1BQVQ7QUFDQTtBQUNELE9BUkQsTUFRTztBQUNOQyxRQUFBQSxTQUFTLGFBQU0vQixtQkFBTixjQUE2QmdDLGVBQTdCLENBQVQ7QUFDQTs7QUFDRCxVQUFNSSxVQUFVLEdBQUdQLGFBQWEsQ0FBQ00sVUFBZCxJQUE0QixFQUEvQztBQUNBLGFBQU87QUFDTi9ELFFBQUFBLEtBQUssRUFBRSxRQUREO0FBRU56RCxRQUFBQSxJQUFJLEVBQUVxSCxlQUZBO0FBR04vRCxRQUFBQSxrQkFBa0IsRUFBRThELFNBSGQ7QUFJTk0sUUFBQUEsT0FBTyxFQUFFUixhQUFhLENBQUNJLFFBSmpCO0FBS05LLFFBQUFBLFVBQVUsRUFBRVIsZ0JBTE47QUFNTlMsUUFBQUEsVUFBVSxFQUFFVixhQUFhLENBQUNXLFdBQWQsR0FBNEJYLGFBQWEsQ0FBQ1csV0FBZCxDQUEwQi9ILEtBQXRELEdBQThELEVBTnBFO0FBT04ySCxRQUFBQSxVQUFVLEVBQUVBLFVBQVUsQ0FBQ3ZKLEdBQVgsQ0FBZSxVQUFBNEosS0FBSyxFQUFJO0FBQ25DLGlCQUFPO0FBQ05yRSxZQUFBQSxLQUFLLEVBQUUsaUJBREQ7QUFFTnNFLFlBQUFBLFdBQVcsRUFBRUQsS0FBSyxDQUFDaEksS0FBTixLQUFnQm9ILGFBQWEsQ0FBQ2MsY0FGckM7QUFHTjFFLFlBQUFBLGtCQUFrQixZQUFLOEQsU0FBTCxjQUFrQlUsS0FBSyxDQUFDRyxLQUF4QixDQUhaO0FBSU52SyxZQUFBQSxJQUFJLEVBQUVvSyxLQUFLLENBQUNoSSxLQUpOLENBS047O0FBTE0sV0FBUDtBQU9BLFNBUlc7QUFQTixPQUFQO0FBaUJBLEtBdm1CeUI7QUF3bUIxQm9JLElBQUFBLGdCQXhtQjBCLFlBd21CVGpGLFVBeG1CUyxFQXdtQlFrRixlQXhtQlIsRUF3bUJpRTtBQUFBOztBQUMxRixVQUFJNUssYUFBSjs7QUFDQSxVQUFJLENBQUM0SyxlQUFMLEVBQXNCO0FBQ3JCNUssUUFBQUEsYUFBYSxHQUFHWCw4QkFBaEI7QUFDQSxPQUZELE1BRU87QUFDTlcsUUFBQUEsYUFBYSxHQUFHNEssZUFBaEI7QUFDQTs7QUFDRCxVQUFNQyxjQUFjLEdBQUduRixVQUFVLENBQUNJLFNBQVgsQ0FBcUIsSUFBckIsQ0FBdkI7QUFDQSxVQUFNZ0YsV0FBVyxHQUFHcEYsVUFBVSxDQUFDSSxTQUFYLENBQXFCLEdBQXJCLENBQXBCO0FBQ0EsVUFBSXpCLGVBQWlDLEdBQUcsRUFBeEM7QUFDQSxVQUFNMEcsV0FBeUIsR0FBRyxFQUFsQztBQUNBLFVBQU1DLFVBQXVCLEdBQUcsRUFBaEM7QUFDQSxVQUFNQyxZQUEyQixHQUFHLEVBQXBDO0FBQ0EsVUFBTW5ELG1CQUFtQixHQUFHK0MsY0FBYyxDQUFDSyxnQkFBM0M7QUFDQSxVQUFJN0MsU0FBUyxHQUFHLEVBQWhCO0FBQ0EsVUFBTThDLFVBQVUsR0FBRzVILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZcUgsY0FBWixFQUE0QnJHLE1BQTVCLENBQW1DLFVBQUE0RyxZQUFZO0FBQUEsZUFBSVAsY0FBYyxDQUFDTyxZQUFELENBQWQsQ0FBNkJ0QyxLQUE3QixLQUF1QyxRQUEzQztBQUFBLE9BQS9DLENBQW5COztBQUNBLFVBQUlxQyxVQUFVLElBQUlBLFVBQVUsQ0FBQ3BLLE1BQVgsR0FBb0IsQ0FBdEMsRUFBeUM7QUFDeENzSCxRQUFBQSxTQUFTLEdBQUc4QyxVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNwSSxNQUFkLENBQXFCLENBQXJCLEVBQXdCb0ksVUFBVSxDQUFDLENBQUQsQ0FBVixDQUFjcEssTUFBZCxHQUF1QixDQUEvQyxDQUFaO0FBQ0EsT0FGRCxNQUVPLElBQUlnSyxXQUFXLElBQUlBLFdBQVcsQ0FBQ2hLLE1BQS9CLEVBQXVDO0FBQzdDc0gsUUFBQUEsU0FBUyxHQUFHMEMsV0FBVyxDQUFDLENBQUQsQ0FBWCxDQUFlaEYsa0JBQWYsQ0FBa0MyQyxPQUFsQyxDQUEwQ3FDLFdBQVcsQ0FBQyxDQUFELENBQVgsQ0FBZXRJLElBQXpELEVBQStELEVBQS9ELENBQVo7QUFDQTRGLFFBQUFBLFNBQVMsR0FBR0EsU0FBUyxDQUFDdEYsTUFBVixDQUFpQixDQUFqQixFQUFvQnNGLFNBQVMsQ0FBQ3RILE1BQVYsR0FBbUIsQ0FBdkMsQ0FBWjtBQUNBOztBQUVEd0MsTUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlxSCxjQUFaLEVBQ0VyRyxNQURGLENBQ1MsVUFBQTJELGNBQWMsRUFBSTtBQUN6QixlQUFPQSxjQUFjLEtBQUssT0FBbkIsSUFBOEIwQyxjQUFjLENBQUMxQyxjQUFELENBQWQsQ0FBK0JXLEtBQS9CLEtBQXlDLFlBQTlFO0FBQ0EsT0FIRixFQUlFckYsT0FKRixDQUlVLFVBQUEwRSxjQUFjLEVBQUk7QUFDMUIsWUFBTWtELFVBQVUsR0FBRyxNQUFJLENBQUNqRCxlQUFMLENBQXFCMUMsVUFBckIsRUFBaUN5QyxjQUFqQyxFQUFpRDlELGVBQWpELEVBQWtFZ0UsU0FBbEUsRUFBNkVySSxhQUE3RSxDQUFuQjs7QUFDQStLLFFBQUFBLFdBQVcsQ0FBQ3BILElBQVosQ0FBaUIwSCxVQUFqQjtBQUNBLE9BUEY7QUFRQTlILE1BQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZc0gsV0FBWixFQUNFdEcsTUFERixDQUNTLFVBQUFxRCxhQUFhLEVBQUk7QUFDeEIsZUFBT0EsYUFBYSxLQUFLLE9BQWxCLElBQTZCaUQsV0FBVyxDQUFDakQsYUFBRCxDQUFYLENBQTJCaUIsS0FBM0IsS0FBcUMsV0FBekU7QUFDQSxPQUhGLEVBSUVyRixPQUpGLENBSVUsVUFBQW9FLGFBQWEsRUFBSTtBQUN6QixZQUFNeUQsU0FBUyxHQUFHLE1BQUksQ0FBQzFELGNBQUwsQ0FBb0JsQyxVQUFwQixFQUFnQ21DLGFBQWhDLEVBQStDeEQsZUFBL0MsRUFBZ0V5RCxtQkFBaEUsRUFBcUY5SCxhQUFyRixDQUFsQjs7QUFDQWdMLFFBQUFBLFVBQVUsQ0FBQ3JILElBQVgsQ0FBZ0IySCxTQUFoQjtBQUNBLE9BUEY7QUFRQS9ILE1BQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZcUgsY0FBWixFQUNFckcsTUFERixDQUNTLFVBQUEwRSxlQUFlLEVBQUk7QUFDMUIsZUFBT0EsZUFBZSxLQUFLLE9BQXBCLElBQStCMkIsY0FBYyxDQUFDM0IsZUFBRCxDQUFkLENBQWdDSixLQUFoQyxLQUEwQyxhQUFoRjtBQUNBLE9BSEYsRUFJRXJGLE9BSkYsQ0FJVSxVQUFBeUYsZUFBZSxFQUFJO0FBQzNCLFlBQU1xQyxXQUFXLEdBQUcsTUFBSSxDQUFDdEMsZ0JBQUwsQ0FBc0J2RCxVQUF0QixFQUFrQ3dELGVBQWxDLEVBQW1EN0UsZUFBbkQsRUFBb0VnRSxTQUFwRSxFQUErRXJJLGFBQS9FLENBQXBCOztBQUNBaUwsUUFBQUEsWUFBWSxDQUFDdEgsSUFBYixDQUFrQjRILFdBQWxCO0FBQ0EsT0FQRjtBQVFBLFVBQU1DLG9CQUFvQixHQUFHakksTUFBTSxDQUFDQyxJQUFQLENBQVlxSCxjQUFaLEVBQTRCN0csSUFBNUIsQ0FBaUMsVUFBQThELG1CQUFtQixFQUFJO0FBQ3BGLGVBQU9BLG1CQUFtQixLQUFLLE9BQXhCLElBQW1DK0MsY0FBYyxDQUFDL0MsbUJBQUQsQ0FBZCxDQUFvQ2dCLEtBQXBDLEtBQThDLGlCQUF4RjtBQUNBLE9BRjRCLENBQTdCO0FBR0EsVUFBSTJDLGVBQWdDLEdBQUcsRUFBdkM7O0FBQ0EsVUFBSUQsb0JBQUosRUFBMEI7QUFDekJDLFFBQUFBLGVBQWUsR0FBRztBQUNqQmhKLFVBQUFBLElBQUksRUFBRStJLG9CQUFvQixDQUFDOUMsT0FBckIsQ0FBNkJMLFNBQVMsR0FBRyxHQUF6QyxFQUE4QyxFQUE5QyxDQURXO0FBRWpCdEMsVUFBQUEsa0JBQWtCLEVBQUV5RjtBQUZILFNBQWxCO0FBSUE7O0FBQ0RSLE1BQUFBLFVBQVUsQ0FBQ3ZILE9BQVgsQ0FBbUIsVUFBQTZILFNBQVMsRUFBSTtBQUMvQixZQUFNSSxtQkFBbUIsR0FBR2IsY0FBYyxDQUFDL0MsbUJBQUQsQ0FBZCxDQUFvQ3dELFNBQVMsQ0FBQzdJLElBQTlDLEVBQW9Ea0osMEJBQWhGOztBQUNBLFlBQUlELG1CQUFKLEVBQXlCO0FBQ3hCbkksVUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlrSSxtQkFBWixFQUFpQ2pJLE9BQWpDLENBQXlDLFVBQUFtSSxXQUFXLEVBQUk7QUFDdkQsZ0JBQU1DLGVBQWUsR0FBR2IsVUFBVSxDQUFDaEgsSUFBWCxDQUFnQixVQUFBNkQsYUFBYTtBQUFBLHFCQUFJQSxhQUFhLENBQUNwRixJQUFkLEtBQXVCaUosbUJBQW1CLENBQUNFLFdBQUQsQ0FBOUM7QUFBQSxhQUE3QixDQUF4Qjs7QUFDQSxnQkFBSUMsZUFBSixFQUFxQjtBQUNwQlAsY0FBQUEsU0FBUyxDQUFDcEQseUJBQVYsQ0FBb0MwRCxXQUFwQyxJQUFtREMsZUFBbkQ7QUFDQTtBQUNELFdBTEQ7QUFNQTtBQUNELE9BVkQ7QUFZQSxVQUFNQyxPQUFpQixHQUFHdkksTUFBTSxDQUFDQyxJQUFQLENBQVlxSCxjQUFaLEVBQ3hCckcsTUFEd0IsQ0FDakIsVUFBQXVILEdBQUcsRUFBSTtBQUNkLGVBQU92TCxLQUFLLENBQUNDLE9BQU4sQ0FBY29LLGNBQWMsQ0FBQ2tCLEdBQUQsQ0FBNUIsS0FBc0NsQixjQUFjLENBQUNrQixHQUFELENBQWQsQ0FBb0JoTCxNQUFwQixHQUE2QixDQUFuRSxJQUF3RThKLGNBQWMsQ0FBQ2tCLEdBQUQsQ0FBZCxDQUFvQixDQUFwQixFQUF1QmpELEtBQXZCLEtBQWlDLFFBQWhIO0FBQ0EsT0FId0IsRUFJeEJrRCxNQUp3QixDQUlqQixVQUFDQyxVQUFELEVBQXVCdkMsVUFBdkIsRUFBc0M7QUFDN0MsWUFBTW9DLE9BQU8sR0FBR2pCLGNBQWMsQ0FBQ25CLFVBQUQsQ0FBOUI7QUFDQW9DLFFBQUFBLE9BQU8sQ0FBQ3JJLE9BQVIsQ0FBZ0IsVUFBQ3lJLE1BQUQsRUFBNkI7QUFDNUNELFVBQUFBLFVBQVUsQ0FBQ3RJLElBQVgsQ0FBZ0IsTUFBSSxDQUFDOEYsV0FBTCxDQUFpQkMsVUFBakIsRUFBNkJ3QyxNQUE3QixFQUFxQzdELFNBQXJDLEVBQWdEUCxtQkFBaEQsQ0FBaEI7QUFDQSxTQUZEO0FBR0EsZUFBT21FLFVBQVA7QUFDQSxPQVZ3QixFQVV0QixFQVZzQixDQUExQixDQXJFMEYsQ0FnRjFGOztBQUNBLFVBQU0vSCxXQUFXLEdBQUcyRyxjQUFjLENBQUNzQixZQUFuQztBQUNBLFVBQU1DLGlCQUFpQixHQUFHN0ksTUFBTSxDQUFDQyxJQUFQLENBQVlVLFdBQVosRUFBeUJNLE1BQXpCLENBQWdDLFVBQUFWLE1BQU07QUFBQSxlQUFJQSxNQUFNLENBQUNhLE9BQVAsQ0FBZSxHQUFmLE1BQXdCLENBQUMsQ0FBN0I7QUFBQSxPQUF0QyxDQUExQjtBQUNBeUgsTUFBQUEsaUJBQWlCLENBQUMzSSxPQUFsQixDQUEwQixVQUFBSyxNQUFNLEVBQUk7QUFDbkMsUUFBQSxNQUFJLENBQUNGLHFCQUFMLENBQTJCaUgsY0FBYyxDQUFDc0IsWUFBZixDQUE0QnJJLE1BQTVCLENBQTNCLEVBQWdFQSxNQUFoRSxFQUF3RU8sZUFBeEUsRUFBeUZyRSxhQUF6RjtBQUNBLE9BRkQ7QUFHQSxVQUFNcU0sMEJBQTBCLEdBQUduSSxXQUFXLENBQUM0RCxtQkFBRCxDQUE5QyxDQXRGMEYsQ0F3RjFGOztBQUNBLFVBQUl1RSwwQkFBSixFQUFnQztBQUMvQixhQUFLekkscUJBQUwsQ0FBMkJ5SSwwQkFBM0IsRUFBdUR2RSxtQkFBdkQsRUFBNEV6RCxlQUE1RSxFQUE2RnJFLGFBQTdGO0FBQ0EsT0EzRnlGLENBNEYxRjs7O0FBQ0FxRSxNQUFBQSxlQUFlLEdBQUdBLGVBQWUsQ0FBQ2lJLElBQWhCLENBQXFCLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLGVBQVdELENBQUMsQ0FBQ3pJLE1BQUYsQ0FBUy9DLE1BQVQsSUFBbUJ5TCxDQUFDLENBQUMxSSxNQUFGLENBQVMvQyxNQUE1QixHQUFxQyxDQUFyQyxHQUF5QyxDQUFDLENBQXJEO0FBQUEsT0FBckIsQ0FBbEI7QUFDQSxVQUFNMEwsVUFBdUIsR0FBRyxFQUFoQztBQUNBLGFBQU87QUFDTkMsUUFBQUEsY0FBYyxFQUFFLGlCQURWO0FBRU5DLFFBQUFBLE9BQU8sRUFBRSxLQUZIO0FBR05DLFFBQUFBLE1BQU0sRUFBRTtBQUNQbkIsVUFBQUEsZUFBZSxFQUFmQSxlQURPO0FBRVBULFVBQUFBLFVBQVUsRUFBVkEsVUFGTztBQUdQRCxVQUFBQSxXQUFXLEVBQVhBLFdBSE87QUFJUEUsVUFBQUEsWUFBWSxFQUFaQSxZQUpPO0FBS1A0QixVQUFBQSxZQUFZLEVBQUUsRUFMUDtBQU1QZixVQUFBQSxPQUFPLEVBQVBBLE9BTk87QUFPUHpELFVBQUFBLFNBQVMsRUFBVEEsU0FQTztBQVFQbkUsVUFBQUEsV0FBVyxFQUFFO0FBQ1osK0JBQW1CRztBQURQO0FBUk4sU0FIRjtBQWVOb0ksUUFBQUEsVUFBVSxFQUFFQTtBQWZOLE9BQVA7QUFpQkE7QUF4dEJ5QixHQUEzQjtBQTJ0QkEsTUFBTUssYUFBMkMsR0FBRyxFQUFwRDtBQUVBOzs7Ozs7OztBQU9PLFdBQVNDLFlBQVQsQ0FBc0JySCxVQUF0QixFQUFrRDFGLGFBQWxELEVBQTRHO0FBQ2xILFFBQU1nTixZQUFZLEdBQUl0SCxVQUFELENBQW9CdUgsRUFBekM7O0FBQ0EsUUFBSSxDQUFDSCxhQUFhLENBQUM5TCxjQUFkLENBQTZCZ00sWUFBN0IsQ0FBTCxFQUFpRDtBQUNoRCxVQUFNRSxZQUFZLEdBQUd4TixrQkFBa0IsQ0FBQ2lMLGdCQUFuQixDQUFvQ2pGLFVBQXBDLEVBQWdEMUYsYUFBaEQsQ0FBckI7QUFDQThNLE1BQUFBLGFBQWEsQ0FBQ0UsWUFBRCxDQUFiLEdBQThCRyxtQkFBbUIsQ0FBQ0osWUFBcEIsQ0FBaUNHLFlBQWpDLENBQTlCO0FBQ0E7O0FBQ0QsV0FBUUosYUFBYSxDQUFDRSxZQUFELENBQXJCO0FBQ0E7OztBQUVELE1BQU1JLG1CQUF3QyxHQUFHLEVBQWpEOztBQUNPLFdBQVNDLHVCQUFULENBQWlDQyxpQkFBakMsRUFBMkc7QUFBQSxRQUE5Q0Msc0JBQThDLHVFQUFaLEtBQVk7QUFDakgsUUFBTUMsZ0JBQWdCLEdBQUdULFlBQVksQ0FBRU8saUJBQWlCLENBQUNHLFFBQWxCLEVBQUYsQ0FBckM7QUFDQSxRQUFNQyxLQUFLLEdBQUdKLGlCQUFpQixDQUFDSyxPQUFsQixFQUFkOztBQUNBLFFBQUksQ0FBQ0osc0JBQUQsSUFBMkJILG1CQUFtQixDQUFDcE0sY0FBcEIsQ0FBbUMwTSxLQUFuQyxDQUEvQixFQUEwRTtBQUN6RSxhQUFPTixtQkFBbUIsQ0FBQ00sS0FBRCxDQUExQjtBQUNBOztBQUNELFFBQU1FLFVBQVUsR0FBR0YsS0FBSyxDQUFDcEwsS0FBTixDQUFZLEdBQVosQ0FBbkI7QUFDQSxRQUFJdUosZUFBMkIsR0FBRzJCLGdCQUFnQixDQUFDeEMsVUFBakIsQ0FBNEJoSCxJQUE1QixDQUFpQyxVQUFBc0gsU0FBUztBQUFBLGFBQUlBLFNBQVMsQ0FBQzdJLElBQVYsS0FBbUJtTCxVQUFVLENBQUMsQ0FBRCxDQUFqQztBQUFBLEtBQTFDLENBQWxDO0FBQ0EsUUFBSUMsWUFBWSxHQUFHRCxVQUFVLENBQUNFLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0JDLElBQXBCLENBQXlCLEdBQXpCLENBQW5CO0FBRUEsUUFBTUMsWUFBbUIsR0FBRyxDQUFDbkMsZUFBRCxDQUE1Qjs7QUFWaUg7QUFZaEgsVUFBTW9DLGFBQWEsR0FBR0osWUFBWSxDQUFDdkwsS0FBYixDQUFtQixHQUFuQixDQUF0QjtBQUNBLFVBQU00TCxhQUFhLEdBQUdyQyxlQUFlLENBQUNSLFVBQWhCLENBQTJCekMsb0JBQTNCLENBQWdENUUsSUFBaEQsQ0FBcUQsVUFBQW1LLE9BQU87QUFBQSxlQUFJQSxPQUFPLENBQUMxTCxJQUFSLEtBQWlCd0wsYUFBYSxDQUFDLENBQUQsQ0FBbEM7QUFBQSxPQUE1RCxDQUF0Qjs7QUFDQSxVQUFJQyxhQUFKLEVBQW1CO0FBQ2xCRixRQUFBQSxZQUFZLENBQUNySyxJQUFiLENBQWtCdUssYUFBbEI7QUFDQTs7QUFDRHJDLE1BQUFBLGVBQWUsR0FBR0EsZUFBZSxDQUFDM0QseUJBQWhCLENBQTBDK0YsYUFBYSxDQUFDLENBQUQsQ0FBdkQsQ0FBbEI7QUFDQUQsTUFBQUEsWUFBWSxDQUFDckssSUFBYixDQUFrQmtJLGVBQWxCO0FBQ0FnQyxNQUFBQSxZQUFZLEdBQUdJLGFBQWEsQ0FBQ0gsS0FBZCxDQUFvQixDQUFwQixFQUF1QkMsSUFBdkIsQ0FBNEIsR0FBNUIsQ0FBZjtBQW5CZ0g7O0FBV2pILFdBQU9GLFlBQVksSUFBSUEsWUFBWSxDQUFDOU0sTUFBYixHQUFzQixDQUF0QyxJQUEyQzhNLFlBQVksQ0FBQ25LLFVBQWIsQ0FBd0IsNEJBQXhCLENBQWxELEVBQXlHO0FBQUE7QUFTeEc7O0FBQ0QsUUFBSW1LLFlBQVksQ0FBQ25LLFVBQWIsQ0FBd0IsT0FBeEIsQ0FBSixFQUFzQztBQUNyQztBQUNBbUssTUFBQUEsWUFBWSxHQUFHRCxVQUFVLENBQUNFLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0JDLElBQXBCLENBQXlCLEdBQXpCLENBQWY7QUFDQTs7QUFDRCxRQUFJbEMsZUFBZSxJQUFJZ0MsWUFBWSxDQUFDOU0sTUFBcEMsRUFBNEM7QUFDM0MsVUFBTXFOLE9BQU8sR0FBR3ZDLGVBQWUsQ0FBQ1IsVUFBaEIsQ0FBMkJnRCxXQUEzQixDQUF1Q1IsWUFBdkMsRUFBcUROLHNCQUFyRCxDQUFoQjs7QUFDQSxVQUFJYSxPQUFKLEVBQWE7QUFDWixZQUFJYixzQkFBSixFQUE0QjtBQUMzQmEsVUFBQUEsT0FBTyxDQUFDRSxjQUFSLEdBQXlCTixZQUFZLENBQUNPLE1BQWIsQ0FBb0JILE9BQU8sQ0FBQ0UsY0FBNUIsQ0FBekI7QUFDQSxTQUZELE1BRU87QUFDTmxCLFVBQUFBLG1CQUFtQixDQUFDTSxLQUFELENBQW5CLEdBQTZCVSxPQUE3QjtBQUNBO0FBQ0QsT0FORCxNQU1PLElBQUl2QyxlQUFlLENBQUNSLFVBQWhCLElBQThCUSxlQUFlLENBQUNSLFVBQWhCLENBQTJCUyxPQUE3RCxFQUFzRTtBQUM1RTtBQUNBLFlBQU1BLE9BQU8sR0FBR0QsZUFBZSxDQUFDUixVQUFoQixJQUE4QlEsZUFBZSxDQUFDUixVQUFoQixDQUEyQlMsT0FBekU7QUFDQSxZQUFNbUMsYUFBYSxHQUFHSixZQUFZLENBQUN2TCxLQUFiLENBQW1CLEdBQW5CLENBQXRCOztBQUNBLFlBQUl3SixPQUFPLENBQUNtQyxhQUFhLENBQUMsQ0FBRCxDQUFkLENBQVgsRUFBK0I7QUFDOUIsY0FBTS9CLE1BQU0sR0FBR0osT0FBTyxDQUFDbUMsYUFBYSxDQUFDLENBQUQsQ0FBZCxDQUF0Qjs7QUFDQSxjQUFJQSxhQUFhLENBQUMsQ0FBRCxDQUFiLElBQW9CL0IsTUFBTSxDQUFDaEMsVUFBL0IsRUFBMkM7QUFDMUMsZ0JBQU1zRSxhQUFhLEdBQUdQLGFBQWEsQ0FBQyxDQUFELENBQW5DO0FBQ0EsZ0JBQU1RLGVBQWUsR0FBR3ZDLE1BQU0sQ0FBQ2hDLFVBQVAsQ0FBa0JsRyxJQUFsQixDQUF1QixVQUFBMEssU0FBUyxFQUFJO0FBQzNELHFCQUFPQSxTQUFTLENBQUMzSSxrQkFBVixDQUE2QjRJLFFBQTdCLENBQXNDLE1BQU1ILGFBQTVDLENBQVA7QUFDQSxhQUZ1QixDQUF4QjtBQUdBLG1CQUFPQyxlQUFQO0FBQ0EsV0FORCxNQU1PLElBQUlaLFlBQVksQ0FBQzlNLE1BQWIsS0FBd0IsQ0FBNUIsRUFBK0I7QUFDckMsbUJBQU9tTCxNQUFQO0FBQ0E7QUFDRDtBQUNEOztBQUNELGFBQU9rQyxPQUFQO0FBQ0EsS0ExQkQsTUEwQk87QUFDTixVQUFJYixzQkFBSixFQUE0QjtBQUMzQixlQUFPO0FBQ056SixVQUFBQSxNQUFNLEVBQUUrSCxlQURGO0FBRU55QyxVQUFBQSxjQUFjLEVBQUVOO0FBRlYsU0FBUDtBQUlBLE9BTEQsTUFLTztBQUNOWixRQUFBQSxtQkFBbUIsQ0FBQ00sS0FBRCxDQUFuQixHQUE2QjdCLGVBQTdCO0FBQ0E7O0FBQ0QsYUFBT0EsZUFBUDtBQUNBO0FBQ0Q7Ozs7QUFXTSxXQUFTK0MsMkJBQVQsQ0FBcUN0QixpQkFBckMsRUFBaUV1QiwwQkFBakUsRUFBNEg7QUFDbEksUUFBTUMsZ0JBQWdCLEdBQUd6Qix1QkFBdUIsQ0FBQ0MsaUJBQUQsRUFBb0IsSUFBcEIsQ0FBaEQ7QUFDQSxRQUFJeUIsdUJBQUo7O0FBQ0EsUUFBSUYsMEJBQTBCLElBQUlBLDBCQUEwQixDQUFDbEIsT0FBM0IsT0FBeUMsR0FBM0UsRUFBZ0Y7QUFDL0VvQixNQUFBQSx1QkFBdUIsR0FBR0gsMkJBQTJCLENBQUNDLDBCQUFELENBQXJEO0FBQ0E7O0FBQ0QsV0FBT0csa0NBQWtDLENBQUNGLGdCQUFELEVBQW1CQyx1QkFBbkIsQ0FBekM7QUFDQTs7OztBQUVNLFdBQVNDLGtDQUFULENBQ05GLGdCQURNLEVBRU5DLHVCQUZNLEVBR2dCO0FBQ3RCLFFBQU1FLGdCQUFnQixHQUFHSCxnQkFBZ0IsQ0FBQ1IsY0FBakIsQ0FBZ0M5SixNQUFoQyxDQUN4QixVQUFDMEssYUFBRDtBQUFBLGFBQXdCQSxhQUFhLElBQUlBLGFBQWEsQ0FBQ2xPLGNBQWQsQ0FBNkIsT0FBN0IsQ0FBakIsSUFBMERrTyxhQUFhLENBQUNoSixLQUFkLEtBQXdCLFlBQTFHO0FBQUEsS0FEd0IsQ0FBekI7O0FBR0EsUUFBSTRJLGdCQUFnQixDQUFDaEwsTUFBakIsSUFBMkJnTCxnQkFBZ0IsQ0FBQ2hMLE1BQWpCLENBQXdCOUMsY0FBeEIsQ0FBdUMsT0FBdkMsQ0FBM0IsSUFBOEU4TixnQkFBZ0IsQ0FBQ2hMLE1BQWpCLENBQXdCb0MsS0FBeEIsS0FBa0MsWUFBcEgsRUFBa0k7QUFDakkrSSxNQUFBQSxnQkFBZ0IsQ0FBQ3RMLElBQWpCLENBQXNCbUwsZ0JBQWdCLENBQUNoTCxNQUF2QztBQUNBOztBQUNELFFBQU04RSxvQkFBMkMsR0FBRyxFQUFwRDtBQUNBLFFBQU11RyxhQUF5QixHQUFHRixnQkFBZ0IsQ0FBQyxDQUFELENBQWxEO0FBQ0EsUUFBSUcsZ0JBQTRCLEdBQUdELGFBQW5DO0FBQ0EsUUFBSUUsaUJBQThCLEdBQUdGLGFBQWEsQ0FBQzlELFVBQW5EO0FBQ0EsUUFBSWlFLENBQUMsR0FBRyxDQUFSO0FBQ0EsUUFBSUMsYUFBSjtBQUNBLFFBQUlDLGNBQWMsR0FBRyxFQUFyQjs7QUFDQSxXQUFPRixDQUFDLEdBQUdMLGdCQUFnQixDQUFDbE8sTUFBNUIsRUFBb0M7QUFDbkN3TyxNQUFBQSxhQUFhLEdBQUdOLGdCQUFnQixDQUFDSyxDQUFDLEVBQUYsQ0FBaEM7O0FBQ0EsVUFBSUMsYUFBYSxDQUFDckosS0FBZCxLQUF3QixvQkFBNUIsRUFBa0Q7QUFDakRzSixRQUFBQSxjQUFjLENBQUM3TCxJQUFmLENBQW9CNEwsYUFBYSxDQUFDOU0sSUFBbEM7QUFDQW1HLFFBQUFBLG9CQUFvQixDQUFDakYsSUFBckIsQ0FBMEI0TCxhQUExQjtBQUNBRixRQUFBQSxpQkFBaUIsR0FBSUUsYUFBRCxDQUF1Q0UsVUFBM0Q7O0FBQ0EsWUFBSUwsZ0JBQWdCLElBQUlBLGdCQUFnQixDQUFDbEgseUJBQWpCLENBQTJDbEgsY0FBM0MsQ0FBMER3TyxjQUFjLENBQUN6QixJQUFmLENBQW9CLEdBQXBCLENBQTFELENBQXhCLEVBQTZHO0FBQzVHcUIsVUFBQUEsZ0JBQWdCLEdBQUdBLGdCQUFnQixDQUFDbEgseUJBQWpCLENBQTJDcUgsYUFBYSxDQUFDOU0sSUFBekQsQ0FBbkI7QUFDQStNLFVBQUFBLGNBQWMsR0FBRyxFQUFqQjtBQUNBO0FBQ0Q7O0FBQ0QsVUFBSUQsYUFBYSxDQUFDckosS0FBZCxLQUF3QixXQUE1QixFQUF5QztBQUN4Q2tKLFFBQUFBLGdCQUFnQixHQUFHRyxhQUFuQjtBQUNBRixRQUFBQSxpQkFBaUIsR0FBR0QsZ0JBQWdCLENBQUMvRCxVQUFyQztBQUNBO0FBQ0Q7O0FBRUQsUUFBSTBELHVCQUF1QixJQUFJQSx1QkFBdUIsQ0FBQ1csaUJBQXhCLEtBQThDUCxhQUE3RSxFQUE0RjtBQUMzRjtBQUNBO0FBQ0EsVUFBTVEsYUFBYSxHQUFHVixnQkFBZ0IsQ0FBQ3RLLE9BQWpCLENBQXlCb0ssdUJBQXVCLENBQUNXLGlCQUFqRCxDQUF0Qjs7QUFDQSxVQUFJQyxhQUFhLEtBQUssQ0FBQyxDQUF2QixFQUEwQjtBQUN6QjtBQUNBLFlBQU1DLHdCQUF3QixHQUFHWCxnQkFBZ0IsQ0FBQ25CLEtBQWpCLENBQXVCLENBQXZCLEVBQTBCNkIsYUFBMUIsQ0FBakM7QUFDQVosUUFBQUEsdUJBQXVCLENBQUNXLGlCQUF4QixHQUE0Q1AsYUFBNUM7QUFDQUosUUFBQUEsdUJBQXVCLENBQUNuRyxvQkFBeEIsR0FBK0NnSCx3QkFBd0IsQ0FDckVwTCxNQUQ2QyxDQUN0QyxVQUFDcUwsTUFBRDtBQUFBLGlCQUFpQkEsTUFBTSxDQUFDM0osS0FBUCxLQUFpQixvQkFBbEM7QUFBQSxTQURzQyxFQUU3Q3FJLE1BRjZDLENBRXRDUSx1QkFBdUIsQ0FBQ25HLG9CQUZjLENBQS9DO0FBR0E7QUFDRDs7QUFDRCxRQUFNa0gsZ0JBQWdCLEdBQUc7QUFDeEJKLE1BQUFBLGlCQUFpQixFQUFFUCxhQURLO0FBRXhCdEQsTUFBQUEsZUFBZSxFQUFFdUQsZ0JBRk87QUFHeEJXLE1BQUFBLGdCQUFnQixFQUFFVixpQkFITTtBQUl4QlcsTUFBQUEsWUFBWSxFQUFFbEIsZ0JBQWdCLENBQUNoTCxNQUpQO0FBS3hCOEUsTUFBQUEsb0JBQW9CLEVBQXBCQSxvQkFMd0I7QUFNeEJxSCxNQUFBQSxlQUFlLEVBQUVsQjtBQU5PLEtBQXpCOztBQVFBLFFBQUksQ0FBQ2UsZ0JBQWdCLENBQUNHLGVBQXRCLEVBQXVDO0FBQ3RDSCxNQUFBQSxnQkFBZ0IsQ0FBQ0csZUFBakIsR0FBbUNILGdCQUFuQztBQUNBOztBQUNELFdBQU9BLGdCQUFQO0FBQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFubm90YXRpb24sIEFubm90YXRpb25MaXN0LCBBbm5vdGF0aW9uUmVjb3JkLCBFeHByZXNzaW9uLCBQYXJzZXJPdXRwdXQgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbi8vIFRoaXMgZmlsZSBpcyByZXRyaWV2ZWQgZnJvbSBAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyLCBzaGFyZWQgY29kZSB3aXRoIHRvb2wgc3VpdGVcbmltcG9ydCB7IEFubm90YXRpb25Db252ZXJ0ZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb21tb25cIjtcbmltcG9ydCB7IE9EYXRhTWV0YU1vZGVsIH0gZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NFwiO1xuaW1wb3J0IHtcblx0Q29udmVydGVyT3V0cHV0LFxuXHRFbnRpdHlTZXQgYXMgX0VudGl0eVNldCxcblx0RW50aXR5VHlwZSBhcyBfRW50aXR5VHlwZSxcblx0TmF2aWdhdGlvblByb3BlcnR5IGFzIF9OYXZpZ2F0aW9uUHJvcGVydHlcbn0gZnJvbSBcIkBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXJcIjtcbmltcG9ydCB7XG5cdEVudGl0eVR5cGUsXG5cdEVudGl0eVNldCxcblx0UHJvcGVydHksXG5cdENvbXBsZXhUeXBlLFxuXHRSZWZlcmVudGlhbENvbnN0cmFpbnQsXG5cdFY0TmF2aWdhdGlvblByb3BlcnR5LFxuXHRBY3Rpb24sXG5cdFJlZmVyZW5jZSxcblx0RW50aXR5Q29udGFpbmVyXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L1BhcnNlclwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCJzYXAvdWkvbW9kZWxcIjtcbmltcG9ydCB7IERhdGFNb2RlbE9iamVjdFBhdGggfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5cbmNvbnN0IFZPQ0FCVUxBUllfQUxJQVM6IGFueSA9IHtcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxXCI6IFwiQ2FwYWJpbGl0aWVzXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjFcIjogXCJDb3JlXCIsXG5cdFwiT3JnLk9EYXRhLk1lYXN1cmVzLlYxXCI6IFwiTWVhc3VyZXNcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjFcIjogXCJDb21tb25cIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MVwiOiBcIlVJXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuU2Vzc2lvbi52MVwiOiBcIlNlc3Npb25cIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5BbmFseXRpY3MudjFcIjogXCJBbmFseXRpY3NcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5QZXJzb25hbERhdGEudjFcIjogXCJQZXJzb25hbERhdGFcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxXCI6IFwiQ29tbXVuaWNhdGlvblwiXG59O1xuXG5leHBvcnQgdHlwZSBFbnZpcm9ubWVudENhcGFiaWxpdGllcyA9IHtcblx0Q2hhcnQ6IGJvb2xlYW47XG5cdE1pY3JvQ2hhcnQ6IGJvb2xlYW47XG5cdFVTaGVsbDogYm9vbGVhbjtcblx0SW50ZW50QmFzZWROYXZpZ2F0aW9uOiBib29sZWFuO1xufTtcblxuZXhwb3J0IGNvbnN0IERlZmF1bHRFbnZpcm9ubWVudENhcGFiaWxpdGllcyA9IHtcblx0Q2hhcnQ6IHRydWUsXG5cdE1pY3JvQ2hhcnQ6IHRydWUsXG5cdFVTaGVsbDogdHJ1ZSxcblx0SW50ZW50QmFzZWROYXZpZ2F0aW9uOiB0cnVlXG59O1xuXG50eXBlIE1ldGFNb2RlbEFjdGlvbiA9IHtcblx0JGtpbmQ6IFwiQWN0aW9uXCI7XG5cdCRJc0JvdW5kOiBib29sZWFuO1xuXHQkRW50aXR5U2V0UGF0aDogc3RyaW5nO1xuXHQkUGFyYW1ldGVyOiB7XG5cdFx0JFR5cGU6IHN0cmluZztcblx0XHQkTmFtZTogc3RyaW5nO1xuXHRcdCROdWxsYWJsZT86IGJvb2xlYW47XG5cdFx0JE1heExlbmd0aD86IG51bWJlcjtcblx0XHQkUHJlY2lzaW9uPzogbnVtYmVyO1xuXHRcdCRTY2FsZT86IG51bWJlcjtcblx0XHQkaXNDb2xsZWN0aW9uPzogYm9vbGVhbjtcblx0fVtdO1xuXHQkUmV0dXJuVHlwZToge1xuXHRcdCRUeXBlOiBzdHJpbmc7XG5cdH07XG59O1xuXG5jb25zdCBNZXRhTW9kZWxDb252ZXJ0ZXIgPSB7XG5cdHBhcnNlUHJvcGVydHlWYWx1ZShcblx0XHRhbm5vdGF0aW9uT2JqZWN0OiBhbnksXG5cdFx0cHJvcGVydHlLZXk6IHN0cmluZyxcblx0XHRjdXJyZW50VGFyZ2V0OiBzdHJpbmcsXG5cdFx0YW5ub3RhdGlvbnNMaXN0czogYW55W10sXG5cdFx0b0NhcGFiaWxpdGllczogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNcblx0KTogYW55IHtcblx0XHRsZXQgdmFsdWU7XG5cdFx0Y29uc3QgY3VycmVudFByb3BlcnR5VGFyZ2V0OiBzdHJpbmcgPSBjdXJyZW50VGFyZ2V0ICsgXCIvXCIgKyBwcm9wZXJ0eUtleTtcblx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdCA9PT0gbnVsbCkge1xuXHRcdFx0dmFsdWUgPSB7IHR5cGU6IFwiTnVsbFwiLCBOdWxsOiBudWxsIH07XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgYW5ub3RhdGlvbk9iamVjdCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0dmFsdWUgPSB7IHR5cGU6IFwiU3RyaW5nXCIsIFN0cmluZzogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0XHR2YWx1ZSA9IHsgdHlwZTogXCJCb29sXCIsIEJvb2w6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0ID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHR2YWx1ZSA9IHsgdHlwZTogXCJJbnRcIiwgSW50OiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFubm90YXRpb25PYmplY3QpKSB7XG5cdFx0XHR2YWx1ZSA9IHtcblx0XHRcdFx0dHlwZTogXCJDb2xsZWN0aW9uXCIsXG5cdFx0XHRcdENvbGxlY3Rpb246IGFubm90YXRpb25PYmplY3QubWFwKChzdWJBbm5vdGF0aW9uT2JqZWN0LCBzdWJBbm5vdGF0aW9uT2JqZWN0SW5kZXgpID0+XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUFubm90YXRpb25PYmplY3QoXG5cdFx0XHRcdFx0XHRzdWJBbm5vdGF0aW9uT2JqZWN0LFxuXHRcdFx0XHRcdFx0Y3VycmVudFByb3BlcnR5VGFyZ2V0ICsgXCIvXCIgKyBzdWJBbm5vdGF0aW9uT2JqZWN0SW5kZXgsXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uc0xpc3RzLFxuXHRcdFx0XHRcdFx0b0NhcGFiaWxpdGllc1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0fTtcblx0XHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0Lmxlbmd0aCA+IDApIHtcblx0XHRcdFx0aWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkUHJvcGVydHlQYXRoXCIpKSB7XG5cdFx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJQcm9wZXJ0eVBhdGhcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJFBhdGhcIikpIHtcblx0XHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlBhdGhcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEFubm90YXRpb25QYXRoXCIpKSB7XG5cdFx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJBbm5vdGF0aW9uUGF0aFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkVHlwZVwiKSkge1xuXHRcdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUmVjb3JkXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRJZlwiKSkge1xuXHRcdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiSWZcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEFwcGx5XCIpKSB7XG5cdFx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJBcHBseVwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0WzBdID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0Ly8gJFR5cGUgaXMgb3B0aW9uYWwuLi5cblx0XHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlJlY29yZFwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiU3RyaW5nXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dmFsdWUgPSB7IHR5cGU6IFwiUGF0aFwiLCBQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRQYXRoIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiREZWNpbWFsICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHZhbHVlID0geyB0eXBlOiBcIkRlY2ltYWxcIiwgRGVjaW1hbDogcGFyc2VGbG9hdChhbm5vdGF0aW9uT2JqZWN0LiREZWNpbWFsKSB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kUHJvcGVydHlQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHZhbHVlID0geyB0eXBlOiBcIlByb3BlcnR5UGF0aFwiLCBQcm9wZXJ0eVBhdGg6IGFubm90YXRpb25PYmplY3QuJFByb3BlcnR5UGF0aCB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTmF2aWdhdGlvblByb3BlcnR5UGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR2YWx1ZSA9IHtcblx0XHRcdFx0dHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIsXG5cdFx0XHRcdE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg6IGFubm90YXRpb25PYmplY3QuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRJZiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR2YWx1ZSA9IHsgdHlwZTogXCJJZlwiLCBJZjogYW5ub3RhdGlvbk9iamVjdC4kSWYgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEFwcGx5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHZhbHVlID0geyB0eXBlOiBcIkFwcGx5XCIsIEFwcGx5OiBhbm5vdGF0aW9uT2JqZWN0LiRBcHBseSwgRnVuY3Rpb246IGFubm90YXRpb25PYmplY3QuJEZ1bmN0aW9uIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBbm5vdGF0aW9uUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR2YWx1ZSA9IHsgdHlwZTogXCJBbm5vdGF0aW9uUGF0aFwiLCBBbm5vdGF0aW9uUGF0aDogYW5ub3RhdGlvbk9iamVjdC4kQW5ub3RhdGlvblBhdGggfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dmFsdWUgPSB7XG5cdFx0XHRcdHR5cGU6IFwiRW51bU1lbWJlclwiLFxuXHRcdFx0XHRFbnVtTWVtYmVyOlxuXHRcdFx0XHRcdHRoaXMubWFwTmFtZVRvQWxpYXMoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlci5zcGxpdChcIi9cIilbMF0pICsgXCIvXCIgKyBhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyLnNwbGl0KFwiL1wiKVsxXVxuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFR5cGUpIHtcblx0XHRcdHZhbHVlID0ge1xuXHRcdFx0XHR0eXBlOiBcIlJlY29yZFwiLFxuXHRcdFx0XHRSZWNvcmQ6IHRoaXMucGFyc2VBbm5vdGF0aW9uT2JqZWN0KGFubm90YXRpb25PYmplY3QsIGN1cnJlbnRUYXJnZXQsIGFubm90YXRpb25zTGlzdHMsIG9DYXBhYmlsaXRpZXMpXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YWx1ZSA9IHtcblx0XHRcdFx0dHlwZTogXCJSZWNvcmRcIixcblx0XHRcdFx0UmVjb3JkOiB0aGlzLnBhcnNlQW5ub3RhdGlvbk9iamVjdChhbm5vdGF0aW9uT2JqZWN0LCBjdXJyZW50VGFyZ2V0LCBhbm5vdGF0aW9uc0xpc3RzLCBvQ2FwYWJpbGl0aWVzKVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0bmFtZTogcHJvcGVydHlLZXksXG5cdFx0XHR2YWx1ZVxuXHRcdH07XG5cdH0sXG5cdG1hcE5hbWVUb0FsaWFzKGFubm90YXRpb25OYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdGxldCBbcGF0aFBhcnQsIGFubm9QYXJ0XSA9IGFubm90YXRpb25OYW1lLnNwbGl0KFwiQFwiKTtcblx0XHRpZiAoIWFubm9QYXJ0KSB7XG5cdFx0XHRhbm5vUGFydCA9IHBhdGhQYXJ0O1xuXHRcdFx0cGF0aFBhcnQgPSBcIlwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXRoUGFydCArPSBcIkBcIjtcblx0XHR9XG5cdFx0Y29uc3QgbGFzdERvdCA9IGFubm9QYXJ0Lmxhc3RJbmRleE9mKFwiLlwiKTtcblx0XHRyZXR1cm4gcGF0aFBhcnQgKyBWT0NBQlVMQVJZX0FMSUFTW2Fubm9QYXJ0LnN1YnN0cigwLCBsYXN0RG90KV0gKyBcIi5cIiArIGFubm9QYXJ0LnN1YnN0cihsYXN0RG90ICsgMSk7XG5cdH0sXG5cdHBhcnNlQW5ub3RhdGlvbk9iamVjdChcblx0XHRhbm5vdGF0aW9uT2JqZWN0OiBhbnksXG5cdFx0Y3VycmVudE9iamVjdFRhcmdldDogc3RyaW5nLFxuXHRcdGFubm90YXRpb25zTGlzdHM6IGFueVtdLFxuXHRcdG9DYXBhYmlsaXRpZXM6IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzXG5cdCk6IEV4cHJlc3Npb24gfCBBbm5vdGF0aW9uUmVjb3JkIHwgQW5ub3RhdGlvbiB7XG5cdFx0bGV0IHBhcnNlZEFubm90YXRpb25PYmplY3Q6IGFueSA9IHt9O1xuXHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0ID09PSBudWxsKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIk51bGxcIiwgTnVsbDogbnVsbCB9O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiU3RyaW5nXCIsIFN0cmluZzogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIkJvb2xcIiwgQm9vbDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiSW50XCIsIEludDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kQW5ub3RhdGlvblBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJBbm5vdGF0aW9uUGF0aFwiLCBBbm5vdGF0aW9uUGF0aDogYW5ub3RhdGlvbk9iamVjdC4kQW5ub3RhdGlvblBhdGggfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJQYXRoXCIsIFBhdGg6IGFubm90YXRpb25PYmplY3QuJFBhdGggfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJERlY2ltYWwgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJEZWNpbWFsXCIsIERlY2ltYWw6IHBhcnNlRmxvYXQoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCkgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFByb3BlcnR5UGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIlByb3BlcnR5UGF0aFwiLCBQcm9wZXJ0eVBhdGg6IGFubm90YXRpb25PYmplY3QuJFByb3BlcnR5UGF0aCB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kSWYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJJZlwiLCBJZjogYW5ub3RhdGlvbk9iamVjdC4kSWYgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEFwcGx5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiQXBwbHlcIiwgQXBwbHk6IGFubm90YXRpb25PYmplY3QuJEFwcGx5LCBGdW5jdGlvbjogYW5ub3RhdGlvbk9iamVjdC4kRnVuY3Rpb24gfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHtcblx0XHRcdFx0dHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIsXG5cdFx0XHRcdE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg6IGFubm90YXRpb25PYmplY3QuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7XG5cdFx0XHRcdHR5cGU6IFwiRW51bU1lbWJlclwiLFxuXHRcdFx0XHRFbnVtTWVtYmVyOlxuXHRcdFx0XHRcdHRoaXMubWFwTmFtZVRvQWxpYXMoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlci5zcGxpdChcIi9cIilbMF0pICsgXCIvXCIgKyBhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyLnNwbGl0KFwiL1wiKVsxXVxuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYW5ub3RhdGlvbk9iamVjdCkpIHtcblx0XHRcdGNvbnN0IHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uID0gcGFyc2VkQW5ub3RhdGlvbk9iamVjdCBhcyBhbnk7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uID0gYW5ub3RhdGlvbk9iamVjdC5tYXAoKHN1YkFubm90YXRpb25PYmplY3QsIHN1YkFubm90YXRpb25JbmRleCkgPT5cblx0XHRcdFx0dGhpcy5wYXJzZUFubm90YXRpb25PYmplY3QoXG5cdFx0XHRcdFx0c3ViQW5ub3RhdGlvbk9iamVjdCxcblx0XHRcdFx0XHRjdXJyZW50T2JqZWN0VGFyZ2V0ICsgXCIvXCIgKyBzdWJBbm5vdGF0aW9uSW5kZXgsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNMaXN0cyxcblx0XHRcdFx0XHRvQ2FwYWJpbGl0aWVzXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJFByb3BlcnR5UGF0aFwiKSkge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUHJvcGVydHlQYXRoXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRQYXRoXCIpKSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJQYXRoXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpKSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBbm5vdGF0aW9uUGF0aFwiKSkge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiQW5ub3RhdGlvblBhdGhcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJFR5cGVcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlJlY29yZFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkSWZcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIklmXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBcHBseVwiKSkge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiQXBwbHlcIjtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgYW5ub3RhdGlvbk9iamVjdFswXSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUmVjb3JkXCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJTdHJpbmdcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdC4kVHlwZSkge1xuXHRcdFx0XHRjb25zdCB0eXBlVmFsdWUgPSBhbm5vdGF0aW9uT2JqZWN0LiRUeXBlO1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnR5cGUgPSB0eXBlVmFsdWU7IC8vYCR7dHlwZUFsaWFzfS4ke3R5cGVUZXJtfWA7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBwcm9wZXJ0eVZhbHVlczogYW55ID0gW107XG5cdFx0XHRPYmplY3Qua2V5cyhhbm5vdGF0aW9uT2JqZWN0KS5mb3JFYWNoKHByb3BlcnR5S2V5ID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiRUeXBlXCIgJiZcblx0XHRcdFx0XHRwcm9wZXJ0eUtleSAhPT0gXCIkSWZcIiAmJlxuXHRcdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiRBcHBseVwiICYmXG5cdFx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJEVxXCIgJiZcblx0XHRcdFx0XHQhcHJvcGVydHlLZXkuc3RhcnRzV2l0aChcIkBcIilcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cHJvcGVydHlWYWx1ZXMucHVzaChcblx0XHRcdFx0XHRcdHRoaXMucGFyc2VQcm9wZXJ0eVZhbHVlKFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0W3Byb3BlcnR5S2V5XSxcblx0XHRcdFx0XHRcdFx0cHJvcGVydHlLZXksXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRPYmplY3RUYXJnZXQsXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25zTGlzdHMsXG5cdFx0XHRcdFx0XHRcdG9DYXBhYmlsaXRpZXNcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHByb3BlcnR5S2V5LnN0YXJ0c1dpdGgoXCJAXCIpKSB7XG5cdFx0XHRcdFx0Ly8gQW5ub3RhdGlvbiBvZiBhbm5vdGF0aW9uXG5cdFx0XHRcdFx0dGhpcy5jcmVhdGVBbm5vdGF0aW9uTGlzdHMoXG5cdFx0XHRcdFx0XHR7IFtwcm9wZXJ0eUtleV06IGFubm90YXRpb25PYmplY3RbcHJvcGVydHlLZXldIH0sXG5cdFx0XHRcdFx0XHRjdXJyZW50T2JqZWN0VGFyZ2V0LFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbnNMaXN0cyxcblx0XHRcdFx0XHRcdG9DYXBhYmlsaXRpZXNcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QucHJvcGVydHlWYWx1ZXMgPSBwcm9wZXJ0eVZhbHVlcztcblx0XHR9XG5cdFx0cmV0dXJuIHBhcnNlZEFubm90YXRpb25PYmplY3Q7XG5cdH0sXG5cdGdldE9yQ3JlYXRlQW5ub3RhdGlvbkxpc3QodGFyZ2V0OiBzdHJpbmcsIGFubm90YXRpb25zTGlzdHM6IEFubm90YXRpb25MaXN0W10pOiBBbm5vdGF0aW9uTGlzdCB7XG5cdFx0bGV0IHBvdGVudGlhbFRhcmdldCA9IGFubm90YXRpb25zTGlzdHMuZmluZChhbm5vdGF0aW9uTGlzdCA9PiBhbm5vdGF0aW9uTGlzdC50YXJnZXQgPT09IHRhcmdldCk7XG5cdFx0aWYgKCFwb3RlbnRpYWxUYXJnZXQpIHtcblx0XHRcdHBvdGVudGlhbFRhcmdldCA9IHtcblx0XHRcdFx0dGFyZ2V0OiB0YXJnZXQsXG5cdFx0XHRcdGFubm90YXRpb25zOiBbXVxuXHRcdFx0fTtcblx0XHRcdGFubm90YXRpb25zTGlzdHMucHVzaChwb3RlbnRpYWxUYXJnZXQpO1xuXHRcdH1cblx0XHRyZXR1cm4gcG90ZW50aWFsVGFyZ2V0O1xuXHR9LFxuXG5cdGNyZWF0ZUFubm90YXRpb25MaXN0cyhcblx0XHRhbm5vdGF0aW9uT2JqZWN0czogYW55LFxuXHRcdGFubm90YXRpb25UYXJnZXQ6IHN0cmluZyxcblx0XHRhbm5vdGF0aW9uTGlzdHM6IGFueVtdLFxuXHRcdG9DYXBhYmlsaXRpZXM6IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzXG5cdCkge1xuXHRcdGNvbnN0IG91dEFubm90YXRpb25PYmplY3QgPSB0aGlzLmdldE9yQ3JlYXRlQW5ub3RhdGlvbkxpc3QoYW5ub3RhdGlvblRhcmdldCwgYW5ub3RhdGlvbkxpc3RzKTtcblx0XHRpZiAoIW9DYXBhYmlsaXRpZXMuTWljcm9DaGFydCkge1xuXHRcdFx0ZGVsZXRlIGFubm90YXRpb25PYmplY3RzW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0XCJdO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlbW92ZUNoYXJ0QW5ub3RhdGlvbnMoYW5ub3RhdGlvbk9iamVjdDogYW55KSB7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdC5maWx0ZXIoKG9SZWNvcmQ6IGFueSkgPT4ge1xuXHRcdFx0XHRpZiAob1JlY29yZC5UYXJnZXQgJiYgb1JlY29yZC5UYXJnZXQuJEFubm90YXRpb25QYXRoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9SZWNvcmQuVGFyZ2V0LiRBbm5vdGF0aW9uUGF0aC5pbmRleE9mKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0XCIpID09PSAtMTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVtb3ZlSUJOQW5ub3RhdGlvbnMoYW5ub3RhdGlvbk9iamVjdDogYW55KSB7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdC5maWx0ZXIoKG9SZWNvcmQ6IGFueSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gb1JlY29yZC4kVHlwZSAhPT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhhbmRsZVByZXNlbnRhdGlvblZhcmlhbnQoYW5ub3RhdGlvbk9iamVjdDogYW55KSB7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdC5maWx0ZXIoKG9SZWNvcmQ6IGFueSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gb1JlY29yZC4kQW5ub3RhdGlvblBhdGggIT09IFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0XCI7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRPYmplY3Qua2V5cyhhbm5vdGF0aW9uT2JqZWN0cykuZm9yRWFjaChhbm5vdGF0aW9uS2V5ID0+IHtcblx0XHRcdGxldCBhbm5vdGF0aW9uT2JqZWN0ID0gYW5ub3RhdGlvbk9iamVjdHNbYW5ub3RhdGlvbktleV07XG5cdFx0XHRzd2l0Y2ggKGFubm90YXRpb25LZXkpIHtcblx0XHRcdFx0Y2FzZSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IZWFkZXJGYWNldHNcIjpcblx0XHRcdFx0XHRpZiAoIW9DYXBhYmlsaXRpZXMuTWljcm9DaGFydCkge1xuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdCA9IHJlbW92ZUNoYXJ0QW5ub3RhdGlvbnMoYW5ub3RhdGlvbk9iamVjdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLklkZW50aWZpY2F0aW9uXCI6XG5cdFx0XHRcdFx0aWYgKCFvQ2FwYWJpbGl0aWVzLkludGVudEJhc2VkTmF2aWdhdGlvbikge1xuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdCA9IHJlbW92ZUlCTkFubm90YXRpb25zKGFubm90YXRpb25PYmplY3QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiOlxuXHRcdFx0XHRcdGlmICghb0NhcGFiaWxpdGllcy5JbnRlbnRCYXNlZE5hdmlnYXRpb24pIHtcblx0XHRcdFx0XHRcdGFubm90YXRpb25PYmplY3QgPSByZW1vdmVJQk5Bbm5vdGF0aW9ucyhhbm5vdGF0aW9uT2JqZWN0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFvQ2FwYWJpbGl0aWVzLk1pY3JvQ2hhcnQpIHtcblx0XHRcdFx0XHRcdGFubm90YXRpb25PYmplY3QgPSByZW1vdmVDaGFydEFubm90YXRpb25zKGFubm90YXRpb25PYmplY3QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GaWVsZEdyb3VwXCI6XG5cdFx0XHRcdFx0aWYgKCFvQ2FwYWJpbGl0aWVzLkludGVudEJhc2VkTmF2aWdhdGlvbikge1xuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdC5EYXRhID0gcmVtb3ZlSUJOQW5ub3RhdGlvbnMoYW5ub3RhdGlvbk9iamVjdC5EYXRhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFvQ2FwYWJpbGl0aWVzLk1pY3JvQ2hhcnQpIHtcblx0XHRcdFx0XHRcdGFubm90YXRpb25PYmplY3QuRGF0YSA9IHJlbW92ZUNoYXJ0QW5ub3RhdGlvbnMoYW5ub3RhdGlvbk9iamVjdC5EYXRhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUHJlc2VudGF0aW9uVmFyaWFudFwiOlxuXHRcdFx0XHRcdGlmICghb0NhcGFiaWxpdGllcy5DaGFydCAmJiBhbm5vdGF0aW9uT2JqZWN0LlZpc3VhbGl6YXRpb25zKSB7XG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0LlZpc3VhbGl6YXRpb25zID0gaGFuZGxlUHJlc2VudGF0aW9uVmFyaWFudChhbm5vdGF0aW9uT2JqZWN0LlZpc3VhbGl6YXRpb25zKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRhbm5vdGF0aW9uT2JqZWN0c1thbm5vdGF0aW9uS2V5XSA9IGFubm90YXRpb25PYmplY3Q7XG5cdFx0XHRsZXQgY3VycmVudE91dEFubm90YXRpb25PYmplY3QgPSBvdXRBbm5vdGF0aW9uT2JqZWN0O1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvblF1YWxpZmllclNwbGl0ID0gYW5ub3RhdGlvbktleS5zcGxpdChcIiNcIik7XG5cdFx0XHRjb25zdCBxdWFsaWZpZXIgPSBhbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXRbMV07XG5cdFx0XHRhbm5vdGF0aW9uS2V5ID0gYW5ub3RhdGlvblF1YWxpZmllclNwbGl0WzBdO1xuXHRcdFx0Ly8gQ2hlY2sgZm9yIGFubm90YXRpb24gb2YgYW5ub3RhdGlvblxuXHRcdFx0Y29uc3QgYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0ID0gYW5ub3RhdGlvbktleS5zcGxpdChcIkBcIik7XG5cdFx0XHRpZiAoYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0Lmxlbmd0aCA+IDIpIHtcblx0XHRcdFx0Y3VycmVudE91dEFubm90YXRpb25PYmplY3QgPSB0aGlzLmdldE9yQ3JlYXRlQW5ub3RhdGlvbkxpc3QoXG5cdFx0XHRcdFx0YW5ub3RhdGlvblRhcmdldCArIFwiQFwiICsgYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0WzFdLFxuXHRcdFx0XHRcdGFubm90YXRpb25MaXN0c1xuXHRcdFx0XHQpO1xuXHRcdFx0XHRhbm5vdGF0aW9uS2V5ID0gYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0WzJdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YW5ub3RhdGlvbktleSA9IGFubm90YXRpb25PZkFubm90YXRpb25TcGxpdFsxXTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcGFyc2VkQW5ub3RhdGlvbk9iamVjdDogYW55ID0ge1xuXHRcdFx0XHR0ZXJtOiBgJHthbm5vdGF0aW9uS2V5fWAsXG5cdFx0XHRcdHF1YWxpZmllcjogcXVhbGlmaWVyXG5cdFx0XHR9O1xuXHRcdFx0bGV0IGN1cnJlbnRBbm5vdGF0aW9uVGFyZ2V0ID0gYW5ub3RhdGlvblRhcmdldCArIFwiQFwiICsgcGFyc2VkQW5ub3RhdGlvbk9iamVjdC50ZXJtO1xuXHRcdFx0aWYgKHF1YWxpZmllcikge1xuXHRcdFx0XHRjdXJyZW50QW5ub3RhdGlvblRhcmdldCArPSBcIiNcIiArIHF1YWxpZmllcjtcblx0XHRcdH1cblx0XHRcdGxldCBpc0NvbGxlY3Rpb24gPSBmYWxzZTtcblx0XHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0ID09PSBudWxsKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiQm9vbFwiLCBCb29sOiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0ID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiU3RyaW5nXCIsIFN0cmluZzogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgYW5ub3RhdGlvbk9iamVjdCA9PT0gXCJib29sZWFuXCIpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJCb29sXCIsIEJvb2w6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJJbnRcIiwgSW50OiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJElmICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJJZlwiLCBJZjogYW5ub3RhdGlvbk9iamVjdC4kSWYgfTtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kQXBwbHkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkFwcGx5XCIsIEFwcGx5OiBhbm5vdGF0aW9uT2JqZWN0LiRBcHBseSwgRnVuY3Rpb246IGFubm90YXRpb25PYmplY3QuJEZ1bmN0aW9uIH07XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIlBhdGhcIiwgUGF0aDogYW5ub3RhdGlvbk9iamVjdC4kUGF0aCB9O1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBbm5vdGF0aW9uUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7XG5cdFx0XHRcdFx0dHlwZTogXCJBbm5vdGF0aW9uUGF0aFwiLFxuXHRcdFx0XHRcdEFubm90YXRpb25QYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRBbm5vdGF0aW9uUGF0aFxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiREZWNpbWFsICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJEZWNpbWFsXCIsIERlY2ltYWw6IHBhcnNlRmxvYXQoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCkgfTtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7XG5cdFx0XHRcdFx0dHlwZTogXCJFbnVtTWVtYmVyXCIsXG5cdFx0XHRcdFx0RW51bU1lbWJlcjpcblx0XHRcdFx0XHRcdHRoaXMubWFwTmFtZVRvQWxpYXMoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlci5zcGxpdChcIi9cIilbMF0pICsgXCIvXCIgKyBhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyLnNwbGl0KFwiL1wiKVsxXVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFubm90YXRpb25PYmplY3QpKSB7XG5cdFx0XHRcdGlzQ29sbGVjdGlvbiA9IHRydWU7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiA9IGFubm90YXRpb25PYmplY3QubWFwKChzdWJBbm5vdGF0aW9uT2JqZWN0LCBzdWJBbm5vdGF0aW9uSW5kZXgpID0+XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUFubm90YXRpb25PYmplY3QoXG5cdFx0XHRcdFx0XHRzdWJBbm5vdGF0aW9uT2JqZWN0LFxuXHRcdFx0XHRcdFx0Y3VycmVudEFubm90YXRpb25UYXJnZXQgKyBcIi9cIiArIHN1YkFubm90YXRpb25JbmRleCxcblx0XHRcdFx0XHRcdGFubm90YXRpb25MaXN0cyxcblx0XHRcdFx0XHRcdG9DYXBhYmlsaXRpZXNcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0Lmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRQcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJQcm9wZXJ0eVBhdGhcIjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkUGF0aFwiKSkge1xuXHRcdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlBhdGhcIjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiKSkge1xuXHRcdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkQW5ub3RhdGlvblBhdGhcIikpIHtcblx0XHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJBbm5vdGF0aW9uUGF0aFwiO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRUeXBlXCIpKSB7XG5cdFx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUmVjb3JkXCI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJElmXCIpKSB7XG5cdFx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiSWZcIjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkQXBwbHlcIikpIHtcblx0XHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJBcHBseVwiO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3RbMF0gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJSZWNvcmRcIjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlN0cmluZ1wiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgcmVjb3JkOiBBbm5vdGF0aW9uUmVjb3JkID0ge1xuXHRcdFx0XHRcdHByb3BlcnR5VmFsdWVzOiBbXVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdC4kVHlwZSkge1xuXHRcdFx0XHRcdGNvbnN0IHR5cGVWYWx1ZSA9IGFubm90YXRpb25PYmplY3QuJFR5cGU7XG5cdFx0XHRcdFx0cmVjb3JkLnR5cGUgPSBgJHt0eXBlVmFsdWV9YDtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBwcm9wZXJ0eVZhbHVlczogYW55W10gPSBbXTtcblx0XHRcdFx0T2JqZWN0LmtleXMoYW5ub3RhdGlvbk9iamVjdCkuZm9yRWFjaChwcm9wZXJ0eUtleSA9PiB7XG5cdFx0XHRcdFx0aWYgKHByb3BlcnR5S2V5ICE9PSBcIiRUeXBlXCIgJiYgIXByb3BlcnR5S2V5LnN0YXJ0c1dpdGgoXCJAXCIpKSB7XG5cdFx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlcy5wdXNoKFxuXHRcdFx0XHRcdFx0XHR0aGlzLnBhcnNlUHJvcGVydHlWYWx1ZShcblx0XHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0W3Byb3BlcnR5S2V5XSxcblx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eUtleSxcblx0XHRcdFx0XHRcdFx0XHRjdXJyZW50QW5ub3RhdGlvblRhcmdldCxcblx0XHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uTGlzdHMsXG5cdFx0XHRcdFx0XHRcdFx0b0NhcGFiaWxpdGllc1xuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHJvcGVydHlLZXkuc3RhcnRzV2l0aChcIkBcIikpIHtcblx0XHRcdFx0XHRcdC8vIEFubm90YXRpb24gb2YgcmVjb3JkXG5cdFx0XHRcdFx0XHR0aGlzLmNyZWF0ZUFubm90YXRpb25MaXN0cyhcblx0XHRcdFx0XHRcdFx0eyBbcHJvcGVydHlLZXldOiBhbm5vdGF0aW9uT2JqZWN0W3Byb3BlcnR5S2V5XSB9LFxuXHRcdFx0XHRcdFx0XHRjdXJyZW50QW5ub3RhdGlvblRhcmdldCxcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbkxpc3RzLFxuXHRcdFx0XHRcdFx0XHRvQ2FwYWJpbGl0aWVzXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJlY29yZC5wcm9wZXJ0eVZhbHVlcyA9IHByb3BlcnR5VmFsdWVzO1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnJlY29yZCA9IHJlY29yZDtcblx0XHRcdH1cblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QuaXNDb2xsZWN0aW9uID0gaXNDb2xsZWN0aW9uO1xuXHRcdFx0Y3VycmVudE91dEFubm90YXRpb25PYmplY3QuYW5ub3RhdGlvbnMucHVzaChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0KTtcblx0XHR9KTtcblx0fSxcblx0cGFyc2VQcm9wZXJ0eShcblx0XHRvTWV0YU1vZGVsOiBhbnksXG5cdFx0ZW50aXR5VHlwZU9iamVjdDogRW50aXR5VHlwZSB8IENvbXBsZXhUeXBlLFxuXHRcdHByb3BlcnR5TmFtZTogc3RyaW5nLFxuXHRcdGFubm90YXRpb25MaXN0czogQW5ub3RhdGlvbkxpc3RbXSxcblx0XHRvQ2FwYWJpbGl0aWVzOiBFbnZpcm9ubWVudENhcGFiaWxpdGllc1xuXHQpOiBQcm9wZXJ0eSB7XG5cdFx0Y29uc3QgcHJvcGVydHlBbm5vdGF0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVR5cGVPYmplY3QuZnVsbHlRdWFsaWZpZWROYW1lfS8ke3Byb3BlcnR5TmFtZX1AYCk7XG5cdFx0Y29uc3QgcHJvcGVydHlEZWZpbml0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVR5cGVPYmplY3QuZnVsbHlRdWFsaWZpZWROYW1lfS8ke3Byb3BlcnR5TmFtZX1gKTtcblxuXHRcdGNvbnN0IHByb3BlcnR5T2JqZWN0OiBQcm9wZXJ0eSA9IHtcblx0XHRcdF90eXBlOiBcIlByb3BlcnR5XCIsXG5cdFx0XHRuYW1lOiBwcm9wZXJ0eU5hbWUsXG5cdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGAke2VudGl0eVR5cGVPYmplY3QuZnVsbHlRdWFsaWZpZWROYW1lfS8ke3Byb3BlcnR5TmFtZX1gLFxuXHRcdFx0dHlwZTogcHJvcGVydHlEZWZpbml0aW9uLiRUeXBlLFxuXHRcdFx0bWF4TGVuZ3RoOiBwcm9wZXJ0eURlZmluaXRpb24uJE1heExlbmd0aCxcblx0XHRcdHByZWNpc2lvbjogcHJvcGVydHlEZWZpbml0aW9uLiRQcmVjaXNpb24sXG5cdFx0XHRzY2FsZTogcHJvcGVydHlEZWZpbml0aW9uLiRTY2FsZSxcblx0XHRcdG51bGxhYmxlOiBwcm9wZXJ0eURlZmluaXRpb24uJE51bGxhYmxlXG5cdFx0fTtcblxuXHRcdHRoaXMuY3JlYXRlQW5ub3RhdGlvbkxpc3RzKHByb3BlcnR5QW5ub3RhdGlvbiwgcHJvcGVydHlPYmplY3QuZnVsbHlRdWFsaWZpZWROYW1lLCBhbm5vdGF0aW9uTGlzdHMsIG9DYXBhYmlsaXRpZXMpO1xuXG5cdFx0cmV0dXJuIHByb3BlcnR5T2JqZWN0O1xuXHR9LFxuXHRwYXJzZU5hdmlnYXRpb25Qcm9wZXJ0eShcblx0XHRvTWV0YU1vZGVsOiBhbnksXG5cdFx0ZW50aXR5VHlwZU9iamVjdDogRW50aXR5VHlwZSB8IENvbXBsZXhUeXBlLFxuXHRcdG5hdlByb3BlcnR5TmFtZTogc3RyaW5nLFxuXHRcdGFubm90YXRpb25MaXN0czogQW5ub3RhdGlvbkxpc3RbXSxcblx0XHRvQ2FwYWJpbGl0aWVzOiBFbnZpcm9ubWVudENhcGFiaWxpdGllc1xuXHQpOiBWNE5hdmlnYXRpb25Qcm9wZXJ0eSB7XG5cdFx0Y29uc3QgbmF2UHJvcGVydHlBbm5vdGF0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVR5cGVPYmplY3QuZnVsbHlRdWFsaWZpZWROYW1lfS8ke25hdlByb3BlcnR5TmFtZX1AYCk7XG5cdFx0Y29uc3QgbmF2UHJvcGVydHlEZWZpbml0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVR5cGVPYmplY3QuZnVsbHlRdWFsaWZpZWROYW1lfS8ke25hdlByb3BlcnR5TmFtZX1gKTtcblxuXHRcdGxldCByZWZlcmVudGlhbENvbnN0cmFpbnQ6IFJlZmVyZW50aWFsQ29uc3RyYWludFtdID0gW107XG5cdFx0aWYgKG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kUmVmZXJlbnRpYWxDb25zdHJhaW50KSB7XG5cdFx0XHRyZWZlcmVudGlhbENvbnN0cmFpbnQgPSBPYmplY3Qua2V5cyhuYXZQcm9wZXJ0eURlZmluaXRpb24uJFJlZmVyZW50aWFsQ29uc3RyYWludCkubWFwKHNvdXJjZVByb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0c291cmNlVHlwZU5hbWU6IGVudGl0eVR5cGVPYmplY3QubmFtZSxcblx0XHRcdFx0XHRzb3VyY2VQcm9wZXJ0eTogc291cmNlUHJvcGVydHlOYW1lLFxuXHRcdFx0XHRcdHRhcmdldFR5cGVOYW1lOiBuYXZQcm9wZXJ0eURlZmluaXRpb24uJFR5cGUsXG5cdFx0XHRcdFx0dGFyZ2V0UHJvcGVydHk6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kUmVmZXJlbnRpYWxDb25zdHJhaW50W3NvdXJjZVByb3BlcnR5TmFtZV1cblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjb25zdCBuYXZpZ2F0aW9uUHJvcGVydHk6IFY0TmF2aWdhdGlvblByb3BlcnR5ID0ge1xuXHRcdFx0X3R5cGU6IFwiTmF2aWdhdGlvblByb3BlcnR5XCIsXG5cdFx0XHRuYW1lOiBuYXZQcm9wZXJ0eU5hbWUsXG5cdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGAke2VudGl0eVR5cGVPYmplY3QuZnVsbHlRdWFsaWZpZWROYW1lfS8ke25hdlByb3BlcnR5TmFtZX1gLFxuXHRcdFx0cGFydG5lcjogbmF2UHJvcGVydHlEZWZpbml0aW9uLiRQYXJ0bmVyLFxuXHRcdFx0aXNDb2xsZWN0aW9uOiBuYXZQcm9wZXJ0eURlZmluaXRpb24uJGlzQ29sbGVjdGlvbiA/IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kaXNDb2xsZWN0aW9uIDogZmFsc2UsXG5cdFx0XHRjb250YWluc1RhcmdldDogbmF2UHJvcGVydHlEZWZpbml0aW9uLiRDb250YWluc1RhcmdldCxcblx0XHRcdHRhcmdldFR5cGVOYW1lOiBuYXZQcm9wZXJ0eURlZmluaXRpb24uJFR5cGUsXG5cdFx0XHRyZWZlcmVudGlhbENvbnN0cmFpbnRcblx0XHR9O1xuXG5cdFx0dGhpcy5jcmVhdGVBbm5vdGF0aW9uTGlzdHMobmF2UHJvcGVydHlBbm5vdGF0aW9uLCBuYXZpZ2F0aW9uUHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lLCBhbm5vdGF0aW9uTGlzdHMsIG9DYXBhYmlsaXRpZXMpO1xuXG5cdFx0cmV0dXJuIG5hdmlnYXRpb25Qcm9wZXJ0eTtcblx0fSxcblx0cGFyc2VFbnRpdHlTZXQoXG5cdFx0b01ldGFNb2RlbDogYW55LFxuXHRcdGVudGl0eVNldE5hbWU6IHN0cmluZyxcblx0XHRhbm5vdGF0aW9uTGlzdHM6IEFubm90YXRpb25MaXN0W10sXG5cdFx0ZW50aXR5Q29udGFpbmVyTmFtZTogc3RyaW5nLFxuXHRcdG9DYXBhYmlsaXRpZXM6IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzXG5cdCk6IEVudGl0eVNldCB7XG5cdFx0Y29uc3QgZW50aXR5U2V0RGVmaW5pdGlvbiA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtlbnRpdHlTZXROYW1lfWApO1xuXHRcdGNvbnN0IGVudGl0eVNldEFubm90YXRpb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7ZW50aXR5U2V0TmFtZX1AYCk7XG5cdFx0Y29uc3QgZW50aXR5U2V0T2JqZWN0OiBFbnRpdHlTZXQgPSB7XG5cdFx0XHRfdHlwZTogXCJFbnRpdHlTZXRcIixcblx0XHRcdG5hbWU6IGVudGl0eVNldE5hbWUsXG5cdFx0XHRuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nOiB7fSxcblx0XHRcdGVudGl0eVR5cGVOYW1lOiBlbnRpdHlTZXREZWZpbml0aW9uLiRUeXBlLFxuXHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBgJHtlbnRpdHlDb250YWluZXJOYW1lfS8ke2VudGl0eVNldE5hbWV9YFxuXHRcdH07XG5cdFx0dGhpcy5jcmVhdGVBbm5vdGF0aW9uTGlzdHMoZW50aXR5U2V0QW5ub3RhdGlvbiwgZW50aXR5U2V0T2JqZWN0LmZ1bGx5UXVhbGlmaWVkTmFtZSwgYW5ub3RhdGlvbkxpc3RzLCBvQ2FwYWJpbGl0aWVzKTtcblx0XHRyZXR1cm4gZW50aXR5U2V0T2JqZWN0O1xuXHR9LFxuXG5cdHBhcnNlRW50aXR5VHlwZShcblx0XHRvTWV0YU1vZGVsOiBhbnksXG5cdFx0ZW50aXR5VHlwZU5hbWU6IHN0cmluZyxcblx0XHRhbm5vdGF0aW9uTGlzdHM6IEFubm90YXRpb25MaXN0W10sXG5cdFx0bmFtZXNwYWNlOiBzdHJpbmcsXG5cdFx0b0NhcGFiaWxpdGllczogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNcblx0KTogRW50aXR5VHlwZSB7XG5cdFx0Y29uc3QgZW50aXR5VHlwZUFubm90YXRpb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7ZW50aXR5VHlwZU5hbWV9QGApO1xuXHRcdGNvbnN0IGVudGl0eVR5cGVEZWZpbml0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVR5cGVOYW1lfWApO1xuXHRcdGNvbnN0IGVudGl0eUtleXMgPSBlbnRpdHlUeXBlRGVmaW5pdGlvbi4kS2V5IHx8IFtdO1xuXHRcdGNvbnN0IGVudGl0eVR5cGVPYmplY3Q6IEVudGl0eVR5cGUgPSB7XG5cdFx0XHRfdHlwZTogXCJFbnRpdHlUeXBlXCIsXG5cdFx0XHRuYW1lOiBlbnRpdHlUeXBlTmFtZS5yZXBsYWNlKG5hbWVzcGFjZSArIFwiLlwiLCBcIlwiKSxcblx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogZW50aXR5VHlwZU5hbWUsXG5cdFx0XHRrZXlzOiBbXSxcblx0XHRcdGVudGl0eVByb3BlcnRpZXM6IFtdLFxuXHRcdFx0bmF2aWdhdGlvblByb3BlcnRpZXM6IFtdXG5cdFx0fTtcblxuXHRcdHRoaXMuY3JlYXRlQW5ub3RhdGlvbkxpc3RzKGVudGl0eVR5cGVBbm5vdGF0aW9uLCBlbnRpdHlUeXBlT2JqZWN0LmZ1bGx5UXVhbGlmaWVkTmFtZSwgYW5ub3RhdGlvbkxpc3RzLCBvQ2FwYWJpbGl0aWVzKTtcblx0XHRjb25zdCBlbnRpdHlQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoZW50aXR5VHlwZURlZmluaXRpb24pXG5cdFx0XHQuZmlsdGVyKHByb3BlcnR5TmFtZU9yTm90ID0+IHtcblx0XHRcdFx0aWYgKHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJEtleVwiICYmIHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJGtpbmRcIikge1xuXHRcdFx0XHRcdHJldHVybiBlbnRpdHlUeXBlRGVmaW5pdGlvbltwcm9wZXJ0eU5hbWVPck5vdF0uJGtpbmQgPT09IFwiUHJvcGVydHlcIjtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5tYXAocHJvcGVydHlOYW1lID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFyc2VQcm9wZXJ0eShvTWV0YU1vZGVsLCBlbnRpdHlUeXBlT2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFubm90YXRpb25MaXN0cywgb0NhcGFiaWxpdGllcyk7XG5cdFx0XHR9KTtcblxuXHRcdGNvbnN0IG5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoZW50aXR5VHlwZURlZmluaXRpb24pXG5cdFx0XHQuZmlsdGVyKHByb3BlcnR5TmFtZU9yTm90ID0+IHtcblx0XHRcdFx0aWYgKHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJEtleVwiICYmIHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJGtpbmRcIikge1xuXHRcdFx0XHRcdHJldHVybiBlbnRpdHlUeXBlRGVmaW5pdGlvbltwcm9wZXJ0eU5hbWVPck5vdF0uJGtpbmQgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCI7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQubWFwKG5hdlByb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBhcnNlTmF2aWdhdGlvblByb3BlcnR5KG9NZXRhTW9kZWwsIGVudGl0eVR5cGVPYmplY3QsIG5hdlByb3BlcnR5TmFtZSwgYW5ub3RhdGlvbkxpc3RzLCBvQ2FwYWJpbGl0aWVzKTtcblx0XHRcdH0pO1xuXG5cdFx0ZW50aXR5VHlwZU9iamVjdC5rZXlzID0gZW50aXR5S2V5c1xuXHRcdFx0Lm1hcCgoZW50aXR5S2V5OiBzdHJpbmcpID0+IGVudGl0eVByb3BlcnRpZXMuZmluZCgocHJvcGVydHk6IFByb3BlcnR5KSA9PiBwcm9wZXJ0eS5uYW1lID09PSBlbnRpdHlLZXkpKVxuXHRcdFx0LmZpbHRlcigocHJvcGVydHk6IFByb3BlcnR5KSA9PiBwcm9wZXJ0eSAhPT0gdW5kZWZpbmVkKTtcblx0XHRlbnRpdHlUeXBlT2JqZWN0LmVudGl0eVByb3BlcnRpZXMgPSBlbnRpdHlQcm9wZXJ0aWVzO1xuXHRcdGVudGl0eVR5cGVPYmplY3QubmF2aWdhdGlvblByb3BlcnRpZXMgPSBuYXZpZ2F0aW9uUHJvcGVydGllcztcblxuXHRcdHJldHVybiBlbnRpdHlUeXBlT2JqZWN0O1xuXHR9LFxuXHRwYXJzZUNvbXBsZXhUeXBlKFxuXHRcdG9NZXRhTW9kZWw6IGFueSxcblx0XHRjb21wbGV4VHlwZU5hbWU6IHN0cmluZyxcblx0XHRhbm5vdGF0aW9uTGlzdHM6IEFubm90YXRpb25MaXN0W10sXG5cdFx0bmFtZXNwYWNlOiBzdHJpbmcsXG5cdFx0b0NhcGFiaWxpdGllczogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNcblx0KTogQ29tcGxleFR5cGUge1xuXHRcdGNvbnN0IGNvbXBsZXhUeXBlQW5ub3RhdGlvbiA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtjb21wbGV4VHlwZU5hbWV9QGApO1xuXHRcdGNvbnN0IGNvbXBsZXhUeXBlRGVmaW5pdGlvbiA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtjb21wbGV4VHlwZU5hbWV9YCk7XG5cdFx0Y29uc3QgY29tcGxleFR5cGVPYmplY3Q6IENvbXBsZXhUeXBlID0ge1xuXHRcdFx0X3R5cGU6IFwiQ29tcGxleFR5cGVcIixcblx0XHRcdG5hbWU6IGNvbXBsZXhUeXBlTmFtZS5yZXBsYWNlKG5hbWVzcGFjZSArIFwiLlwiLCBcIlwiKSxcblx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogY29tcGxleFR5cGVOYW1lLFxuXHRcdFx0cHJvcGVydGllczogW10sXG5cdFx0XHRuYXZpZ2F0aW9uUHJvcGVydGllczogW11cblx0XHR9O1xuXG5cdFx0dGhpcy5jcmVhdGVBbm5vdGF0aW9uTGlzdHMoY29tcGxleFR5cGVBbm5vdGF0aW9uLCBjb21wbGV4VHlwZU9iamVjdC5mdWxseVF1YWxpZmllZE5hbWUsIGFubm90YXRpb25MaXN0cywgb0NhcGFiaWxpdGllcyk7XG5cdFx0Y29uc3QgY29tcGxleFR5cGVQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoY29tcGxleFR5cGVEZWZpbml0aW9uKVxuXHRcdFx0LmZpbHRlcihwcm9wZXJ0eU5hbWVPck5vdCA9PiB7XG5cdFx0XHRcdGlmIChwcm9wZXJ0eU5hbWVPck5vdCAhPSBcIiRLZXlcIiAmJiBwcm9wZXJ0eU5hbWVPck5vdCAhPSBcIiRraW5kXCIpIHtcblx0XHRcdFx0XHRyZXR1cm4gY29tcGxleFR5cGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZU9yTm90XS4ka2luZCA9PT0gXCJQcm9wZXJ0eVwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0Lm1hcChwcm9wZXJ0eU5hbWUgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYXJzZVByb3BlcnR5KG9NZXRhTW9kZWwsIGNvbXBsZXhUeXBlT2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFubm90YXRpb25MaXN0cywgb0NhcGFiaWxpdGllcyk7XG5cdFx0XHR9KTtcblxuXHRcdGNvbXBsZXhUeXBlT2JqZWN0LnByb3BlcnRpZXMgPSBjb21wbGV4VHlwZVByb3BlcnRpZXM7XG5cdFx0Y29uc3QgY29tcGxleFR5cGVOYXZpZ2F0aW9uUHJvcGVydGllcyA9IE9iamVjdC5rZXlzKGNvbXBsZXhUeXBlRGVmaW5pdGlvbilcblx0XHRcdC5maWx0ZXIocHJvcGVydHlOYW1lT3JOb3QgPT4ge1xuXHRcdFx0XHRpZiAocHJvcGVydHlOYW1lT3JOb3QgIT0gXCIkS2V5XCIgJiYgcHJvcGVydHlOYW1lT3JOb3QgIT0gXCIka2luZFwiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGNvbXBsZXhUeXBlRGVmaW5pdGlvbltwcm9wZXJ0eU5hbWVPck5vdF0uJGtpbmQgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCI7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQubWFwKG5hdlByb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBhcnNlTmF2aWdhdGlvblByb3BlcnR5KG9NZXRhTW9kZWwsIGNvbXBsZXhUeXBlT2JqZWN0LCBuYXZQcm9wZXJ0eU5hbWUsIGFubm90YXRpb25MaXN0cywgb0NhcGFiaWxpdGllcyk7XG5cdFx0XHR9KTtcblx0XHRjb21wbGV4VHlwZU9iamVjdC5uYXZpZ2F0aW9uUHJvcGVydGllcyA9IGNvbXBsZXhUeXBlTmF2aWdhdGlvblByb3BlcnRpZXM7XG5cdFx0cmV0dXJuIGNvbXBsZXhUeXBlT2JqZWN0O1xuXHR9LFxuXHRwYXJzZUFjdGlvbihhY3Rpb25OYW1lOiBzdHJpbmcsIGFjdGlvblJhd0RhdGE6IE1ldGFNb2RlbEFjdGlvbiwgbmFtZXNwYWNlOiBzdHJpbmcsIGVudGl0eUNvbnRhaW5lck5hbWU6IHN0cmluZyk6IEFjdGlvbiB7XG5cdFx0bGV0IGFjdGlvbkVudGl0eVR5cGU6IHN0cmluZyA9IFwiXCI7XG5cdFx0bGV0IGFjdGlvbkZRTiA9IGAke2FjdGlvbk5hbWV9YDtcblx0XHRjb25zdCBhY3Rpb25TaG9ydE5hbWUgPSBhY3Rpb25OYW1lLnN1YnN0cihuYW1lc3BhY2UubGVuZ3RoICsgMSk7XG5cdFx0aWYgKGFjdGlvblJhd0RhdGEuJElzQm91bmQpIHtcblx0XHRcdGNvbnN0IGJpbmRpbmdQYXJhbWV0ZXIgPSBhY3Rpb25SYXdEYXRhLiRQYXJhbWV0ZXJbMF07XG5cdFx0XHRhY3Rpb25FbnRpdHlUeXBlID0gYmluZGluZ1BhcmFtZXRlci4kVHlwZTtcblx0XHRcdGlmIChiaW5kaW5nUGFyYW1ldGVyLiRpc0NvbGxlY3Rpb24gPT09IHRydWUpIHtcblx0XHRcdFx0YWN0aW9uRlFOID0gYCR7YWN0aW9uTmFtZX0oQ29sbGVjdGlvbigke2FjdGlvbkVudGl0eVR5cGV9KSlgO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWN0aW9uRlFOID0gYCR7YWN0aW9uTmFtZX0oJHthY3Rpb25FbnRpdHlUeXBlfSlgO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRhY3Rpb25GUU4gPSBgJHtlbnRpdHlDb250YWluZXJOYW1lfS8ke2FjdGlvblNob3J0TmFtZX1gO1xuXHRcdH1cblx0XHRjb25zdCBwYXJhbWV0ZXJzID0gYWN0aW9uUmF3RGF0YS4kUGFyYW1ldGVyIHx8IFtdO1xuXHRcdHJldHVybiB7XG5cdFx0XHRfdHlwZTogXCJBY3Rpb25cIixcblx0XHRcdG5hbWU6IGFjdGlvblNob3J0TmFtZSxcblx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYWN0aW9uRlFOLFxuXHRcdFx0aXNCb3VuZDogYWN0aW9uUmF3RGF0YS4kSXNCb3VuZCxcblx0XHRcdHNvdXJjZVR5cGU6IGFjdGlvbkVudGl0eVR5cGUsXG5cdFx0XHRyZXR1cm5UeXBlOiBhY3Rpb25SYXdEYXRhLiRSZXR1cm5UeXBlID8gYWN0aW9uUmF3RGF0YS4kUmV0dXJuVHlwZS4kVHlwZSA6IFwiXCIsXG5cdFx0XHRwYXJhbWV0ZXJzOiBwYXJhbWV0ZXJzLm1hcChwYXJhbSA9PiB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0X3R5cGU6IFwiQWN0aW9uUGFyYW1ldGVyXCIsXG5cdFx0XHRcdFx0aXNFbnRpdHlTZXQ6IHBhcmFtLiRUeXBlID09PSBhY3Rpb25SYXdEYXRhLiRFbnRpdHlTZXRQYXRoLFxuXHRcdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7YWN0aW9uRlFOfS8ke3BhcmFtLiROYW1lfWAsXG5cdFx0XHRcdFx0dHlwZTogcGFyYW0uJFR5cGVcblx0XHRcdFx0XHQvLyBUT0RPIG1pc3NpbmcgcHJvcGVydGllcyA/XG5cdFx0XHRcdH07XG5cdFx0XHR9KVxuXHRcdH07XG5cdH0sXG5cdHBhcnNlRW50aXR5VHlwZXMob01ldGFNb2RlbDogYW55LCBvSW5DYXBhYmlsaXRpZXM/OiBFbnZpcm9ubWVudENhcGFiaWxpdGllcyk6IFBhcnNlck91dHB1dCB7XG5cdFx0bGV0IG9DYXBhYmlsaXRpZXM6IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzO1xuXHRcdGlmICghb0luQ2FwYWJpbGl0aWVzKSB7XG5cdFx0XHRvQ2FwYWJpbGl0aWVzID0gRGVmYXVsdEVudmlyb25tZW50Q2FwYWJpbGl0aWVzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvQ2FwYWJpbGl0aWVzID0gb0luQ2FwYWJpbGl0aWVzO1xuXHRcdH1cblx0XHRjb25zdCBvTWV0YU1vZGVsRGF0YSA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KFwiLyRcIik7XG5cdFx0Y29uc3Qgb0VudGl0eVNldHMgPSBvTWV0YU1vZGVsLmdldE9iamVjdChcIi9cIik7XG5cdFx0bGV0IGFubm90YXRpb25MaXN0czogQW5ub3RhdGlvbkxpc3RbXSA9IFtdO1xuXHRcdGNvbnN0IGVudGl0eVR5cGVzOiBFbnRpdHlUeXBlW10gPSBbXTtcblx0XHRjb25zdCBlbnRpdHlTZXRzOiBFbnRpdHlTZXRbXSA9IFtdO1xuXHRcdGNvbnN0IGNvbXBsZXhUeXBlczogQ29tcGxleFR5cGVbXSA9IFtdO1xuXHRcdGNvbnN0IGVudGl0eUNvbnRhaW5lck5hbWUgPSBvTWV0YU1vZGVsRGF0YS4kRW50aXR5Q29udGFpbmVyO1xuXHRcdGxldCBuYW1lc3BhY2UgPSBcIlwiO1xuXHRcdGNvbnN0IHNjaGVtYUtleXMgPSBPYmplY3Qua2V5cyhvTWV0YU1vZGVsRGF0YSkuZmlsdGVyKG1ldGFtb2RlbEtleSA9PiBvTWV0YU1vZGVsRGF0YVttZXRhbW9kZWxLZXldLiRraW5kID09PSBcIlNjaGVtYVwiKTtcblx0XHRpZiAoc2NoZW1hS2V5cyAmJiBzY2hlbWFLZXlzLmxlbmd0aCA+IDApIHtcblx0XHRcdG5hbWVzcGFjZSA9IHNjaGVtYUtleXNbMF0uc3Vic3RyKDAsIHNjaGVtYUtleXNbMF0ubGVuZ3RoIC0gMSk7XG5cdFx0fSBlbHNlIGlmIChlbnRpdHlUeXBlcyAmJiBlbnRpdHlUeXBlcy5sZW5ndGgpIHtcblx0XHRcdG5hbWVzcGFjZSA9IGVudGl0eVR5cGVzWzBdLmZ1bGx5UXVhbGlmaWVkTmFtZS5yZXBsYWNlKGVudGl0eVR5cGVzWzBdLm5hbWUsIFwiXCIpO1xuXHRcdFx0bmFtZXNwYWNlID0gbmFtZXNwYWNlLnN1YnN0cigwLCBuYW1lc3BhY2UubGVuZ3RoIC0gMSk7XG5cdFx0fVxuXG5cdFx0T2JqZWN0LmtleXMob01ldGFNb2RlbERhdGEpXG5cdFx0XHQuZmlsdGVyKGVudGl0eVR5cGVOYW1lID0+IHtcblx0XHRcdFx0cmV0dXJuIGVudGl0eVR5cGVOYW1lICE9PSBcIiRraW5kXCIgJiYgb01ldGFNb2RlbERhdGFbZW50aXR5VHlwZU5hbWVdLiRraW5kID09PSBcIkVudGl0eVR5cGVcIjtcblx0XHRcdH0pXG5cdFx0XHQuZm9yRWFjaChlbnRpdHlUeXBlTmFtZSA9PiB7XG5cdFx0XHRcdGNvbnN0IGVudGl0eVR5cGUgPSB0aGlzLnBhcnNlRW50aXR5VHlwZShvTWV0YU1vZGVsLCBlbnRpdHlUeXBlTmFtZSwgYW5ub3RhdGlvbkxpc3RzLCBuYW1lc3BhY2UsIG9DYXBhYmlsaXRpZXMpO1xuXHRcdFx0XHRlbnRpdHlUeXBlcy5wdXNoKGVudGl0eVR5cGUpO1xuXHRcdFx0fSk7XG5cdFx0T2JqZWN0LmtleXMob0VudGl0eVNldHMpXG5cdFx0XHQuZmlsdGVyKGVudGl0eVNldE5hbWUgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZW50aXR5U2V0TmFtZSAhPT0gXCIka2luZFwiICYmIG9FbnRpdHlTZXRzW2VudGl0eVNldE5hbWVdLiRraW5kID09PSBcIkVudGl0eVNldFwiO1xuXHRcdFx0fSlcblx0XHRcdC5mb3JFYWNoKGVudGl0eVNldE5hbWUgPT4ge1xuXHRcdFx0XHRjb25zdCBlbnRpdHlTZXQgPSB0aGlzLnBhcnNlRW50aXR5U2V0KG9NZXRhTW9kZWwsIGVudGl0eVNldE5hbWUsIGFubm90YXRpb25MaXN0cywgZW50aXR5Q29udGFpbmVyTmFtZSwgb0NhcGFiaWxpdGllcyk7XG5cdFx0XHRcdGVudGl0eVNldHMucHVzaChlbnRpdHlTZXQpO1xuXHRcdFx0fSk7XG5cdFx0T2JqZWN0LmtleXMob01ldGFNb2RlbERhdGEpXG5cdFx0XHQuZmlsdGVyKGNvbXBsZXhUeXBlTmFtZSA9PiB7XG5cdFx0XHRcdHJldHVybiBjb21wbGV4VHlwZU5hbWUgIT09IFwiJGtpbmRcIiAmJiBvTWV0YU1vZGVsRGF0YVtjb21wbGV4VHlwZU5hbWVdLiRraW5kID09PSBcIkNvbXBsZXhUeXBlXCI7XG5cdFx0XHR9KVxuXHRcdFx0LmZvckVhY2goY29tcGxleFR5cGVOYW1lID0+IHtcblx0XHRcdFx0Y29uc3QgY29tcGxleFR5cGUgPSB0aGlzLnBhcnNlQ29tcGxleFR5cGUob01ldGFNb2RlbCwgY29tcGxleFR5cGVOYW1lLCBhbm5vdGF0aW9uTGlzdHMsIG5hbWVzcGFjZSwgb0NhcGFiaWxpdGllcyk7XG5cdFx0XHRcdGNvbXBsZXhUeXBlcy5wdXNoKGNvbXBsZXhUeXBlKTtcblx0XHRcdH0pO1xuXHRcdGNvbnN0IG9FbnRpdHlDb250YWluZXJOYW1lID0gT2JqZWN0LmtleXMob01ldGFNb2RlbERhdGEpLmZpbmQoZW50aXR5Q29udGFpbmVyTmFtZSA9PiB7XG5cdFx0XHRyZXR1cm4gZW50aXR5Q29udGFpbmVyTmFtZSAhPT0gXCIka2luZFwiICYmIG9NZXRhTW9kZWxEYXRhW2VudGl0eUNvbnRhaW5lck5hbWVdLiRraW5kID09PSBcIkVudGl0eUNvbnRhaW5lclwiO1xuXHRcdH0pO1xuXHRcdGxldCBlbnRpdHlDb250YWluZXI6IEVudGl0eUNvbnRhaW5lciA9IHt9O1xuXHRcdGlmIChvRW50aXR5Q29udGFpbmVyTmFtZSkge1xuXHRcdFx0ZW50aXR5Q29udGFpbmVyID0ge1xuXHRcdFx0XHRuYW1lOiBvRW50aXR5Q29udGFpbmVyTmFtZS5yZXBsYWNlKG5hbWVzcGFjZSArIFwiLlwiLCBcIlwiKSxcblx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBvRW50aXR5Q29udGFpbmVyTmFtZVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0ZW50aXR5U2V0cy5mb3JFYWNoKGVudGl0eVNldCA9PiB7XG5cdFx0XHRjb25zdCBuYXZQcm9wZXJ0eUJpbmRpbmdzID0gb01ldGFNb2RlbERhdGFbZW50aXR5Q29udGFpbmVyTmFtZV1bZW50aXR5U2V0Lm5hbWVdLiROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nO1xuXHRcdFx0aWYgKG5hdlByb3BlcnR5QmluZGluZ3MpIHtcblx0XHRcdFx0T2JqZWN0LmtleXMobmF2UHJvcGVydHlCaW5kaW5ncykuZm9yRWFjaChuYXZQcm9wTmFtZSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdGFyZ2V0RW50aXR5U2V0ID0gZW50aXR5U2V0cy5maW5kKGVudGl0eVNldE5hbWUgPT4gZW50aXR5U2V0TmFtZS5uYW1lID09PSBuYXZQcm9wZXJ0eUJpbmRpbmdzW25hdlByb3BOYW1lXSk7XG5cdFx0XHRcdFx0aWYgKHRhcmdldEVudGl0eVNldCkge1xuXHRcdFx0XHRcdFx0ZW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdbbmF2UHJvcE5hbWVdID0gdGFyZ2V0RW50aXR5U2V0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRjb25zdCBhY3Rpb25zOiBBY3Rpb25bXSA9IE9iamVjdC5rZXlzKG9NZXRhTW9kZWxEYXRhKVxuXHRcdFx0LmZpbHRlcihrZXkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gQXJyYXkuaXNBcnJheShvTWV0YU1vZGVsRGF0YVtrZXldKSAmJiBvTWV0YU1vZGVsRGF0YVtrZXldLmxlbmd0aCA+IDAgJiYgb01ldGFNb2RlbERhdGFba2V5XVswXS4ka2luZCA9PT0gXCJBY3Rpb25cIjtcblx0XHRcdH0pXG5cdFx0XHQucmVkdWNlKChvdXRBY3Rpb25zOiBBY3Rpb25bXSwgYWN0aW9uTmFtZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBhY3Rpb25zID0gb01ldGFNb2RlbERhdGFbYWN0aW9uTmFtZV07XG5cdFx0XHRcdGFjdGlvbnMuZm9yRWFjaCgoYWN0aW9uOiBNZXRhTW9kZWxBY3Rpb24pID0+IHtcblx0XHRcdFx0XHRvdXRBY3Rpb25zLnB1c2godGhpcy5wYXJzZUFjdGlvbihhY3Rpb25OYW1lLCBhY3Rpb24sIG5hbWVzcGFjZSwgZW50aXR5Q29udGFpbmVyTmFtZSkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIG91dEFjdGlvbnM7XG5cdFx0XHR9LCBbXSk7XG5cdFx0Ly8gRklYTUUgQ3JhcHB5IGNvZGUgdG8gZGVhbCB3aXRoIGFubm90YXRpb25zIGZvciBmdW5jdGlvbnNcblx0XHRjb25zdCBhbm5vdGF0aW9ucyA9IG9NZXRhTW9kZWxEYXRhLiRBbm5vdGF0aW9ucztcblx0XHRjb25zdCBhY3Rpb25Bbm5vdGF0aW9ucyA9IE9iamVjdC5rZXlzKGFubm90YXRpb25zKS5maWx0ZXIodGFyZ2V0ID0+IHRhcmdldC5pbmRleE9mKFwiKFwiKSAhPT0gLTEpO1xuXHRcdGFjdGlvbkFubm90YXRpb25zLmZvckVhY2godGFyZ2V0ID0+IHtcblx0XHRcdHRoaXMuY3JlYXRlQW5ub3RhdGlvbkxpc3RzKG9NZXRhTW9kZWxEYXRhLiRBbm5vdGF0aW9uc1t0YXJnZXRdLCB0YXJnZXQsIGFubm90YXRpb25MaXN0cywgb0NhcGFiaWxpdGllcyk7XG5cdFx0fSk7XG5cdFx0Y29uc3QgZW50aXR5Q29udGFpbmVyQW5ub3RhdGlvbnMgPSBhbm5vdGF0aW9uc1tlbnRpdHlDb250YWluZXJOYW1lXTtcblxuXHRcdC8vIFJldHJpZXZlIEVudGl0eSBDb250YWluZXIgYW5ub3RhdGlvbnNcblx0XHRpZiAoZW50aXR5Q29udGFpbmVyQW5ub3RhdGlvbnMpIHtcblx0XHRcdHRoaXMuY3JlYXRlQW5ub3RhdGlvbkxpc3RzKGVudGl0eUNvbnRhaW5lckFubm90YXRpb25zLCBlbnRpdHlDb250YWluZXJOYW1lLCBhbm5vdGF0aW9uTGlzdHMsIG9DYXBhYmlsaXRpZXMpO1xuXHRcdH1cblx0XHQvLyBTb3J0IGJ5IHRhcmdldCBsZW5ndGhcblx0XHRhbm5vdGF0aW9uTGlzdHMgPSBhbm5vdGF0aW9uTGlzdHMuc29ydCgoYSwgYikgPT4gKGEudGFyZ2V0Lmxlbmd0aCA+PSBiLnRhcmdldC5sZW5ndGggPyAxIDogLTEpKTtcblx0XHRjb25zdCByZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xuXHRcdHJldHVybiB7XG5cdFx0XHRpZGVudGlmaWNhdGlvbjogXCJtZXRhbW9kZWxSZXN1bHRcIixcblx0XHRcdHZlcnNpb246IFwiNC4wXCIsXG5cdFx0XHRzY2hlbWE6IHtcblx0XHRcdFx0ZW50aXR5Q29udGFpbmVyLFxuXHRcdFx0XHRlbnRpdHlTZXRzLFxuXHRcdFx0XHRlbnRpdHlUeXBlcyxcblx0XHRcdFx0Y29tcGxleFR5cGVzLFxuXHRcdFx0XHRhc3NvY2lhdGlvbnM6IFtdLFxuXHRcdFx0XHRhY3Rpb25zLFxuXHRcdFx0XHRuYW1lc3BhY2UsXG5cdFx0XHRcdGFubm90YXRpb25zOiB7XG5cdFx0XHRcdFx0XCJtZXRhbW9kZWxSZXN1bHRcIjogYW5ub3RhdGlvbkxpc3RzXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRyZWZlcmVuY2VzOiByZWZlcmVuY2VzXG5cdFx0fTtcblx0fVxufTtcblxuY29uc3QgbU1ldGFNb2RlbE1hcDogUmVjb3JkPHN0cmluZywgUGFyc2VyT3V0cHV0PiA9IHt9O1xuXG4vKipcbiAqIENvbnZlcnQgdGhlIE9EYXRhTWV0YU1vZGVsIGludG8gYW5vdGhlciBmb3JtYXQgdGhhdCBhbGxvdyBmb3IgZWFzeSBtYW5pcHVsYXRpb24gb2YgdGhlIGFubm90YXRpb25zLlxuICpcbiAqIEBwYXJhbSB7T0RhdGFNZXRhTW9kZWx9IG9NZXRhTW9kZWwgdGhlIGN1cnJlbnQgb0RhdGFNZXRhTW9kZWxcbiAqIEBwYXJhbSBvQ2FwYWJpbGl0aWVzIHRoZSBjdXJyZW50IGNhcGFiaWxpdGllc1xuICogQHJldHVybnMge0NvbnZlcnRlck91dHB1dH0gYW4gb2JqZWN0IGNvbnRhaW5pbmcgb2JqZWN0IGxpa2UgYW5ub3RhdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFR5cGVzKG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsLCBvQ2FwYWJpbGl0aWVzPzogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMpOiBDb252ZXJ0ZXJPdXRwdXQge1xuXHRjb25zdCBzTWV0YU1vZGVsSWQgPSAob01ldGFNb2RlbCBhcyBhbnkpLmlkO1xuXHRpZiAoIW1NZXRhTW9kZWxNYXAuaGFzT3duUHJvcGVydHkoc01ldGFNb2RlbElkKSkge1xuXHRcdGNvbnN0IHBhcnNlZE91dHB1dCA9IE1ldGFNb2RlbENvbnZlcnRlci5wYXJzZUVudGl0eVR5cGVzKG9NZXRhTW9kZWwsIG9DYXBhYmlsaXRpZXMpO1xuXHRcdG1NZXRhTW9kZWxNYXBbc01ldGFNb2RlbElkXSA9IEFubm90YXRpb25Db252ZXJ0ZXIuY29udmVydFR5cGVzKHBhcnNlZE91dHB1dCk7XG5cdH1cblx0cmV0dXJuIChtTWV0YU1vZGVsTWFwW3NNZXRhTW9kZWxJZF0gYXMgYW55KSBhcyBDb252ZXJ0ZXJPdXRwdXQ7XG59XG5cbmNvbnN0IHBhdGhCYXNlZFJlc29sdXRpb246IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0TWV0YU1vZGVsQ29udGV4dChvTWV0YU1vZGVsQ29udGV4dDogQ29udGV4dCwgYkluY2x1ZGVWaXNpdGVkT2JqZWN0czogYm9vbGVhbiA9IGZhbHNlKTogYW55IHtcblx0Y29uc3Qgb0NvbnZlcnRlck91dHB1dCA9IGNvbnZlcnRUeXBlcygob01ldGFNb2RlbENvbnRleHQuZ2V0TW9kZWwoKSBhcyB1bmtub3duKSBhcyBPRGF0YU1ldGFNb2RlbCk7XG5cdGNvbnN0IHNQYXRoID0gb01ldGFNb2RlbENvbnRleHQuZ2V0UGF0aCgpO1xuXHRpZiAoIWJJbmNsdWRlVmlzaXRlZE9iamVjdHMgJiYgcGF0aEJhc2VkUmVzb2x1dGlvbi5oYXNPd25Qcm9wZXJ0eShzUGF0aCkpIHtcblx0XHRyZXR1cm4gcGF0aEJhc2VkUmVzb2x1dGlvbltzUGF0aF07XG5cdH1cblx0Y29uc3QgYVBhdGhTcGxpdCA9IHNQYXRoLnNwbGl0KFwiL1wiKTtcblx0bGV0IHRhcmdldEVudGl0eVNldDogX0VudGl0eVNldCA9IG9Db252ZXJ0ZXJPdXRwdXQuZW50aXR5U2V0cy5maW5kKGVudGl0eVNldCA9PiBlbnRpdHlTZXQubmFtZSA9PT0gYVBhdGhTcGxpdFsxXSkgYXMgX0VudGl0eVNldDtcblx0bGV0IHJlbGF0aXZlUGF0aCA9IGFQYXRoU3BsaXQuc2xpY2UoMikuam9pbihcIi9cIik7XG5cblx0Y29uc3QgbG9jYWxPYmplY3RzOiBhbnlbXSA9IFt0YXJnZXRFbnRpdHlTZXRdO1xuXHR3aGlsZSAocmVsYXRpdmVQYXRoICYmIHJlbGF0aXZlUGF0aC5sZW5ndGggPiAwICYmIHJlbGF0aXZlUGF0aC5zdGFydHNXaXRoKFwiJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIikpIHtcblx0XHRjb25zdCByZWxhdGl2ZVNwbGl0ID0gcmVsYXRpdmVQYXRoLnNwbGl0KFwiL1wiKTtcblx0XHRjb25zdCB0YXJnZXROYXZQcm9wID0gdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMuZmluZChuYXZQcm9wID0+IG5hdlByb3AubmFtZSA9PT0gcmVsYXRpdmVTcGxpdFsxXSk7XG5cdFx0aWYgKHRhcmdldE5hdlByb3ApIHtcblx0XHRcdGxvY2FsT2JqZWN0cy5wdXNoKHRhcmdldE5hdlByb3ApO1xuXHRcdH1cblx0XHR0YXJnZXRFbnRpdHlTZXQgPSB0YXJnZXRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tyZWxhdGl2ZVNwbGl0WzFdXTtcblx0XHRsb2NhbE9iamVjdHMucHVzaCh0YXJnZXRFbnRpdHlTZXQpO1xuXHRcdHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlU3BsaXQuc2xpY2UoMikuam9pbihcIi9cIik7XG5cdH1cblx0aWYgKHJlbGF0aXZlUGF0aC5zdGFydHNXaXRoKFwiJFR5cGVcIikpIHtcblx0XHQvLyBXZSdyZSBhbnl3YXkgZ29pbmcgdG8gbG9vayBvbiB0aGUgZW50aXR5VHlwZS4uLlxuXHRcdHJlbGF0aXZlUGF0aCA9IGFQYXRoU3BsaXQuc2xpY2UoMykuam9pbihcIi9cIik7XG5cdH1cblx0aWYgKHRhcmdldEVudGl0eVNldCAmJiByZWxhdGl2ZVBhdGgubGVuZ3RoKSB7XG5cdFx0Y29uc3Qgb1RhcmdldCA9IHRhcmdldEVudGl0eVNldC5lbnRpdHlUeXBlLnJlc29sdmVQYXRoKHJlbGF0aXZlUGF0aCwgYkluY2x1ZGVWaXNpdGVkT2JqZWN0cyk7XG5cdFx0aWYgKG9UYXJnZXQpIHtcblx0XHRcdGlmIChiSW5jbHVkZVZpc2l0ZWRPYmplY3RzKSB7XG5cdFx0XHRcdG9UYXJnZXQudmlzaXRlZE9iamVjdHMgPSBsb2NhbE9iamVjdHMuY29uY2F0KG9UYXJnZXQudmlzaXRlZE9iamVjdHMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGF0aEJhc2VkUmVzb2x1dGlvbltzUGF0aF0gPSBvVGFyZ2V0O1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUgJiYgdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUuYWN0aW9ucykge1xuXHRcdFx0Ly8gaWYgdGFyZ2V0IGlzIGFuIGFjdGlvbiBvciBhbiBhY3Rpb24gcGFyYW1ldGVyXG5cdFx0XHRjb25zdCBhY3Rpb25zID0gdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUgJiYgdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUuYWN0aW9ucztcblx0XHRcdGNvbnN0IHJlbGF0aXZlU3BsaXQgPSByZWxhdGl2ZVBhdGguc3BsaXQoXCIvXCIpO1xuXHRcdFx0aWYgKGFjdGlvbnNbcmVsYXRpdmVTcGxpdFswXV0pIHtcblx0XHRcdFx0Y29uc3QgYWN0aW9uID0gYWN0aW9uc1tyZWxhdGl2ZVNwbGl0WzBdXTtcblx0XHRcdFx0aWYgKHJlbGF0aXZlU3BsaXRbMV0gJiYgYWN0aW9uLnBhcmFtZXRlcnMpIHtcblx0XHRcdFx0XHRjb25zdCBwYXJhbWV0ZXJOYW1lID0gcmVsYXRpdmVTcGxpdFsxXTtcblx0XHRcdFx0XHRjb25zdCB0YXJnZXRQYXJhbWV0ZXIgPSBhY3Rpb24ucGFyYW1ldGVycy5maW5kKHBhcmFtZXRlciA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcGFyYW1ldGVyLmZ1bGx5UXVhbGlmaWVkTmFtZS5lbmRzV2l0aChcIi9cIiArIHBhcmFtZXRlck5hbWUpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJldHVybiB0YXJnZXRQYXJhbWV0ZXI7XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVsYXRpdmVQYXRoLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdHJldHVybiBhY3Rpb247XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9UYXJnZXQ7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKGJJbmNsdWRlVmlzaXRlZE9iamVjdHMpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHRhcmdldDogdGFyZ2V0RW50aXR5U2V0LFxuXHRcdFx0XHR2aXNpdGVkT2JqZWN0czogbG9jYWxPYmplY3RzXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXRoQmFzZWRSZXNvbHV0aW9uW3NQYXRoXSA9IHRhcmdldEVudGl0eVNldDtcblx0XHR9XG5cdFx0cmV0dXJuIHRhcmdldEVudGl0eVNldDtcblx0fVxufVxuXG50eXBlIENvbnZlcnRlck9iamVjdCA9IHtcblx0X3R5cGU6IHN0cmluZztcblx0bmFtZTogc3RyaW5nO1xufTtcbmV4cG9ydCB0eXBlIFJlc29sdmVkVGFyZ2V0ID0ge1xuXHR0YXJnZXQ/OiBDb252ZXJ0ZXJPYmplY3Q7XG5cdHZpc2l0ZWRPYmplY3RzOiBDb252ZXJ0ZXJPYmplY3RbXTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMob01ldGFNb2RlbENvbnRleHQ6IENvbnRleHQsIG9FbnRpdHlTZXRNZXRhTW9kZWxDb250ZXh0PzogQ29udGV4dCk6IERhdGFNb2RlbE9iamVjdFBhdGgge1xuXHRjb25zdCBtZXRhTW9kZWxDb250ZXh0ID0gY29udmVydE1ldGFNb2RlbENvbnRleHQob01ldGFNb2RlbENvbnRleHQsIHRydWUpO1xuXHRsZXQgdGFyZ2V0RW50aXR5U2V0TG9jYXRpb247XG5cdGlmIChvRW50aXR5U2V0TWV0YU1vZGVsQ29udGV4dCAmJiBvRW50aXR5U2V0TWV0YU1vZGVsQ29udGV4dC5nZXRQYXRoKCkgIT09IFwiL1wiKSB7XG5cdFx0dGFyZ2V0RW50aXR5U2V0TG9jYXRpb24gPSBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMob0VudGl0eVNldE1ldGFNb2RlbENvbnRleHQpO1xuXHR9XG5cdHJldHVybiBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdEZyb21QYXRoKG1ldGFNb2RlbENvbnRleHQsIHRhcmdldEVudGl0eVNldExvY2F0aW9uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0RnJvbVBhdGgoXG5cdG1ldGFNb2RlbENvbnRleHQ6IFJlc29sdmVkVGFyZ2V0LFxuXHR0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbj86IERhdGFNb2RlbE9iamVjdFBhdGhcbik6IERhdGFNb2RlbE9iamVjdFBhdGgge1xuXHRjb25zdCBkYXRhTW9kZWxPYmplY3RzID0gbWV0YU1vZGVsQ29udGV4dC52aXNpdGVkT2JqZWN0cy5maWx0ZXIoXG5cdFx0KHZpc2l0ZWRPYmplY3Q6IGFueSkgPT4gdmlzaXRlZE9iamVjdCAmJiB2aXNpdGVkT2JqZWN0Lmhhc093blByb3BlcnR5KFwiX3R5cGVcIikgJiYgdmlzaXRlZE9iamVjdC5fdHlwZSAhPT0gXCJFbnRpdHlUeXBlXCJcblx0KTtcblx0aWYgKG1ldGFNb2RlbENvbnRleHQudGFyZ2V0ICYmIG1ldGFNb2RlbENvbnRleHQudGFyZ2V0Lmhhc093blByb3BlcnR5KFwiX3R5cGVcIikgJiYgbWV0YU1vZGVsQ29udGV4dC50YXJnZXQuX3R5cGUgIT09IFwiRW50aXR5VHlwZVwiKSB7XG5cdFx0ZGF0YU1vZGVsT2JqZWN0cy5wdXNoKG1ldGFNb2RlbENvbnRleHQudGFyZ2V0KTtcblx0fVxuXHRjb25zdCBuYXZpZ2F0aW9uUHJvcGVydGllczogX05hdmlnYXRpb25Qcm9wZXJ0eVtdID0gW107XG5cdGNvbnN0IHJvb3RFbnRpdHlTZXQ6IF9FbnRpdHlTZXQgPSBkYXRhTW9kZWxPYmplY3RzWzBdIGFzIF9FbnRpdHlTZXQ7XG5cdGxldCBjdXJyZW50RW50aXR5U2V0OiBfRW50aXR5U2V0ID0gcm9vdEVudGl0eVNldCBhcyBfRW50aXR5U2V0O1xuXHRsZXQgY3VycmVudEVudGl0eVR5cGU6IF9FbnRpdHlUeXBlID0gcm9vdEVudGl0eVNldC5lbnRpdHlUeXBlO1xuXHRsZXQgaSA9IDE7XG5cdGxldCBjdXJyZW50T2JqZWN0O1xuXHRsZXQgbmF2aWdhdGVkUGF0aHMgPSBbXTtcblx0d2hpbGUgKGkgPCBkYXRhTW9kZWxPYmplY3RzLmxlbmd0aCkge1xuXHRcdGN1cnJlbnRPYmplY3QgPSBkYXRhTW9kZWxPYmplY3RzW2krK107XG5cdFx0aWYgKGN1cnJlbnRPYmplY3QuX3R5cGUgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIpIHtcblx0XHRcdG5hdmlnYXRlZFBhdGhzLnB1c2goY3VycmVudE9iamVjdC5uYW1lKTtcblx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0aWVzLnB1c2goY3VycmVudE9iamVjdCBhcyBfTmF2aWdhdGlvblByb3BlcnR5KTtcblx0XHRcdGN1cnJlbnRFbnRpdHlUeXBlID0gKGN1cnJlbnRPYmplY3QgYXMgX05hdmlnYXRpb25Qcm9wZXJ0eSkudGFyZ2V0VHlwZTtcblx0XHRcdGlmIChjdXJyZW50RW50aXR5U2V0ICYmIGN1cnJlbnRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZy5oYXNPd25Qcm9wZXJ0eShuYXZpZ2F0ZWRQYXRocy5qb2luKFwiL1wiKSkpIHtcblx0XHRcdFx0Y3VycmVudEVudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tjdXJyZW50T2JqZWN0Lm5hbWVdO1xuXHRcdFx0XHRuYXZpZ2F0ZWRQYXRocyA9IFtdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoY3VycmVudE9iamVjdC5fdHlwZSA9PT0gXCJFbnRpdHlTZXRcIikge1xuXHRcdFx0Y3VycmVudEVudGl0eVNldCA9IGN1cnJlbnRPYmplY3QgYXMgX0VudGl0eVNldDtcblx0XHRcdGN1cnJlbnRFbnRpdHlUeXBlID0gY3VycmVudEVudGl0eVNldC5lbnRpdHlUeXBlO1xuXHRcdH1cblx0fVxuXG5cdGlmICh0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbiAmJiB0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbi5zdGFydGluZ0VudGl0eVNldCAhPT0gcm9vdEVudGl0eVNldCkge1xuXHRcdC8vIEluIGNhc2UgdGhlIGVudGl0eXNldCBpcyBub3Qgc3RhcnRpbmcgZnJvbSB0aGUgc2FtZSBsb2NhdGlvbiBpdCBtYXkgbWVhbiB0aGF0IHdlIGFyZSBkb2luZyB0b28gbXVjaCB3b3JrIGVhcmxpZXIgZm9yIHNvbWUgcmVhc29uXG5cdFx0Ly8gQXMgc3VjaCB3ZSBuZWVkIHRvIHJlZGVmaW5lIHRoZSBjb250ZXh0IHNvdXJjZSBmb3IgdGhlIHRhcmdldEVudGl0eVNldExvY2F0aW9uXG5cdFx0Y29uc3Qgc3RhcnRpbmdJbmRleCA9IGRhdGFNb2RlbE9iamVjdHMuaW5kZXhPZih0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbi5zdGFydGluZ0VudGl0eVNldCk7XG5cdFx0aWYgKHN0YXJ0aW5nSW5kZXggIT09IC0xKSB7XG5cdFx0XHQvLyBJZiBpdCdzIG5vdCBmb3VuZCBJIGRvbid0IGtub3cgd2hhdCB3ZSBjYW4gZG8gKHByb2JhYmx5IG5vdGhpbmcpXG5cdFx0XHRjb25zdCByZXF1aXJlZERhdGFNb2RlbE9iamVjdHMgPSBkYXRhTW9kZWxPYmplY3RzLnNsaWNlKDAsIHN0YXJ0aW5nSW5kZXgpO1xuXHRcdFx0dGFyZ2V0RW50aXR5U2V0TG9jYXRpb24uc3RhcnRpbmdFbnRpdHlTZXQgPSByb290RW50aXR5U2V0O1xuXHRcdFx0dGFyZ2V0RW50aXR5U2V0TG9jYXRpb24ubmF2aWdhdGlvblByb3BlcnRpZXMgPSByZXF1aXJlZERhdGFNb2RlbE9iamVjdHNcblx0XHRcdFx0LmZpbHRlcigob2JqZWN0OiBhbnkpID0+IG9iamVjdC5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIilcblx0XHRcdFx0LmNvbmNhdCh0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbi5uYXZpZ2F0aW9uUHJvcGVydGllcykgYXMgX05hdmlnYXRpb25Qcm9wZXJ0eVtdO1xuXHRcdH1cblx0fVxuXHRjb25zdCBvdXREYXRhTW9kZWxQYXRoID0ge1xuXHRcdHN0YXJ0aW5nRW50aXR5U2V0OiByb290RW50aXR5U2V0LFxuXHRcdHRhcmdldEVudGl0eVNldDogY3VycmVudEVudGl0eVNldCxcblx0XHR0YXJnZXRFbnRpdHlUeXBlOiBjdXJyZW50RW50aXR5VHlwZSxcblx0XHR0YXJnZXRPYmplY3Q6IG1ldGFNb2RlbENvbnRleHQudGFyZ2V0LFxuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0aWVzLFxuXHRcdGNvbnRleHRMb2NhdGlvbjogdGFyZ2V0RW50aXR5U2V0TG9jYXRpb25cblx0fTtcblx0aWYgKCFvdXREYXRhTW9kZWxQYXRoLmNvbnRleHRMb2NhdGlvbikge1xuXHRcdG91dERhdGFNb2RlbFBhdGguY29udGV4dExvY2F0aW9uID0gb3V0RGF0YU1vZGVsUGF0aDtcblx0fVxuXHRyZXR1cm4gb3V0RGF0YU1vZGVsUGF0aDtcbn1cbiJdfQ==