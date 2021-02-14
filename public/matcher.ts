export class Matcher {
    constructor (
        private universe:string[]
    ) {
    }
    match(s:string) {
        const result = this.universe.filter(m => m.indexOf(s) >= 0)
        return result
    }
}