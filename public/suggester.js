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
import { Matcher } from './matcher.js';
var InputBox = /** @class */ (function () {
    function InputBox(universe, elem, autofocus) {
        var _this = this;
        if (autofocus === void 0) { autofocus = true; }
        this.universe = universe;
        this.elem = elem;
        this.suggestions = [];
        this.selected = null;
        this.submit = function () { };
        this.matcher = new Matcher(universe);
        elem.empty();
        this.inputElement = makeElement('input', ['input']);
        elem.append(this.inputElement);
        this.inputElement.keydown(function (e) { return _this.keydown(e); });
        this.inputElement.keyup(function (e) { return _this.keyup(e); });
        this.suggestionElement = makeElement('div', ['suggestions']);
        elem.append(this.suggestionElement);
        if (autofocus) {
            this.inputElement.focus();
            this.inputElement.prop('autofocus', true);
        }
    }
    InputBox.prototype.bind = function (f) {
        this.submit = f;
    };
    InputBox.prototype.reset = function () {
        this.inputElement.val('');
        this.refresh();
    };
    InputBox.prototype.setUniverse = function (universe) {
        this.universe = universe;
        this.matcher = new Matcher(universe);
        this.refresh();
    };
    InputBox.prototype.addToUniverse = function (s) {
        this.universe.push(s);
        this.matcher = new Matcher(this.universe);
        this.refresh();
    };
    // I do this on keydown so that I can prevent default for the up arrow...
    InputBox.prototype.keydown = function (e) {
        switch (e.keyCode) {
            case 13:
                var m = match(this.getText());
                this.submit(m.action, m.suffix);
                this.reset();
                e.preventDefault();
                break;
            case 9: //tab
            case 38: //up
            case 40: //down
                var direction = (e.keyCode == 38) ? -1 : 1;
                this.shiftSelection(direction);
                var suggestion = this.currentSuggestion();
                if (suggestion !== undefined)
                    this.inputElement.val(suggestion);
                e.preventDefault();
                break;
        }
    };
    InputBox.prototype.keyup = function (e) {
        switch (e.keyCode) {
            case 13:
            case 9:
            case 38:
            case 40:
                break;
            default:
                this.selected = null;
                this.refresh();
        }
    };
    InputBox.prototype.render = function () {
        this.suggestionElement.html('');
        for (var i = 0; i < this.suggestions.length; i++) {
            var suggestion = this.suggestions[i];
            this.suggestionElement.append(suggestionDiv(suggestion, i == this.selected));
        }
    };
    InputBox.prototype.currentSuggestion = function () {
        return (this.selected === null) ? undefined : this.suggestions[this.selected];
    };
    InputBox.prototype.shiftSelection = function (direction) {
        var n = this.suggestions.length;
        if (n == 0) {
            return;
        }
        else if (this.selected == null) {
            switch (direction) {
                case 1:
                    this.selected = 0;
                    break;
                case -1:
                    this.selected = n - 1;
                    break;
                default: return assertNever(direction);
            }
        }
        else {
            console.log(this.suggestions);
            this.selected = (this.selected + direction + n) % n;
        }
        this.render();
    };
    InputBox.prototype.getText = function () {
        return (this.inputElement.val() || '');
    };
    // Should be able to call it constantly, doesn't change state
    InputBox.prototype.refresh = function () {
        var s = this.getText();
        var _a = __read(splitPrefix(s), 2), prefix = _a[0], suffix = _a[1];
        this.suggestions = (suffix.length == 0) ? [] : this.matcher.match(suffix).map(function (x) { return (prefix.length == 0) ? x : prefix + " " + x; });
        this.render();
    };
    return InputBox;
}());
export { InputBox };
function matchToken(s, t) {
    switch (t) {
        case 'number':
            var n = parseInt(s);
            if (isNaN(n))
                return 'none';
            return 'full';
        case 'time':
            var parts = s.split(':');
            if (parts.some(function (p) { return parseInt(p) == parseInt('nan'); }) || parts.length > 2)
                return 'none';
            if (parts.length == 2)
                return 'full';
            return 'partial';
        default:
            if (s == t[0])
                return 'full';
            if (s.length < t[0].length && s == t[0].slice(0, s.length))
                return 'partial';
            return 'none';
    }
}
function matchTokens(xs, ts) {
    for (var i = 0; i < ts.length; i++) {
        if (i >= xs.length)
            return 'partial';
        var m = matchToken(xs[i], ts[i]);
        switch (m) {
            case 'full':
                break;
            case 'partial':
                if (i == xs.length - 1)
                    return 'partial';
                else
                    return 'none';
            case 'none':
                return 'none';
            default: return assertNever(m);
        }
    }
    return 'full';
}
var rules = [
    { pattern: ['number'], action: function (xs) { return ({ kind: 'number', number: parseInt(xs[0]) }); } },
    { pattern: [['now']], action: function () { return ({ kind: 'now' }); } },
    { pattern: [['first'], 'number'], action: function (xs) { return ({ kind: 'first', minutes: parseInt(xs[1]) }); } },
    { pattern: [['last'], 'number'], action: function (xs) { return ({ kind: 'last', minutes: parseInt(xs[1]) }); } },
    { pattern: [['until'], 'time'], action: function (xs) { return ({ kind: 'until', time: xs[1] }); } },
    { pattern: [['after'], 'time'], action: function (xs) { return ({ kind: 'after', time: xs[1] }); } }
];
//Remove the part at the beginning that is a keyword
function splitPrefix(s) {
    var m = match(s);
    if (m.partial)
        return [s, ''];
    return [m.prefix, m.suffix];
}
function match(s) {
    var e_1, _a;
    debugger;
    var xs = s.split(' ');
    var partial = false;
    try {
        for (var rules_1 = __values(rules), rules_1_1 = rules_1.next(); !rules_1_1.done; rules_1_1 = rules_1.next()) {
            var rule = rules_1_1.value;
            var m = matchTokens(xs, rule.pattern);
            switch (m) {
                case 'full':
                    var prefix = xs.slice(0, rule.pattern.length);
                    var suffix = xs.slice(rule.pattern.length);
                    return { action: rule.action(prefix), partial: false, prefix: prefix.join(' '), suffix: suffix.join(' ') };
                case 'partial':
                    partial = true;
                    break;
                case 'none':
                    break;
                default: assertNever(m);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rules_1_1 && !rules_1_1.done && (_a = rules_1.return)) _a.call(rules_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return { action: { kind: 'raw' }, prefix: '', suffix: s, partial: partial };
}
function suggestionDiv(suggestion, focused) {
    if (focused === void 0) { focused = false; }
    var classes = ['suggestion'];
    if (focused)
        classes.push('focused');
    var result = makeElement('div', classes);
    result.text(suggestion);
    return result;
}
function assertNever(value) {
    throw new Error("Shouldn't reach this case!");
}
function makeElement(type, classes, id) {
    if (classes === void 0) { classes = []; }
    var classString = (classes.length == 0) ? '' : " class=\"" + classes.join(' ') + "\"";
    var idString = (id === undefined) ? '' : "id=\"" + id;
    var html = "<" + type + classString + idString + "></" + type + ">";
    return $(html);
}
//# sourceMappingURL=suggester.js.map