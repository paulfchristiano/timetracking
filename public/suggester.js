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
        this.inputElement = makeElement('input', ['input']);
        if (autofocus)
            this.inputElement.attr('autofocus', '');
        elem.append(this.inputElement);
        this.inputElement.keydown(function (e) { return _this.keydown(e); });
        this.inputElement.keyup(function (e) { return _this.keyup(e); });
        this.suggestionElement = makeElement('div', ['suggestions']);
        elem.append(this.suggestionElement);
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
                this.submit(this.getText());
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
        console.log(this.selected);
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
        this.suggestions = (s.length == 0) ? [] : this.matcher.match(s);
        this.render();
    };
    return InputBox;
}());
export { InputBox };
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