function component() {

    const btn = document.createElement('button');
    btn.textContent = 'Click Me'

    btn.onclick = () => import(/* webpackChunkName: 'print' */ "./print")
        .then((module) => {
        const print = module.default;

        print();
    });

    return btn;
}

document.body.appendChild(component());