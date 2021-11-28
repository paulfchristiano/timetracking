import { Matcher } from './matcher.js'
import { actionRule, parseString, Action, Rule } from './parse.js'

type JQE = JQuery<HTMLElement>

export class InputBox<T> {
    private suggestions:string[] = [];
    private selected:number|null = null;
    private submit:(a:T, s:string) => void = () => {}
    private matcher:Matcher;
    public readonly inputElement:HTMLInputElement;
    public readonly suggestionElement:JQE;
    constructor (
        private prefixRule:Rule<T>,
        private raw:T,
        private universe:string[],
        public readonly elem:JQE,
    ) {

        this.matcher = new Matcher(universe)

        this.inputElement = document.createElement('input')
        this.inputElement.setAttribute('class', 'input')

        elem.append(this.inputElement)
        this.inputElement.addEventListener('keydown', e => this.keydown(e))
        this.inputElement.addEventListener('keyup', e => this.keyup(e))

        this.suggestionElement = makeElement('div', ['suggestions'])
        elem.append(this.suggestionElement)
    }

    bind(f:(a:T, s:string) => void) {
        this.submit = f
    }

    focus() {
        this.inputElement.focus()
    }

    reset() {
        this.inputElement.value = ''
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
                this.enter()
                e.preventDefault()
                break
            case 9: //tab
            case 38: //up
            case 40: //down
                const direction:1|-1 = (e.keyCode == 38) ? -1 : 1
                this.shiftSelection(direction)
                const suggestion:string|undefined = this.currentSuggestion()
                if (suggestion !== undefined) this.inputElement.value = suggestion
                e.preventDefault()
                if (this.suggestions.length > 0) e.stopPropagation()
                break
        }
    }

    enter() {
        const s = this.getText()
        const m = parseString(this.prefixRule, this.getText())
        if (m == 'prefix' || m == 'fail') {
            this.submit(this.raw, s)
        } else {
            this.submit(m[0], m[2].trim())
        }
        this.reset()
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
        const suggester = this;
        this.suggestionElement.html('')
        for (let i = 0; i < this.suggestions.length; i++) {
            const suggestion = this.suggestions[i]
            const div = suggestionDiv(suggestion, i == this.selected)
            this.suggestionElement.append(div)
            div.click(function() {
                suggester.inputElement.value = suggestion
                suggester.selected = i
                suggester.enter()
            })
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
        return this.inputElement.value || ''
    }

    // Should be able to call it constantly, doesn't change state
    refresh() {
        const s:string = this.getText()
        let [prefix, suffix] = splitPrefix(s)
        suffix = suffix.trim()
        this.suggestions = (suffix.length == 0) ? [] : this.matcher.match(suffix).map(
            x => (prefix.length == 0) ? x : `${prefix} ${x}`
        )
        this.render()
    }
}

function splitPrefix(s:string): [string, string] {
    const m = parseString(actionRule, s)
    if (m == 'fail') return ['', s]
    if (m == 'prefix') return [s, '']
    return [m[1], m[2]]
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