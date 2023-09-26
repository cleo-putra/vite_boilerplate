// placeholder/placeholderui.js

import { Plugin } from '@ckeditor/ckeditor5-core';
import { Model, addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui';
import { Collection } from '@ckeditor/ckeditor5-utils';
import { ButtonView, ContextualBalloon, clickOutsideHandler  } from '@ckeditor/ckeditor5-ui'; // ADDED
import FormView from './placeholderview';	
import './theme/styles.css';	
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';

export default class PlaceholderUI extends Plugin {
    static get requires() {
        return [ ContextualBalloon ];
    }

    private _balloon;
    private formView;

    init() {
        const editor = this.editor;
        const t = editor.t;
        const placeholderNames = editor.config.get( 'placeholderConfig.types' );

        this._balloon = this.editor.plugins.get( ContextualBalloon );
        this.formView = this._createFormView();
        // The "placeholder" dropdown must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'placeholder', locale => {
            const dropdownView = createDropdown( locale );

            // Populate the list in the dropdown with items.
            // @ts-ignore
            addListToDropdown( dropdownView, getDropdownItemsDefinitions( placeholderNames ) );

            dropdownView.buttonView.set( {
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t( 'Placeholder' ),
                tooltip: true,
                withText: true
            } );

            // Disable the placeholder button when the command is disabled.
            const command = editor.commands.get( 'placeholder' );
            dropdownView.bind( 'isEnabled' ).to( command );

            // Execute the command when the dropdown item is clicked (executed).
            this.listenTo( dropdownView, 'execute', evt => {
                // @ts-ignore
                editor.execute( 'placeholder', { value: evt.source.commandParam } );
                editor.editing.view.focus();
                //this._showUI();
            } );

            return dropdownView;
        } );

        const view = editor.editing.view;
        const viewDocument = view.document;

        view.addObserver( ClickObserver );
        const selection = editor.model.document.selection;
        editor.listenTo( viewDocument, 'click', ( evt, data ) => {
            const modelElement = editor.editing.mapper.toModelElement( data.target);

            if ( modelElement.name == 'placeholder' ) {
                console.log( 'Placeholder has been clicked.' );
                this._showUI();
            }
        } );
    }

    _createFormView() {
        const editor = this.editor;
        const formView = new FormView( editor.locale );

        this.listenTo( formView, 'submit', () => {
            const title = formView.titleInputView.fieldView.element.value;
            //const abbr = formView.abbrInputView.fieldView.element.value;

            /*const view = this.editor.editing.view;
            const viewDocument = view.document;
            let target = null;
    
            // Set a target position by converting view selection range to DOM.
            target = () => view.domConverter.viewRangeToDom(
                viewDocument.selection.getFirstRange()
            );

            //const modelElement = editor.editing.mapper.toModelElement( data.target);
            const modelElement = this.editor.editing.mapper.toModelRange( target );

            if ( modelElement.name == 'placeholder' ) {
                console.log( 'Placeholder has been clicked.' );
                //this._showUI();
                modelElement.textContent = 'testing'
            }*/

            /*editor.model.change( writer => {
                const view = this.editor.editing.view;
                const viewDocument = view.document;
                let target = null;
        
                // Set a target position by converting view selection range to DOM.
                target = () => view.domConverter.viewRangeToDom(
                    viewDocument.selection.getFirstRange()
                );

                //const modelElement = editor.editing.mapper.toModelElement( data.target);
                const modelElement = this.editor.editing.mapper.toModelRange( target );

                if ( modelElement.name == 'placeholder' ) {
                    console.log( 'Placeholder has been clicked.' );
                    //this._showUI();
                    modelElement.textContent = 'testing'
                }

                /*const view = this.editor.editing.view;
                const viewDocument = view.document;
                let target = null;
        
                // Set a target position by converting view selection range to DOM.
                target = () => view.domConverter.viewRangeToDom(
                    viewDocument.selection.getFirstRange()
                );

                
                const innerText = writer.createText( title );
                writer.insert( target, innerText );*/
                //editor.model.insertContent(
                //    writer.createText( "placeholder", { name: title } )
                //);
            //});

            this._hideUI();
        } );

        // Hide the form view after clicking the "Cancel" button.
        this.listenTo( formView, 'cancel', () => {
            this._hideUI();
        } );

        // Hide the form view when clicking outside the balloon.
        clickOutsideHandler( {
            emitter: formView,
            activator: () => this._balloon.visibleView === formView,
            contextElements: [ this._balloon.view.element ],
            callback: () => this._hideUI()
        } );

        return formView;
    }

    _hideUI() {
        //this.formView.abbrInputView.fieldView.value = '';
        this.formView.titleInputView.fieldView.value = '';
        this.formView.element.reset();

        this._balloon.remove( this.formView );

        // Focus the editing view after closing the form view.
        this.editor.editing.view.focus();
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        let target = null;

        // Set a target position by converting view selection range to DOM.
        target = () => view.domConverter.viewRangeToDom(
            viewDocument.selection.getFirstRange()
        );

        return {
            target
        };
    }

    _showUI() {
        this._balloon.add( {
            view: this.formView,
            position: this._getBalloonPositionData()
        } );

        this.formView.focus();
    }
}

function getDropdownItemsDefinitions( placeholderNames ) {
    const itemDefinitions = new Collection();

    for ( const name of placeholderNames ) {
        const definition = {
            type: 'button',
            model: new Model( {
                commandParam: name,
                label: name,
                withText: true
            } )
        };

        // Add the item definition to the collection.
        itemDefinitions.add( definition );
    }

    return itemDefinitions;
}