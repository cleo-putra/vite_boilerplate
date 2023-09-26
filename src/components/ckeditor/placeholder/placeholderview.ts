import { View, ButtonView, LabeledFieldView, createLabeledInputText, submitHandler } from '@ckeditor/ckeditor5-ui';
import { icons } from '@ckeditor/ckeditor5-core';

export default class FormView extends View {
    private saveButtonView;
    private cancelButtonView;
    titleInputView;
    private childViews;

    constructor( locale ) {
        super( locale );

        this.saveButtonView = this._createButton(
            'Save', icons.check, 'ck-button-save'
        );
        this.saveButtonView.type = 'submit';

        this.cancelButtonView = this._createButton(
            'Cancel', icons.cancel, 'ck-button-cancel'
        );
        this.cancelButtonView.delegate( 'execute' ).to( this, 'cancel' );

        this.titleInputView = this._createInput( 'Add title' );
        
        this.childViews = this.createCollection( [
            //this.abbrInputView,
            this.titleInputView,
            this.saveButtonView,
            this.cancelButtonView
        ] );

        this.setTemplate( {
            tag: 'form',
            attributes: {
                class: [ 'ck', 'ck-abbr-form' ],
                tabindex: '-1'
            },
            children: this.childViews
        } );
    }

    render() {
        super.render();

        // Submit the form when the user clicked the save button
        // or pressed enter in the input.
        submitHandler( {
            view: this
        } );
    }

    focus() {
        this.childViews.first.focus();
    }

    _createInput( label ) {
        const labeledInput = new LabeledFieldView( this.locale, createLabeledInputText );

        labeledInput.label = label;

        return labeledInput;
    }

    _createButton( label, icon, className ) {
        const button = new ButtonView();

        button.set( {
            label,
            icon,
            tooltip: true,
            class: className
        } );

        return button;
    }

}