(function () {
    var SELF;
    var Utils = {


        /*
        * Gets MS calculations by different units.
        * @returns {object} - Object containing different MS counts.
        */
        getMS: function() {
            var oneSec = 1000
		        ,oneMin = oneSec * 60
		        ,oneHour = oneMin * 60
		        ,oneDay = oneHour * 24
		        ,oneYear = oneDay * 365;
	
            return {
                oneSec: oneSec
		        ,oneMin: oneMin
		        ,oneHour: oneHour
		        ,oneDay: oneDay
                ,oneYear: oneYear
            }
        }

        /*
        * Gets different units from provided MS.
        * @param {number} ms - Milliseconds used to calulate units.
        * @returns {object} - Object containing different units.
        */
        , getUnitsFromMS: function( ms ) {
            var secs = Math.round( ms / 1000 )
                ,mins = Math.round( secs / 60 )
                ,hours = Math.round( mins / 60 )
                ,days = Math.round( hours / 24 );
	
            return {
                secs: secs
                ,mins: mins
                ,hours: hours
                ,days: days
            }
        }


        /*
        * Gets the day of the week in English.
        * @param {number} utcTime/ind - UTC time value or array index. If this is ommitted, you will get the time right now and return today's day of the week name.
        * @param {boolean} byInd - If true, will use `time` as an index value from the `days` array.
        * @param {boolean} useShort - If true, will get shortened version of name.
        * @returns {string} - Day of the week in English. Potentially add other languages here too.
        */
        , getWeekDay: function (time, byInd, useShort) {
            var days = useShort ?
                    ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
                    :
                    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            if (byInd === true) {
                if (time >= 7) return null;
                return days[time];
            }
            var date = time ? new Date(time) : new Date();
            
            return days[date.getDay()];
        }

        /*
        * Gets the month of the year in English.
        * @param {number} utcTime/ind - UTC time value or array index. If this is ommitted, you will get the time right now and return today's month of the year name.
        * @param {boolean} byInd - If true, will use `time` as an index value from the `months` array.
        * @param {boolean} useShort - If true, will get shortened version of name.
        * @return {string} - Month of the year in English. Potentially add other languages here too.
        */
        , getMonthName: function (time, byInd, useShort) {
            var months = useShort ?
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
                    :
                    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            if (byInd === true) {
                if (time >= 12) return null;
                return months[time];
            }
            var date = time ? new Date(time) : new Date();
            return months[date.getMonth()];
        }


        /**
         * Converts words in a string to pascal case.  
         * @param {string[]} [lcWords] - Optionally provide an array `lcWords` that will get forced to lower case (or use default).
         * @param {string[]} [UcWords] - Optionally provide an array `ucWords` that will not get modified (or use default).
         * @returns {string} Modified string with replacements.
         */
		, toPascalCase: function (str, lcWords, ucWords) {
		    
            lcWords = lcWords || ["and", "a", "is", "not", "to", "&", "be", "was", "no", "are", "i", "for", "me", "you", "the", "in", "of", "out", "isn't"];
		    ucWords = ucWords || ["NSW", "WA", "QLD", "TAS", "WA", "NT", "ACT", "SA", "VIC", "FAQ", "FAQs"];

		    var wordCount = 0;
		    return str.replace(/\w\S*/g, function (txt) {
                // skip small words on first word
		        if (wordCount > 0) {
		            // make small words lower case
		            for (var i = 0; i < lcWords.length; i++) {
		                var lcTxt = txt.toLowerCase();
		                if (lcTxt === lcWords[i]) {
		                    return lcTxt;
		                }
		            }
		        }
		        // leave special words alone
		        for (var i = 0; i < ucWords.length; i++) {
		            if (txt === ucWords[i]) return txt;
		        }
		        wordCount++;

                // other words make Pascal case
		        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		    });
		}



        /**
         * Gets a unique ID, based on a random number, with optional prefix.
         * @param {string} [pref] - A string to prefix the ID with. For example 'topnav-'.
         * @returns {string} Modified string with replacements.
         */
        , getUID: function(pref) {
            return (pref || "") + Math.random().toString().replace(".", "");
        }

        
        /**
         * Replace between delimters for all instances in a string.
         * @param {string} rxStart - the string to begin with.
         * @param {string} rxEnd - the string to end with.
         * @param {string} originalString - the string to search through.
         * @param {string} replacementString - the string to put in between the delimeters.
         * @param {boolean} [keepDelimeters] - whether to keep the delimeters in the returned value, or remove them.
         * @param {boolean} [delimLineBreak] - whether to add a line break after each delimeter or not. Only applies if `keepDelimeteres` equals `true`.
         * @returns {string} Modified string with replacements.
         */
        , replaceBetween: function(rxStart, rxEnd, originalString, replacementString, keepDelimeteres, delimLineBreak) {

            var originalStart = rxStart;
            var originalEnd = rxEnd;

            // replace special characters that can cause problems in regex
            if (rxStart.indexOf("?") != -1) rxStart = rxStart.split("?").join("\\?");
            if (rxEnd.indexOf("?") != -1) rxEnd = rxEnd.split("?").join("\\?");

            if (rxStart.indexOf("*") != -1) rxStart = rxStart.split("*").join("\\*");
            if (rxEnd.indexOf("*") != -1) rxEnd = rxEnd.split("*").join("\\*");

            var rx = new RegExp(rxStart + "[\\d\\D]*?" + rxEnd, "g");

            // console.log( originalString.substr( rx ) );

            if (!replacementString) replacementString = "";

            var result;
            if (keepDelimeteres === true) {
                var lineBr = delimLineBreak ? "\n" : "";
                result = originalString.replace(rx, originalStart + lineBr + replacementString + lineBr + originalEnd);
            } else {
                result = originalString.replace(rx, replacementString);
            }

            return result;
        }

        
        /**
         * Get the number of lines in a text element.
         * @param {HTMLElement} el - The text element you're counting the lines from.
         * @returns {number} Number of lines in the element.
         */
        , getTextLines: function (el) {
            var thisPar = el.parentElement
              , clone = thisPar.appendChild(el.cloneNode());

            clone.innerHTML = "X";

            var h = clone.offsetHeight;
            thisPar.removeChild(clone);

            var lines = Math.ceil(el.offsetHeight / h);

            return lines;
        }
    }

    // exposes library for browser and Node-based code (such as unit tests)
    if (typeof window === "undefined") {
        module.exports = Utils;
    }
    else {
        window.utils = Utils;
    }
    
    SELF = Utils;
})();