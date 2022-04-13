(() => {

const querySelect = liwra.querySelect
// Form example

const form = querySelect('[data-target]');

const handleSubmit = evt => {
    evt.preventDefault();

    const formValues = querySelect(evt.target, 'input[name]').reduce((r, elem) => {
        return { ...r, [elem.name]: elem.value };
    }, {})

    alert(JSON.stringify(formValues, null, 4));
}

const handleReset = () => {
    querySelect(form, 'input[name]').value = "";
}

form.addEventListener('submit', handleSubmit);
querySelect(form, '[data-reset]').addEventListener('click', handleReset);

})();