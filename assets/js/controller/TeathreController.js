/**
 * Class that represents the application controller. The controller is responsible 
 * for accessing data from the model and displaying it on the view. The controller 
 * is used to intermediate between the view and the model. It monitors user interactions 
 * with the view and communicates any changes to the model. On the other hand, 
 * changes (if any) to the model are observed by the controller and subsequently 
 * reflected in the view.  
 * 
 * The controller contains the code that handles different types of events. The
 * controller's methods are event handlers.
 * 
 * BEWARE of the 'this' keyword. The 'this' keyword behaves a little differently
 * in JavaScript compared to other languages. In most cases, the value of 'this'
 * is determined by how a function is called (runtime binding). Inside a handler,
 * 'this' points to the UI element that triggered the event. Inside an arrow 
 * function, 'this' points to the object that owns/defines the arrow function.
 * Here, that's the AnimalController object.
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
 */
export class TeathreController {

    /**
 * Creastes an object to represent the ShopController 
 * @param {*} model - model which the controller will interact with
 * @param {*} view - view which the controller will interact with
 */
    constructor(model, view) {
        this.model = model;
        this.view = view;

        let properties = this.model.getProperties();
        this.view.renderSelects(properties);

        // 2. populate the first select
        let firstSelectID = properties[0];
        this.view.addOptions(firstSelectID, this.model.getOptions(firstSelectID));

        // 3. register one event handler for all select 'change' events
        this.view.selects.forEach((select) => {
            select.addEventListener('change', this.handleSelectChange);
        });

        // 4. register form submit handler
        this.view.teathreForm.addEventListener('submit', this.handleFormSubmit);
        this.view.resetButton.addEventListener("click", this.handleFormReset);
    }

    handleSelectChange = (event) => {
        let select = event.target;

        //1. UPDATE MODEL ------------------------------------------------------
        //Once the current model property is update, the other model properties
        //that are defined after the current property, they need to be reset to 
        //"undefined".
        this.model[select.id] = select.value;
        this.model.resetNextProperties(select.id);
        console.log(this.model);

        //2. UPDATE VIEW (selectsDiv + animalDiv -------------------------------    

        //2.1 Update the selectsDiv - reset next selects & load new options into
        // the next select only if the current selected option is different than 
        // '-- Select the ... --', which index is 0
        this.view.resetNextSiblings(select.id);
        let nextSelect = select.nextElementSibling;
        if (select.selectedIndex > 0 && nextSelect) {
            this.view.addOptions(nextSelect.id, this.model.getOptions(nextSelect.id));
        }

        //2.2. Update the animalDiv 
        this.view.renderTeathre();
    }

    /**
     * Handles form reset where all properties are reset
     */
    handleFormReset = () => {
        this.model.resetNextProperties("undefined");
        this.view.resetNextSiblings("genreType");
        this.view.resetImage();
    }

    /**
     * Submits form and stores object to local storage
     * @param {*} event 
     */
    handleFormSubmit = (event) => {
        this.model.store();
        this.model.persist();
    }

}

