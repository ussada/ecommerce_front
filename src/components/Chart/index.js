import React from 'react';
import BarChart from './bar'
import PieChart from './pie';

const getComponent = ({id, opts, defaultOpts, title}) => {
    // defaultOpts = {
    //     className: 'input-field grid-cell--6',
    //     // className: classes.input,
    //     ...defaultOpts
    // };

    let {component} = opts;
    opts = {...opts};
    opts.label = title || opts.title;
    delete opts.component;
    delete opts.title;
    opts = {...defaultOpts, ...opts, id, key: id, name: id};
    // if( !types.hasOwnProperty(component)) return `Invalid component '${component}'`;

    switch(component) {
        case 'piechart':
            return <PieChart {...opts} />;

        case 'bachart': {
            let {label} = opts;
            delete opts.label;
            opts.title = label;
            return <BarChart {...opts} />;
        }

        default:
            return;
    }
}

const Chart = ({lang, schema, opts}) => {

    return (
        <div>
            {
                Object.keys(schema).map((id, idx) => {
                    if (schema[id]) {
                        return (
                            getComponent({
                                id,
                                opts: schema[id],
                                // opts: otherProps,
                                defaultOpts: opts ? opts : {},
                                title: lang && lang.data ? lang.data[id] : ''
                            })
                        )
                    }
                })
            }
        </div>
    );
}

export default Chart;