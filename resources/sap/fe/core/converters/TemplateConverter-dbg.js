sap.ui.define(["./templates/ListReportConverter", "./templates/ObjectPageConverter", "./MetaModelConverter", "./templates/BaseConverter", "sap/fe/core/converters/ConverterContext", "sap/fe/core/converters/helpers/IssueManager", "sap/base/util/merge"], function (ListReportConverter, ObjectPageConverter, MetaModelConverter, BaseConverter, ConverterContext, IssueManager, merge) {
  "use strict";

  var _exports = {};
  var IssueCategoryType = IssueManager.IssueCategoryType;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategory = IssueManager.IssueCategory;
  var createConverterContext = ConverterContext.createConverterContext;
  var TemplateType = BaseConverter.TemplateType;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var convertTypes = MetaModelConverter.convertTypes;

  function handleErrorForCollectionFacets(oFacets, oDiagnostics, sEntitySetName, level) {
    oFacets.forEach(function (oFacet) {
      var Message = "For entity set " + sEntitySetName;

      if ((oFacet === null || oFacet === void 0 ? void 0 : oFacet.$Type) === "com.sap.vocabularies.UI.v1.CollectionFacet" && !(oFacet === null || oFacet === void 0 ? void 0 : oFacet.ID)) {
        var _IssueCategoryType$Fa;

        Message = Message + ", " + "level " + level + ", the collection facet does not have an ID.";
        oDiagnostics.addIssue(IssueCategory.Facets, IssueSeverity.High, Message, IssueCategoryType, IssueCategoryType === null || IssueCategoryType === void 0 ? void 0 : (_IssueCategoryType$Fa = IssueCategoryType.Facets) === null || _IssueCategoryType$Fa === void 0 ? void 0 : _IssueCategoryType$Fa.MissingID);
      }

      if ((oFacet === null || oFacet === void 0 ? void 0 : oFacet.$Type) === "com.sap.vocabularies.UI.v1.CollectionFacet" && level >= 3) {
        var _IssueCategoryType$Fa2;

        Message = Message + ", collection facet " + oFacet.Label + " is not supported at " + "level " + level;
        oDiagnostics.addIssue(IssueCategory.Facets, IssueSeverity.Medium, Message, IssueCategoryType, IssueCategoryType === null || IssueCategoryType === void 0 ? void 0 : (_IssueCategoryType$Fa2 = IssueCategoryType.Facets) === null || _IssueCategoryType$Fa2 === void 0 ? void 0 : _IssueCategoryType$Fa2.UnSupportedLevel);
      }

      if (oFacet === null || oFacet === void 0 ? void 0 : oFacet.Facets) {
        handleErrorForCollectionFacets(oFacet === null || oFacet === void 0 ? void 0 : oFacet.Facets, oDiagnostics, sEntitySetName, ++level);
        level = level - 1;
      }
    });
  }
  /**
   * Based on a template type, convert the metamodel and manifest definition into a json structure for the page.
   * @param {TemplateType} sTemplateType the template type
   * @param {ODataMetaModel} oMetaModel the odata model metaModel
   * @param {BaseManifestSettings} oManifestSettings current manifest settings
   * @param {IShellServicesProxy} oShellServices the shellservice instance
   * @param {IDiagnostics} oDiagnostics the diagnostics wrapper
   * @param {string} sFullContextPath the context path to reach this page
   * @param oCapabilities
   * @returns {PageDefinition} the target page definition
   */


  function convertPage(sTemplateType, oMetaModel, oManifestSettings, oShellServices, oDiagnostics, sFullContextPath, oCapabilities) {
    var _oConverterOutput$ent;

    var oConverterOutput = convertTypes(oMetaModel, oCapabilities);
    oConverterOutput.diagnostics.forEach(function (annotationErrorDetail) {
      var checkIfIssueExists = oDiagnostics.checkIfIssueExists(IssueCategory.Annotation, IssueSeverity.High, annotationErrorDetail.message);

      if (!checkIfIssueExists) {
        oDiagnostics.addIssue(IssueCategory.Annotation, IssueSeverity.High, annotationErrorDetail.message);
      }
    });
    oConverterOutput === null || oConverterOutput === void 0 ? void 0 : (_oConverterOutput$ent = oConverterOutput.entityTypes) === null || _oConverterOutput$ent === void 0 ? void 0 : _oConverterOutput$ent.forEach(function (oEntitySet) {
      var _oEntitySet$annotatio, _oEntitySet$annotatio2;

      if (oEntitySet === null || oEntitySet === void 0 ? void 0 : (_oEntitySet$annotatio = oEntitySet.annotations) === null || _oEntitySet$annotatio === void 0 ? void 0 : (_oEntitySet$annotatio2 = _oEntitySet$annotatio.UI) === null || _oEntitySet$annotatio2 === void 0 ? void 0 : _oEntitySet$annotatio2.Facets) {
        var _oEntitySet$annotatio3, _oEntitySet$annotatio4;

        handleErrorForCollectionFacets(oEntitySet === null || oEntitySet === void 0 ? void 0 : (_oEntitySet$annotatio3 = oEntitySet.annotations) === null || _oEntitySet$annotatio3 === void 0 ? void 0 : (_oEntitySet$annotatio4 = _oEntitySet$annotatio3.UI) === null || _oEntitySet$annotatio4 === void 0 ? void 0 : _oEntitySet$annotatio4.Facets, oDiagnostics, oEntitySet === null || oEntitySet === void 0 ? void 0 : oEntitySet.name, 1);
      }
    });
    var sTargetEntitySetName = oManifestSettings.entitySet;
    var oFullContext = getInvolvedDataModelObjects(oMetaModel.createBindingContext(sFullContextPath === "/" ? sFullContextPath + sTargetEntitySetName : sFullContextPath));

    if (oFullContext) {
      var oConvertedPage;

      switch (sTemplateType) {
        case TemplateType.ListReport:
        case TemplateType.AnalyticalListPage:
          oConvertedPage = ListReportConverter.convertPage(createConverterContext(oConverterOutput, oManifestSettings, sTemplateType, oShellServices, oDiagnostics, merge, oFullContext));
          break;

        case TemplateType.ObjectPage:
          oConvertedPage = ObjectPageConverter.convertPage(createConverterContext(oConverterOutput, oManifestSettings, sTemplateType, oShellServices, oDiagnostics, merge, oFullContext));
          break;
      }

      return oConvertedPage;
    }

    return undefined;
  }

  _exports.convertPage = convertPage;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRlbXBsYXRlQ29udmVydGVyLnRzIl0sIm5hbWVzIjpbImhhbmRsZUVycm9yRm9yQ29sbGVjdGlvbkZhY2V0cyIsIm9GYWNldHMiLCJvRGlhZ25vc3RpY3MiLCJzRW50aXR5U2V0TmFtZSIsImxldmVsIiwiZm9yRWFjaCIsIm9GYWNldCIsIk1lc3NhZ2UiLCIkVHlwZSIsIklEIiwiYWRkSXNzdWUiLCJJc3N1ZUNhdGVnb3J5IiwiRmFjZXRzIiwiSXNzdWVTZXZlcml0eSIsIkhpZ2giLCJJc3N1ZUNhdGVnb3J5VHlwZSIsIk1pc3NpbmdJRCIsIkxhYmVsIiwiTWVkaXVtIiwiVW5TdXBwb3J0ZWRMZXZlbCIsImNvbnZlcnRQYWdlIiwic1RlbXBsYXRlVHlwZSIsIm9NZXRhTW9kZWwiLCJvTWFuaWZlc3RTZXR0aW5ncyIsIm9TaGVsbFNlcnZpY2VzIiwic0Z1bGxDb250ZXh0UGF0aCIsIm9DYXBhYmlsaXRpZXMiLCJvQ29udmVydGVyT3V0cHV0IiwiY29udmVydFR5cGVzIiwiZGlhZ25vc3RpY3MiLCJhbm5vdGF0aW9uRXJyb3JEZXRhaWwiLCJjaGVja0lmSXNzdWVFeGlzdHMiLCJBbm5vdGF0aW9uIiwibWVzc2FnZSIsImVudGl0eVR5cGVzIiwib0VudGl0eVNldCIsImFubm90YXRpb25zIiwiVUkiLCJuYW1lIiwic1RhcmdldEVudGl0eVNldE5hbWUiLCJlbnRpdHlTZXQiLCJvRnVsbENvbnRleHQiLCJnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCIsIm9Db252ZXJ0ZWRQYWdlIiwiVGVtcGxhdGVUeXBlIiwiTGlzdFJlcG9ydCIsIkFuYWx5dGljYWxMaXN0UGFnZSIsIkxpc3RSZXBvcnRDb252ZXJ0ZXIiLCJjcmVhdGVDb252ZXJ0ZXJDb250ZXh0IiwibWVyZ2UiLCJPYmplY3RQYWdlIiwiT2JqZWN0UGFnZUNvbnZlcnRlciIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBc0NBLFdBQVNB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SnFCLEVBS3JCdEIsWUFMcUIsRUFNckJnRCxLQU5xQixFQU9yQlQsWUFQcUIsQ0FETixDQUFqQjtBQVdBO0FBM0JGOztBQTZCQSxhQUFPRyxjQUFQO0FBQ0E7O0FBQ0QsV0FBT1MsU0FBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlTWFuaWZlc3RTZXR0aW5ncyB9IGZyb20gXCIuL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCAqIGFzIExpc3RSZXBvcnRDb252ZXJ0ZXIgZnJvbSBcIi4vdGVtcGxhdGVzL0xpc3RSZXBvcnRDb252ZXJ0ZXJcIjtcbmltcG9ydCAqIGFzIE9iamVjdFBhZ2VDb252ZXJ0ZXIgZnJvbSBcIi4vdGVtcGxhdGVzL09iamVjdFBhZ2VDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IGNvbnZlcnRUeXBlcywgZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RzLCBFbnZpcm9ubWVudENhcGFiaWxpdGllcyB9IGZyb20gXCIuL01ldGFNb2RlbENvbnZlcnRlclwiO1xuaW1wb3J0IHsgT0RhdGFNZXRhTW9kZWwgfSBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0XCI7XG5pbXBvcnQgeyBJU2hlbGxTZXJ2aWNlc1Byb3h5LCBUZW1wbGF0ZVR5cGUgfSBmcm9tIFwiLi90ZW1wbGF0ZXMvQmFzZUNvbnZlcnRlclwiO1xuaW1wb3J0IHsgY3JlYXRlQ29udmVydGVyQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCB7IElzc3VlQ2F0ZWdvcnksIElzc3VlU2V2ZXJpdHksIElzc3VlQ2F0ZWdvcnlUeXBlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Jc3N1ZU1hbmFnZXJcIjtcblxuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tIFwic2FwL2Jhc2UvdXRpbFwiO1xuaW1wb3J0IHsgRmFjZXRUeXBlcywgVUlBbm5vdGF0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcblxuLyoqXG4gKiBAdHlwZWRlZiBQYWdlRGVmaW5pdGlvblxuICovXG5leHBvcnQgdHlwZSBQYWdlRGVmaW5pdGlvbiA9IHtcblx0dGVtcGxhdGU6IHN0cmluZztcbn07XG5cbi8qKiBAdHlwZWRlZiBJRGlhZ25vc3RpY3MgKiovXG5leHBvcnQgaW50ZXJmYWNlIElEaWFnbm9zdGljcyB7XG5cdGFkZElzc3VlKFxuXHRcdGlzc3VlQ2F0ZWdvcnk6IElzc3VlQ2F0ZWdvcnkgfCBzdHJpbmcsXG5cdFx0aXNzdWVTZXZlcml0eTogSXNzdWVTZXZlcml0eSxcblx0XHRkZXRhaWxzOiBzdHJpbmcsXG5cdFx0aXNzdWVDYXRlZ29yeVR5cGU/OiBhbnksXG5cdFx0aXNzdWVTdWJDYXRlZ29yeT86IHN0cmluZ1xuXHQpOiB2b2lkO1xuXHRnZXRJc3N1ZXMoKTogYW55W107XG5cdGNoZWNrSWZJc3N1ZUV4aXN0cyhcblx0XHRpc3N1ZUNhdGVnb3J5OiBJc3N1ZUNhdGVnb3J5LFxuXHRcdGlzc3VlU2V2ZXJpdHk6IElzc3VlU2V2ZXJpdHksXG5cdFx0ZGV0YWlsczogc3RyaW5nLFxuXHRcdGlzc3VlQ2F0ZWdvcnlUeXBlPzogYW55LFxuXHRcdGlzc3VlU3ViQ2F0ZWdvcnk/OiBzdHJpbmdcblx0KTogYm9vbGVhbjtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRXJyb3JGb3JDb2xsZWN0aW9uRmFjZXRzKG9GYWNldHM6IEZhY2V0VHlwZXNbXSwgb0RpYWdub3N0aWNzOiBJRGlhZ25vc3RpY3MsIHNFbnRpdHlTZXROYW1lOiBzdHJpbmcsIGxldmVsOiBudW1iZXIpIHtcblx0b0ZhY2V0cy5mb3JFYWNoKChvRmFjZXQ6IGFueSkgPT4ge1xuXHRcdGxldCBNZXNzYWdlID0gXCJGb3IgZW50aXR5IHNldCBcIiArIHNFbnRpdHlTZXROYW1lO1xuXHRcdGlmIChvRmFjZXQ/LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQgJiYgIW9GYWNldD8uSUQpIHtcblx0XHRcdE1lc3NhZ2UgPSBNZXNzYWdlICsgXCIsIFwiICsgXCJsZXZlbCBcIiArIGxldmVsICsgXCIsIHRoZSBjb2xsZWN0aW9uIGZhY2V0IGRvZXMgbm90IGhhdmUgYW4gSUQuXCI7XG5cdFx0XHRvRGlhZ25vc3RpY3MuYWRkSXNzdWUoXG5cdFx0XHRcdElzc3VlQ2F0ZWdvcnkuRmFjZXRzLFxuXHRcdFx0XHRJc3N1ZVNldmVyaXR5LkhpZ2gsXG5cdFx0XHRcdE1lc3NhZ2UsXG5cdFx0XHRcdElzc3VlQ2F0ZWdvcnlUeXBlLFxuXHRcdFx0XHRJc3N1ZUNhdGVnb3J5VHlwZT8uRmFjZXRzPy5NaXNzaW5nSURcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmIChvRmFjZXQ/LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQgJiYgbGV2ZWwgPj0gMykge1xuXHRcdFx0TWVzc2FnZSA9IE1lc3NhZ2UgKyBcIiwgY29sbGVjdGlvbiBmYWNldCBcIiArIG9GYWNldC5MYWJlbCArIFwiIGlzIG5vdCBzdXBwb3J0ZWQgYXQgXCIgKyBcImxldmVsIFwiICsgbGV2ZWw7XG5cdFx0XHRvRGlhZ25vc3RpY3MuYWRkSXNzdWUoXG5cdFx0XHRcdElzc3VlQ2F0ZWdvcnkuRmFjZXRzLFxuXHRcdFx0XHRJc3N1ZVNldmVyaXR5Lk1lZGl1bSxcblx0XHRcdFx0TWVzc2FnZSxcblx0XHRcdFx0SXNzdWVDYXRlZ29yeVR5cGUsXG5cdFx0XHRcdElzc3VlQ2F0ZWdvcnlUeXBlPy5GYWNldHM/LlVuU3VwcG9ydGVkTGV2ZWxcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmIChvRmFjZXQ/LkZhY2V0cykge1xuXHRcdFx0aGFuZGxlRXJyb3JGb3JDb2xsZWN0aW9uRmFjZXRzKG9GYWNldD8uRmFjZXRzLCBvRGlhZ25vc3RpY3MsIHNFbnRpdHlTZXROYW1lLCArK2xldmVsKTtcblx0XHRcdGxldmVsID0gbGV2ZWwgLSAxO1xuXHRcdH1cblx0fSk7XG59XG5cbi8qKlxuICogQmFzZWQgb24gYSB0ZW1wbGF0ZSB0eXBlLCBjb252ZXJ0IHRoZSBtZXRhbW9kZWwgYW5kIG1hbmlmZXN0IGRlZmluaXRpb24gaW50byBhIGpzb24gc3RydWN0dXJlIGZvciB0aGUgcGFnZS5cbiAqIEBwYXJhbSB7VGVtcGxhdGVUeXBlfSBzVGVtcGxhdGVUeXBlIHRoZSB0ZW1wbGF0ZSB0eXBlXG4gKiBAcGFyYW0ge09EYXRhTWV0YU1vZGVsfSBvTWV0YU1vZGVsIHRoZSBvZGF0YSBtb2RlbCBtZXRhTW9kZWxcbiAqIEBwYXJhbSB7QmFzZU1hbmlmZXN0U2V0dGluZ3N9IG9NYW5pZmVzdFNldHRpbmdzIGN1cnJlbnQgbWFuaWZlc3Qgc2V0dGluZ3NcbiAqIEBwYXJhbSB7SVNoZWxsU2VydmljZXNQcm94eX0gb1NoZWxsU2VydmljZXMgdGhlIHNoZWxsc2VydmljZSBpbnN0YW5jZVxuICogQHBhcmFtIHtJRGlhZ25vc3RpY3N9IG9EaWFnbm9zdGljcyB0aGUgZGlhZ25vc3RpY3Mgd3JhcHBlclxuICogQHBhcmFtIHtzdHJpbmd9IHNGdWxsQ29udGV4dFBhdGggdGhlIGNvbnRleHQgcGF0aCB0byByZWFjaCB0aGlzIHBhZ2VcbiAqIEBwYXJhbSBvQ2FwYWJpbGl0aWVzXG4gKiBAcmV0dXJucyB7UGFnZURlZmluaXRpb259IHRoZSB0YXJnZXQgcGFnZSBkZWZpbml0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0UGFnZShcblx0c1RlbXBsYXRlVHlwZTogVGVtcGxhdGVUeXBlLFxuXHRvTWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbCxcblx0b01hbmlmZXN0U2V0dGluZ3M6IEJhc2VNYW5pZmVzdFNldHRpbmdzLFxuXHRvU2hlbGxTZXJ2aWNlczogSVNoZWxsU2VydmljZXNQcm94eSxcblx0b0RpYWdub3N0aWNzOiBJRGlhZ25vc3RpY3MsXG5cdHNGdWxsQ29udGV4dFBhdGg6IHN0cmluZyxcblx0b0NhcGFiaWxpdGllcz86IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzXG4pIHtcblx0Y29uc3Qgb0NvbnZlcnRlck91dHB1dCA9IGNvbnZlcnRUeXBlcyhvTWV0YU1vZGVsLCBvQ2FwYWJpbGl0aWVzKTtcblx0b0NvbnZlcnRlck91dHB1dC5kaWFnbm9zdGljcy5mb3JFYWNoKGFubm90YXRpb25FcnJvckRldGFpbCA9PiB7XG5cdFx0Y29uc3QgY2hlY2tJZklzc3VlRXhpc3RzID0gb0RpYWdub3N0aWNzLmNoZWNrSWZJc3N1ZUV4aXN0cyhcblx0XHRcdElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbixcblx0XHRcdElzc3VlU2V2ZXJpdHkuSGlnaCxcblx0XHRcdGFubm90YXRpb25FcnJvckRldGFpbC5tZXNzYWdlXG5cdFx0KTtcblx0XHRpZiAoIWNoZWNrSWZJc3N1ZUV4aXN0cykge1xuXHRcdFx0b0RpYWdub3N0aWNzLmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5IaWdoLCBhbm5vdGF0aW9uRXJyb3JEZXRhaWwubWVzc2FnZSk7XG5cdFx0fVxuXHR9KTtcblx0b0NvbnZlcnRlck91dHB1dD8uZW50aXR5VHlwZXM/LmZvckVhY2goKG9FbnRpdHlTZXQ6IGFueSkgPT4ge1xuXHRcdGlmIChvRW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uVUk/LkZhY2V0cykge1xuXHRcdFx0aGFuZGxlRXJyb3JGb3JDb2xsZWN0aW9uRmFjZXRzKG9FbnRpdHlTZXQ/LmFubm90YXRpb25zPy5VST8uRmFjZXRzLCBvRGlhZ25vc3RpY3MsIG9FbnRpdHlTZXQ/Lm5hbWUsIDEpO1xuXHRcdH1cblx0fSk7XG5cdGNvbnN0IHNUYXJnZXRFbnRpdHlTZXROYW1lID0gb01hbmlmZXN0U2V0dGluZ3MuZW50aXR5U2V0O1xuXHRjb25zdCBvRnVsbENvbnRleHQgPSBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMoXG5cdFx0b01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChzRnVsbENvbnRleHRQYXRoID09PSBcIi9cIiA/IHNGdWxsQ29udGV4dFBhdGggKyBzVGFyZ2V0RW50aXR5U2V0TmFtZSA6IHNGdWxsQ29udGV4dFBhdGgpXG5cdCk7XG5cblx0aWYgKG9GdWxsQ29udGV4dCkge1xuXHRcdGxldCBvQ29udmVydGVkUGFnZTtcblx0XHRzd2l0Y2ggKHNUZW1wbGF0ZVR5cGUpIHtcblx0XHRcdGNhc2UgVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQ6XG5cdFx0XHRjYXNlIFRlbXBsYXRlVHlwZS5BbmFseXRpY2FsTGlzdFBhZ2U6XG5cdFx0XHRcdG9Db252ZXJ0ZWRQYWdlID0gTGlzdFJlcG9ydENvbnZlcnRlci5jb252ZXJ0UGFnZShcblx0XHRcdFx0XHRjcmVhdGVDb252ZXJ0ZXJDb250ZXh0KFxuXHRcdFx0XHRcdFx0b0NvbnZlcnRlck91dHB1dCxcblx0XHRcdFx0XHRcdG9NYW5pZmVzdFNldHRpbmdzLFxuXHRcdFx0XHRcdFx0c1RlbXBsYXRlVHlwZSxcblx0XHRcdFx0XHRcdG9TaGVsbFNlcnZpY2VzLFxuXHRcdFx0XHRcdFx0b0RpYWdub3N0aWNzLFxuXHRcdFx0XHRcdFx0bWVyZ2UsXG5cdFx0XHRcdFx0XHRvRnVsbENvbnRleHRcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZTpcblx0XHRcdFx0b0NvbnZlcnRlZFBhZ2UgPSBPYmplY3RQYWdlQ29udmVydGVyLmNvbnZlcnRQYWdlKFxuXHRcdFx0XHRcdGNyZWF0ZUNvbnZlcnRlckNvbnRleHQoXG5cdFx0XHRcdFx0XHRvQ29udmVydGVyT3V0cHV0LFxuXHRcdFx0XHRcdFx0b01hbmlmZXN0U2V0dGluZ3MsXG5cdFx0XHRcdFx0XHRzVGVtcGxhdGVUeXBlLFxuXHRcdFx0XHRcdFx0b1NoZWxsU2VydmljZXMsXG5cdFx0XHRcdFx0XHRvRGlhZ25vc3RpY3MsXG5cdFx0XHRcdFx0XHRtZXJnZSxcblx0XHRcdFx0XHRcdG9GdWxsQ29udGV4dFxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdHJldHVybiBvQ29udmVydGVkUGFnZTtcblx0fVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufVxuIl19