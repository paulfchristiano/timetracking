import { Matcher } from './matcher.js'

type JQE = JQuery<HTMLElement>

export class InputBox {
    private suggestions:string[] = [];
    private selected:number|null = null;
    private submit:(e:any) => void = () => {}
    private matcher:Matcher;
    public readonly inputElement:JQE;
    public readonly suggestionElement:JQE;
    constructor (
        private universe:string[],
        public readonly elem:JQE,
        autofocus:boolean = true
    ) {

        this.matcher = new Matcher(universe)

        this.inputElement = makeElement('input', ['input'])
        if (autofocus) this.inputElement.attr('autofocus', '')
        elem.append(this.inputElement)
        this.inputElement.keydown(e => this.keydown(e))
        this.inputElement.keyup(e => this.keyup(e))

        this.suggestionElement = makeElement('div', ['suggestions'])
        elem.append(this.suggestionElement)
    }

    bind(f:(e:any) => void) {
        this.submit = f
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
                this.submit(this.getText())
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
        console.log(this.selected)
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
        this.suggestions = (s.length == 0) ? [] : this.matcher.match(s)
        this.render()
    }
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