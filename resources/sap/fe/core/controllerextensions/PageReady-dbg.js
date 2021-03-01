sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "sap/fe/core/controllerextensions/ControllerExtensionMetadata", "sap/ui/core/Component", "sap/fe/core/CommonUtils", "sap/ui/base/EventProvider", "sap/base/Log", "../helpers/ClassSupport"], function (ControllerExtension, OverrideExecution, ControllerExtensionMetadata, Component, CommonUtils, EventProvider, Log, ClassSupport) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2;

  var Private = ClassSupport.Private;
  var Extensible = ClassSupport.Extensible;
  var Final = ClassSupport.Final;
  var Public = ClassSupport.Public;
  var Override = ClassSupport.Override;
  var UI5Class = ClassSupport.UI5Class;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var PageReadyControllerExtension = (_dec = UI5Class("sap.fe.core.controllerextensions.PageReady", ControllerExtensionMetadata), _dec2 = Override(), _dec3 = Override("_routing"), _dec4 = Override("_routing"), _dec5 = Override("_routing"), _dec6 = Extensible(OverrideExecution.Instead), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inherits(PageReadyControllerExtension, _ControllerExtension);

    var _super = _createSuper(PageReadyControllerExtension);

    function PageReadyControllerExtension() {
      _classCallCheck(this, PageReadyControllerExtension);

      return _super.apply(this, arguments);
    }

    _createClass(PageReadyControllerExtension, [{
      key: "onInit",
      value: function onInit() {
        var _this = this;

        this._oEventProvider = new EventProvider();
        this._oView = this.base.getView();
        this._oAppComponent = CommonUtils.getAppComponent(this._oView);
        this._oPageComponent = Component.getOwnerComponentFor(this._oView);

        if (this._oPageComponent && this._oPageComponent.attachContainerDefined) {
          this._oPageComponent.attachContainerDefined(function (oEvent) {
            return _this.registerContainer(oEvent.getParameter("container"));
          });
        } else {
          this.registerContainer(this._oView);
        }
      }
    }, {
      key: "onRouteMatched",
      value: function onRouteMatched() {
        this._bIsPageReady = false;
      }
    }, {
      key: "onRouteMatchedFinished",
      value: function onRouteMatchedFinished() {
        this.checkPageReadyDebounced();
      }
    }, {
      key: "onAfterBinding",
      value: function onAfterBinding(oBindingContext) {
        var _this2 = this;

        if (!this._bAfterBindingAlreadyApplied) {
          this._bAfterBindingAlreadyApplied = true;
          var aBoundElements = [];
          var aNotBoundMDCTables = [];
          var iRequested = 0;
          var iReceived = 0;

          var fnRequested = function (oEvent) {
            oEvent.getSource().detachDataRequested(fnRequested);
            iRequested++;
            _this2.bDataReceived = false;
          };

          var fnReceived = function (oEvent) {
            switch (oEvent.getSource().sGroupId) {
              case "$auto.Workers":
                _this2._oEventProvider.fireEvent("workersBatchReceived");

                break;

              case "$auto.Heroes":
                _this2._oEventProvider.fireEvent("heroesBatchReceived");

                break;

              default:
            }

            oEvent.getSource().detachDataReceived(fnReceived);
            iReceived++;

            if (iReceived === iRequested && iRequested !== 0) {
              iRequested = 0;
              iReceived = 0;
              _this2.bDataReceived = true;

              _this2.checkPageReadyDebounced();
            }
          };

          var fnSearch = function (oEvent) {
            var aMDCTables = aNotBoundMDCTables.filter(function (oElem) {
              if (oEvent.getSource().sId === oElem.getFilter()) {
                return true;
              }

              return false;
            });
            aMDCTables.forEach(function (oMDCTable) {
              var oRowBinding = oMDCTable.getRowBinding();

              var fnAttachDataEvents = function () {
                oRowBinding.attachDataRequested(fnRequested);
                oRowBinding.attachDataReceived(fnReceived);
                aBoundElements.push(oRowBinding);
              };

              if (oRowBinding) {
                fnAttachDataEvents();
              } else {
                setTimeout(function () {
                  oRowBinding = oMDCTable.getRowBinding();

                  if (oRowBinding) {
                    fnAttachDataEvents();
                  } else {
                    Log.error("Cannot attach events to unbound table", null);
                  }
                }, 0);
              }
            });
          };

          if (this.isContextExpected() && oBindingContext === undefined) {
            // Force to mention we are expecting data
            this.bHasContext = false;
            return;
          } else {
            this.bHasContext = true;
          }

          this.attachEventOnce("pageReady", null, function () {
            aBoundElements.forEach(function (oElement) {
              oElement.detachEvent("dataRequested", fnRequested);
              oElement.detachEvent("dataReceived", fnReceived);
              oElement.detachEvent("search", fnSearch);
            });
            _this2._bAfterBindingAlreadyApplied = false;
            aBoundElements = [];
          }, null);

          if (oBindingContext) {
            var mainObjectBinding = oBindingContext.getBinding();
            mainObjectBinding.attachDataRequested(fnRequested);
            mainObjectBinding.attachDataReceived(fnReceived);
            aBoundElements.push(mainObjectBinding);
          }

          var aTableInitializedPromises = [];

          this._oView.findAggregatedObjects(true, function (oElement) {
            var oObjectBinding = oElement.getObjectBinding();

            if (oObjectBinding) {
              // Register on all object binding (mostly used on object pages)
              oObjectBinding.attachDataRequested(fnRequested);
              oObjectBinding.attachDataReceived(fnReceived);
              aBoundElements.push(oObjectBinding);
            } else {
              var aBindingKeys = Object.keys(oElement.mBindingInfos);

              if (aBindingKeys.length > 0) {
                aBindingKeys.forEach(function (sPropertyName) {
                  var oListBinding = oElement.mBindingInfos[sPropertyName].binding; // Register on all list binding, good for basic tables, problematic for MDC, see above

                  if (oListBinding && oListBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
                    oListBinding.attachDataRequested(fnRequested);
                    oListBinding.attachDataReceived(fnReceived);
                    aBoundElements.push(oListBinding);
                  }
                });
              }
            } // This is dirty but MDC Table has a weird loading lifecycle


            if (oElement.isA("sap.ui.mdc.Table")) {
              _this2.bTablesLoaded = false; // access binding only after table is bound

              aTableInitializedPromises.push(oElement.initialized().then(function () {
                var oRowBinding = oElement.getRowBinding();

                if (oRowBinding) {
                  oRowBinding.attachDataRequested(fnRequested);
                  oRowBinding.attachDataReceived(fnReceived);
                  aBoundElements.push(oRowBinding);
                } else {
                  aNotBoundMDCTables.push(oElement);
                }
              }).catch(function (oError) {
                Log.error("Cannot find a bound table", oError);
              }));
            } else if (oElement.isA("sap.ui.mdc.FilterBar")) {
              oElement.attachEvent("search", fnSearch);
              aBoundElements.push(oElement);
            }
          });

          if (aTableInitializedPromises.length > 0) {
            Promise.all(aTableInitializedPromises).then(function () {
              _this2.bTablesLoaded = true;

              _this2.checkPageReadyDebounced();
            }).catch(function (oError) {
              Log.info("There was an error with one or multiple table", oError);
              _this2.bTablesLoaded = true;

              _this2.checkPageReadyDebounced();
            });
          }
        }
      }
    }, {
      key: "isPageReady",
      value: function isPageReady() {
        return this._bIsPageReady;
      }
    }, {
      key: "attachEventOnce",
      value: function attachEventOnce(sEventId, oData, fnFunction, oListener) {
        // eslint-disable-next-line prefer-rest-params
        return this._oEventProvider.attachEventOnce(sEventId, oData, fnFunction, oListener);
      }
    }, {
      key: "attachEvent",
      value: function attachEvent(sEventId, oData, fnFunction, oListener) {
        // eslint-disable-next-line prefer-rest-params
        return this._oEventProvider.attachEvent(sEventId, oData, fnFunction, oListener);
      }
    }, {
      key: "detachEvent",
      value: function detachEvent(sEventId, fnFunction) {
        // eslint-disable-next-line prefer-rest-params
        return this._oEventProvider.detachEvent(sEventId, fnFunction);
      }
    }, {
      key: "registerContainer",
      value: function registerContainer(oContainer) {
        var _this3 = this;

        this._oContainer = oContainer;

        this._oContainer.addEventDelegate({
          onBeforeShow: function () {
            _this3.bShown = false;
            _this3._bIsPageReady = false;
          },
          onBeforeHide: function () {
            _this3.bShown = false;
            _this3._bIsPageReady = false;
          },
          onAfterShow: function () {
            _this3.bShown = true;

            _this3._checkPageReady(true);
          }
        });
      }
    }, {
      key: "isContextExpected",
      value: function isContextExpected() {
        return false;
      }
    }, {
      key: "checkPageReadyDebounced",
      value: function checkPageReadyDebounced() {
        var _this4 = this;

        if (this.pageReadyTimer) {
          clearTimeout(this.pageReadyTimer);
        }

        this.pageReadyTimer = setTimeout(function () {
          _this4._checkPageReady();
        }, 200);
      }
    }, {
      key: "_checkPageReady",
      value: function _checkPageReady() {
        var _this5 = this;

        var bFromNav = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var fnUIUpdated = function () {
          // Wait until the UI is no longer dirty
          if (!sap.ui.getCore().getUIDirty()) {
            sap.ui.getCore().detachEvent("UIUpdated", fnUIUpdated);
            _this5._bWaitingForRefresh = false;
            setTimeout(function () {
              _this5._checkPageReady();
            }, 20);
          }
        }; // In case UIUpdate does not get called, check if UI is not dirty and then call _checkPageReady


        var checkUIUpdated = function () {
          if (sap.ui.getCore().getUIDirty()) {
            setTimeout(checkUIUpdated, 500);
          } else if (_this5._bWaitingForRefresh) {
            _this5._bWaitingForRefresh = false;
            sap.ui.getCore().detachEvent("UIUpdated", fnUIUpdated);

            _this5._checkPageReady();
          }
        };

        if (this.bShown && this.bDataReceived !== false && this.bTablesLoaded !== false && (!this.isContextExpected() || this.bHasContext) // Either no context is expected or there is one
        ) {
            if (this.bDataReceived === true && !bFromNav && !this._bWaitingForRefresh && sap.ui.getCore().getUIDirty()) {
              // If we requested data we get notified as soon as the data arrived, so before the next rendering tick
              this.bDataReceived = undefined;
              this._bWaitingForRefresh = true;
              sap.ui.getCore().attachEvent("UIUpdated", fnUIUpdated);
              setTimeout(checkUIUpdated, 500);
            } else if (!this._bWaitingForRefresh && sap.ui.getCore().getUIDirty()) {
              this._bWaitingForRefresh = true;
              sap.ui.getCore().attachEvent("UIUpdated", fnUIUpdated);
              setTimeout(checkUIUpdated, 500);
            } else if (!this._bWaitingForRefresh) {
              // In the case we're not waiting for any data (navigating back to a page we already have loaded)
              // just wait for a frame to fire the event.
              this._bIsPageReady = true;

              this._oEventProvider.fireEvent("pageReady");
            }
          }
      }
    }]);

    return PageReadyControllerExtension;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onRouteMatched", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "onRouteMatched"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onRouteMatchedFinished", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "onRouteMatchedFinished"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onAfterBinding", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "onAfterBinding"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isPageReady", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "isPageReady"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "attachEventOnce", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "attachEventOnce"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "attachEvent", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "attachEvent"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "detachEvent", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "detachEvent"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isContextExpected", [Private, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "isContextExpected"), _class2.prototype)), _class2)) || _class);
  return PageReadyControllerExtension;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhZ2VSZWFkeS50cyJdLCJuYW1lcyI6WyJQYWdlUmVhZHlDb250cm9sbGVyRXh0ZW5zaW9uIiwiVUk1Q2xhc3MiLCJDb250cm9sbGVyRXh0ZW5zaW9uTWV0YWRhdGEiLCJPdmVycmlkZSIsIkV4dGVuc2libGUiLCJPdmVycmlkZUV4ZWN1dGlvbiIsIkluc3RlYWQiLCJfb0V2ZW50UHJvdmlkZXIiLCJFdmVudFByb3ZpZGVyIiwiX29WaWV3IiwiYmFzZSIsImdldFZpZXciLCJfb0FwcENvbXBvbmVudCIsIkNvbW1vblV0aWxzIiwiZ2V0QXBwQ29tcG9uZW50IiwiX29QYWdlQ29tcG9uZW50IiwiQ29tcG9uZW50IiwiZ2V0T3duZXJDb21wb25lbnRGb3IiLCJhdHRhY2hDb250YWluZXJEZWZpbmVkIiwib0V2ZW50IiwicmVnaXN0ZXJDb250YWluZXIiLCJnZXRQYXJhbWV0ZXIiLCJfYklzUGFnZVJlYWR5IiwiY2hlY2tQYWdlUmVhZHlEZWJvdW5jZWQiLCJvQmluZGluZ0NvbnRleHQiLCJfYkFmdGVyQmluZGluZ0FscmVhZHlBcHBsaWVkIiwiYUJvdW5kRWxlbWVudHMiLCJhTm90Qm91bmRNRENUYWJsZXMiLCJpUmVxdWVzdGVkIiwiaVJlY2VpdmVkIiwiZm5SZXF1ZXN0ZWQiLCJnZXRTb3VyY2UiLCJkZXRhY2hEYXRhUmVxdWVzdGVkIiwiYkRhdGFSZWNlaXZlZCIsImZuUmVjZWl2ZWQiLCJzR3JvdXBJZCIsImZpcmVFdmVudCIsImRldGFjaERhdGFSZWNlaXZlZCIsImZuU2VhcmNoIiwiYU1EQ1RhYmxlcyIsImZpbHRlciIsIm9FbGVtIiwic0lkIiwiZ2V0RmlsdGVyIiwiZm9yRWFjaCIsIm9NRENUYWJsZSIsIm9Sb3dCaW5kaW5nIiwiZ2V0Um93QmluZGluZyIsImZuQXR0YWNoRGF0YUV2ZW50cyIsImF0dGFjaERhdGFSZXF1ZXN0ZWQiLCJhdHRhY2hEYXRhUmVjZWl2ZWQiLCJwdXNoIiwic2V0VGltZW91dCIsIkxvZyIsImVycm9yIiwiaXNDb250ZXh0RXhwZWN0ZWQiLCJ1bmRlZmluZWQiLCJiSGFzQ29udGV4dCIsImF0dGFjaEV2ZW50T25jZSIsIm9FbGVtZW50IiwiZGV0YWNoRXZlbnQiLCJtYWluT2JqZWN0QmluZGluZyIsImdldEJpbmRpbmciLCJhVGFibGVJbml0aWFsaXplZFByb21pc2VzIiwiZmluZEFnZ3JlZ2F0ZWRPYmplY3RzIiwib09iamVjdEJpbmRpbmciLCJnZXRPYmplY3RCaW5kaW5nIiwiYUJpbmRpbmdLZXlzIiwiT2JqZWN0Iiwia2V5cyIsIm1CaW5kaW5nSW5mb3MiLCJsZW5ndGgiLCJzUHJvcGVydHlOYW1lIiwib0xpc3RCaW5kaW5nIiwiYmluZGluZyIsImlzQSIsImJUYWJsZXNMb2FkZWQiLCJpbml0aWFsaXplZCIsInRoZW4iLCJjYXRjaCIsIm9FcnJvciIsImF0dGFjaEV2ZW50IiwiUHJvbWlzZSIsImFsbCIsImluZm8iLCJzRXZlbnRJZCIsIm9EYXRhIiwiZm5GdW5jdGlvbiIsIm9MaXN0ZW5lciIsIm9Db250YWluZXIiLCJfb0NvbnRhaW5lciIsImFkZEV2ZW50RGVsZWdhdGUiLCJvbkJlZm9yZVNob3ciLCJiU2hvd24iLCJvbkJlZm9yZUhpZGUiLCJvbkFmdGVyU2hvdyIsIl9jaGVja1BhZ2VSZWFkeSIsInBhZ2VSZWFkeVRpbWVyIiwiY2xlYXJUaW1lb3V0IiwiYkZyb21OYXYiLCJmblVJVXBkYXRlZCIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImdldFVJRGlydHkiLCJfYldhaXRpbmdGb3JSZWZyZXNoIiwiY2hlY2tVSVVwZGF0ZWQiLCJDb250cm9sbGVyRXh0ZW5zaW9uIiwiUHVibGljIiwiRmluYWwiLCJQcml2YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BV01BLDRCLFdBRExDLFFBQVEsQ0FBQyw0Q0FBRCxFQUErQ0MsMkJBQS9DLEMsVUFpQlBDLFFBQVEsRSxVQWNSQSxRQUFRLENBQUMsVUFBRCxDLFVBSVJBLFFBQVEsQ0FBQyxVQUFELEMsVUFLUkEsUUFBUSxD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QUE3QixFQUEwQ21CLFdBQTFDO0FBQ0FoRCxjQUFBQSxVQUFVLENBQUNzRCxjQUFELEVBQWlCLEdBQWpCLENBQVY7QUFDQSxhQU5ELE1BTU8sSUFBSSxDQUFDLEtBQUtELG1CQUFOLElBQTZCSixHQUFHLENBQUNDLEVBQUosQ0FBT0MsT0FBUCxHQUFpQkMsVUFBakIsRUFBakMsRUFBZ0U7QUFDdEUsbUJBQUtDLG1CQUFMLEdBQTJCLElBQTNCO0FBQ0FKLGNBQUFBLEdBQUcsQ0FBQ0MsRUFBSixDQUFPQyxPQUFQLEdBQWlCdEIsV0FBakIsQ0FBNkIsV0FBN0IsRUFBMENtQixXQUExQztBQUNBaEQsY0FBQUEsVUFBVSxDQUFDc0QsY0FBRCxFQUFpQixHQUFqQixDQUFWO0FBQ0EsYUFKTSxNQUlBLElBQUksQ0FBQyxLQUFLRCxtQkFBVixFQUErQjtBQUNyQztBQUNBO0FBQ0EsbUJBQUtuRixhQUFMLEdBQXFCLElBQXJCOztBQUNBLG1CQUFLZixlQUFMLENBQXFCNkIsU0FBckIsQ0FBK0IsV0FBL0I7QUFDQTtBQUNEO0FBQ0Q7Ozs7SUFyU3lDdUUsbUIseXNCQStMekNDLE0sRUFDQUMsSywySkFJQUQsTSxFQUNBQyxLLDJKQUtBRCxNLEVBQ0FDLEssdUpBS0FELE0sRUFDQUMsSyw2SkF1QkFDLE87U0FnRWE5Ryw0QiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udHJvbGxlckV4dGVuc2lvbiwgT3ZlcnJpZGVFeGVjdXRpb24gfSBmcm9tIFwic2FwL3VpL2NvcmUvbXZjXCI7XG5pbXBvcnQgeyBDb250cm9sbGVyRXh0ZW5zaW9uTWV0YWRhdGEgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJzYXAvdWkvY29yZVwiO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50LCBDb21tb25VdGlscyB9IGZyb20gXCJzYXAvZmUvY29yZVwiO1xuaW1wb3J0IHsgTWFuYWdlZE9iamVjdCwgRXZlbnRQcm92aWRlciB9IGZyb20gXCJzYXAvdWkvYmFzZVwiO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSBcInNhcC9iYXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcInNhcC91aS9tb2RlbFwiO1xuaW1wb3J0IHsgVUk1RXZlbnQgfSBmcm9tIFwiZ2xvYmFsXCI7XG5pbXBvcnQgeyBVSTVDbGFzcywgT3ZlcnJpZGUsIFB1YmxpYywgRmluYWwsIEV4dGVuc2libGUsIFByaXZhdGUgfSBmcm9tIFwiLi4vaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcblxuQFVJNUNsYXNzKFwic2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuUGFnZVJlYWR5XCIsIENvbnRyb2xsZXJFeHRlbnNpb25NZXRhZGF0YSlcbmNsYXNzIFBhZ2VSZWFkeUNvbnRyb2xsZXJFeHRlbnNpb24gZXh0ZW5kcyBDb250cm9sbGVyRXh0ZW5zaW9uIHtcblx0cHJpdmF0ZSBfb0V2ZW50UHJvdmlkZXIhOiBFdmVudFByb3ZpZGVyO1xuXHRwcml2YXRlIF9vVmlldzogYW55O1xuXHRwcml2YXRlIF9vQXBwQ29tcG9uZW50ITogQXBwQ29tcG9uZW50O1xuXHRwcml2YXRlIF9vUGFnZUNvbXBvbmVudCE6IGFueTtcblx0cHJpdmF0ZSBfb0NvbnRhaW5lciE6IGFueTtcblx0cHJpdmF0ZSBfYkFmdGVyQmluZGluZ0FscmVhZHlBcHBsaWVkITogYm9vbGVhbjtcblxuXHRwcml2YXRlIF9iSXNQYWdlUmVhZHkhOiBib29sZWFuO1xuXHRwcml2YXRlIF9iV2FpdGluZ0ZvclJlZnJlc2ghOiBib29sZWFuO1xuXHRwcml2YXRlIGJTaG93biE6IGJvb2xlYW47XG5cdHByaXZhdGUgYkhhc0NvbnRleHQhOiBib29sZWFuO1xuXHRwcml2YXRlIGJEYXRhUmVjZWl2ZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cdHByaXZhdGUgYlRhYmxlc0xvYWRlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblx0cHJpdmF0ZSBwYWdlUmVhZHlUaW1lcjogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQ7XG5cblx0QE92ZXJyaWRlKClcblx0cHVibGljIG9uSW5pdCgpIHtcblx0XHR0aGlzLl9vRXZlbnRQcm92aWRlciA9IG5ldyBFdmVudFByb3ZpZGVyKCk7XG5cdFx0dGhpcy5fb1ZpZXcgPSAodGhpcyBhcyBhbnkpLmJhc2UuZ2V0VmlldygpO1xuXHRcdHRoaXMuX29BcHBDb21wb25lbnQgPSBDb21tb25VdGlscy5nZXRBcHBDb21wb25lbnQodGhpcy5fb1ZpZXcpO1xuXHRcdHRoaXMuX29QYWdlQ29tcG9uZW50ID0gQ29tcG9uZW50LmdldE93bmVyQ29tcG9uZW50Rm9yKHRoaXMuX29WaWV3KTtcblxuXHRcdGlmICh0aGlzLl9vUGFnZUNvbXBvbmVudCAmJiB0aGlzLl9vUGFnZUNvbXBvbmVudC5hdHRhY2hDb250YWluZXJEZWZpbmVkKSB7XG5cdFx0XHR0aGlzLl9vUGFnZUNvbXBvbmVudC5hdHRhY2hDb250YWluZXJEZWZpbmVkKChvRXZlbnQ6IFVJNUV2ZW50KSA9PiB0aGlzLnJlZ2lzdGVyQ29udGFpbmVyKG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJjb250YWluZXJcIikpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yZWdpc3RlckNvbnRhaW5lcih0aGlzLl9vVmlldyk7XG5cdFx0fVxuXHR9XG5cblx0QE92ZXJyaWRlKFwiX3JvdXRpbmdcIilcblx0b25Sb3V0ZU1hdGNoZWQoKSB7XG5cdFx0dGhpcy5fYklzUGFnZVJlYWR5ID0gZmFsc2U7XG5cdH1cblx0QE92ZXJyaWRlKFwiX3JvdXRpbmdcIilcblx0b25Sb3V0ZU1hdGNoZWRGaW5pc2hlZCgpIHtcblx0XHR0aGlzLmNoZWNrUGFnZVJlYWR5RGVib3VuY2VkKCk7XG5cdH1cblxuXHRAT3ZlcnJpZGUoXCJfcm91dGluZ1wiKVxuXHRvbkFmdGVyQmluZGluZyhvQmluZGluZ0NvbnRleHQ6IENvbnRleHQpIHtcblx0XHRpZiAoIXRoaXMuX2JBZnRlckJpbmRpbmdBbHJlYWR5QXBwbGllZCkge1xuXHRcdFx0dGhpcy5fYkFmdGVyQmluZGluZ0FscmVhZHlBcHBsaWVkID0gdHJ1ZTtcblx0XHRcdGxldCBhQm91bmRFbGVtZW50czogYW55W10gPSBbXTtcblx0XHRcdGNvbnN0IGFOb3RCb3VuZE1EQ1RhYmxlczogYW55W10gPSBbXTtcblx0XHRcdGxldCBpUmVxdWVzdGVkID0gMDtcblx0XHRcdGxldCBpUmVjZWl2ZWQgPSAwO1xuXHRcdFx0Y29uc3QgZm5SZXF1ZXN0ZWQgPSAob0V2ZW50OiBVSTVFdmVudCkgPT4ge1xuXHRcdFx0XHRvRXZlbnQuZ2V0U291cmNlKCkuZGV0YWNoRGF0YVJlcXVlc3RlZChmblJlcXVlc3RlZCk7XG5cdFx0XHRcdGlSZXF1ZXN0ZWQrKztcblx0XHRcdFx0dGhpcy5iRGF0YVJlY2VpdmVkID0gZmFsc2U7XG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgZm5SZWNlaXZlZCA9IChvRXZlbnQ6IFVJNUV2ZW50KSA9PiB7XG5cdFx0XHRcdHN3aXRjaCAob0V2ZW50LmdldFNvdXJjZSgpLnNHcm91cElkKSB7XG5cdFx0XHRcdFx0Y2FzZSBcIiRhdXRvLldvcmtlcnNcIjpcblx0XHRcdFx0XHRcdHRoaXMuX29FdmVudFByb3ZpZGVyLmZpcmVFdmVudChcIndvcmtlcnNCYXRjaFJlY2VpdmVkXCIpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIiRhdXRvLkhlcm9lc1wiOlxuXHRcdFx0XHRcdFx0dGhpcy5fb0V2ZW50UHJvdmlkZXIuZmlyZUV2ZW50KFwiaGVyb2VzQmF0Y2hSZWNlaXZlZFwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdH1cblx0XHRcdFx0b0V2ZW50LmdldFNvdXJjZSgpLmRldGFjaERhdGFSZWNlaXZlZChmblJlY2VpdmVkKTtcblx0XHRcdFx0aVJlY2VpdmVkKys7XG5cdFx0XHRcdGlmIChpUmVjZWl2ZWQgPT09IGlSZXF1ZXN0ZWQgJiYgaVJlcXVlc3RlZCAhPT0gMCkge1xuXHRcdFx0XHRcdGlSZXF1ZXN0ZWQgPSAwO1xuXHRcdFx0XHRcdGlSZWNlaXZlZCA9IDA7XG5cdFx0XHRcdFx0dGhpcy5iRGF0YVJlY2VpdmVkID0gdHJ1ZTtcblx0XHRcdFx0XHR0aGlzLmNoZWNrUGFnZVJlYWR5RGVib3VuY2VkKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRjb25zdCBmblNlYXJjaCA9IGZ1bmN0aW9uKG9FdmVudDogVUk1RXZlbnQpIHtcblx0XHRcdFx0Y29uc3QgYU1EQ1RhYmxlcyA9IGFOb3RCb3VuZE1EQ1RhYmxlcy5maWx0ZXIob0VsZW0gPT4ge1xuXHRcdFx0XHRcdGlmIChvRXZlbnQuZ2V0U291cmNlKCkuc0lkID09PSBvRWxlbS5nZXRGaWx0ZXIoKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGFNRENUYWJsZXMuZm9yRWFjaCgob01EQ1RhYmxlOiBhbnkpID0+IHtcblx0XHRcdFx0XHRsZXQgb1Jvd0JpbmRpbmcgPSBvTURDVGFibGUuZ2V0Um93QmluZGluZygpO1xuXHRcdFx0XHRcdGNvbnN0IGZuQXR0YWNoRGF0YUV2ZW50cyA9ICgpID0+IHtcblx0XHRcdFx0XHRcdG9Sb3dCaW5kaW5nLmF0dGFjaERhdGFSZXF1ZXN0ZWQoZm5SZXF1ZXN0ZWQpO1xuXHRcdFx0XHRcdFx0b1Jvd0JpbmRpbmcuYXR0YWNoRGF0YVJlY2VpdmVkKGZuUmVjZWl2ZWQpO1xuXHRcdFx0XHRcdFx0YUJvdW5kRWxlbWVudHMucHVzaChvUm93QmluZGluZyk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRpZiAob1Jvd0JpbmRpbmcpIHtcblx0XHRcdFx0XHRcdGZuQXR0YWNoRGF0YUV2ZW50cygpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0b1Jvd0JpbmRpbmcgPSBvTURDVGFibGUuZ2V0Um93QmluZGluZygpO1xuXHRcdFx0XHRcdFx0XHRpZiAob1Jvd0JpbmRpbmcpIHtcblx0XHRcdFx0XHRcdFx0XHRmbkF0dGFjaERhdGFFdmVudHMoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJDYW5ub3QgYXR0YWNoIGV2ZW50cyB0byB1bmJvdW5kIHRhYmxlXCIsIG51bGwpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCAwKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblx0XHRcdGlmICh0aGlzLmlzQ29udGV4dEV4cGVjdGVkKCkgJiYgb0JpbmRpbmdDb250ZXh0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ly8gRm9yY2UgdG8gbWVudGlvbiB3ZSBhcmUgZXhwZWN0aW5nIGRhdGFcblx0XHRcdFx0dGhpcy5iSGFzQ29udGV4dCA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmJIYXNDb250ZXh0ID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5hdHRhY2hFdmVudE9uY2UoXG5cdFx0XHRcdFwicGFnZVJlYWR5XCIsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5mb3JFYWNoKChvRWxlbWVudDogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRvRWxlbWVudC5kZXRhY2hFdmVudChcImRhdGFSZXF1ZXN0ZWRcIiwgZm5SZXF1ZXN0ZWQpO1xuXHRcdFx0XHRcdFx0b0VsZW1lbnQuZGV0YWNoRXZlbnQoXCJkYXRhUmVjZWl2ZWRcIiwgZm5SZWNlaXZlZCk7XG5cdFx0XHRcdFx0XHRvRWxlbWVudC5kZXRhY2hFdmVudChcInNlYXJjaFwiLCBmblNlYXJjaCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5fYkFmdGVyQmluZGluZ0FscmVhZHlBcHBsaWVkID0gZmFsc2U7XG5cdFx0XHRcdFx0YUJvdW5kRWxlbWVudHMgPSBbXTtcblx0XHRcdFx0fSxcblx0XHRcdFx0bnVsbFxuXHRcdFx0KTtcblx0XHRcdGlmIChvQmluZGluZ0NvbnRleHQpIHtcblx0XHRcdFx0Y29uc3QgbWFpbk9iamVjdEJpbmRpbmcgPSAob0JpbmRpbmdDb250ZXh0IGFzIGFueSkuZ2V0QmluZGluZygpO1xuXHRcdFx0XHRtYWluT2JqZWN0QmluZGluZy5hdHRhY2hEYXRhUmVxdWVzdGVkKGZuUmVxdWVzdGVkKTtcblx0XHRcdFx0bWFpbk9iamVjdEJpbmRpbmcuYXR0YWNoRGF0YVJlY2VpdmVkKGZuUmVjZWl2ZWQpO1xuXHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG1haW5PYmplY3RCaW5kaW5nKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYVRhYmxlSW5pdGlhbGl6ZWRQcm9taXNlczogUHJvbWlzZTxhbnk+W10gPSBbXTtcblx0XHRcdHRoaXMuX29WaWV3LmZpbmRBZ2dyZWdhdGVkT2JqZWN0cyh0cnVlLCAob0VsZW1lbnQ6IGFueSkgPT4ge1xuXHRcdFx0XHRjb25zdCBvT2JqZWN0QmluZGluZyA9IG9FbGVtZW50LmdldE9iamVjdEJpbmRpbmcoKTtcblx0XHRcdFx0aWYgKG9PYmplY3RCaW5kaW5nKSB7XG5cdFx0XHRcdFx0Ly8gUmVnaXN0ZXIgb24gYWxsIG9iamVjdCBiaW5kaW5nIChtb3N0bHkgdXNlZCBvbiBvYmplY3QgcGFnZXMpXG5cdFx0XHRcdFx0b09iamVjdEJpbmRpbmcuYXR0YWNoRGF0YVJlcXVlc3RlZChmblJlcXVlc3RlZCk7XG5cdFx0XHRcdFx0b09iamVjdEJpbmRpbmcuYXR0YWNoRGF0YVJlY2VpdmVkKGZuUmVjZWl2ZWQpO1xuXHRcdFx0XHRcdGFCb3VuZEVsZW1lbnRzLnB1c2gob09iamVjdEJpbmRpbmcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGFCaW5kaW5nS2V5cyA9IE9iamVjdC5rZXlzKG9FbGVtZW50Lm1CaW5kaW5nSW5mb3MpO1xuXHRcdFx0XHRcdGlmIChhQmluZGluZ0tleXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0YUJpbmRpbmdLZXlzLmZvckVhY2goc1Byb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG9MaXN0QmluZGluZyA9IG9FbGVtZW50Lm1CaW5kaW5nSW5mb3Nbc1Byb3BlcnR5TmFtZV0uYmluZGluZztcblx0XHRcdFx0XHRcdFx0Ly8gUmVnaXN0ZXIgb24gYWxsIGxpc3QgYmluZGluZywgZ29vZCBmb3IgYmFzaWMgdGFibGVzLCBwcm9ibGVtYXRpYyBmb3IgTURDLCBzZWUgYWJvdmVcblx0XHRcdFx0XHRcdFx0aWYgKG9MaXN0QmluZGluZyAmJiBvTGlzdEJpbmRpbmcuaXNBKFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhTGlzdEJpbmRpbmdcIikpIHtcblx0XHRcdFx0XHRcdFx0XHRvTGlzdEJpbmRpbmcuYXR0YWNoRGF0YVJlcXVlc3RlZChmblJlcXVlc3RlZCk7XG5cdFx0XHRcdFx0XHRcdFx0b0xpc3RCaW5kaW5nLmF0dGFjaERhdGFSZWNlaXZlZChmblJlY2VpdmVkKTtcblx0XHRcdFx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG9MaXN0QmluZGluZyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBUaGlzIGlzIGRpcnR5IGJ1dCBNREMgVGFibGUgaGFzIGEgd2VpcmQgbG9hZGluZyBsaWZlY3ljbGVcblx0XHRcdFx0aWYgKG9FbGVtZW50LmlzQShcInNhcC51aS5tZGMuVGFibGVcIikpIHtcblx0XHRcdFx0XHR0aGlzLmJUYWJsZXNMb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0XHQvLyBhY2Nlc3MgYmluZGluZyBvbmx5IGFmdGVyIHRhYmxlIGlzIGJvdW5kXG5cdFx0XHRcdFx0YVRhYmxlSW5pdGlhbGl6ZWRQcm9taXNlcy5wdXNoKFxuXHRcdFx0XHRcdFx0b0VsZW1lbnRcblx0XHRcdFx0XHRcdFx0LmluaXRpYWxpemVkKClcblx0XHRcdFx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IG9Sb3dCaW5kaW5nID0gb0VsZW1lbnQuZ2V0Um93QmluZGluZygpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChvUm93QmluZGluZykge1xuXHRcdFx0XHRcdFx0XHRcdFx0b1Jvd0JpbmRpbmcuYXR0YWNoRGF0YVJlcXVlc3RlZChmblJlcXVlc3RlZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRvUm93QmluZGluZy5hdHRhY2hEYXRhUmVjZWl2ZWQoZm5SZWNlaXZlZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG9Sb3dCaW5kaW5nKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0YU5vdEJvdW5kTURDVGFibGVzLnB1c2gob0VsZW1lbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uKG9FcnJvcjogRXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJDYW5ub3QgZmluZCBhIGJvdW5kIHRhYmxlXCIsIG9FcnJvcik7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIGlmIChvRWxlbWVudC5pc0EoXCJzYXAudWkubWRjLkZpbHRlckJhclwiKSkge1xuXHRcdFx0XHRcdG9FbGVtZW50LmF0dGFjaEV2ZW50KFwic2VhcmNoXCIsIGZuU2VhcmNoKTtcblx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG9FbGVtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoYVRhYmxlSW5pdGlhbGl6ZWRQcm9taXNlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFByb21pc2UuYWxsKGFUYWJsZUluaXRpYWxpemVkUHJvbWlzZXMpXG5cdFx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5iVGFibGVzTG9hZGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHRoaXMuY2hlY2tQYWdlUmVhZHlEZWJvdW5jZWQoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChvRXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0TG9nLmluZm8oXCJUaGVyZSB3YXMgYW4gZXJyb3Igd2l0aCBvbmUgb3IgbXVsdGlwbGUgdGFibGVcIiwgb0Vycm9yKTtcblx0XHRcdFx0XHRcdHRoaXMuYlRhYmxlc0xvYWRlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR0aGlzLmNoZWNrUGFnZVJlYWR5RGVib3VuY2VkKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0QFB1YmxpY1xuXHRARmluYWxcblx0cHVibGljIGlzUGFnZVJlYWR5KCkge1xuXHRcdHJldHVybiB0aGlzLl9iSXNQYWdlUmVhZHk7XG5cdH1cblx0QFB1YmxpY1xuXHRARmluYWxcblx0cHVibGljIGF0dGFjaEV2ZW50T25jZShzRXZlbnRJZDogc3RyaW5nLCBvRGF0YTogYW55LCBmbkZ1bmN0aW9uOiBGdW5jdGlvbiwgb0xpc3RlbmVyOiBhbnkpIHtcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLXJlc3QtcGFyYW1zXG5cdFx0cmV0dXJuIHRoaXMuX29FdmVudFByb3ZpZGVyLmF0dGFjaEV2ZW50T25jZShzRXZlbnRJZCwgb0RhdGEsIGZuRnVuY3Rpb24sIG9MaXN0ZW5lcik7XG5cdH1cblx0QFB1YmxpY1xuXHRARmluYWxcblx0cHVibGljIGF0dGFjaEV2ZW50KHNFdmVudElkOiBzdHJpbmcsIG9EYXRhOiBhbnksIGZuRnVuY3Rpb246IEZ1bmN0aW9uLCBvTGlzdGVuZXI6IGFueSkge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItcmVzdC1wYXJhbXNcblx0XHRyZXR1cm4gdGhpcy5fb0V2ZW50UHJvdmlkZXIuYXR0YWNoRXZlbnQoc0V2ZW50SWQsIG9EYXRhLCBmbkZ1bmN0aW9uLCBvTGlzdGVuZXIpO1xuXHR9XG5cdEBQdWJsaWNcblx0QEZpbmFsXG5cdHB1YmxpYyBkZXRhY2hFdmVudChzRXZlbnRJZDogc3RyaW5nLCBmbkZ1bmN0aW9uOiBGdW5jdGlvbikge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItcmVzdC1wYXJhbXNcblx0XHRyZXR1cm4gdGhpcy5fb0V2ZW50UHJvdmlkZXIuZGV0YWNoRXZlbnQoc0V2ZW50SWQsIGZuRnVuY3Rpb24pO1xuXHR9XG5cdHByaXZhdGUgcmVnaXN0ZXJDb250YWluZXIob0NvbnRhaW5lcjogTWFuYWdlZE9iamVjdCkge1xuXHRcdHRoaXMuX29Db250YWluZXIgPSBvQ29udGFpbmVyO1xuXHRcdHRoaXMuX29Db250YWluZXIuYWRkRXZlbnREZWxlZ2F0ZSh7XG5cdFx0XHRvbkJlZm9yZVNob3c6ICgpID0+IHtcblx0XHRcdFx0dGhpcy5iU2hvd24gPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5fYklzUGFnZVJlYWR5ID0gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0b25CZWZvcmVIaWRlOiAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuYlNob3duID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMuX2JJc1BhZ2VSZWFkeSA9IGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdG9uQWZ0ZXJTaG93OiAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuYlNob3duID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fY2hlY2tQYWdlUmVhZHkodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRAUHJpdmF0ZVxuXHRARXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5JbnN0ZWFkKVxuXHRwdWJsaWMgaXNDb250ZXh0RXhwZWN0ZWQoKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cHVibGljIGNoZWNrUGFnZVJlYWR5RGVib3VuY2VkKCkge1xuXHRcdGlmICh0aGlzLnBhZ2VSZWFkeVRpbWVyKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5wYWdlUmVhZHlUaW1lcik7XG5cdFx0fVxuXHRcdHRoaXMucGFnZVJlYWR5VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMuX2NoZWNrUGFnZVJlYWR5KCk7XG5cdFx0fSwgMjAwKTtcblx0fVxuXG5cdHB1YmxpYyBfY2hlY2tQYWdlUmVhZHkoYkZyb21OYXY6IGJvb2xlYW4gPSBmYWxzZSkge1xuXHRcdGNvbnN0IGZuVUlVcGRhdGVkID0gKCkgPT4ge1xuXHRcdFx0Ly8gV2FpdCB1bnRpbCB0aGUgVUkgaXMgbm8gbG9uZ2VyIGRpcnR5XG5cdFx0XHRpZiAoIXNhcC51aS5nZXRDb3JlKCkuZ2V0VUlEaXJ0eSgpKSB7XG5cdFx0XHRcdHNhcC51aS5nZXRDb3JlKCkuZGV0YWNoRXZlbnQoXCJVSVVwZGF0ZWRcIiwgZm5VSVVwZGF0ZWQpO1xuXHRcdFx0XHR0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2ggPSBmYWxzZTtcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fY2hlY2tQYWdlUmVhZHkoKTtcblx0XHRcdFx0fSwgMjApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBJbiBjYXNlIFVJVXBkYXRlIGRvZXMgbm90IGdldCBjYWxsZWQsIGNoZWNrIGlmIFVJIGlzIG5vdCBkaXJ0eSBhbmQgdGhlbiBjYWxsIF9jaGVja1BhZ2VSZWFkeVxuXHRcdGNvbnN0IGNoZWNrVUlVcGRhdGVkID0gKCkgPT4ge1xuXHRcdFx0aWYgKHNhcC51aS5nZXRDb3JlKCkuZ2V0VUlEaXJ0eSgpKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoY2hlY2tVSVVwZGF0ZWQsIDUwMCk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX2JXYWl0aW5nRm9yUmVmcmVzaCkge1xuXHRcdFx0XHR0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2ggPSBmYWxzZTtcblx0XHRcdFx0c2FwLnVpLmdldENvcmUoKS5kZXRhY2hFdmVudChcIlVJVXBkYXRlZFwiLCBmblVJVXBkYXRlZCk7XG5cdFx0XHRcdHRoaXMuX2NoZWNrUGFnZVJlYWR5KCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGlmIChcblx0XHRcdHRoaXMuYlNob3duICYmXG5cdFx0XHR0aGlzLmJEYXRhUmVjZWl2ZWQgIT09IGZhbHNlICYmXG5cdFx0XHR0aGlzLmJUYWJsZXNMb2FkZWQgIT09IGZhbHNlICYmXG5cdFx0XHQoIXRoaXMuaXNDb250ZXh0RXhwZWN0ZWQoKSB8fCB0aGlzLmJIYXNDb250ZXh0KSAvLyBFaXRoZXIgbm8gY29udGV4dCBpcyBleHBlY3RlZCBvciB0aGVyZSBpcyBvbmVcblx0XHQpIHtcblx0XHRcdGlmICh0aGlzLmJEYXRhUmVjZWl2ZWQgPT09IHRydWUgJiYgIWJGcm9tTmF2ICYmICF0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2ggJiYgc2FwLnVpLmdldENvcmUoKS5nZXRVSURpcnR5KCkpIHtcblx0XHRcdFx0Ly8gSWYgd2UgcmVxdWVzdGVkIGRhdGEgd2UgZ2V0IG5vdGlmaWVkIGFzIHNvb24gYXMgdGhlIGRhdGEgYXJyaXZlZCwgc28gYmVmb3JlIHRoZSBuZXh0IHJlbmRlcmluZyB0aWNrXG5cdFx0XHRcdHRoaXMuYkRhdGFSZWNlaXZlZCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0dGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoID0gdHJ1ZTtcblx0XHRcdFx0c2FwLnVpLmdldENvcmUoKS5hdHRhY2hFdmVudChcIlVJVXBkYXRlZFwiLCBmblVJVXBkYXRlZCk7XG5cdFx0XHRcdHNldFRpbWVvdXQoY2hlY2tVSVVwZGF0ZWQsIDUwMCk7XG5cdFx0XHR9IGVsc2UgaWYgKCF0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2ggJiYgc2FwLnVpLmdldENvcmUoKS5nZXRVSURpcnR5KCkpIHtcblx0XHRcdFx0dGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoID0gdHJ1ZTtcblx0XHRcdFx0c2FwLnVpLmdldENvcmUoKS5hdHRhY2hFdmVudChcIlVJVXBkYXRlZFwiLCBmblVJVXBkYXRlZCk7XG5cdFx0XHRcdHNldFRpbWVvdXQoY2hlY2tVSVVwZGF0ZWQsIDUwMCk7XG5cdFx0XHR9IGVsc2UgaWYgKCF0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2gpIHtcblx0XHRcdFx0Ly8gSW4gdGhlIGNhc2Ugd2UncmUgbm90IHdhaXRpbmcgZm9yIGFueSBkYXRhIChuYXZpZ2F0aW5nIGJhY2sgdG8gYSBwYWdlIHdlIGFscmVhZHkgaGF2ZSBsb2FkZWQpXG5cdFx0XHRcdC8vIGp1c3Qgd2FpdCBmb3IgYSBmcmFtZSB0byBmaXJlIHRoZSBldmVudC5cblx0XHRcdFx0dGhpcy5fYklzUGFnZVJlYWR5ID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fb0V2ZW50UHJvdmlkZXIuZmlyZUV2ZW50KFwicGFnZVJlYWR5XCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYWdlUmVhZHlDb250cm9sbGVyRXh0ZW5zaW9uO1xuIl19