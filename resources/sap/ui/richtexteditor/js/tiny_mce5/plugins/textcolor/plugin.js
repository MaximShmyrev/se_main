
(function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    function Plugin () {
      global.add('textcolor', function () {
        console.warn('Text color plugin is now built in to the core editor, please remove it from your editor configuration');
      });
    }

    Plugin();

}());
