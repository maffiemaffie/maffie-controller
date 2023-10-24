import { Control } from "./control";

/**
 * Slider control with label and value display
 */
class Slider extends Control {
    private sliderAttributes: {
        'min':number|undefined,
        'max':number|undefined,
        'step':number|'any'|undefined,
        'value':number|undefined,
        'name':string|undefined,
    } = {
        min: undefined,
        max: undefined,
        step: undefined,
        value: undefined,
        name: undefined
    };

    /**
     * Initializes a new instance of the {@link Slider} class.
     * @param label The label.
     * @param attributes The slider attributes.
     */
    constructor(label:string, attributes:{min:number, max:number, step:number|'any', value:number, name:string}) {
        super(label);
        // for (const [key, value] of Object.entries(attributes)) {
        //     this.sliderAttributes[key] = value;
        // }
        Object.assign(this.sliderAttributes, attributes);
    }

    protected createControls(): (HTMLInputElement | HTMLFieldSetElement)[] {
        const slider = document.createElement('input');
        slider.setAttribute('type', 'range');

        for (const [attr, value] of Object.entries(this.sliderAttributes)) {
            if (value) slider.setAttribute(attr, value as string);
        }

        return [slider];
    }
    protected updateValue(inputs: HTMLInputElement[]) {
        const slider = inputs[0] as HTMLInputElement;
        return slider.value;
    }
    
}

customElements.define('maffie-slider', Slider);

export { Slider };