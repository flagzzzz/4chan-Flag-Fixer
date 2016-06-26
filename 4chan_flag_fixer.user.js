// ==UserScript==
// @name        4chan Flag Fixer
// @namespace   flagfixer
// @description Because Hiroshimoot keeps using old flags
// @include     http*://boards.4chan.org/int/*
// @include     http*://boards.4chan.org/sp/*
// @include     http*://boards.4chan.org/pol/*
// @exclude     http*://boards.4chan.org/int/catalog
// @exclude     http*://boards.4chan.org/sp/catalog
// @exclude     http*://boards.4chan.org/pol/catalog
// @version     1.0
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @run-at      document-end
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @updateURL   
// @downloadURL 
// ==/UserScript==
var flagOption = "fixed"; // Radio button; options are fixed, diverse, or official flags
var flagOptionsVar = "fixerFlagOptions";
var flagReplaceUrl = "https://raw.githubusercontent.com/flagzzzz/4chan-Flag-Fixer/master/flagsheets/";
var nameSpace = "flagfixer.";

var setup = {
	html: function () {
        var htmlFixedStart = '<div>4chan Fixed Flags</div><br/>';
        var htmlSaveButton = '<div><button name="save" title="Pressing &#34;Save Region&#34; will save the currently selected region as your region">' +
            'Save Region</button></div><br/>';
        var filterRadio = '<br/><br/><form id="filterRadio">' +
            '<input type="radio" name="filterRadio" id="filterRadiofixed" style="display: inline !important;" value="fixed"><label>Fixed: flags are updated and glossed</label>' +
            '<br/><input type="radio" name="filterRadio" id="filterRadiodiverse" style="display: inline !important;" value="diverse"><label>Unofficial: use unofficial flags</label>' +
            '<br/><input type="radio" name="filterRadio" id="filterRadioofficial" style="display: inline !important;" value="last"><label>Official only: only use official flags</label>' +
            '</form>';
			
        return htmlFixedStart + htmlSaveButton + filterRadio;

    },
	setRadio: function() {
        var flagOptionStatus = load(flagOptionsVar);
        if (!flagOptionStatus || flagOptionStatus === "" || flagOptionStatus === "undefined") {
            flagOptionStatus = "fixed";
        }
        var radioButton = document.getElementById("filterRadio" + flagOptionStatus);
        radioButton.checked = true;
    },
	show: function () {
        /* remove setup window if existing */
        var setup_el = document.getElementById("fixedflags");
        if (setup_el) {
            setup_el.parentNode.removeChild(setup_el);
        }
        /* create new setup window */
        GM_addStyle('\
            #fixedflags { position:fixed;z-index:10001;top:40px;right:40px;padding:20px 30px;background-color:white;width:auto;border:1px solid black }\
            #fixedflags * { color:black;text-align:left;line-height:normal;font-size:12px }\
            #fixedflags div { text-align:center;font-weight:bold;font-size:14px }'
        );
        setup_el = document.createElement('div');
        setup_el.id = 'fixedflags';
        setup_el.innerHTML = setup.html();

        document.body.appendChild(setup_el);

        setup.setRadio();

        /* button listeners */
        document.querySelector('#fixedflags *[name="save"]').addEventListener('click', function () {
			flagOption = document.querySelector('input[name="filterRadio"]:checked').value;
            this.disabled = true;
            this.innerHTML = 'Saving...';
            setup_el.parentNode.removeChild(setup_el);
            save(flagOptionsVar, flagOptions);
			alert("Fixed Flags option set, please refresh all of your 4chan tabs!");

        }, false);
    },
	setupSetting: function() {
		GM_registerMenuCommand("Flag Fixer Setup", setup.show);
	}
};

flagOptions = load(flagOptionsVar);

if (!flagOptions || flagOptions === "" || flagOptions === "undefined") {
	flagOptions = "fixed";
}

function save(key, value) {
	GM_setValue(nameSpace + key, value);
}

function load(key) {
	return GM_getValue(nameSpace + key);
}

setup.setupSetting();
GM_addStyle(".flag { display:inline-block; width:16px; height:11px; position:relative; top:1px; background-image:url(\'" + flagReplaceUrl + flagOption + ".png" + "\') !important; background-repeat: no-repeat;}");