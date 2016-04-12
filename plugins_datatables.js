//spf - DataTables Plugins should go here - see http://datatables.net/plug-ins - there are all sorts of plugins that can extend the 
//      internal functioning of the DataTables plug-in itself by including plug-ins here.
(function () {

    /*
     * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
     * Author: Jim Palmer (based on chunking idea from Dave Koelle)
     * Contributors: Mike Grier (mgrier.com), Clint Priest, Kyle Adams, guillermo
     * See: http://js-naturalsort.googlecode.com/svn/trunk/naturalSort.js
     */
    function naturalSort(a, b) {
        var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
            sre = /(^[ ]*|[ ]*$)/g,
            dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
            hre = /^0x[0-9a-f]+$/i,
            ore = /^0/,
            // convert all to strings and trim()
            x = a.toString().replace(sre, '') || '',
            y = b.toString().replace(sre, '') || '',
            // chunk/tokenize
            xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
            yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
            // numeric, hex or date detection
            xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
            yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null;
        // first try and sort Hex codes or Dates
        if (yD)
            if (xD < yD) return -1;
            else if (xD > yD) return 1;
        // natural sorting through split numeric strings and default strings
        for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
            // find floats not starting with '0', string or 0 if not defined (Clint Priest)
            var oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
            var oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
            // handle numeric vs string comparison - number < string - (Kyle Adams)
            if (isNaN(oFxNcL) !== isNaN(oFyNcL)) return (isNaN(oFxNcL)) ? 1 : -1;
            // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
            else if (typeof oFxNcL !== typeof oFyNcL) {
                oFxNcL += '';
                oFyNcL += '';
            }
            if (oFxNcL < oFyNcL) return -1;
            if (oFxNcL > oFyNcL) return 1;
        }
        return 0;
    }

    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "natural-asc": function (a, b) {
            return naturalSort(a, b);
        },

        "natural-desc": function (a, b) {
            return naturalSort(a, b) * -1;
        }
    });

}());

// sort number with any html characters - strips out the html and sorts as numbers
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "num-html-pre": function (a) {
        var x = String(a).replace(/<[\s\S]*?>/g, "");
        return parseFloat(x);
    },

    "num-html-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "num-html-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});


// dataTables sorting - Currency - http://datatables.net/plug-ins/sorting - 'Currency' section - 'Show details'

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "currency-pre": function (a) {
        a = (a === "-") ? 0 : a.replace(/[^\d\-\.]/g, "");
        return parseFloat(a);
    },

    "currency-asc": function (a, b) {
        return a - b;
    },

    "currency-desc": function (a, b) {
        return b - a;
    }
});

// dataTables sorting Fully signed numbers - http://datatables.net/plug-ins/sorting#Signed_Numbers
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "signed-num-pre": function (a) {
        return (a == "-" || a === "") ? 0 : a.replace('+', '') * 1;
    },

    "signed-num-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "signed-num-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

//spf - Formatted numbers for dataTables
//    - This plug-in will provide numeric sorting for numeric columns which have extra formatting, such as thousands seperators, currency symobols or any other non-numeric data.

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "formatted-num-pre": function (a) {
        a = (a === "-" || a === "") ? 0 : a.replace(/[^\d\-\.]/g, "");
        return parseFloat(a);
    },

    "formatted-num-asc": function (a, b) {
        return a - b;
    },

    "formatted-num-desc": function (a, b) {
        return b - a;
    }
});

// dataTables sort ignore minus sign - https://www.datatables.net/forums/discussion/2690/sorttable-containing-plus-and-minus-sign/p1
jQuery.fn.dataTableExt.oSort['numeric-comma-asc'] = function (a, b) {
    var x = (a == "-") ? 0 : a.replace(/,/, ".").replace(/[^\d\-]/g, "");
    var y = (b == "-") ? 0 : b.replace(/,/, ".").replace(/[^\d\-]/g, "");
    x = parseFloat(x);
    y = parseFloat(y);
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
};

jQuery.fn.dataTableExt.oSort['numeric-comma-desc'] = function (a, b) {
    var x = (a == "-") ? 0 : a.replace(/,/, ".").replace(/[^\d\-]/g, "");
    var y = (b == "-") ? 0 : b.replace(/,/, ".").replace(/[^\d\-]/g, "");
    x = parseFloat(x);
    y = parseFloat(y);
    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
};


// force empty cells to be last function for dataTables
jQuery.fn.dataTableExt.oSort['empty-asc'] = function (x, y) {
    var retVal;
    x = $.trim(x);
    y = $.trim(y);

    if (x == y) retVal = 0;
    else if (x == "" || x == "&nbsp;") retVal = 1;
    else if (y == "" || y == "&nbsp;") retVal = -1;
    else if (x > y) retVal = 1;
    else retVal = -1; // <- this was missing in version 1
    return retVal;
};

jQuery.fn.dataTableExt.oSort['empty-desc'] = function (y, x) {
    var retVal;
    x = $.trim(x);
    y = $.trim(y);

    if (x == y) retVal = 0;
    else if (x == "" || x == "&nbsp;") retVal = -1;
    else if (y == "" || y == "&nbsp;") retVal = 1;
    else if (x > y) retVal = 1;
    else retVal = -1; // <- this was missing in version 1
    return retVal;
};


jQuery.fn.dataTableExt.oSort['neg-currency-asc'] = function (a, b) {
    /* Remove any commas (assumes that if present all strings will have a fixed number of d.p) */
    /* Remove the currency sign, after the minus! */
    var x = a == "-" ? 0 : a.replace(new RegExp(/[^-0-9.]/g), "");
    var y = b == "-" ? 0 : b.replace(new RegExp(/[^-0-9.]/g), "");

    /* Parse and return */
    x = parseFloat(x);
    y = parseFloat(y);

    return x - y;
};

jQuery.fn.dataTableExt.oSort['neg-currency-desc'] = function (a, b) {
    /* Remove any commas (assumes that if present all strings will have a fixed number of d.p) */
    /* Remove the currency sign, after the minus! */
    var x = a == "-" ? 0 : a.replace(new RegExp(/[^-0-9.]/g), "");
    var y = b == "-" ? 0 : b.replace(new RegExp(/[^-0-9.]/g), "");

    /* Parse and return */
    x = parseFloat(x);
    y = parseFloat(y);

    return y - x;
}; // This is just a sample script. Paste your real code (javascript or HTML) here.