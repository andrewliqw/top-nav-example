/*!
 * verge 1.9.1+201402130803
 * https://github.com/ryanve/verge
 * MIT License 2013 Ryan Van Etten
 */

(function(root, name, make) {
  if (typeof module != 'undefined' && module['exports']) module['exports'] = make();
  else root[name] = make();
}(this, 'verge', function() {

  var xports = {}
    , win = typeof window != 'undefined' && window
    , doc = typeof document != 'undefined' && document
    , docElem = doc && doc.documentElement
    , matchMedia = win['matchMedia'] || win['msMatchMedia']
    , mq = matchMedia ? function(q) {
        return !!matchMedia.call(win, q).matches;
      } : function() {
        return false;
      }
    , viewportW = xports['viewportW'] = function() {
        var a = docElem['clientWidth'], b = win['innerWidth'];
        return a < b ? b : a;
      }
    , viewportH = xports['viewportH'] = function() {
        var a = docElem['clientHeight'], b = win['innerHeight'];
        return a < b ? b : a;
      };
  
  /** 
   * Test if a media query is active. Like Modernizr.mq
   * @since 1.6.0
   * @return {boolean}
   */  
  xports['mq'] = mq;

  /** 
   * Normalized matchMedia
   * @since 1.6.0
   * @return {MediaQueryList|Object}
   */ 
  xports['matchMedia'] = matchMedia ? function() {
    // matchMedia must be binded to window
    return matchMedia.apply(win, arguments);
  } : function() {
    // Gracefully degrade to plain object
    return {};
  };

  /**
   * @since 1.8.0
   * @return {{width:number, height:number}}
   */
  function viewport() {
    return {'width':viewportW(), 'height':viewportH()};
  }
  xports['viewport'] = viewport;
  
  /** 
   * Cross-browser window.scrollX
   * @since 1.0.0
   * @return {number}
   */
  xports['scrollX'] = function() {
    return win.pageXOffset || docElem.scrollLeft; 
  };

  /** 
   * Cross-browser window.scrollY
   * @since 1.0.0
   * @return {number}
   */
  xports['scrollY'] = function() {
    return win.pageYOffset || docElem.scrollTop; 
  };

  /**
   * @param {{top:number, right:number, bottom:number, left:number}} coords
   * @param {number=} cushion adjustment
   * @return {Object}
   */
  function calibrate(coords, cushion) {
    var o = {};
    cushion = +cushion || 0;
    o['width'] = (o['right'] = coords['right'] + cushion) - (o['left'] = coords['left'] - cushion);
    o['height'] = (o['bottom'] = coords['bottom'] + cushion) - (o['top'] = coords['top'] - cushion);
    return o;
  }

  /**
   * Cross-browser element.getBoundingClientRect plus optional cushion.
   * Coords are relative to the top-left corner of the viewport.
   * @since 1.0.0
   * @param {Element|Object} el element or stack (uses first item)
   * @param {number=} cushion +/- pixel adjustment amount
   * @return {Object|boolean}
   */
  function rectangle(el, cushion) {
    el = el && !el.nodeType ? el[0] : el;
    if (!el || 1 !== el.nodeType) return false;
    return calibrate(el.getBoundingClientRect(), cushion);
  }
  xports['rectangle'] = rectangle;

  /**
   * Get the viewport aspect ratio (or the aspect ratio of an object or element)
   * @since 1.7.0
   * @param {(Element|Object)=} o optional object with width/height props or methods
   * @return {number}
   * @link http://w3.org/TR/css3-mediaqueries/#orientation
   */
  function aspect(o) {
    o = null == o ? viewport() : 1 === o.nodeType ? rectangle(o) : o;
    var h = o['height'], w = o['width'];
    h = typeof h == 'function' ? h.call(o) : h;
    w = typeof w == 'function' ? w.call(o) : w;
    return w/h;
  }
  xports['aspect'] = aspect;

  /**
   * Test if an element is in the same x-axis section as the viewport.
   * @since 1.0.0
   * @param {Element|Object} el
   * @param {number=} cushion
   * @return {boolean}
   */
  xports['inX'] = function(el, cushion) {
    var r = rectangle(el, cushion);
    return !!r && r.right >= 0 && r.left <= viewportW();
  };

  /**
   * Test if an element is in the same y-axis section as the viewport.
   * @since 1.0.0
   * @param {Element|Object} el
   * @param {number=} cushion
   * @return {boolean}
   */
  xports['inY'] = function(el, cushion) {
    var r = rectangle(el, cushion);
    return !!r && r.bottom >= 0 && r.top <= viewportH();
  };

  /**
   * Test if an element is in the viewport.
   * @since 1.0.0
   * @param {Element|Object} el
   * @param {number=} cushion
   * @return {boolean}
   */
  xports['inViewport'] = function(el, cushion) {
    // Equiv to `inX(el, cushion) && inY(el, cushion)` but just manually do both 
    // to avoid calling rectangle() twice. It gzips just as small like this.
    var r = rectangle(el, cushion);
    return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW();
  };

  return xports;
}));
(function () {
    var NS = "evenNav"
      , NS_LC = "evennav"
      , incr = 0
      , instances = {}
      , D_TEXT_WITH_BR = "data-text-with-break"
      , D_TEXT_WITHOUT_BR = "data-text-without-break"
      , D_HTML_ORIG = "data-html-original";

    function init(el, _opts) {

        if (isInited(el)) return;

        var opts = {
            liSel: ".evennav-item"
            , ulSel: ".evennav-list"
            , btnSel: ".evennav-btn"
            , btnInnerSel: ".evennav-btninner"
            , condition: true // this can have logic in it, such as viewport width for responsive layouts
        };

        opts = mergeOptions( opts, _opts );

        
        console.log("opts", opts.condition)


        el.classList.remove('evennav-nojs');
        el.classList.add(NS_LC);

        var instanceID = NS_LC + "-" + incr
          , instance = {
              id: instanceID
            , opts: opts
          };

        instances[instanceID] = instance;
        el.setAttribute("data-id", instanceID);

        incr++;

        if (!opts.condition) {
            el.classList.add("is-ready");
            clearClasses(el);
            return instance;
        }

        setEvenWidths(el, opts);
        el.classList.add("is-ready");

        return instance;
    }

    /**
     * @description Clears classes and styles that get applied after the main logic is done.
     * @param el (element) - A single instance of this widget as a jQuery element.
     * @param items (element list) - <li>'s in the list.
     */
    function clearCalc(el, items) {
        eachDom(items, function (item) {
            item.removeAttribute("style");
        });
        el.classList.remove('is-calc');
    }

    /**
     * @description Distributes items in a list by percentages.
     * @param el (element) - A single instance of this widget as a element.
     * @param opts (object) - library options
     */
    function setEvenWidths(el, opts) {

        var items = el.querySelectorAll(opts.liSel);

        var totalW = el.querySelector(opts.ulSel).offsetWidth;

        el.classList.add('is-calc'); // needs to come after 'totalW' is calculated or else IE9 miscalculates the width
        
        setEvenPadData(items, totalW);

        var perc, totPerc = 0, w;
        eachDom(items, function (item) {
            w = parseFloat(item.getAttribute("data-pixel-width"));
            if (w.toString() !== "NaN") {
                perc = (w / totalW) * 100;
                item.style.width = perc + "%";

                totPerc += perc;
            } else {
                console.warn(NS, "setEvenWidths", "Attribute 'data-pixel-width' was not a valid number.", item);
            }
        });
    }



    /**
     * @description Sets even padding to a data object, so it can be used later.
     * @param items (element list) - <li>'s in the list.
     * @param totalW (number) - The total width of all items.
     */
    function setEvenPadData(items, totalW) {

        var itemsW = getListWidth(items)
          , extraW = totalW - itemsW
          , pad = (extraW / items.length) / 2;

        eachDom(items, function(item) {
            item.setAttribute("data-pixel-width", pad * 2 + item.offsetWidth);
        });
    }

    /**
     * @description Gets the total width of all items.
     * @param items (element list) - <li>'s in the list.
     */
    function getListWidth(items) {

        var totalW = 0;
        eachDom(items, function(item) {
            totalW += item.offsetWidth;
        });
        return totalW;
    }



    function resize(el, doResetWidths) {

        var instance = getInstance(el);
        if (!instance) return;

        if (typeof doResetWidths === "undefined") doResetWidths = true;

        var items = el.querySelectorAll(instance.opts.liSel);
        clearCalc(el, items);
        

        if (doResetWidths) {
            el.classList.remove("is-ready");
            setEvenWidths(el, instance.opts);
            el.classList.add("is-ready");
        }
    }


    function getInstance(el) {
        var id = el.getAttribute("data-id");

        if (!id) {
            console.warn(NS, "No attribute 'data-id' found. You probably haven't initialized the '" + NS + "' library yet on this element.", el);
            return;
        }

        var instance = instances[id];

        if (!instance) {
            console.warn(NS, "Something's not right. Couldn't find instance '" + id + "'.", el);
            return;
        }

        return instance;
    }

    function isInited(el) {
        var id = el.getAttribute("data-id")
              , instance = instances[id];

        return !!instance;
    }

    function tightFit(textElList, doAddBreaks) {

        eachDom(textElList, function (txtEl) {

            newTxt = "";
            brAdded = false;
            txt = txtEl.textContent.trim();
            txtSplit = txt.split(" ");

            // includes the full markup, in case there are span elements nested or something and something outside of this library needs them
            txtEl.setAttribute(D_HTML_ORIG, txtEl.innerHTML.trim());
            txtEl.setAttribute(D_TEXT_WITHOUT_BR, txt);

            txtSplit.forEach(function (char, i) {
                newTxt += char;

                if (i < txtSplit.length) {
                    if (brAdded // if break already added
                        || i === 0 && char.length < 4 // or first word and word is less than 4 characters
                        || txt.length < 10 // or the total word character count is less than 10
                        ) {
                        newTxt += " ";
                    } else {
                        brAdded = true;
                        newTxt += "<br>";
                    }
                }
            });
            txtEl.setAttribute(D_TEXT_WITH_BR, newTxt);
        });

        setWordBreaks(textElList, doAddBreaks);
    }

    function setWordBreaks(textElList, doAddBreaks) {

        eachDom(textElList, function (txtEl) {
            var markup = txtEl.getAttribute(doAddBreaks ? D_TEXT_WITH_BR : D_TEXT_WITHOUT_BR);
            txtEl.innerHTML = markup;
        })
    }

    function eachDom(list, cb) {
        var len = list.length;
        for (var i = 0; i < len; i++) {
            cb(list[i]);
        }
    }

    // adds CSS classes with JS so that the layout isn't affected by them until all JS is ready
    function addClasses(el) {
        eachDom(el.querySelectorAll("[data-add-class]"), function (el) {
            var cls = el.getAttribute("data-add-class");
            if (cls) el.classList.add(cls);
        });
    }

    // clears evennav classes and stores them in variables in case you need them back
    function clearClasses(el, addThemBack) {
        var instance = getInstance(el);
        
        if (addThemBack) {
            el.classList.add('is-calc');

            var items = el.querySelectorAll("[data-li-sel]");

            var addCls = function (attr, thisEl, item) {
                if (!thisEl) thisEl = (item || el).querySelector("[" + attr + "]");
                if (!thisEl) return
                
                thisEl.classList.add(thisEl.getAttribute(attr))
                thisEl.removeAttribute(attr);
            }

            eachDom(items, function (item) {
                item.style.width = item.getAttribute("data-width");
                item.removeAttribute("data-width");
                addCls("data-li-sel", item);
                addCls("data-btn-sel", null, item);
                addCls("data-btn-inner-sel", null, item);
            });

            addCls("data-ul-sel");

        } else {
            el.classList.remove('is-calc');

            var items = el.querySelectorAll(instance.opts.liSel);

            var addAttr = function (attr, sel, thisEl, item) {
                if (!thisEl) thisEl = (item || el).querySelector(sel);
                if (!thisEl) return

                thisEl.classList.remove(sel.slice(1));
                thisEl.setAttribute(attr, sel.slice(1));
            }

            eachDom(items, function (item) {
                item.setAttribute("data-width", window.getComputedStyle(item, null).width);
                item.style.width = "";
                addAttr("data-li-sel", instance.opts.liSel, item);
                addAttr("data-btn-sel", instance.opts.btnSel, null, item);
                addAttr("data-btn-inner-sel", instance.opts.btnInnerSel, null, item);
            });

            addAttr("data-ul-sel", instance.opts.ulSel);
        }
    }

    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    function mergeOptions(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    }

    window[NS] = {
        init: init
        , isInited: isInited
        , resize: resize
        , tightFit: tightFit
        , setWordBreaks: setWordBreaks
        , addClasses: addClasses
        , clearClasses: clearClasses
    }

})();
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
(function(utils, evenNav, verge) {


    function init() {
        var el = document.querySelector(".topNav");
        el.setAttribute("data-uid", utils.getUID()); // adds a unique id (uid) to the component
        setTodayTitle(el);
        setSubTitle(el);
        setEvenNav(el);
    }


    // Changes the upper case characters of '.topNav-subTitle' to pascal case
    function setSubTitle(el) {
        // TODO: use 'utils.toPascalCase' to sanitize the contents of element '.topNav-subTitle'
    }


    // Replaces '--WEEK_DAY_NAME--' and '--MONTH_NAME--' with dynamic contents in element '.topNav-title'
    function setTodayTitle(el) {
        
        // TODO: add today's week day and month name to the element '.topNav-title', using 'utils.getWeekDay' and 'utils.getMonthName'
    }


    // gets the window viewport width
    function isMobileVP() {
        return verge.viewportW() < 768
    }

    // set the library 'EvenNav', which evenly sizes navigation elements horizontally
    function setEvenNav(el) {
        
        evenNav.init(el, {
            condition: !isMobileVP() // ignores mobile
        });

        // needs a resize handler so it can clear mobile styles and recalculate when window is resized
        window.addEventListener("resize", function() {
            var isMb = isMobileVP()

            evenNav.clearClasses(el, !isMb);
            if(!isMb) evenNav.resize(el, !isMb);
        });
    }


    init();

// "app/Global/js/Utils.js", "./node_modules/verge/verge.js", "./libs/evennav/evennav.js"
})(window.utils, window.evenNav, window.verge); // adds libraries and utils