const status = [
    {
        id: 'A',
        name: 'Active'
    },
    {
        id: 'I',
        name: 'Inactive'
    }
]

export const getList = (type, param = '') => {
    if (param === '')
        return eval(type).slice();
    else if (param === 'sum') {
        var dataArr = [];
        for (let i = 0; i < eval(type).datasets.length; i++) {
            dataArr.push(eval(type).datasets[i])
        } 
        return {
            "datasets": dataArr
        };
    }
    else
        return eval(type).filter(item => item[param.name] === param.value);
}