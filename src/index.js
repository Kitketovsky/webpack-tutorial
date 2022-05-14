async function getComponent() {
    const element = document.createElement('div');

    const btn = document.createElement('button');

    btn.textContent = 'Click to lazy'

    btn.onclick = () => import('./lazy').then((lazy) => {
        btn.textContent = lazy.default;
    })

    element.appendChild(btn);

    return element;
}

getComponent().then((component) => {
    document.body.appendChild(component);
})