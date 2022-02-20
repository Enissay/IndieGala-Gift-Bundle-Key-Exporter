// ==UserScript==
// @name         Indie Gala Gift Bundle Key Exporter - Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  1-Click Key Export for your IndieGala Gifts (Updated for Indiegala's website redesign on May 2020)
// @author       MDuh - Eny
// @match        https://www.indiegala.com/gift-bundle/*
// @match        https://www.indiegala.com/gift?gift_id=*
// @supportURL   https://github.com/Enissay/IndieGala-Gift-Bundle-Key-Exporter/issues
// @updateURL    https://github.com/Enissay/IndieGala-Gift-Bundle-Key-Exporter/raw/master/IndieGala_Gift_Bundle_Key_Exporter.user.js
// @downloadURL  https://github.com/Enissay/IndieGala-Gift-Bundle-Key-Exporter/raw/master/IndieGala_Gift_Bundle_Key_Exporter.user.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// ==/UserScript==

// safe jQuery loading header
(function ($, undefined) {
    $(function () {
////////////////////////////////////

        var zNode = document.createElement('li');
        zNode.className = "active bg-gradient-light-blue"
        zNode.innerHTML = '<div class="profile-private-page-library-menu-item-inner"><a id="copyKeyButton" href="#" onclick="return false">Redeem Keys</a></div>';
        zNode.setAttribute('id', 'myContainer');

        var injectLocation = document.getElementsByClassName("profile-private-page-library-menu")[0].children[0];
        injectLocation.appendChild(zNode);
        injectLocation.style = "justify-content: space-between; display: flex;"

//--- Activate the newly added button.
        document.getElementById("copyKeyButton").addEventListener(
            "click", main, false
        );

        function main() {

            // ACTIVATE ALL KEYS
            var buttonToRedeem = document.querySelectorAll("figcaption > div.profile-private-page-library-serial-dialog.display-none > div > button.right.profile-private-page-library-get-serial-btn.bg-gradient-blue");

            for (let item of buttonToRedeem) {
                item.click();
                window.getSerialKeyGo = true;
            }

            // KEEP CHECKING UNTIL NODE IS ZERO
            var isItDoneYet = setInterval(function () {
                var checkDOM = document.querySelectorAll("figcaption > div.profile-private-page-library-serial-dialog.display-none > div > button.right.profile-private-page-library-get-serial-btn.bg-gradient-blue");

                if (checkDOM.length === 0) {
                    clearInterval(isItDoneYet);
                    generateResult();
                }
            }, 200);

}

        function generateResult() {
            var keyResult = "";

            // GET GAME LIST
            var gameList = document.evaluate("//li/div/figcaption/div[div[contains(@class, 'left')]]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var gameList_eny = $("ul.profile-private-page-library-sublist.profile-private-page-library-sublist-active > li");
            for (var i = 0; i < gameList.snapshotLength; i++) {
                // APPEND GAME:KEY LIST
                keyResult +=
                    gameList.snapshotItem(i).children[0].children[0].innerHTML  // GAME NAME
                    + "\t" +
                    gameList.snapshotItem(i).children[1].children[0].children[0].children[0].value // SERIAL KEY
                    + "\t" +
                    gameList_eny.eq(i).find('a[href*="https://store.steampowered.com/"]').attr('href')  // GAME URL
                    + "\r\n";
                // MODIFY HTML TO SET STEAM ICON AS A URL TO ACTIVATE THE KEY TO STEAM
                gameList.snapshotItem(i).children[1].children[0].children[1].setAttribute("onClick", "javascript: window.open('https://store.steampowered.com/account/registerkey?key=" + gameList.snapshotItem(i).children[1].children[0].children[0].children[0].value + "')");
        gameList.snapshotItem(i).children[1].children[0].children[1].setAttribute("class", "right profile-private-page-library-key-icon bg-gradient-blue");
        gameList.snapshotItem(i).children[1].children[0].children[1].style = "cursor: pointer;"
    }

    textToClipboard(keyResult);

    alert("Game keys copied to clipboard");
        }

        function textToClipboard(text) {
            var dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
        }

////////////////////////////////////
// safe jQuery loading footer
    });
})(window.jQuery.noConflict(true));