// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/* global $ */
sap.ui.define([], function () {
    "use strict";

    if (!window.location.hash) {
        window.location.hash = "#Action-search&/searchterm=*";
    }

    sap.ui.getCore().attachInit(function () {

        sap.ui.require([
            'sap/ushell/renderers/fiori2/search/container/ComponentService'
        ], function (ComponentService) {

            //init search services
            ComponentService.init();

            sap.ui.require([
                'sap/ushell/renderers/fiori2/search/personalization/PersonalizationStorage',
                'sap/ushell/renderers/fiori2/search/SearchModel',
                'sap/ushell/renderers/fiori2/search/container/ComponentControl'
            ], function (PersonalizationStorage, SearchModel, ComponentControl) {

                //init Personalization Storage Service
                PersonalizationStorage.getInstance();

                //init search model
                if (!this.oModel) {
                    this.oModel = sap.ushell.renderers.fiori2.search.getModelSingleton();
                }
                this.oModel.searchUrlParser.parse().then(function () {

                    //init search controls
                    ComponentControl.init();

                    //to arrange the search controls
                    this.oSearchFieldGroup = ComponentControl.oSearchFieldGroup;
                    this.oSearchFieldGroup.setCancelButtonActive(false);
                    this.oSearchFieldGroup.setModel(this.oModel);
                    this.oSearchFieldGroup.addStyleClass('sapSearchFieldGroup');
                    this.oSearchFieldGroup.input.setValue(this.oModel.getSearchBoxTerm());

                    this.oLogo = new sap.m.Image({
                        src: '/logo.png',
                        press: function () {
                            window.location = 'index.html';
                        }
                    });

                    this.oLogoutButton = new sap.m.Button({
                        icon: sap.ui.core.IconPool.getIconURI("log"),
                        tooltip: sap.ushell.resources.i18n.getText("logoutBtn_tooltip"),
                        press: function () {
                            window.location = 'index.html';
                        }
                    }).addStyleClass('sapSearchLogout');

                    this.oLogoutLabel = sap.ui.getCore().byId("logoutLabel");
                    if (!this.oLogoutLabel) {
                        this.oLogoutLabel = new sap.ui.core.InvisibleText("logoutLabel", {
                            text: sap.ushell.resources.i18n.getText("logoutBtn_title")
                        });
                    }
                    this.oLogoutButton.addAriaLabelledBy("logoutLabel");

                    this.oLogout = new sap.ui.layout.HorizontalLayout();
                    this.oLogout.addContent(this.oLogoutButton);
                    this.oLogout.addContent(this.oLogoutLabel);

                    this.oSearchBar = new sap.ui.layout.HorizontalLayout();
                    this.oSearchBar.addContent(this.oLogo);
                    this.oSearchBar.addContent(this.oSearchFieldGroup);
                    this.oSearchBar.addContent(this.oLogout);
                    this.oSearchBar.addStyleClass('sapSearchBar');
                    this.oSearchBar.placeAt("content", "first");

                    this.oSearchPage = ComponentControl.oSearchPage;
                    this.oSearchPage.setModel(this.oModel);
                    this.oSearchPage.setModel(sap.ushell.resources.i18nModel, "i18n");
                    this.oSearchPage.placeAt("content", "last");
                    this.oSearchPage.addStyleClass('sapSearchPage');

                    ComponentControl.createFooter(this.oSearchPage);

                }.bind(this));
            });
        });
    });

    $(window).bind('hashchange', function () {
        if (this.oModel) {
            this.oModel.parseURL();
            this.oSearchFieldGroup.input.setValue(this.oModel.getSearchBoxTerm());
        }
    });

});
