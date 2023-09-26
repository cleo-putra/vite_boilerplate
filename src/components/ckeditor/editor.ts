import {ClassicEditor} from './ckeditor';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { List } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';

import Placeholder from './placeholder/placeholder';

export class Editor extends HTMLElement {
    constructor() {
        super();
    }

    private _editor:ClassicEditor | undefined;
    connectedCallback() {
        this.innerHTML = `
        <div id="editor"></div>
        `;

        let el = this.querySelector( '#editor' ) as HTMLElement;
        ClassicEditor //'#editor'
            .create( el, {
                plugins: [ Essentials, Paragraph, Heading, List, Bold, Italic, Placeholder ],
                toolbar: [ 'heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList', '|', 'placeholder' ],
                // @ts-ignore
                placeholderConfig: {
                    types: [ 'date', 'color', 'first name', 'surname' ]
                }
            } )
            .then( editor => {
                console.log( 'Editor was initialized', editor );
        
                // Expose for playing in the console.
                this._editor = editor;
            } )
            .catch( error => {
                console.error( error.stack );
            } );
    }

    get data():string | undefined{
        return this._editor?.getData();
    }

    set data(data:string){
        this._editor?.setData(data);
    }
}
customElements.define('sp-editor', Editor);