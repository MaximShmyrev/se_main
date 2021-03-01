sap.ui.define(["sap/ui/core/service/ServiceFactory", "sap/ui/core/service/Service", "../converters/MetaModelConverter"], function (ServiceFactory, Service, MetaModelConverter) {
  "use strict";

  var DefaultEnvironmentCapabilities = MetaModelConverter.DefaultEnvironmentCapabilities;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

  var EnvironmentCapabilitiesService = /*#__PURE__*/function (_Service) {
    _inherits(EnvironmentCapabilitiesService, _Service);

    var _super = _createSuper(EnvironmentCapabilitiesService);

    function EnvironmentCapabilitiesService() {
      _classCallCheck(this, EnvironmentCapabilitiesService);

      return _super.apply(this, arguments);
    }

    _createClass(EnvironmentCapabilitiesService, [{
      key: "init",
      // !: means that we know it will be assigned before usage
      value: function init() {
        var _this = this;

        this.initPromise = new Promise(function (resolve, reject) {
          _this.resolveFn = resolve;
          _this.rejectFn = reject;
        });
        var oContext = this.getContext();
        this.environmentCapabilities = Object.assign({}, DefaultEnvironmentCapabilities);
        Promise.all([this.resolveLibrary("sap.chart"), this.resolveLibrary("sap.suite.ui.microchart")]).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              chartCapabilities = _ref2[0],
              microChartCapabilities = _ref2[1];

          _this.environmentCapabilities.Chart = chartCapabilities;
          _this.environmentCapabilities.MicroChart = microChartCapabilities;
          _this.environmentCapabilities.UShell = !!(sap && sap.ushell && sap.ushell.Container);
          _this.environmentCapabilities.IntentBasedNavigation = !!(sap && sap.ushell && sap.ushell.Container);
          _this.environmentCapabilities = Object.assign(_this.environmentCapabilities, oContext.settings);

          _this.resolveFn(_this);
        }).catch(this.rejectFn);
      }
    }, {
      key: "resolveLibrary",
      value: function resolveLibrary(libraryName) {
        return new Promise(function (resolve) {
          try {
            sap.ui.require(["".concat(libraryName.replace(/\./g, "/"), "/library")], function () {
              resolve(true);
            }, function () {
              resolve(false);
            });
          } catch (e) {
            resolve(false);
          }
        });
      }
    }, {
      key: "setCapabilities",
      value: function setCapabilities(oCapabilities) {
        this.environmentCapabilities = oCapabilities;
      }
    }, {
      key: "getCapabilities",
      value: function getCapabilities() {
        return this.environmentCapabilities;
      }
    }, {
      key: "getInterface",
      value: function getInterface() {
        return this;
      }
    }]);

    return EnvironmentCapabilitiesService;
  }(Service);

  var EnvironmentServiceFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inherits(EnvironmentServiceFactory, _ServiceFactory);

    var _super2 = _createSuper(EnvironmentServiceFactory);

    function EnvironmentServiceFactory() {
      _classCallCheck(this, EnvironmentServiceFactory);

      return _super2.apply(this, arguments);
    }

    _createClass(EnvironmentServiceFactory, [{
      key: "createInstance",
      value: function createInstance(oServiceContext) {
        var environmentCapabilitiesService = new EnvironmentCapabilitiesService(oServiceContext);
        return environmentCapabilitiesService.initPromise;
      }
    }]);

    return EnvironmentServiceFactory;
  }(ServiceFactory);

  return EnvironmentServiceFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudmlyb25tZW50U2VydmljZUZhY3RvcnkudHMiXSwibmFtZXMiOlsiRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNTZXJ2aWNlIiwiaW5pdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlc29sdmVGbiIsInJlamVjdEZuIiwib0NvbnRleHQiLCJnZXRDb250ZXh0IiwiZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMiLCJPYmplY3QiLCJhc3NpZ24iLCJEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMiLCJhbGwiLCJyZXNvbHZlTGlicmFyeSIsInRoZW4iLCJjaGFydENhcGFiaWxpdGllcyIsIm1pY3JvQ2hhcnRDYXBhYmlsaXRpZXMiLCJDaGFydCIsIk1pY3JvQ2hhcnQiLCJVU2hlbGwiLCJzYXAiLCJ1c2hlbGwiLCJDb250YWluZXIiLCJJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJzZXR0aW5ncyIsImNhdGNoIiwibGlicmFyeU5hbWUiLCJ1aSIsInJlcXVpcmUiLCJyZXBsYWNlIiwiZSIsIm9DYXBhYmlsaXRpZXMiLCJTZXJ2aWNlIiwiRW52aXJvbm1lbnRTZXJ2aWNlRmFjdG9yeSIsIm9TZXJ2aWNlQ29udGV4dCIsImVudmlyb25tZW50Q2FwYWJpbGl0aWVzU2VydmljZSIsIlNlcnZpY2VGYWN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BR01BLDhCOzs7Ozs7Ozs7Ozs7O0FBS0w7NkJBRU87QUFBQTs7QUFDTixhQUFLQyxXQUFMLEdBQW1CLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDbkQsVUFBQSxLQUFJLENBQUNDLFNBQUwsR0FBaUJGLE9BQWpCO0FBQ0EsVUFBQSxLQUFJLENBQUNHLFFBQUwsR0FBZ0JGLE1BQWhCO0FBQ0EsU0FIa0IsQ0FBbkI7QUFJQSxZQUFNRyxRQUFRLEdBQUcsS0FBS0MsVUFBTCxFQUFqQjtBQUNBLGFBQUtDLHVCQUFMLEdBQStCQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCQyw4QkFBbEIsQ0FBL0I7QUFDQVYsUUFBQUEsT0FBTyxDQUFDVyxHQUFSLENBQVksQ0FBQyxLQUFLQyxjQUFMLENBQW9CLFdBQXBCLENBQUQsRUFBbUMsS0FBS0EsY0FBTCxDQUFvQix5QkFBcEIsQ0FBbkMsQ0FBWixFQUNFQyxJQURGLENBQ08sZ0JBQWlEO0FBQUE7QUFBQSxjQUEvQ0MsaUJBQStDO0FBQUEsY0FBNUJDLHNCQUE0Qjs7QUFDdEQsVUFBQSxLQUFJLENBQUNSLHVCQUFMLENBQTZCUyxLQUE3QixHQUFxQ0YsaUJBQXJDO0FBQ0EsVUFBQSxLQUFJLENBQUNQLHVCQUFMLENBQTZCVSxVQUE3QixHQUEwQ0Ysc0JBQTFDO0FBQ0EsVUFBQSxLQUFJLENBQUNSLHVCQUFMLENBQTZCVyxNQUE3QixHQUFzQyxDQUFDLEVBQUVDLEdBQUcsSUFBSUEsR0FBRyxDQUFDQyxNQUFYLElBQXFCRCxHQUFHLENBQUNDLE1BQUosQ0FBV0MsU0FBbEMsQ0FBdkM7QUFDQSxVQUFBLEtBQUksQ0FBQ2QsdUJBQUwsQ0FBNkJlLHFCQUE3QixHQUFxRCxDQUFDLEVBQUVILEdBQUcsSUFBSUEsR0FBRyxDQUFDQyxNQUFYLElBQXFCRCxHQUFHLENBQUNDLE1BQUosQ0FBV0MsU0FBbEMsQ0FBdEQ7QUFDQSxVQUFBLEtBQUksQ0FBQ2QsdUJBQUwsR0FBK0JDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEtBQUksQ0FBQ0YsdUJBQW5CLEVBQTRDRixRQUFRLENBQUNrQixRQUFyRCxDQUEvQjs7QUFDQSxVQUFBLEtBQUksQ0FBQ3BCLFNBQUwsQ0FBZSxLQUFmO0FBQ0EsU0FSRixFQVNFcUIsS0FURixDQVNRLEtBQUtwQixRQVRiO0FBVUE7OztxQ0FFY3FCLFcsRUFBdUM7QUFDckQsZUFBTyxJQUFJekIsT0FBSixDQUFZLFVBQVNDLE9BQVQsRUFBa0I7QUFDcEMsY0FBSTtBQUNIa0IsWUFBQUEsR0FBRyxDQUFDTyxFQUFKLENBQU9DLE9BQVAsQ0FDQyxXQUFJRixXQUFXLENBQUNHLE9BQVosQ0FBb0IsS0FBcEIsRUFBMkIsR0FBM0IsQ0FBSixjQURELEVBRUMsWUFBVztBQUNWM0IsY0FBQUEsT0FBTyxDQUFDLElBQUQsQ0FBUDtBQUNBLGFBSkYsRUFLQyxZQUFXO0FBQ1ZBLGNBQUFBLE9BQU8sQ0FBQyxLQUFELENBQVA7QUFDQSxhQVBGO0FBU0EsV0FWRCxDQVVFLE9BQU80QixDQUFQLEVBQVU7QUFDWDVCLFlBQUFBLE9BQU8sQ0FBQyxLQUFELENBQVA7QUFDQTtBQUNELFNBZE0sQ0FBUDtBQWVBOzs7c0NBRXNCNkIsYSxFQUF3QztBQUM5RCxhQUFLdkIsdUJBQUwsR0FBK0J1QixhQUEvQjtBQUNBOzs7d0NBRXdCO0FBQ3hCLGVBQU8sS0FBS3ZCLHVCQUFaO0FBQ0E7OztxQ0FFbUI7QUFDbkIsZUFBTyxJQUFQO0FBQ0E7Ozs7SUF0RDJDd0IsTzs7TUF5RHZDQyx5Qjs7Ozs7Ozs7Ozs7OztxQ0FDVUMsZSxFQUEwRDtBQUN4RSxZQUFNQyw4QkFBOEIsR0FBRyxJQUFJcEMsOEJBQUosQ0FBbUNtQyxlQUFuQyxDQUF2QztBQUNBLGVBQU9DLDhCQUE4QixDQUFDbkMsV0FBdEM7QUFDQTs7OztJQUpzQ29DLGM7O1NBT3pCSCx5QiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmljZUZhY3RvcnksIFNlcnZpY2UsIFNlcnZpY2VDb250ZXh0IH0gZnJvbSBcInNhcC91aS9jb3JlL3NlcnZpY2VcIjtcbmltcG9ydCB7IERlZmF1bHRFbnZpcm9ubWVudENhcGFiaWxpdGllcywgRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgfSBmcm9tIFwiLi4vY29udmVydGVycy9NZXRhTW9kZWxDb252ZXJ0ZXJcIjtcblxuY2xhc3MgRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNTZXJ2aWNlIGV4dGVuZHMgU2VydmljZTxFbnZpcm9ubWVudENhcGFiaWxpdGllcz4ge1xuXHRyZXNvbHZlRm46IGFueTtcblx0cmVqZWN0Rm46IGFueTtcblx0aW5pdFByb21pc2UhOiBQcm9taXNlPGFueT47XG5cdGVudmlyb25tZW50Q2FwYWJpbGl0aWVzITogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXM7XG5cdC8vICE6IG1lYW5zIHRoYXQgd2Uga25vdyBpdCB3aWxsIGJlIGFzc2lnbmVkIGJlZm9yZSB1c2FnZVxuXG5cdGluaXQoKSB7XG5cdFx0dGhpcy5pbml0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMucmVzb2x2ZUZuID0gcmVzb2x2ZTtcblx0XHRcdHRoaXMucmVqZWN0Rm4gPSByZWplY3Q7XG5cdFx0fSk7XG5cdFx0Y29uc3Qgb0NvbnRleHQgPSB0aGlzLmdldENvbnRleHQoKTtcblx0XHR0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzID0gT2JqZWN0LmFzc2lnbih7fSwgRGVmYXVsdEVudmlyb25tZW50Q2FwYWJpbGl0aWVzKTtcblx0XHRQcm9taXNlLmFsbChbdGhpcy5yZXNvbHZlTGlicmFyeShcInNhcC5jaGFydFwiKSwgdGhpcy5yZXNvbHZlTGlicmFyeShcInNhcC5zdWl0ZS51aS5taWNyb2NoYXJ0XCIpXSlcblx0XHRcdC50aGVuKChbY2hhcnRDYXBhYmlsaXRpZXMsIG1pY3JvQ2hhcnRDYXBhYmlsaXRpZXNdKSA9PiB7XG5cdFx0XHRcdHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMuQ2hhcnQgPSBjaGFydENhcGFiaWxpdGllcztcblx0XHRcdFx0dGhpcy5lbnZpcm9ubWVudENhcGFiaWxpdGllcy5NaWNyb0NoYXJ0ID0gbWljcm9DaGFydENhcGFiaWxpdGllcztcblx0XHRcdFx0dGhpcy5lbnZpcm9ubWVudENhcGFiaWxpdGllcy5VU2hlbGwgPSAhIShzYXAgJiYgc2FwLnVzaGVsbCAmJiBzYXAudXNoZWxsLkNvbnRhaW5lcik7XG5cdFx0XHRcdHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMuSW50ZW50QmFzZWROYXZpZ2F0aW9uID0gISEoc2FwICYmIHNhcC51c2hlbGwgJiYgc2FwLnVzaGVsbC5Db250YWluZXIpO1xuXHRcdFx0XHR0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzID0gT2JqZWN0LmFzc2lnbih0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzLCBvQ29udGV4dC5zZXR0aW5ncyk7XG5cdFx0XHRcdHRoaXMucmVzb2x2ZUZuKHRoaXMpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaCh0aGlzLnJlamVjdEZuKTtcblx0fVxuXG5cdHJlc29sdmVMaWJyYXJ5KGxpYnJhcnlOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0c2FwLnVpLnJlcXVpcmUoXG5cdFx0XHRcdFx0W2Ake2xpYnJhcnlOYW1lLnJlcGxhY2UoL1xcLi9nLCBcIi9cIil9L2xpYnJhcnlgXSxcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgc2V0Q2FwYWJpbGl0aWVzKG9DYXBhYmlsaXRpZXM6IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzKSB7XG5cdFx0dGhpcy5lbnZpcm9ubWVudENhcGFiaWxpdGllcyA9IG9DYXBhYmlsaXRpZXM7XG5cdH1cblxuXHRwdWJsaWMgZ2V0Q2FwYWJpbGl0aWVzKCkge1xuXHRcdHJldHVybiB0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzO1xuXHR9XG5cblx0Z2V0SW50ZXJmYWNlKCk6IGFueSB7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cblxuY2xhc3MgRW52aXJvbm1lbnRTZXJ2aWNlRmFjdG9yeSBleHRlbmRzIFNlcnZpY2VGYWN0b3J5PEVudmlyb25tZW50Q2FwYWJpbGl0aWVzPiB7XG5cdGNyZWF0ZUluc3RhbmNlKG9TZXJ2aWNlQ29udGV4dDogU2VydmljZUNvbnRleHQ8RW52aXJvbm1lbnRDYXBhYmlsaXRpZXM+KSB7XG5cdFx0Y29uc3QgZW52aXJvbm1lbnRDYXBhYmlsaXRpZXNTZXJ2aWNlID0gbmV3IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzU2VydmljZShvU2VydmljZUNvbnRleHQpO1xuXHRcdHJldHVybiBlbnZpcm9ubWVudENhcGFiaWxpdGllc1NlcnZpY2UuaW5pdFByb21pc2U7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRW52aXJvbm1lbnRTZXJ2aWNlRmFjdG9yeTtcbiJdfQ==