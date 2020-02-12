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

const menu = [
    {
        permit_type: 'S',
        name_en: 'User Management',
        name_th: 'จัดการผู้ใช้',
        permit_path: '/user',
        permit_order: 2010,
        permit_key: 'user',
        permit_module: 'user',
        permit_icon: 'person'
    },
    {
        permit_type: 'S',
        name_en: 'Role Management',
        name_th: 'จัดการสิทธิ์การใช้งาน',
        permit_path: '/role',
        permit_order: 2020,
        permit_key: 'role',
        permit_module: 'role',
        permit_icon: 'group_work'
    },
    {
        permit_type: 'M',
        name_en: 'Category Management',
        name_th: 'จัดการหมวดสินค้า',
        permit_path: '/product_category',
        permit_order: 3010,
        permit_key: 'product_category',
        permit_module: 'product_category',
        permit_icon: ''
    },
    {
        permit_type: 'M',
        name_en: 'Product Management',
        name_th: 'จัดการสินค้า',
        permit_path: '/product',
        permit_order: 3020,
        permit_key: 'product',
        permit_module: 'product_category',
        permit_icon: ''
    },
]

const role = [
    {
        id: 1,
        role_name: 'Administrator',
        status: 'A'
    }
]

const role_permission = [
    {
        id: 1,
        role_id: 1,
        permit_id: 1,
        status: 'A'
    },
    {
        id: 2,
        role_id: 1,
        permit_id: 2,
        status: 'A'
    },
    {
        id: 3,
        role_id: 1,
        permit_id: 3,
        status: 'A'
    },
    {
        id: 4,
        role_id: 1,
        permit_id: 4,
        status: 'A'
    }
]

const user = [
    {
        id: 1,
        username: 'admin',
        passwd: 'admin',
        role_id: 1,
        status: 'A'
    }
]

const pay_amount_m = {
    datasets: [
        {
            backgroundColor: "pink",
            data: [3, 18, 6]
        },
        {
            backgroundColor: "lightblue",
            data: [4, 6, 9]
        },
        {
            backgroundColor: "blue",
            data: [6, 7, 8]
        },
        {
            backgroundColor: "green",
            data: [3, 8, 5]
        }
    ]
};
const pay_amount_q =  {
    datasets: [
        {
            backgroundColor: "pink",
            data: [3, 18, 6]
        },
        {
            backgroundColor: "lightblue",
            data: [4, 6, 9]
        },
        {
            backgroundColor: "blue",
            data: [6, 7, 8],
            text: "Payment G/W"
        },
        {
            backgroundColor: "green",
            data: [3, 8, 5]
        }
    ]
};
const pay_amount_channel_m = {
    datasets: [
        {
            backgroundColor: "pink",
            data: [3, 18, 6],
            text: "Mobile"
        },
        {
            backgroundColor: "lightblue",
            data: [4, 6, 9],
            text: "Counter Service"
        },
        {
            backgroundColor: "blue",
            data: [6, 7, 8],
            text: "Payment G/W"
        },
        {
            backgroundColor: "green",
            data: [3, 8, 5],
            text: "EDC Room"
        }
    ]
};
const pay_amount_channel_q =  {
    datasets: [
        {
            backgroundColor: "pink",
            data: [3, 18, 6],
            text: "Mobile"
        },
        {
            backgroundColor: "lightblue",
            data: [4, 6, 9],
            text: "Counter Service"
        },
        {
            backgroundColor: "blue",
            data: [6, 7, 8],
            text: "Payment G/W"
        },
        {
            backgroundColor: "green",
            data: [3, 8, 5],
            text: "EDC Room"
        }
    ]
};

const locale = [
    {
        id: 'TH',
        name: 'TH'
    },
    {
        id: 'EN',
        name: 'EN'
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