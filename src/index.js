import _ from 'lodash';
import Print from './print';
import React from 'react';
import { Container } from 'react-dom';

function component() {
    const element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.onclick = Print.bind(null, 'Hello webpack!');

    return element;
}

document.body.appendChild(component());