const template = document.createElement('template');
template.innerHTML = `
<fieldset>
    <legend class="maffie-control-label"></legend>
    <p class="maffie-control-display"></p>
</fieldset>`;

/**
 * Base class for creating custom controls.
 */
abstract class Control extends HTMLElement {
    private _value:any;
    private _listeners:Array<UpdateListener>;
    private _label:string;
    
    /**
     * Initializes a new instance of the {@link Control} class.
     * @param label The label (typically name) of the control.
     */
    public constructor(label:string) {
        super();
        this._label = label;
        this.attachShadow({ mode: "open" }); // open so this.shadowRoot isn't null
        this.shadowRoot!.appendChild(template.content.cloneNode(true));
    }

    /**
     * Returns the [inputs]{@link HTMLInputElement} for controlling this control.
     * @returns The inputs.
     */
    protected abstract createControls():Array<HTMLInputElement|HTMLFieldSetElement>;

    /**
     * Get an updated value of this control.
     * @param inputs All input elements in this control.
     * @returns The updated value.
     */
    protected abstract updateValue(inputs:Array<HTMLInputElement>):any;

    /**
     * Gets the current value of this control.
     */
    public get value():any {
        return this._value;
    }

    /**
     * Sets a new value for this control.
     */
    private set value(newValue: any) {
        // create the event
        const event:MaffieControlUpdateEvent = {
            emittedBy: this,
            oldValue: this._value,
            newValue: newValue,
        };

        // alert all listeners
        for (const listener of this._listeners) {
            listener.onUpdate(event);
        }

        // update display
        const display:HTMLElement = this.shadowRoot!.querySelector('.maffie-control-display')!;
        display.innerText = newValue;

        // update value
        this._value = newValue;
    }

    /**
     * Adds a new listener for each time this control's value changes.
     * @param listener The event handler.
     */
    public addListener(listener:UpdateListener) {
        this._listeners.push(listener);
    }

    /**
     * Sets up this control and connects event handlers.
     */
    connectedCallback() {
        const labelElement:HTMLElement = this.shadowRoot!.querySelector('.maffie-control-label')!;
        labelElement.appendChild(document.createTextNode(this._label));
        
        const controls = this.createControls();
        for (const control of controls) {
            control.classList.add('maffie-control-input');
            labelElement.insertAdjacentElement('afterend', control);
        }

        const inputs = Array.from(this.shadowRoot!.querySelectorAll('input'));
        for (const input of inputs) {
            input.addEventListener('input', () => {
                this.value = this.updateValue(inputs);
            });
        }
    }
}

/**
 * Handles the event when a [control's]{@link Control} value changes.
 * @see Control
 * @see MaffieControlUpdateEvent
 */
interface UpdateListener {
    onUpdate(event:MaffieControlUpdateEvent):void;
}

/**
 * The event emitted when a [control's]{@link Control} value changes.
 * @property emmittedBy The {@link Control} that emitted the event.
 * @property oldValue The value of the {@link Control} before the change.
 * @property newValue The value of the {@link Control} after the change.
 * @see Control
 * @see UpdateListener
 */
type MaffieControlUpdateEvent = {
    emittedBy:Control;
    oldValue:any;
    newValue:any;
}

export { Control };