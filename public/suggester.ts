import { Matcher } from './matcher.js'

type JQE = JQuery<HTMLElement>

export class InputBox {
    private suggestions:string[] = [];
    private selected:number|null = null;
    private submit:(a:Action, s:string) => void = () => {}
    private matcher:Matcher;
    public readonly inputElement:JQE;
    public readonly suggestionElement:JQE;
    constructor (
        private universe:string[],
        public readonly elem:JQE,
    ) {

        this.matcher = new Matcher(universe)
        elem.empty()

        this.inputElement = makeElement('input', ['input'])

        elem.append(this.inputElement)
        this.inputElement.keydown(e => this.keydown(e))
        this.inputElement.keyup(e => this.keyup(e))

        this.suggestionElement = makeElement('div', ['suggestions'])
        elem.append(this.suggestionElement)
    }

    bind(f:(a:Action, s:string) => void) {
        this.submit = f
    }

    focus() {
        this.inputElement.focus()
    }

    reset() {
        this.inputElement.val('')
        this.refresh()
    }

    setUniverse(universe:string[]) {
        this.universe = universe
        this.matcher = new Matcher(universe)
        this.refresh()
    }

    addToUniverse(s:string) {
        this.universe.push(s)
        this.matcher = new Matcher(this.universe)
        this.refresh()
    }

    // I do this on keydown so that I can prevent default for the up arrow...
    keydown(e:any) {
        switch (e.keyCode) {
            case 13:
                const m = match(this.getText())
                this.submit(m.action, m.suffix)
                this.reset()
                e.preventDefault()
                break
            case 9: //tab
            case 38: //up
            case 40: //down
                const direction:1|-1 = (e.keyCode == 38) ? -1 : 1
                this.shiftSelection(direction)
                const suggestion:string|undefined = this.currentSuggestion()
                if (suggestion !== undefined) this.inputElement.val(suggestion)
                e.preventDefault()
                break
        }
    }
    
    keyup(e:any) {
        switch (e.keyCode) {
            case 13:
            case 9:
            case 38:
            case 40:
                break
            default:
                this.selected = null
                this.refresh()
        }
    }

    render(): void {
        this.suggestionElement.html('')
        for (let i = 0; i < this.suggestions.length; i++) {
            const suggestion = this.suggestions[i]
            this.suggestionElement.append(suggestionDiv(suggestion, i == this.selected))
        }
    }

    currentSuggestion(): string|undefined {
        return (this.selected === null) ? undefined : this.suggestions[this.selected]
    }

    shiftSelection(direction:1|-1): void {
        const n = this.suggestions.length;
        if (n == 0) {
            return
        } else if (this.selected == null) {
            switch (direction) {
                case 1:
                    this.selected = 0
                    break
                case -1:
                    this.selected = n-1
                    break
                default: return assertNever(direction)
            }
        } else {
            console.log(this.suggestions)
            this.selected = (this.selected + direction + n) % n
        }
        this.render()
    }

    getText(): string {
        return (this.inputElement.val() || '') as string
    }

    // Should be able to call it constantly, doesn't change state
    refresh() {
        const s:string = this.getText()
        const [prefix, suffix] = splitPrefix(s)
        this.suggestions = (suffix.length == 0) ? [] : this.matcher.match(suffix).map(
            x => (prefix.length == 0) ? x : `${prefix} ${x}`
        )
        this.render()
    }
}

type Token = 'number' | 'time' | [string]

function matchToken(s:string, t:Token): 'full' | 'partial' | 'none' {
    switch (t) {
        case 'number':
            const n = parseInt(s)
            if (isNaN(n)) return 'none'
            return 'full'
        case 'time':
            const parts = s.split(':')
            if (parts.some(p => parseInt(p) == parseInt('nan')) || parts.length > 2) return 'none'
            if (parts.length == 2) return 'full'
            return 'partial'
        default:
            if (s == t[0]) return 'full'
            if (s.length < t[0].length && s == t[0].slice(0, s.length)) return 'partial'
            return 'none'
    }
}

function matchTokens(
    xs:string[],
    ts:Token[]
): 'partial' | 'full'| 'none' {
    for (let i = 0; i < ts.length; i++) {
        if (i >= xs.length) return 'partial'
        const m = matchToken(xs[i], ts[i])
        switch (m) {
            case 'full':
                break
            case 'partial':
                if (i == xs.length - 1) return 'partial'
                else return 'none'
            case 'none':
                return 'none'
            default: return assertNever(m)
        }
    }
    return 'full'
}

type Action = {kind: 'raw'} 
    | {kind: 'first', minutes: number}
    | {kind: 'number', number: number}
    | {kind: 'now'}
    | {kind: 'last', minutes: number}
    | {kind: 'until', time: string}
    | {kind: 'untilMinutes', minutes: number}
    | {kind: 'after', time: string}

interface Rule {
    pattern: Token[],
    action: (xs:string[]) => Action
}

const rules:Rule[] = [
    {pattern: ['number'], action: xs => ({kind: 'number', number: parseInt(xs[0])})},
    {pattern: [['now']], action: () => ({kind: 'now'})},
    {pattern: [['first'], 'number'], action: xs => ({kind: 'first', minutes: parseInt(xs[1])})},
    {pattern: [['last'], 'number'], action: xs => ({kind: 'last', minutes: parseInt(xs[1])})},
    {pattern: [['until'], 'time'], action: xs => ({kind: 'until', time: xs[1]})},
    {pattern: [['until'], 'number'], action: xs => ({kind: 'untilMinutes', minutes: parseInt(xs[1])})},
    {pattern: [['after'], 'time'], action: xs => ({kind: 'after', time: xs[1]})}

]

interface MatchResult {
    action: Action,
    partial: boolean,
    prefix: string, //does this look like it could be the beginning of a command?
    suffix: string
}

//Remove the part at the beginning that is a keyword
function splitPrefix(s:string): [string, string] {
    const m = match(s)
    if (m.partial) return [s, '']
    return [m.prefix, m.suffix]
}

function match(s:string): MatchResult {
    const xs = s.split(' ')
    let partial = false
    for (const rule of rules) {
        const m = matchTokens(xs, rule.pattern)
        switch (m) {
            case 'full':
                const prefix = xs.slice(0, rule.pattern.length)
                const suffix = xs.slice(rule.pattern.length)
                return {action: rule.action(prefix), partial: false, prefix: prefix.join(' '), suffix: suffix.join(' ')}
            case 'partial':
                partial = true
                break
            case 'none':
                break
            default: assertNever(m)
        }
    }
    return {action: {kind: 'raw'}, prefix: '', suffix: s, partial: partial}
}

function suggestionDiv(suggestion:string, focused:boolean = false): JQE {
    const classes = ['suggestion']
    if (focused) classes.push('focused')
    const result = makeElement('div', classes)
    result.text(suggestion)
    return result
}

function assertNever(value: never): never {
    throw new Error("Shouldn't reach this case!")
}

function makeElement(type:'div'|'span'|'input', classes:string[]=[], id?:string,): JQE {
    const classString = (classes.length == 0) ? '' : ` class="${classes.join(' ')}"`
    const idString = (id === undefined) ? '' : `id="${id}`
    const html:string = `<${type}${classString}${idString}></${type}>`
    return $(html)
}