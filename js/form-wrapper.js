// helper method to extract a JS object from a DOM form
function wrapForm(formId, func) {
    let form = document.getElementById(formId);

    form.onsubmit = function (event) {
        const formData = {};
        event.preventDefault();

        for (let i = 0; i < form.elements.length; ++i) {
            if (form.elements[i].name) {
                // convert dashed names into nested data (billingContact-email -> billingContact['email'])
                let root = formData;
                const path = form.elements[i].name.split('-');
                const value = form.elements[i].value;

                path.slice(undefined, -1).forEach(function (key) {
                    if (root[key] === undefined) {
                        root[key] = {};
                    }

                    root = root[key];
                });

                // assign value to leaf
                root[path[path.length - 1]] = value;
            }
        }

        // call func with unpacked formData
        func(formData);
    };
}
