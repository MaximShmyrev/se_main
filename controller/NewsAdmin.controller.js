sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function (MessageToast, Controller, JSONModel, Fragment) {
	"use strict";

	var newsJson;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_NewsService/ZCE_News', false);

	// build SOAP request
	var sr = '<?xml version="1.0" encoding="utf-8"?>' +
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_news/">' +
		'<soapenv:Header/>' +
		'<soapenv:Body>' +
		'<zce:getNews/>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';

	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {

				var response = xmlhttp.responseText;

				var splitResponse = response.split(/<return>|<\/return>/);
				var arrayResponse = splitResponse[1];
				newsJson = JSON.parse(arrayResponse.toString());
			}
		}
	}


	// Send the POST request
	xmlhttp.setRequestHeader("Content-Type", "text/xml");
	xmlhttp.send(sr);

	return Controller.extend("main.controller.NewsAdmin", {

		onInit: function () {
			var oModel = new JSONModel(newsJson);
			this.getView().setModel(oModel);
		},



		onListItemPressed: function (oEvent) {

			// get pressed value
			var itemPressed = oEvent.oSource.mProperties.title;
			var oModel = this.getView().getModel();


			var selectedNew;

			for (var i = 0, len = newsJson.length; i < len; i++) {
				if (newsJson[i].HEADER == itemPressed) {
					selectedNew = i;
				}
			}

			oModel.setProperty("/itemHeader", itemPressed);
			oModel.setProperty("/itemDate", newsJson[selectedNew].UPDATED_DATE);
			oModel.setProperty("/itemAuthor", newsJson[selectedNew].UPDATED_BY);
			oModel.setProperty("/itemText", newsJson[selectedNew].TEXT);
			oModel.setProperty("/itemImage", newsJson[selectedNew].DATA_RAW);
			oModel.setProperty("/itemID", newsJson[selectedNew].ID);
			oModel.setProperty("/itemType", newsJson[selectedNew].TYPE);

			if (newsJson[selectedNew].DATA_RAW.substring(0, 20) == 'data:application/pdf') {
				// Internet Explorer 11 and Edge workaround
				if (window.navigator && window.navigator.msSaveOrOpenBlob) {

					var data = newsJson[selectedNew].DATA_RAW.substring(28);
					var fileName = 'file.pdf'
					var byteCharacters = atob(data)

					var byteNumbers = new Array(byteCharacters.length)

					for (var i = 0; i < byteCharacters.length; i++) {
						byteNumbers[i] = byteCharacters.charCodeAt(i)
					}

					var byteArray = new Uint8Array(byteNumbers)
					var blob = new Blob([byteArray], { type: 'application/pdf' })

					window.navigator.msSaveOrOpenBlob(blob, fileName)

				} else {
					// other browsers		
					var file = "<object data='" + newsJson[selectedNew].DATA_RAW + "' type='application/pdf' width='100%' height='700'><embed src='" + newsJson[selectedNew].DATA_RAW + "' type='application/pdf'/></object>";
					var oHtml = this.getView().byId("attachmentFrame");
					oHtml.setContent(file);
				}
			} else {
				file = ""
				oHtml = this.getView().byId("attachmentFrame");
				oHtml.setContent(file);
			}

		},

		onPressHome: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			document.title = "Главная страница";
			oRouter.navTo("home", {}, true);
		},


		onEditNews: function () {
			sessionStorage.setItem("NEWS_CHANGE", "edit");
			var oView = this.getView();
			var oModel = this.getView().getModel();

			// create dialog lazily
			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "main.view.CreateDialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this.getView().byId("Header").setValue(oModel.getProperty("/itemHeader"));
			this.getView().byId("elementType").setSelectedKey(oModel.getProperty("/itemType"));
			this.getView().byId("Text").setValue(oModel.getProperty("/itemText"));

			this.pDialog.then(function (oDialog) {
				oDialog.open();
			});

		},


		onDeleteNews: function () {
			var oModel = this.getView().getModel();
			var itemId = '<id>' + oModel.getProperty("/itemID") + '</id>';

			var newsHTTP = new XMLHttpRequest();
			newsHTTP.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_NewsService/ZCE_News', false);

			// build SOAP request
			var sr = '<?xml version="1.0" encoding="utf-8"?>' +
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_news/">' +
				'<soapenv:Header/>' +
				'<soapenv:Body>' +
				'<zce:deleteNews>' +
				itemId +
				'</zce:deleteNews>' +
				'</soapenv:Body>' +
				'</soapenv:Envelope>';

			newsHTTP.onreadystatechange = function () {
				if (newsHTTP.readyState == 4) {
					if (newsHTTP.status == 200) {
						//var response = newsHTTP.responseText;
						var msg = 'Элемент удалён, обновите страницу.';
						MessageToast.show(msg);
					}
				}
			}

			// Send the POST request
			newsHTTP.setRequestHeader("Content-Type", "text/xml");
			newsHTTP.send(sr);

		},

		onCreateDialog: function (oEvent) {
			sessionStorage.setItem("NEWS_CHANGE", "create");
			var oView = this.getView();
			var oModel = this.getView().getModel();

			// create dialog lazily
			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "main.view.CreateDialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this.pDialog.then(function (oDialog) {
				oDialog.open();
			});
		},

		onCloseDialog: function () {
			// note: We don't need to chain to the pDialog promise, since this event-handler
			// is only called from within the loaded dialog itself.
			this.byId("Dialog").close();
		},

		onSaveDialog: function () {
			// note: We don't need to chain to the pDialog promise, since this event-handler
			// is only called from within the loaded dialog itself.
			var header = this.byId("Header").getValue();
			// header = header.replaceAll(/\n/g, '');
			header = header.replace(/\n/g, '');
			header = header.replace('"', '');

			var news_type = this.byId("elementType").getSelectedKey();
			var text = this.byId("Text").getValue();
			// text = text.replace(/\n/g, '');
			text = text.replace('"', '');

			header = '<header>' + header + '</header>';
			text = '<text>' + text + '</text>';
			news_type = '<news_type>' + news_type + '</news_type>';
			var userid = sessionStorage.getItem("USERNAME");

			if (userid == '') {
				var updated_by = '<updated_by>' + 'SHMYREV' + '</updated_by>';
			} else {
				var updated_by = '<updated_by>' + userid + '</updated_by>';
			}

			var oModel = this.getView().getModel();
			var itemId = '<id>' + oModel.getProperty("/itemID") + '</id>';

			var change = sessionStorage.getItem("NEWS_CHANGE");

			var isAttachment = this.getView().byId("fileUploader").getValue();

			var newsHTTP = new XMLHttpRequest();
			newsHTTP.open('POST', 'http://prt.samaraenergo.ru:50000/ZCE_NewsService/ZCE_News', false);

			if (change == 'create') {

				if (isAttachment !== "") {
					var data_mime = sessionStorage.getItem("FILE_TYPE");
					var data_raw = sessionStorage.getItem("FILE_DATA");
					data_mime = '<data_mime>' + data_mime + '</data_mime>';
					data_raw = '<data_raw>' + 'data:' + sessionStorage.getItem("FILE_TYPE") + ';base64,' + data_raw + '</data_raw>';

					// build SOAP request
					var sr = '<?xml version="1.0" encoding="utf-8"?>' +
						'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_news/">' +
						'<soapenv:Header/>' +
						'<soapenv:Body>' +
						'<zce:createNews>' +
						header +
						text +
						news_type +
						data_mime +
						data_raw +
						updated_by +
						'</zce:createNews>' +
						'</soapenv:Body>' +
						'</soapenv:Envelope>';

				} else {

					// build SOAP request
					var sr = '<?xml version="1.0" encoding="utf-8"?>' +
						'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_news/">' +
						'<soapenv:Header/>' +
						'<soapenv:Body>' +
						'<zce:createNews>' +
						header +
						text +
						news_type +
						updated_by +
						'</zce:createNews>' +
						'</soapenv:Body>' +
						'</soapenv:Envelope>';

				}

			} else {

				if (isAttachment !== "") {
					var data_mime = sessionStorage.getItem("FILE_TYPE");
					var data_raw = sessionStorage.getItem("FILE_DATA");
					data_mime = '<data_mime>' + data_mime + '</data_mime>';
					data_raw = '<data_raw>' + 'data:' + sessionStorage.getItem("FILE_TYPE") + ';base64,' + data_raw + '</data_raw>';

					// build SOAP request
					var sr = '<?xml version="1.0" encoding="utf-8"?>' +
						'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_news/">' +
						'<soapenv:Header/>' +
						'<soapenv:Body>' +
						'<zce:updateNews>' +
						itemId +
						header +
						text +
						news_type +
						data_mime +
						data_raw +
						updated_by +
						'</zce:updateNews>' +
						'</soapenv:Body>' +
						'</soapenv:Envelope>';

				} else {

					// build SOAP request
					var sr = '<?xml version="1.0" encoding="utf-8"?>' +
						'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:zce="http://samaraenergo.ru/zce_news/">' +
						'<soapenv:Header/>' +
						'<soapenv:Body>' +
						'<zce:updateNews>' +
						itemId +
						header +
						text +
						news_type +
						updated_by +
						'</zce:updateNews>' +
						'</soapenv:Body>' +
						'</soapenv:Envelope>';

				}

			};

			newsHTTP.onreadystatechange = function () {
				if (newsHTTP.readyState == 4) {
					if (newsHTTP.status == 200) {
						//var response = newsHTTP.responseText;
						var msg = 'Элемент добавлен, обновите страницу.';
						MessageToast.show(msg);
					}
				}
			}

			// Send the POST request
			newsHTTP.setRequestHeader("Content-Type", "text/xml");
			newsHTTP.send(sr);

			this.byId("Dialog").close();
		},


		onChangeFileUploader: function (oEvent) {
			var aFiles = oEvent.getParameters().files;
			var currentFile = aFiles[0];

			sap.ui.getCore().fileUploadArr = [];
			var mimeDet = currentFile.type;
			var fileName = currentFile.name;
			this.base64coonversionMethod(mimeDet, fileName, currentFile, "001");
		},


		// Base64 conversion of selected file(Called method)....
		base64coonversionMethod: function (fileMime, fileName, fileDetails, DocNum) {
			var that = this;
			if (!FileReader.prototype.readAsBinaryString) {
				FileReader.prototype.readAsBinaryString = function (fileData) {
					var binary = "";
					var reader = new FileReader();
					reader.onload = function (e) {
						var bytes = new Uint8Array(reader.result);
						var length = bytes.byteLength;
						for (var i = 0; i < length; i++) {
							binary += String.fromCharCode(bytes[i]);
						}
						that.base64ConversionRes = btoa(binary);
						sap.ui.getCore().fileUploadArr.push({
							"DocumentType": DocNum,
							"MimeType": fileMime,
							"FileName": fileName,
							"Content": that.base64ConversionRes,
						});
					};
					reader.readAsArrayBuffer(fileData);
				};
			}
			var reader = new FileReader();
			reader.onload = function (readerEvt) {
				var binaryString = readerEvt.target.result;
				that.base64ConversionRes = btoa(binaryString);

				sessionStorage.setItem("FILE_DATA", that.base64ConversionRes);
				sessionStorage.setItem("FILE_TYPE", fileMime);

				sap.ui.getCore().fileUploadArr.push({
					"DocumentType": DocNum,
					"MimeType": fileMime,
					"FileName": fileName,
					"Content": that.base64ConversionRes,
				});
			};
			reader.readAsBinaryString(fileDetails);
		},
		//   });
		//  });

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		onOrientationChange: function (oEvent) {
			var bLandscapeOrientation = oEvent.getParameter("landscape"),
				sMsg = "Orientation now is: " + (bLandscapeOrientation ? "Landscape" : "Portrait");
			MessageToast.show(sMsg, { duration: 5000 });
		},

		onPressNavToDetail: function () {
			this.getSplitAppObj().to(this.createId("detailDetail"));
		},

		onPressDetailBack: function () {
			this.getSplitAppObj().backDetail();
		},

		onPressMasterBack: function () {
			this.getSplitAppObj().backMaster();
		},

		onPressGoToMaster: function () {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},

		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		}

	});
});