// import() calls use promises internally. If you use import() with older browsers (e.g., IE 11),
// remember to shim Promise using a polyfill such as es6-promise or promise-polyfill.

async function getComponent() {
    const element = document.createElement('div');

    const { default: _ } = await import('lodash');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}

getComponent().then((component) => {
    document.body.appendChild(component);
})