var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { InputBox } from './suggester.js';
function exampleEntries() {
    var events = ['breakfast', 'party', 'lunch', 'party', 'dinner', 'sleep', 'breakfast'];
    var result = [];
    for (var i = 0; i < events.length; i++) {
        result.push({ time: hoursAgo(events.length - i), before: events[i], id: newUID() });
    }
    return result;
}
export function load() {
    var entries = loadEntries();
    sortEntries(entries);
    var x = new InputBox(getNames(entries), $('#trackerdiv'));
    function callback(t, entriesList) {
        entriesList = applyUpdate(t, [entries].concat(entriesList));
        entries = entriesList[0];
        saveEntries(entries);
        render();
        return entriesList.slice(1);
    }
    function render() {
        var e_1, _a;
        var elem = $('#inputs');
        var options = $('#options');
        elem.html('');
        options.html('');
        var _loop_1 = function (j, end, start) {
            var i = entries.length - j - 1;
            //end = entries[i]
            if (end != null) {
                var e_2 = $("<span class='clickable'>[" + renderTime(end.time) + "]</span>");
                e_2.click(function () {
                    evolvingPopup(entries.slice(i - 2, i), callback);
                });
                var f = $('<div></div>');
                f.append(e_2);
                elem.append(f);
            }
            if (start != null && end != null) {
                var e_3 = $("<span class='clickable'>" + labelFrom(start, end) + "</span>");
                e_3.click(function () {
                    evolvingPopup(entries.slice(i - 2, i + 1), callback);
                });
                var f = $('<div></div>');
                f.append(e_3);
                elem.append(f);
            }
        };
        try {
            for (var _b = __values(enumerate(listPairsAndEnds(revit(entries)))), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), j = _d[0], _e = __read(_d[1], 2), end = _e[0], start = _e[1];
                _loop_1(j, end, start);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    function addEntry(s) {
        entries.push({ before: s, time: now(), id: newUID() });
        saveEntries(entries);
        x.setUniverse(getNames(entries));
        render();
    }
    render();
    x.bind(addEntry);
}
export function loadChart() {
    renderChart(loadEntries());
}
function renderChart(entries) {
    var e_4, _a;
    var timings = getTotalTime(entries, entries[0].time, entries[entries.length - 1].time);
    var datapoints = [];
    try {
        for (var timings_1 = __values(timings), timings_1_1 = timings_1.next(); !timings_1_1.done; timings_1_1 = timings_1.next()) {
            var _b = __read(timings_1_1.value, 2), k = _b[0], v = _b[1];
            datapoints.push({ label: k, y: v / 3600, color: nameToColor(k) });
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (timings_1_1 && !timings_1_1.done && (_a = timings_1.return)) _a.call(timings_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    /* tslint:disable-next-line */
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: false,
        title: {},
        data: [{
                type: "pie",
                startAngle: 240,
                yValueFormatString: "##0.0h",
                indexLabel: "{label} {y}",
                dataPoints: datapoints
            }]
    });
    chart.render();
}
function secondsBetween(a, b) {
    return (b.getTime() - a.getTime()) / 1000;
}
function length(span) {
    return secondsBetween(span.start.time, span.end.time);
}
function renderBars(entries, buckets) {
    var e_5, _a, e_6, _b, e_7, _c, e_8, _d;
    var seconds = [];
    try {
        for (var buckets_1 = __values(buckets), buckets_1_1 = buckets_1.next(); !buckets_1_1.done; buckets_1_1 = buckets_1.next()) {
            var bucket = buckets_1_1.value;
            var spans = spansInRange(bucket.start, bucket.end, entries);
            seconds.push(sumByName(spans.map(function (span) { return [span.label, length(span)]; })));
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (buckets_1_1 && !buckets_1_1.done && (_a = buckets_1.return)) _a.call(buckets_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    var keys = new Set();
    try {
        for (var seconds_1 = __values(seconds), seconds_1_1 = seconds_1.next(); !seconds_1_1.done; seconds_1_1 = seconds_1.next()) {
            var m = seconds_1_1.value;
            try {
                for (var m_1 = (e_7 = void 0, __values(m)), m_1_1 = m_1.next(); !m_1_1.done; m_1_1 = m_1.next()) {
                    var k = m_1_1.value;
                    keys.add(k[0]);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (m_1_1 && !m_1_1.done && (_c = m_1.return)) _c.call(m_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (seconds_1_1 && !seconds_1_1.done && (_b = seconds_1.return)) _b.call(seconds_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    var data = [];
    var _loop_2 = function (k) {
        data.push({
            type: "stackedColumn",
            showInLegend: false,
            color: nameToColor(k),
            name: k,
            dataPoints: seconds.map(function (m, i) { return ({
                y: (m.get(k) || 0) / 3600,
                x: i,
            }); })
        });
    };
    try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var k = keys_1_1.value;
            _loop_2(k);
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_d = keys_1.return)) _d.call(keys_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: false,
        title: {},
        toolTip: {
            shared: false,
            contentFormatter: function (e) {
                var _a;
                return e.entries[0].dataSeries.name + ": " + ((_a = e.entries[0].dataPoint.y) === null || _a === void 0 ? void 0 : _a.toFixed(2));
            },
            content: '{name}: {y} '
        },
        axisX: {
            interval: 1,
            labelFormatter: function (e) { return (e.value >= 0) ? buckets[e.value].name : '???'; }
        },
        axisY: {
            valueFormatString: "#0h",
        },
        data: data
    });
    /*
    var chart = new CanvasJS.Chart("chartContainer", {
     animationEnabled: true,
     title: {},
     axisX: {
         interval: 1,
     },
     axisY:{
         valueFormatString:"#0h",
     },
     data: [{
         type: "stackedColumn",
         showInLegend: true,
         color: "#696661",
         name: "Q1",
         dataPoints: [
             { y: 6.75, x: 0},
             { y: 8.57, x: 1 },
             { y: 10.64, x: 2 },
             { y: 13.97, x: 3 },
             { y: 15.42, x: 4 },
             { y: 17.26, x: 5 },
             { y: 20.26, x: 6 }
         ]
         },
         {
             type: "stackedColumn",
             showInLegend: true,
             name: "Q2",
             color: "#EDCA93",
             dataPoints: [
                 { y: 6.82, x: 0},
                 { y: 9.02, x: 1 },
                 { y: 11.80, x: 2 },
                 { y: 14.11, x: 3 },
                 { y: 15.96, x: 4 },
                 { y: 17.73, x: 5 },
                 { y: 21.5, x: 6 }
             ]
         },
         {
             type: "stackedColumn",
             showInLegend: true,
             name: "Q3",
             color: "#695A42",
             dataPoints: [
                 { y: 7.28, x: 0 },
                 { y: 9.72, x: 1 },
                 { y: 13.30, x: 2 },
                 { y: 14.9, x: 3 },
                 { y: 18.10, x: 4 },
                 { y: 18.68, x: 5 },
                 { y: 22.45, x: 6 }
             ]
         },
         {
             type: "stackedColumn",
             showInLegend: true,
             name: "Q4",
             color: "#B6B1A8",
             dataPoints: [
                 { y: 8.44, x: 0 },
                 { y: 10.58, x: 1 },
                 { y: 14.41, x: 2 },
                 { y: 16.86, x: 3 },
                 { y: 10.64, x: 4 },
                 { y: 21.32, x: 5 },
                 { y: 26.06, x: 6 }
             ]
     }]
     });
     */
    chart.render();
}
export function loadBars() {
    var entries = loadEntries();
    var buckets = weeklyBuckets();
    renderBars(entries, buckets);
}
function weeklyBuckets() {
    var result = [];
    for (var i = 0; i < 7; i++) {
        var d = daysAgo(6 - i);
        var start = startOfDay(d);
        var end = endOfDay(d);
        result.push({ name: renderDay(d), start: start, end: end });
    }
    return result;
}
function incrementMap(map, x, dy) {
    var y = map.get(x);
    map.set(x, (y || 0) + dy);
}
function getTotalTime(entries, start, end) {
    var e_9, _a;
    var result = new Map();
    var spans = spansInRange(start, end, entries);
    try {
        for (var spans_1 = __values(spans), spans_1_1 = spans_1.next(); !spans_1_1.done; spans_1_1 = spans_1.next()) {
            var span = spans_1_1.value;
            var seconds = (span.start.time.getTime() - span.end.time.getTime()) / 1000;
            incrementMap(result, span.label, seconds);
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (spans_1_1 && !spans_1_1.done && (_a = spans_1.return)) _a.call(spans_1);
        }
        finally { if (e_9) throw e_9.error; }
    }
    return result;
}
function sumByName(data) {
    var e_10, _a;
    var result = new Map();
    try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var datum = data_1_1.value;
            incrementMap(result, datum[0], datum[1]);
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        }
        finally { if (e_10) throw e_10.error; }
    }
    return result;
}
function hoursAgo(n) {
    var result = now();
    result.setHours(result.getHours() - n);
    return result;
}
function daysAgo(n) {
    var result = now();
    result.setDate(result.getDate() - n);
    return result;
}
function getNames(entries) {
    var e_11, _a;
    var s = new Set();
    try {
        for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
            var entry = entries_1_1.value;
            if (entry.before !== undefined)
                s.add(entry.before);
            if (entry.after !== undefined)
                s.add(entry.after);
        }
    }
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
        try {
            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
        }
        finally { if (e_11) throw e_11.error; }
    }
    return Array.from(s.keys());
}
function uniques(xs) {
    return __spread(new Set(xs));
}
function now() {
    return new Date();
}
function renderTime(d) {
    return d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
}
//TODO: takes as input a date and a string
//parses the string as the nearest reasonable date
function parseTime(s, d) {
    var result = new Date(d);
    var parts = s.split(':').map(function (s) { return parseInt(s.trim()); });
    if (parts.length == 2 && parts.filter(function (x) { return x == parseInt('!'); })) {
        result.setHours(parts[0]);
        result.setMinutes(parts[1]);
    }
    return result;
}
function saveEntries(entries) {
    localStorage.setItem('entries', serializeEntries(entries));
}
function serializeEntries(entries) {
    return JSON.stringify(entries.map(function (x) { return ({ time: x.time.getTime(), before: x.before, after: x.after }); }));
}
function deserializeEntries(s) {
    var json = JSON.parse(s);
    return json.map(function (x) { return ({ time: new Date(x.time), before: x.before, after: x.after, id: x.id || newUID() }); });
}
function loadEntries() {
    var s = localStorage.getItem('entries');
    if (s == '' || s == null)
        return [];
    return deserializeEntries(s);
}
function renderDay(d) {
    return d.toLocaleDateString("en-US", { day: 'numeric', weekday: 'short', month: 'short' });
}
function sortEntries(entries) {
    entries.sort(function (a, b) { return a.time.getTime() - b.time.getTime(); });
}
function startOfDay(d) {
    var result = new Date(d);
    result.setHours(0, 0, 0, 0);
    return result;
}
function endOfDay(d) {
    var result = new Date(d);
    result.setHours(23, 59, 59, 999);
    return result;
}
function first(a, b) {
    return (a < b) ? a : b;
}
function last(a, b) {
    return (a > b) ? a : b;
}
function mid(a, b) {
    return new Date((a.getTime() + b.getTime()) / 2);
}
function applyToTriples(f, xs) {
    var e_12, _a;
    var a = undefined;
    var b = undefined;
    var c = undefined;
    var result = [];
    function addIf(a, b, c) {
        var y = f(a, b, c);
        if (y != null)
            result.push(y);
    }
    try {
        for (var xs_1 = __values(xs), xs_1_1 = xs_1.next(); !xs_1_1.done; xs_1_1 = xs_1.next()) {
            var x = xs_1_1.value;
            a = b;
            b = c;
            c = x;
            if (b != undefined) {
                addIf(a, b, c);
            }
        }
    }
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
        try {
            if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
        }
        finally { if (e_12) throw e_12.error; }
    }
    addIf(xs[xs.length - 2], xs[xs.length - 1], undefined);
    return result;
}
function labelFrom(a, b) {
    if (a.after === undefined && b.before === undefined)
        return '?unlabeled';
    if (a.after === undefined) {
        if (b.before === undefined)
            return '?unlabeled';
        return b.before;
    }
    else {
        if (b.before === undefined)
            return a.after;
        if (b.before !== a.after)
            return "?conflict-" + a.after + "-" + b.before;
        return a.after;
    }
}
// assumes that entries are sorted
function spansFromEntries(entries) {
    var result = applyToTriples(function (a, b, c) {
        if (a != undefined) {
            return {
                start: a,
                end: b,
                label: labelFrom(a, b),
                uid: newUID(),
            };
        }
        else {
            return null;
        }
    }, entries);
    return result;
}
// assumes that entries are sorted
function spansInRange(start, end, entries) {
    var e_13, _a;
    function clip(span) {
        if (span.start.time < start && span.end.time < start) {
            return null;
        }
        else if (span.start.time > end && span.end.time > end) {
            return null;
        }
        else {
            return __assign(__assign({}, span), { start: span.start, end: span.end });
        }
    }
    var result = [];
    try {
        for (var _b = __values(spansFromEntries(entries).map(clip)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var span = _c.value;
            if (span != null)
                result.push(span);
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_13) throw e_13.error; }
    }
    return result;
}
function partInDay(start, stop, day) {
    if (stop < day.start)
        return null;
    else if (start > day.end)
        return null;
    return {
        start: last(day.start, start),
        stop: first(day.end, stop)
    };
}
export function loadCalendar() {
    var entries = loadEntries();
    sortEntries(entries);
    function callback(t, entriesList) {
        entriesList = applyUpdate(t, [entries].concat(entriesList));
        entries = entriesList[0];
        showCalendar(entries, callback);
        saveEntries(entries);
        return entriesList.slice(1);
    }
    showCalendar(entries, callback);
}
function showCalendar(entries, callback) {
    var e_14, _a, e_15, _b;
    var days = [];
    for (var i = 0; i < 7; i++) {
        var d = daysAgo(6 - i);
        $("#headerrow th:nth-child(" + (i + 2) + ")").text(renderDay(d));
        days.push({ start: startOfDay(d), end: endOfDay(d), index: i });
    }
    try {
        for (var _c = __values(listPairs(enumerate(it(entries)))), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), _f = __read(_e[0], 2), i = _f[0], start = _f[1], _g = __read(_e[1], 2), j = _g[0], end = _g[1];
            try {
                for (var days_1 = (e_15 = void 0, __values(days)), days_1_1 = days_1.next(); !days_1_1.done; days_1_1 = days_1.next()) {
                    var day = days_1_1.value;
                    var range = partInDay(start.time, end.time, day);
                    if (range !== null) {
                        getCalendarColumn(day.index).append(calendarSpan(labelFrom(start, end), range.start, range.stop, day.start, day.end, entries, i, callback));
                    }
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (days_1_1 && !days_1_1.done && (_b = days_1.return)) _b.call(days_1);
                }
                finally { if (e_15) throw e_15.error; }
            }
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_14) throw e_14.error; }
    }
}
function split(name) {
    var n = name.indexOf('/');
    if (n == 0)
        return [name, null];
    else
        return [name.slice(0, n), name.slice(n + 1, 0)];
}
function group(name, view) {
    var _a = __read(split(name), 2), start = _a[0], rest = _a[1];
    var v = view.get(start);
    if (v == undefined)
        return null;
    if (v.expand == undefined || rest == null)
        return start;
    return start + "/" + group(rest, v.expand);
}
function nameToColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}
//TODO: callback applies the update and then gives the new list of spans
function calendarSpan(label, spanStart, spanEnd, start, end, entries, firstIndex, callback) {
    function frac(d) {
        return (d.getTime() - start.getTime()) / (end.getTime() - start.getTime());
    }
    var lengthPercent = 100 * (frac(spanEnd) - frac(spanStart));
    var topPercent = 100 * frac(spanStart);
    var color = nameToColor(label);
    var style = "top:" + topPercent + "%; height:" + lengthPercent + "%; background:" + color + ";";
    var result = $("<div class='event' style='" + style + "'><div class='spantext'>" + label + "</div></div>");
    var initialEntries = [];
    if (firstIndex > 0)
        initialEntries.push(entries[firstIndex - 1]);
    initialEntries.push(entries[firstIndex]);
    initialEntries.push(entries[firstIndex + 1]);
    if (firstIndex + 2 < entries.length)
        initialEntries.push(entries[firstIndex + 2]);
    result.click(function () { evolvingPopup(initialEntries, callback); });
    return result;
}
function evolvingPopup(initialEntries, callback) {
    function popup(entriesToShow) {
        function popupCallback(t) {
            var newEntries = callback(t, [entriesToShow]);
            popup(newEntries[0]);
        }
        multiPopup(entriesToShow, popupCallback);
    }
    popup(initialEntries);
}
function makeInput(initial, callback) {
    var elem = $("<input></input>");
    elem.val(initial);
    elem.keyup(function (e) {
        if (e.keyCode == 13) {
            callback(elem.val());
            elem.blur();
            e.preventDefault();
        }
    });
    return elem;
}
function inputAfterColon(head, initial, callback) {
    var elem = $("<div>" + head + ":</div>");
    elem.append(makeInput(initial, callback));
    return elem;
}
function newUID() {
    return Math.random().toString(36).substring(2, 10);
}
function noop() {
    return { kind: 'sequence', updates: [] };
}
function apply(update) {
    return function (x) {
        var y = (__assign({}, x));
        for (var k in update) {
            var f = update[k];
            if (f !== undefined)
                y[k] = f(x[k]);
        }
        return y;
    };
}
function assertNever(value) {
    throw new Error("Shouldn't reach this case!");
}
function applyList(update) {
    return function (xs) {
        var e_16, _a;
        switch (update.kind) {
            case 'sequence':
                var result = xs;
                try {
                    for (var _b = __values(update.updates), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var u = _c.value;
                        result = applyList(u)(result);
                    }
                }
                catch (e_16_1) { e_16 = { error: e_16_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_16) throw e_16.error; }
                }
                return result;
            case 'apply':
                return xs.map(function (x) { return (x.id == update.uid) ? update.update(x) : x; });
            case 'split':
            case 'delete':
                var n = xs.findIndex(function (x) { return x.id == update.uid; });
                if (n < 0)
                    throw new Error("Can't find that UID");
                var insert = (update.kind == 'split') ? update.insert : [];
                return xs.slice(0, n).concat(insert).concat(xs.slice(n + 1, undefined));
            default:
                return assertNever(update);
        }
    };
}
function insertAt(toInsert, xs, index) {
    return xs.slice(0, index).concat([toInsert]).concat(xs.slice(index));
}
function applyTo(f, xs, x) {
    return xs.map(function (y) { return (x.id == y.id) ? f(y) : y; });
}
function remove(x, xs) {
    return xs.filter(function (y) { return y.id != x.id; });
}
function insertBetween(x, xs, a, b) {
    for (var i = 0; i < xs.length - 1; i++) {
        if (xs[i].id == a.id && xs[i + 1].id == b.id) {
            return insertAt(x, xs, i + 1);
        }
    }
    return xs;
}
function neighbors(x, xs) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i].id == x.id) {
            return [
                (i == 0) ? null : xs[i - 1],
                (i == xs.length - 1) ? null : xs[i + 1]
            ];
        }
    }
    return [null, null];
}
//TODO: I think I want this to be the only place that mutates a span or entry?
//TODO: I want to somehow block the user from moving time past another entry
//(But at any rate I'll need to figure out how to resolve such conflicts in the DB...)
function applyUpdate(update, entriesList) {
    switch (update.kind) {
        case 'relabel':
            return entriesList.map(function (entries) {
                entries = applyTo(function (entry) { return (__assign(__assign({}, entry), { after: update.label })); }, entries, update.before);
                entries = applyTo(function (entry) { return (__assign(__assign({}, entry), { before: update.label })); }, entries, update.after);
                return entries;
            });
        case 'split':
            var newEntry_1 = {
                time: update.time,
                before: update.before.after || update.after.before,
                after: update.after.before || update.before.after,
                id: newUID()
            };
            return entriesList.map(function (entries) {
                return insertBetween(newEntry_1, entries, update.before, update.after);
            });
        case 'merge':
            return entriesList.map(function (entries) {
                var _a = __read(neighbors(update.entry, entries), 2), a = _a[0], b = _a[1];
                if (a != null)
                    a.after = update.label;
                if (b != null)
                    b.before = update.label;
                return remove(update.entry, entries);
            });
        case 'move':
            return entriesList.map(function (entries) { return applyTo(function (entry) { return (__assign(__assign({}, entry), { time: update.time })); }, entries, update.entry); });
        default: assertNever(update);
    }
}
function listPairsAndEnds(xs) {
    var a, b, xs_2, xs_2_1, x, e_17_1;
    var e_17, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                a = null;
                b = null;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                xs_2 = __values(xs), xs_2_1 = xs_2.next();
                _b.label = 2;
            case 2:
                if (!!xs_2_1.done) return [3 /*break*/, 5];
                x = xs_2_1.value;
                a = b;
                b = x;
                return [4 /*yield*/, [a, b]];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                xs_2_1 = xs_2.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_17_1 = _b.sent();
                e_17 = { error: e_17_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (xs_2_1 && !xs_2_1.done && (_a = xs_2.return)) _a.call(xs_2);
                }
                finally { if (e_17) throw e_17.error; }
                return [7 /*endfinally*/];
            case 8:
                if (!(b != null)) return [3 /*break*/, 10];
                return [4 /*yield*/, [b, null]];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}
function listPairs(xs) {
    var _a, _b, _c, x, y, e_18_1;
    var e_18, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 5, 6, 7]);
                _a = __values(listPairsAndEnds(xs)), _b = _a.next();
                _e.label = 1;
            case 1:
                if (!!_b.done) return [3 /*break*/, 4];
                _c = __read(_b.value, 2), x = _c[0], y = _c[1];
                if (!(x != null && y != null)) return [3 /*break*/, 3];
                return [4 /*yield*/, [x, y]];
            case 2:
                _e.sent();
                _e.label = 3;
            case 3:
                _b = _a.next();
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 7];
            case 5:
                e_18_1 = _e.sent();
                e_18 = { error: e_18_1 };
                return [3 /*break*/, 7];
            case 6:
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_18) throw e_18.error; }
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}
function enumerate(xs) {
    var i, xs_3, xs_3_1, x, e_19_1;
    var e_19, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                i = 0;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                xs_3 = __values(xs), xs_3_1 = xs_3.next();
                _b.label = 2;
            case 2:
                if (!!xs_3_1.done) return [3 /*break*/, 5];
                x = xs_3_1.value;
                return [4 /*yield*/, [i, x]];
            case 3:
                _b.sent();
                i += 1;
                _b.label = 4;
            case 4:
                xs_3_1 = xs_3.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_19_1 = _b.sent();
                e_19 = { error: e_19_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (xs_3_1 && !xs_3_1.done && (_a = xs_3.return)) _a.call(xs_3);
                }
                finally { if (e_19) throw e_19.error; }
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}
function it(xs) {
    var xs_4, xs_4_1, x, e_20_1;
    var e_20, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                xs_4 = __values(xs), xs_4_1 = xs_4.next();
                _b.label = 1;
            case 1:
                if (!!xs_4_1.done) return [3 /*break*/, 4];
                x = xs_4_1.value;
                return [4 /*yield*/, x];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                xs_4_1 = xs_4.next();
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 7];
            case 5:
                e_20_1 = _b.sent();
                e_20 = { error: e_20_1 };
                return [3 /*break*/, 7];
            case 6:
                try {
                    if (xs_4_1 && !xs_4_1.done && (_a = xs_4.return)) _a.call(xs_4);
                }
                finally { if (e_20) throw e_20.error; }
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}
function revit(xs) {
    var i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = xs.length - 1;
                _a.label = 1;
            case 1:
                if (!i--) return [3 /*break*/, 4];
                return [4 /*yield*/, xs[i]];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i >= 0;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
//Returns the same set of elements, but with booleans flagging first and last
function markTails(xs) {
    var first, next, start, xs_5, xs_5_1, x, e_21_1;
    var e_21, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                first = true;
                start = xs.next();
                if (start.done) {
                    return [2 /*return*/];
                }
                else {
                    next = start.value;
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                xs_5 = __values(xs), xs_5_1 = xs_5.next();
                _b.label = 2;
            case 2:
                if (!!xs_5_1.done) return [3 /*break*/, 5];
                x = xs_5_1.value;
                return [4 /*yield*/, [first, false, next]];
            case 3:
                _b.sent();
                next = x;
                first = false;
                _b.label = 4;
            case 4:
                xs_5_1 = xs_5.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_21_1 = _b.sent();
                e_21 = { error: e_21_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (xs_5_1 && !xs_5_1.done && (_a = xs_5.return)) _a.call(xs_5);
                }
                finally { if (e_21) throw e_21.error; }
                return [7 /*endfinally*/];
            case 8: return [4 /*yield*/, [first, true, next]];
            case 9:
                _b.sent();
                return [2 /*return*/];
        }
    });
}
//TODO: make all this logic work with entries instead of spans
function multiPopup(entries, callback) {
    var e_22, _a;
    $('#popup').attr('active', 'true');
    $('#popup').html('');
    function renderEntry(entry) {
        var timeElem = inputAfterColon('Time', renderTime(entry.time), function (s) { return callback({ kind: 'move', entry: entry, time: parseTime(s, entry.time) }); });
        timeElem.css('position', 'relative');
        $('#popup').append(timeElem);
    }
    function renderSpan(start, stop) {
        var label = labelFrom(start, stop);
        var labelElem = inputAfterColon('Activity', label, function (s) { return callback({ kind: 'relabel', before: start, after: stop, label: s }); });
        labelElem.css('position', 'relative');
        var splitButton = $("<div class='splitbutton button'>+</div>");
        splitButton.click(function () {
            callback({ kind: 'split', before: start, after: stop, time: mid(start.time, stop.time) });
        });
        labelElem.append(splitButton);
        var upButton = $("<div class='upbutton button'>↑</div>");
        upButton.click(function () {
            callback({ kind: 'merge', entry: start, label: label });
        });
        labelElem.append(upButton);
        var downButton = $("<div class='downbutton button'>↓</div>");
        downButton.click(function () {
            callback({ kind: 'merge', entry: stop, label: label });
        });
        labelElem.append(downButton);
        $('#popup').append(labelElem);
    }
    try {
        for (var _b = __values(listPairsAndEnds(it(entries))), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), start = _d[0], stop_1 = _d[1];
            if (start != null) {
                renderEntry(start);
            }
            if (start != null && stop_1 != null) {
                renderSpan(start, stop_1);
            }
        }
    }
    catch (e_22_1) { e_22 = { error: e_22_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_22) throw e_22.error; }
    }
}
function zip(xs, ys) {
    return xs.map(function (x, i) { return [x, ys[i]]; });
}
function getCalendarColumn(n) {
    return $("td:nth-child(" + (n + 2) + ")");
}
//# sourceMappingURL=track.js.map