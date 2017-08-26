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