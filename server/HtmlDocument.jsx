import React, { Component } from 'react';

function dehydrate(state) {
    let result = {};

    Object.keys(state).forEach(key => {
        const store = state[key];

        if (typeof store.dehydrate === 'function') {
            if (typeof store.shouldDehydrate === 'function' && !store.shouldDehydrate()){
                return;
            }
        }

        result[key] = store.dehydrate();
    });

    return result;
}

export default class HtmlDocument extends Component {
    
};