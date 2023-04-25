// import chroma from "chroma-js";

//
// export function getRandomColors(numOfColors) {
//   return [...Array(numOfColors)].map(() => chroma.random().hex());
// }
import {Notify} from 'quasar';

export const loadScript = function (url, scriptClass, callback = null) {
    let isLoaded = document.querySelectorAll('.' + scriptClass);
    if (!(isLoaded.length > 0)) {
        let myScript = document.createElement('script');
        myScript.src = url;
        myScript.className = scriptClass;
        document.body.appendChild(myScript);
        myScript.onload = function () {
            if (callback) callback();
        };
    }
};

export const loadCss = function (filename, scriptClass, callback = null) {
    let isLoaded = document.querySelectorAll('.' + scriptClass);
    if (!(isLoaded.length > 0)) {
        let myLink = document.createElement('link');
        myLink.href = filename;
        myLink.rel = 'stylesheet';
        myLink.type = 'text/css';
        myLink.className = scriptClass;
        document.head.appendChild(myLink);
        myLink.onload = function () {
            if (callback) callback();
        };
    }
    // var cssNode = document.createElement("link");
    // cssNode.setAttribute("rel", "stylesheet");
    // cssNode.setAttribute("type", "text/css");
    // cssNode.setAttribute("href", filename);
    // document.getElementsByTagName("head")[0].appendChild(cssNode);
};

export const rowsUnpack = function (jsonRows, key) {
    try {
        return jsonRows.map(function (jsonRow) {
            return jsonRow[key];
        });
    } catch (err) {
        console.log('could not unpack', key, jsonRows);
    }
};

export const sortDataArray = function (dataArray) {
    return dataArray.sort(function (a, b) {
        let aDate = new Date(a[0]);
        let bDate = new Date(b[0]);
        return aDate - bDate;
    });
};

export const zipArrays = function (a, b) {
    return a.map(function (e, i) {
        if (Array.isArray(e)) {
            return [...e, b[i]];
        }
        return [e, b[i]];
    });
};

export const titleCase = function (sentence) {
    sentence = sentence.toLowerCase().split('_');
    for (let i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(' ');
};

export const showError = (msg) => {
    Notify.create({
        type: 'negative',
        message: msg,
        position: 'top',
        classes: ['notify'],
        multiLine: true,
    });
    // $q.notify({
    //     type: 'negative',
    //     message: msg,
    //     position: 'top',
    //     classes: ['notify'],
    //     multiLine: true,
    // })
};

export const isEmptyObject = (obj) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

//custom header filter
export const dateFilterEditor = function (cell, onRendered, success, cancel, editorParams) {

    // var container = $("<span></span>")
    let container = document.createElement('span');

    //create and style input
    // var start = $("<input type='date' placeholder='Start'/>");
    // var end = $("<input type='date' placeholder='End'/>");
    let start = document.createElement('input');
    start.setAttribute('type', 'date');
    start.setAttribute('placeholder', 'MM/DD/YYYY');
    start.setAttribute('onfocus', "(this.type='date')");
    start.setAttribute('onblur', "(this.type='text')");

    //onfocus="(this.type='date')"
    // onblur="(this.type='text')"

    let end = document.createElement('input');
    end.setAttribute('type', 'date');
    end.setAttribute('placeholder', 'End');
    end.setAttribute('onfocus', "(this.type='date')");
    end.setAttribute('onblur', "(this.type='text')");

    container.appendChild(start);
    container.appendChild(end);

    let inputs = [start, end];

    const cssObj = {
        "padding": "4px",
        "width": "50%",
        "box-sizing": "border-box"
    };

    const buildDateString = function () {
        return {
            start: start.value,
            end: end.value,
        };
    };

    inputs.forEach(input => {
        for (let [key, value] of Object.entries(cssObj)) {
            input.style.cssText += `${key}: ${value};`;
        }

        //submit new value on blur
        input.addEventListener("change blur", function (e) {
            success(buildDateString());
        });

        //submit new value on enter
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                success(buildDateString());
            }

            if (e.key === "Escape") {
                cancel();
            }
        });
    });
    start.style.width = '100%';
    end.style.display = 'None';
    return container;
};


export function getCookie(name, info = '') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length >= 2) return parts.pop().split(';').shift();
}

export const addHeaderToolTips = function (column) {
    const externalColumns = ['workplanid', 'candidate site id', 'candidate site name', 'candidate longitude', 'candidate latitude'];
    column.headerTooltip = function (col) {
        if (column.field && externalColumns.includes(column.field.toLowerCase())) {
            return 'Source=Erisite/DPM';
        }
        return false;
    };

};

export const addMapIcons = function (column) {
    if (column.field.toLowerCase() === 'cellname') {
        column.formatter = function (cell, formatterParams, onRendered) {
            const cellValue = `<span>${cell.getValue()}</span>`;

            // let qMap = `<a class="q-btn q-btn-item non-selectable no-outline q-btn--outline q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-mx-md" tabindex="0" href='https://ndo-portal.eprojecttrackers.com/app/spa/index.php#/map?cellName=${cell.getValue()}' target="_blank" title='view on kpi-map'><span class="q-focus-helper" tabindex="-1"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="fas fa-globe q-icon on-left" aria-hidden="true" role="img"> </i></span></a>`;

            let qMap = `<a class="q-btn q-btn-item non-selectable no-outline q-btn--outline q-btn--rectangle q-btn--actionable q-focusable q-hoverable text-positive q-pa-xs" href='https://ndo-portal.eprojecttrackers.com/app/spa/#/map?cellName=${cell.getValue()}' target="_blank" title='view on kpi-map'><i class='q-pa-xs fas fa-globe'></i></a>`;


            let lMap = `<a class="q-btn q-btn-item non-selectable no-outline q-btn--outline q-btn--rectangle q-btn--actionable q-focusable q-hoverable text-accent q-pa-xs" href='https://ndo-portal.eprojecttrackers.com/app/lite-map/index.php?cellName=${cell.getValue()}' target="_blank" title='view on simple map (lite version)'
            onclick="window.open(this.href,'targetWindow',
                                            \`toolbar=no,
                                            location=no,
                                            status=no,
                                            toolbar=no,
                                            left=500px,
                                            top=0,
                                            menubar=no,
                                            scrollbars=yes,
                                            resizable=yes,
                                            width=500px,
                                            height=500px    \`);
                    return false;"

><i class='q-pa-xs fas fa-globe'></i></a>`;

            return qMap + lMap + cellValue;
        };
    }
};

export const findStyleSheet = (sheetName) => {
    const styleSheetsArray = Array.from(document.styleSheets);
    return styleSheetsArray.find((styleSheet) => {
        if (styleSheet?.href) {
            const pathName = new URL(styleSheet.href).pathname.split("/").pop();
            if (pathName === sheetName) {
                return styleSheet;
            }
        }
    });
};

export const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

export const colorTrace = function (msg, color) {
    console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
};

export function redirectToLogin(errorMessage, authLoginUrl) {
    Notify.create({
        message: errorMessage,
        type: 'negative',
        position: 'center',
    });
    Notify.create({
        message: 'Redirecting to Login Page in 5 seconds...',
        type: 'negative',
        position: 'center',
    });
    setTimeout(
        () => {
            window.location = authLoginUrl;
        }
        , 5000);
}

export const properCase = function (str) {
    return str.replace(/(^|\s)\S/g, function (t) {
        return t.toUpperCase();
    });
};

export function removeProp(obj, propToDelete) {
    for (var property in obj) {
        if (typeof obj[property] == "object") {
            delete obj.property;
            obj[property] = removeProp(obj[property], propToDelete);
        } else {
            if (property === propToDelete) {
                delete obj[property];
            }
        }
    }
    return obj;
}

export class SvgToPngConverter {
    constructor() {
        this._init = this._init.bind(this);
        this._cleanUp = this._cleanUp.bind(this);
        this.convertFromInput = this.convertFromInput.bind(this);
    }

    _init() {
        this.canvas = document.createElement("canvas");
        this.imgPreview = document.createElement("img");
        this.imgPreview.style = "position: absolute; top: -9999px";

        document.body.appendChild(this.imgPreview);
        this.canvasCtx = this.canvas.getContext("2d");
    }

    _cleanUp() {
        document.body.removeChild(this.imgPreview);
    }

    convertFromInput(input, callback) {
        this._init();
        let _this = this;
        this.imgPreview.onload = function () {
            const img = new Image();
            _this.canvas.width = _this.imgPreview.clientWidth;
            _this.canvas.height = _this.imgPreview.clientHeight;
            img.crossOrigin = "anonymous";
            img.src = _this.imgPreview.src;
            img.onload = function () {
                _this.canvasCtx.drawImage(img, 0, 0);
                let imgData = _this.canvas.toDataURL("image/png");
                if (typeof callback == "function") {
                    callback(imgData);
                }
                _this._cleanUp();
            };
        };

        this.imgPreview.src = input;
    }
}

/**
 * converts a base64 encoded data url SVG image to a PNG image
 * @param originalBase64 data url of svg image
 * @param width target width in pixel of PNG image
 * @return {Promise<String>} resolves to png data url of the image
 */
export function base64SvgToBase64Png(originalBase64, width) {
    return new Promise(resolve => {
        let img = document.createElement('img');
        img.onload = function () {
            document.body.appendChild(img);
            let canvas = document.createElement("canvas");
            let ratio = (img.clientWidth / img.clientHeight) || 1;
            document.body.removeChild(img);
            canvas.width = width;
            canvas.height = width / ratio;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            try {
                let data = canvas.toDataURL('image/png');
                resolve(data);
            } catch (e) {
                resolve(null);
            }
        };
        img.src = originalBase64;
    });
}


export function svgToPng(svgStr, filename) {


    var canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 500;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgStr));

    // img.src = "data:image/svg+xml," + encodeURIComponent(svgStr);
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        var imgURL = canvas.toDataURL("image/png");
        var dlLink = document.createElement('a');
        dlLink.download = filename;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = ["image/png", dlLink.download, dlLink.href]
            .join(':');
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    };

    document.body.removeChild(canvas);
}

export function exportJSONToCSV(objArray, filename) {
    if (!objArray || !objArray.length) return;
    let arr = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str =
        `${Object.keys(arr[0])
            .map((value) => `"${value}"`)
            .join(',')}` + '\r\n';
    let csvContent = arr.reduce((st, next) => {
        st +=
            `${Object.values(next)
                .map((value) => `"${value}"`)
                .join(',')}` + '\r\n';
        return st;
    }, str);
    let element = document.createElement('a');
    element.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
    element.target = '_blank';
    element.download = `${filename}.csv`;
    element.click();
}

export function dataUrlToImage(dataUrl, fileName) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export const isIterable = (value) => {
    return Symbol.iterator in Object(value);
};

export const getBrowserName = function () {

    const agent = window.navigator.userAgent.toLowerCase();

    switch (true) {
        case agent.indexOf("edge") > -1:
            return "edge";
        case agent.indexOf("edg/") > -1:
            return "chromium based edge"; // Match also / to avoid matching for the older Edge
        case agent.indexOf("opr") > -1 && !!window.opr:
            return "opera";
        case agent.indexOf("chrome") > -1 && !!window.chrome:
            return "chrome";
        case agent.indexOf("trident") > -1:
            return "ie";
        case agent.indexOf("firefox") > -1:
            return "firefox";
        case agent.indexOf("safari") > -1:
            return "safari";
        default:
            return "other";
    }

};

export function mergeArrays(arr1, arr2, mergeKey) {
//    function to merge 2 arrays of objects using a key
//    arr1 is the longer array

    let results = [];
    for (let i = 0; i < arr1.length; i++) {
        results.push({
                ...arr1[i],
                ...(arr2.find((itmInner) => itmInner[mergeKey] === arr1[i][mergeKey]))
            }
        );
    }
    return results;
}

// sort array ascending
const asc = arr => arr.sort((a, b) => a - b);

const sum = arr => arr.reduce((a, b) => a + b, 0);

const mean = arr => sum(arr) / arr.length;

// sample standard deviation
const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

export const quantile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

export function merge(arrays, key) {
    var r = [],
        hash = Object.create(null);

    arrays.forEach(function (a) {
        a.forEach(function (o) {
            if (!hash[o[key]]) {
                hash[o[key]] = {};
                r.push(hash[o[key]]);
            }
            Object.keys(o).forEach(function (k) {
                hash[o[key]][k] = o[k];
            });
        });
    });
    return r;
}

export const parseCookie = str =>
    str
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});


export const getTodayDateString = function () {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
};