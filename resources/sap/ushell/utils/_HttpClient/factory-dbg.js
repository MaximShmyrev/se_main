// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return function HttpClient (
        fnGetHttpRequestWrapper,
        fnRequest,
        sBaseUrl,
        oCommonConfig
    ) {
        if (!/String/.test(Object.prototype.toString.call(sBaseUrl))) {
            throw "IllegalArgumentError: `sBaseUrl` should be a string";
        }

        // We need to inject a unique cache object for each instance
        // to account for a scenario that accesses different servers (e.g. cFLP)
        var oCsfrCache = {
            sBaseUrl: sBaseUrl, // To identify the wrapper internally while debugging
            token: undefined
        };

        return Object.create(null, {
            post: {
                value: fnGetHttpRequestWrapper(
                    "POST",
                    fnRequest,
                    sBaseUrl,
                    oCommonConfig,
                    oCsfrCache
                )
            },
            get: {
                value: fnGetHttpRequestWrapper(
                    "GET",
                    fnRequest,
                    sBaseUrl,
                    oCommonConfig,
                    oCsfrCache
                )
            },
            put: {
                value: fnGetHttpRequestWrapper(
                    "PUT",
                    fnRequest,
                    sBaseUrl,
                    oCommonConfig,
                    oCsfrCache
                )
            },
            delete: {
                value: fnGetHttpRequestWrapper(
                    "DELETE",
                    fnRequest,
                    sBaseUrl,
                    oCommonConfig,
                    oCsfrCache
                )
            },
            options: {
                value: fnGetHttpRequestWrapper(
                    "OPTIONS",
                    fnRequest,
                    sBaseUrl,
                    oCommonConfig,
                    oCsfrCache
                )
            }
        });
    };
});