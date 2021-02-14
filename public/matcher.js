var Matcher = /** @class */ (function () {
    function Matcher(universe) {
        this.universe = universe;
    }
    Matcher.prototype.match = function (s) {
        var result = this.universe.filter(function (m) { return m.indexOf(s) >= 0; });
        return result;
    };
    return Matcher;
}());
export { Matcher };
//# sourceMappingURL=matcher.js.map