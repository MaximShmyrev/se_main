sap.ui.define(["sap/fe/core/support/CommonHelper", "sap/fe/core/converters/helpers/IssueManager"], function (CommonHelper, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var Audiences = CommonHelper.Audiences;
  var getIssueByCategory = CommonHelper.getIssueByCategory;
  var Categories = CommonHelper.Categories;
  var oAnnotationIssue = {
    id: "annotationIssue",
    title: "Annotations: Incorrect path or target",
    minversion: "1.85",
    audiences: [Audiences.Application],
    categories: [Categories.Usage],
    description: "This rule identifies the incorrect path or targets defined in the metadata of the annotation.xml file or CDS annotations.",
    resolution: "Please review the message details for more information.",
    resolutionurls: [{
      "text": "CDS Annotations reference",
      "href": "https://cap.cloud.sap/docs/cds/common"
    }],
    check: function (oIssueManager, oCoreFacade)
    /*oScope: any*/
    {
      getIssueByCategory(oIssueManager, oCoreFacade, IssueCategory.Annotation);
    }
  };

  function getRules() {
    return [oAnnotationIssue];
  }

  _exports.getRules = getRules;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFubm90YXRpb25Jc3N1ZS5zdXBwb3J0LnRzIl0sIm5hbWVzIjpbIm9Bbm5vdGF0aW9uSXNzdWUiLCJpZCIsInRpdGxlIiwibWludmVyc2lvbiIsImF1ZGllbmNlcyIsIkF1ZGllbmNlcyIsIkFwcGxpY2F0aW9uIiwiY2F0ZWdvcmllcyIsIkNhdGVnb3JpZXMiLCJVc2FnZSIsImRlc2NyaXB0aW9uIiwicmVzb2x1dGlvbiIsInJlc29sdXRpb251cmxzIiwiY2hlY2siLCJvSXNzdWVNYW5hZ2VyIiwib0NvcmVGYWNhZGUiLCJnZXRJc3N1ZUJ5Q2F0ZWdvcnkiLCJJc3N1ZUNhdGVnb3J5IiwiQW5ub3RhdGlvbiIsImdldFJ1bGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBLE1BQU1BLGdCQUFnQixHQUFHO0FBQ3hCQyxJQUFBQSxFQUFFLEVBQUUsaUJBRG9CO0FBRXhCQyxJQUFBQSxLQUFLLEVBQUUsdUNBRmlCO0FBR3hCQyxJQUFBQSxVQUFVLEVBQUUsTUFIWTtBQUl4QkMsSUFBQUEsU0FBUyxFQUFFLENBQUNDLFNBQVMsQ0FBQ0MsV0FBWCxDQUphO0FBS3hCQyxJQUFBQSxVQUFVLEVBQUUsQ0FBQ0MsVUFBVSxDQUFDQyxLQUFaLENBTFk7QUFNeEJDLElBQUFBLFdBQVcsRUFDViwySEFQdUI7QUFReEJDLElBQUFBLFVBQVUsRUFBRSx5REFSWTtBQVN4QkMsSUFBQUEsY0FBYyxFQUFFLENBQUM7QUFBRSxjQUFRLDJCQUFWO0FBQXVDLGNBQVE7QUFBL0MsS0FBRCxDQVRRO0FBVXhCQyxJQUFBQSxLQUFLLEVBQUUsVUFBU0MsYUFBVCxFQUE2QkMsV0FBN0I7QUFBOEM7QUFBaUI7QUFDckVDLE1BQUFBLGtCQUFrQixDQUFDRixhQUFELEVBQWdCQyxXQUFoQixFQUE2QkUsYUFBYSxDQUFDQyxVQUEzQyxDQUFsQjtBQUNBO0FBWnVCLEdBQXpCOztBQWNPLFdBQVNDLFFBQVQsR0FBb0I7QUFDMUIsV0FBTyxDQUFDbkIsZ0JBQUQsQ0FBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYXRlZ29yaWVzLCBnZXRJc3N1ZUJ5Q2F0ZWdvcnksIEF1ZGllbmNlcyB9IGZyb20gXCJzYXAvZmUvY29yZS9zdXBwb3J0L0NvbW1vbkhlbHBlclwiO1xuaW1wb3J0IHsgSXNzdWVDYXRlZ29yeSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5cbmNvbnN0IG9Bbm5vdGF0aW9uSXNzdWUgPSB7XG5cdGlkOiBcImFubm90YXRpb25Jc3N1ZVwiLFxuXHR0aXRsZTogXCJBbm5vdGF0aW9uczogSW5jb3JyZWN0IHBhdGggb3IgdGFyZ2V0XCIsXG5cdG1pbnZlcnNpb246IFwiMS44NVwiLFxuXHRhdWRpZW5jZXM6IFtBdWRpZW5jZXMuQXBwbGljYXRpb25dLFxuXHRjYXRlZ29yaWVzOiBbQ2F0ZWdvcmllcy5Vc2FnZV0sXG5cdGRlc2NyaXB0aW9uOlxuXHRcdFwiVGhpcyBydWxlIGlkZW50aWZpZXMgdGhlIGluY29ycmVjdCBwYXRoIG9yIHRhcmdldHMgZGVmaW5lZCBpbiB0aGUgbWV0YWRhdGEgb2YgdGhlIGFubm90YXRpb24ueG1sIGZpbGUgb3IgQ0RTIGFubm90YXRpb25zLlwiLFxuXHRyZXNvbHV0aW9uOiBcIlBsZWFzZSByZXZpZXcgdGhlIG1lc3NhZ2UgZGV0YWlscyBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cIixcblx0cmVzb2x1dGlvbnVybHM6IFt7IFwidGV4dFwiOiBcIkNEUyBBbm5vdGF0aW9ucyByZWZlcmVuY2VcIiwgXCJocmVmXCI6IFwiaHR0cHM6Ly9jYXAuY2xvdWQuc2FwL2RvY3MvY2RzL2NvbW1vblwiIH1dLFxuXHRjaGVjazogZnVuY3Rpb24ob0lzc3VlTWFuYWdlcjogYW55LCBvQ29yZUZhY2FkZTogYW55IC8qb1Njb3BlOiBhbnkqLykge1xuXHRcdGdldElzc3VlQnlDYXRlZ29yeShvSXNzdWVNYW5hZ2VyLCBvQ29yZUZhY2FkZSwgSXNzdWVDYXRlZ29yeS5Bbm5vdGF0aW9uKTtcblx0fVxufTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRSdWxlcygpIHtcblx0cmV0dXJuIFtvQW5ub3RhdGlvbklzc3VlXTtcbn1cbiJdfQ==