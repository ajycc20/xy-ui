export default class XyButton extends HTMLElement {
    //https://mladenplavsic.github.io/css-ripple-effect
    static get observedAttributes() { return ['disabled'] }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
        <style>
        :host{ display:inline-block; box-sizing:border-box; vertical-align: middle; overflow:hidden; line-height: 2.4; border:1px solid #ddd; font-size: 14px; color: #333;  border-radius: 3px; transition:background .3s,box-shadow .3s,border-color .3s,color .3s; transform: translateZ(0);}
        :host([disabled]){ pointer-events: none; opacity:.6; }
        :host([disabled]:not([type])){ background:#f1f1f1; }
        :host([disabled]) .btn{ pointer-events: all;  cursor: not-allowed; }
        :host([disabled]) slot{ pointer-events: none; }
        :host(:not([type="primary"]):not([disabled]):hover),
        :host(:not([type="primary"]):focus-within){ color:var(--themeColor,dodgerblue); border-color: var(--themeColor,dodgerblue); }
        :host(:not([type="primary"])) .btn::after{ background-image: radial-gradient(circle, var(--themeColor,dodgerblue) 10%, transparent 10.01%); }
        :host([type="primary"]){ border-color: var(--themeColor,dodgerblue); color: #fff; background: var(--themeColor,dodgerblue) }
        :host([type="dashed"]){ border-style:dashed }
        :host([type="flat"]){ border:0 }
        :host([type="flat"]) .btn{ padding:1px .8em; }
        :host([type="flat"]) .btn::before{ content:''; position:absolute; background: var(--themeColor,dodgerblue); pointer-events:none; left:0; right:0; top:0; bottom:0; opacity:0; transition:.3s;}
        :host([type="flat"]:not([disabled]):hover) .btn::before{ opacity:.1 }
        :host([type="flat"]:focus-within) .btn:before{ opacity:.2 }
        :host(:focus-within){ box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .btn{ display:flex; width:100%; align-items:center; color: inherit; line-height: inherit; font-size: inherit;  background:none; outline:0; border:0; position: relative; padding:0 .8em; user-select: none; text-align: center; }
        ::-moz-focus-inner{border:0;}
        .btn::after {
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            left: var(--x,0); 
            top: var(--y,0);
            pointer-events: none;
            background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
            background-repeat: no-repeat;
            background-position: 50%;
            transform: translate(-50%,-50%) scale(10);
            opacity: 0;
            transition: transform .3s, opacity .8s;
        }
        .btn:not([disabled]):active::after {
            transform: translate(-50%,-50%) scale(0);
            opacity: .3;
            transition: 0s;
        }
        </style>
        <button class="btn" id="btn" ><slot></slot></button>
        `
    }

    focus() {
        this.btn.focus();
    }

    get disabled() {
        return this.getAttribute('disabled')!==null;
    }

    set disabled(value) {
        if(value===null||value===false){
            this.removeAttribute('disabled');
        }else{
            this.setAttribute('disabled', '');
        }
    }

    connectedCallback() {
        this.btn = this.shadowRoot.getElementById('btn');
        this.btn.addEventListener('mousedown',function(ev){
            //ev.preventDefault();
            ev.stopPropagation();
            const { left, top } = this.getBoundingClientRect();
            this.style.setProperty('--x',(ev.clientX - left)+'px');
            this.style.setProperty('--y',(ev.clientY - top)+'px');
        })
        this.btn.addEventListener('mouseup',function(ev){
            this.focus();
        })
        this.disabled = this.disabled;
    }

    attributeChangedCallback (name, oldValue, newValue) {
        if( name == 'disabled' && this.btn){
            if(newValue!==null){
                this.btn.setAttribute('disabled', 'disabled');
            }else{
                this.btn.removeAttribute('disabled');
            }
        }
    }
}

if(!customElements.get('xy-button')){
    customElements.define('xy-button', XyButton);
}
