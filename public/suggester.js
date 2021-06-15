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
import { Matcher } from './matcher.js';
import { actionRule, parseString } from './parse.js';
var InputBox = /** @class */ (function () {
    function InputBox(prefixRule, raw, universe, elem) {
        var _this = this;
        this.prefixRule = prefixRule;
        this.raw = raw;
        this.universe = universe;
        this.elem = elem;
        this.suggestions = [];
        this.selected = null;
        this.submit = function () { };
        this.matcher = new Matcher(universe);
        this.inputElement = document.createElement('input');
        this.inputElement.setAttribute('class', 'input');
        elem.append(this.inputElement);
        this.inputElement.addEventListener('keydown', function (e) { return _this.keydown(e); });
        this.inputElement.addEventListener('keyup', function (e) { return _this.keyup(e); });
        this.suggestionElement = makeElement('div', ['suggestions']);
        elem.append(this.suggestionElement);
    }
    InputBox.prototype.bind = function (f) {
        this.submit = f;
    };
    InputBox.prototype.focus = function () {
        this.inputElement.focus();
    };
    InputBox.prototype.reset = function () {
        this.inputElement.value = '';
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
                this.enter();
                e.preventDefault();
                break;
            case 9: //tab
            case 38: //up
            case 40: //down
                var direction = (e.keyCode == 38) ? -1 : 1;
                this.shiftSelection(direction);
                var suggestion = this.currentSuggestion();
                if (suggestion !== undefined)
                    this.inputElement.value = suggestion;
                e.preventDefault();
                if (this.suggestions.length > 0)
                    e.stopPropagation();
                break;
        }
    };
    InputBox.prototype.enter = function () {
        var s = this.getText();
        var m = parseString(this.prefixRule, this.getText());
        if (m == 'prefix' || m == 'fail') {
            this.submit(this.raw, s);
        }
        else {
            this.submit(m[0], m[2].trim());
        }
        this.reset();
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
        var suggester = this;
        this.suggestionElement.html('');
        var _loop_1 = function (i) {
            var suggestion = this_1.suggestions[i];
            var div = suggestionDiv(suggestion, i == this_1.selected);
            this_1.suggestionElement.append(div);
            div.click(function () {
                suggester.inputElement.value = suggestion;
                suggester.selected = i;
                suggester.enter();
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.suggestions.length; i++) {
            _loop_1(i);
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
        return this.inputElement.value || '';
    };
    // Should be able to call it constantly, doesn't change state
    InputBox.prototype.refresh = function () {
        var s = this.getText();
        var _a = __read(splitPrefix(s), 2), prefix = _a[0], suffix = _a[1];
        suffix = suffix.trim();
        this.suggestions = (suffix.length == 0) ? [] : this.matcher.match(suffix).map(function (x) { return (prefix.length == 0) ? x : prefix + " " + x; });
        this.render();
    };
    return InputBox;
}());
export { InputBox };
function splitPrefix(s) {
    var m = parseString(actionRule, s);
    if (m == 'fail')
        return ['', s];
    if (m == 'prefix')
        return [s, ''];
    return [m[1], m[2]];
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