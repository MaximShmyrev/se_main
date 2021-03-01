sap.ui.define(["../../helpers/StableIdHelper"], function (StableIdHelper) {
  "use strict";

  var _exports = {};
  var generate = StableIdHelper.generate;
  var BASE_ID = ["fe"];
  /**
   * Shortcut to the stableIdHelper providing a "curry" like method where the last parameter is missing.
   *
   * @param sFixedPart
   * @returns {Function} a shorcut function with the fixed ID part
   */

  function IDGenerator() {
    for (var _len = arguments.length, sFixedPart = new Array(_len), _key = 0; _key < _len; _key++) {
      sFixedPart[_key] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, sIDPart = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        sIDPart[_key2] = arguments[_key2];
      }

      return generate(BASE_ID.concat.apply(BASE_ID, sFixedPart.concat(sIDPart)));
    };
  }
  /**
   * Those are all helpers to centralize ID generation in the code for different elements
   */


  _exports.IDGenerator = IDGenerator;
  var HeaderFacetID = IDGenerator("HeaderFacet");
  _exports.HeaderFacetID = HeaderFacetID;
  var HeaderFacetContainerID = IDGenerator("HeaderFacetContainer");
  _exports.HeaderFacetContainerID = HeaderFacetContainerID;
  var HeaderFacetFormID = IDGenerator("HeaderFacet", "Form");
  _exports.HeaderFacetFormID = HeaderFacetFormID;
  var CustomHeaderFacetID = IDGenerator("HeaderFacetCustomContainer");
  _exports.CustomHeaderFacetID = CustomHeaderFacetID;
  var SectionID = IDGenerator("FacetSection");
  _exports.SectionID = SectionID;
  var CustomSectionID = IDGenerator("CustomSection");
  _exports.CustomSectionID = CustomSectionID;
  var SubSectionID = IDGenerator("FacetSubSection");
  _exports.SubSectionID = SubSectionID;
  var CustomSubSectionID = IDGenerator("CustomSubSection");
  _exports.CustomSubSectionID = CustomSubSectionID;
  var FormID = IDGenerator("Form");
  _exports.FormID = FormID;
  var TableID = IDGenerator("table");
  _exports.TableID = TableID;
  var FilterBarID = IDGenerator("FilterBar");
  _exports.FilterBarID = FilterBarID;

  var FilterVariantManagementID = function (sFilterID) {
    return generate([sFilterID, "VariantManagement"]);
  };

  _exports.FilterVariantManagementID = FilterVariantManagementID;
  var ChartID = IDGenerator("Chart");
  _exports.ChartID = ChartID;

  var CustomActionID = function (sActionID) {
    return generate(["CustomAction", sActionID]);
  };

  _exports.CustomActionID = CustomActionID;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIklELnRzIl0sIm5hbWVzIjpbIkJBU0VfSUQiLCJJREdlbmVyYXRvciIsInNGaXhlZFBhcnQiLCJzSURQYXJ0IiwiZ2VuZXJhdGUiLCJjb25jYXQiLCJIZWFkZXJGYWNldElEIiwiSGVhZGVyRmFjZXRDb250YWluZXJJRCIsIkhlYWRlckZhY2V0Rm9ybUlEIiwiQ3VzdG9tSGVhZGVyRmFjZXRJRCIsIlNlY3Rpb25JRCIsIkN1c3RvbVNlY3Rpb25JRCIsIlN1YlNlY3Rpb25JRCIsIkN1c3RvbVN1YlNlY3Rpb25JRCIsIkZvcm1JRCIsIlRhYmxlSUQiLCJGaWx0ZXJCYXJJRCIsIkZpbHRlclZhcmlhbnRNYW5hZ2VtZW50SUQiLCJzRmlsdGVySUQiLCJDaGFydElEIiwiQ3VzdG9tQWN0aW9uSUQiLCJzQWN0aW9uSUQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0EsTUFBTUEsT0FBaUIsR0FBRyxDQUFDLElBQUQsQ0FBMUI7QUFFQTs7Ozs7OztBQU1PLFdBQVNDLFdBQVQsR0FBOEM7QUFBQSxzQ0FBdEJDLFVBQXNCO0FBQXRCQSxNQUFBQSxVQUFzQjtBQUFBOztBQUNwRCxXQUFPLFlBQStCO0FBQUEseUNBQW5CQyxPQUFtQjtBQUFuQkEsUUFBQUEsT0FBbUI7QUFBQTs7QUFDckMsYUFBT0MsUUFBUSxDQUFDSixPQUFPLENBQUNLLE1BQVIsT0FBQUwsT0FBTyxFQUFXRSxVQUFYLFFBQTBCQyxPQUExQixFQUFSLENBQWY7QUFDQSxLQUZEO0FBR0E7QUFFRDs7Ozs7O0FBR08sTUFBTUcsYUFBYSxHQUFHTCxXQUFXLENBQUMsYUFBRCxDQUFqQzs7QUFDQSxNQUFNTSxzQkFBc0IsR0FBR04sV0FBVyxDQUFDLHNCQUFELENBQTFDOztBQUNBLE1BQU1PLGlCQUFpQixHQUFHUCxXQUFXLENBQUMsYUFBRCxFQUFnQixNQUFoQixDQUFyQzs7QUFDQSxNQUFNUSxtQkFBbUIsR0FBR1IsV0FBVyxDQUFDLDRCQUFELENBQXZDOztBQUNBLE1BQU1TLFNBQVMsR0FBR1QsV0FBVyxDQUFDLGNBQUQsQ0FBN0I7O0FBQ0EsTUFBTVUsZUFBZSxHQUFHVixXQUFXLENBQUMsZUFBRCxDQUFuQzs7QUFDQSxNQUFNVyxZQUFZLEdBQUdYLFdBQVcsQ0FBQyxpQkFBRCxDQUFoQzs7QUFDQSxNQUFNWSxrQkFBa0IsR0FBR1osV0FBVyxDQUFDLGtCQUFELENBQXRDOztBQUNBLE1BQU1hLE1BQU0sR0FBR2IsV0FBVyxDQUFDLE1BQUQsQ0FBMUI7O0FBQ0EsTUFBTWMsT0FBTyxHQUFHZCxXQUFXLENBQUMsT0FBRCxDQUEzQjs7QUFDQSxNQUFNZSxXQUFXLEdBQUdmLFdBQVcsQ0FBQyxXQUFELENBQS9COzs7QUFDQSxNQUFNZ0IseUJBQXlCLEdBQUcsVUFBU0MsU0FBVCxFQUE0QjtBQUNwRSxXQUFPZCxRQUFRLENBQUMsQ0FBQ2MsU0FBRCxFQUFZLG1CQUFaLENBQUQsQ0FBZjtBQUNBLEdBRk07OztBQUdBLE1BQU1DLE9BQU8sR0FBR2xCLFdBQVcsQ0FBQyxPQUFELENBQTNCOzs7QUFDQSxNQUFNbUIsY0FBYyxHQUFHLFVBQVNDLFNBQVQsRUFBNEI7QUFDekQsV0FBT2pCLFFBQVEsQ0FBQyxDQUFDLGNBQUQsRUFBaUJpQixTQUFqQixDQUFELENBQWY7QUFDQSxHQUZNIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJRFBhcnQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVyc1wiO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9TdGFibGVJZEhlbHBlclwiO1xuXG5jb25zdCBCQVNFX0lEOiBJRFBhcnRbXSA9IFtcImZlXCJdO1xuXG4vKipcbiAqIFNob3J0Y3V0IHRvIHRoZSBzdGFibGVJZEhlbHBlciBwcm92aWRpbmcgYSBcImN1cnJ5XCIgbGlrZSBtZXRob2Qgd2hlcmUgdGhlIGxhc3QgcGFyYW1ldGVyIGlzIG1pc3NpbmcuXG4gKlxuICogQHBhcmFtIHNGaXhlZFBhcnRcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gYSBzaG9yY3V0IGZ1bmN0aW9uIHdpdGggdGhlIGZpeGVkIElEIHBhcnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIElER2VuZXJhdG9yKC4uLnNGaXhlZFBhcnQ6IElEUGFydFtdKSB7XG5cdHJldHVybiBmdW5jdGlvbiguLi5zSURQYXJ0OiBJRFBhcnRbXSkge1xuXHRcdHJldHVybiBnZW5lcmF0ZShCQVNFX0lELmNvbmNhdCguLi5zRml4ZWRQYXJ0LCAuLi5zSURQYXJ0KSk7XG5cdH07XG59XG5cbi8qKlxuICogVGhvc2UgYXJlIGFsbCBoZWxwZXJzIHRvIGNlbnRyYWxpemUgSUQgZ2VuZXJhdGlvbiBpbiB0aGUgY29kZSBmb3IgZGlmZmVyZW50IGVsZW1lbnRzXG4gKi9cbmV4cG9ydCBjb25zdCBIZWFkZXJGYWNldElEID0gSURHZW5lcmF0b3IoXCJIZWFkZXJGYWNldFwiKTtcbmV4cG9ydCBjb25zdCBIZWFkZXJGYWNldENvbnRhaW5lcklEID0gSURHZW5lcmF0b3IoXCJIZWFkZXJGYWNldENvbnRhaW5lclwiKTtcbmV4cG9ydCBjb25zdCBIZWFkZXJGYWNldEZvcm1JRCA9IElER2VuZXJhdG9yKFwiSGVhZGVyRmFjZXRcIiwgXCJGb3JtXCIpO1xuZXhwb3J0IGNvbnN0IEN1c3RvbUhlYWRlckZhY2V0SUQgPSBJREdlbmVyYXRvcihcIkhlYWRlckZhY2V0Q3VzdG9tQ29udGFpbmVyXCIpO1xuZXhwb3J0IGNvbnN0IFNlY3Rpb25JRCA9IElER2VuZXJhdG9yKFwiRmFjZXRTZWN0aW9uXCIpO1xuZXhwb3J0IGNvbnN0IEN1c3RvbVNlY3Rpb25JRCA9IElER2VuZXJhdG9yKFwiQ3VzdG9tU2VjdGlvblwiKTtcbmV4cG9ydCBjb25zdCBTdWJTZWN0aW9uSUQgPSBJREdlbmVyYXRvcihcIkZhY2V0U3ViU2VjdGlvblwiKTtcbmV4cG9ydCBjb25zdCBDdXN0b21TdWJTZWN0aW9uSUQgPSBJREdlbmVyYXRvcihcIkN1c3RvbVN1YlNlY3Rpb25cIik7XG5leHBvcnQgY29uc3QgRm9ybUlEID0gSURHZW5lcmF0b3IoXCJGb3JtXCIpO1xuZXhwb3J0IGNvbnN0IFRhYmxlSUQgPSBJREdlbmVyYXRvcihcInRhYmxlXCIpO1xuZXhwb3J0IGNvbnN0IEZpbHRlckJhcklEID0gSURHZW5lcmF0b3IoXCJGaWx0ZXJCYXJcIik7XG5leHBvcnQgY29uc3QgRmlsdGVyVmFyaWFudE1hbmFnZW1lbnRJRCA9IGZ1bmN0aW9uKHNGaWx0ZXJJRDogc3RyaW5nKSB7XG5cdHJldHVybiBnZW5lcmF0ZShbc0ZpbHRlcklELCBcIlZhcmlhbnRNYW5hZ2VtZW50XCJdKTtcbn07XG5leHBvcnQgY29uc3QgQ2hhcnRJRCA9IElER2VuZXJhdG9yKFwiQ2hhcnRcIik7XG5leHBvcnQgY29uc3QgQ3VzdG9tQWN0aW9uSUQgPSBmdW5jdGlvbihzQWN0aW9uSUQ6IHN0cmluZykge1xuXHRyZXR1cm4gZ2VuZXJhdGUoW1wiQ3VzdG9tQWN0aW9uXCIsIHNBY3Rpb25JRF0pO1xufTtcbiJdfQ==