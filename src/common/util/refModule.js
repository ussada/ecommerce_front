const role = {
    moduleName: 'role',
    fields: {
        id: 'id',
        name: 'role_name'
    }
}

const user = {
    moduleName: 'user',
    fields: {
        id: 'id',
        name: 'username'
    }
}

const category = {
    moduleName: 'category',
    fields: {
        id: 'id',
        name: 'cat_name'
    }
}

const product = {
    moduleName: 'product',
    fields: {
        id: 'id',
        name: 'prod_name'
    }
}

const menu = {
    moduleName: 'menu',
    fields: {
        id: 'id',
        name_th: 'name_th',
        name_en: 'name_en',
        icon: 'permit_icon',
        order: 'permit_order',
        key: 'permit_key',
        to: 'permit_path',
        module: 'permit_module',
        type: 'permit_type'
    }
}

export const getReference = (moduleName) => {
    try {
        return {...eval(moduleName)};
    }
    catch {
        return {};
    }
}
