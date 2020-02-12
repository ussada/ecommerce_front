import React, {Component} from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import Form from '../../components/Form';
import {connect} from "react-redux";
import {addData, updateData, getDataBatch, setInitialData} from '../../actions/base';
import {validate, getFormData, cardExpiry} from '../../common/util';
import {handleChange, setChangeFields, setChangeFieldsByParam, getListItems, getCurrentValue} from '../../common/actions';
import Detail from './detail';
import Dialog from '../../components/Dialog';
import SnackBar from '../../components/SnackBar';

class PageData extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            mode: 'add',
            id: 0,
            count: 0,
            initialFields: {},
            changeFields: {},
            redirect: '',
            saveSuccess: false,
            snackbar: {}
        }

        this.schema = this.props.schema.bind( null, this );
        this.cardExpiry = cardExpiry.bind(this);
        this.handleChange = handleChange.bind(null, this);
        this.setChangeFields = setChangeFields.bind(null, this);
        this.setChangeFieldsByParam = setChangeFieldsByParam.bind(null, this);
        this.getListItems = getListItems.bind(null, this);
        this.getCurrentValue = getCurrentValue.bind(null, this);
    }

    static defaultProps = {
        moduleName: ''
    }
 
    save = (event, params = {}, callback) => {
        const {moduleName, selectedItems} = this.props;
        const {changeFields, mode, initialFields} = this.state;
        const dataSchema = this.schema('data');
        let item = {};

        if (mode === 'add') 
            item = getFormData(this.form);
        else
            item = typeof selectedItems !== 'undefined' ? selectedItems.slice()[0] : [];        
        
        
        let validateMsg = validate(dataSchema, {...changeFields, ...params}, item);

        // Validate required fields
        if (Object.keys(validateMsg).length > 0) {
            let msg = '';
            
            Object.keys(validateMsg).map(name => {
                msg += `${validateMsg[name]} \n`;
            });
            
            const snackbar = {
                content: msg,
                open: true,
                handleClose: this.snackbarHide
            }

            this.setState({
                snackbar, 
                errors: validateMsg  // For in-line msg
            });
        }
        else {
            let param = {
                ...changeFields,
                ...params
            }

            if (mode === 'add')
                param = {
                    ...item,
                    ...param
                }
            else if(mode === 'edit')
                param = {
                    // ...initialFields, // update with all fields
                    ...param // update only change fields
                }
    
            let detail = this.schema('detail');
            let detailList = detail ? Object.keys(detail) : [];
            const {detailStore } = this.props;
    
            detailList.map(moduleName => {
                let changeRows = detailStore[moduleName].changeRows;
                let fk = detail[moduleName](this, 'fk');
    
                if (typeof changeRows !== 'undefined' && changeRows.length > 0)
                    param[moduleName] = {fk, items: changeRows};
            });
        
            if (this.state.mode === 'add') {
                this.props.dispatch(addData(moduleName, param, json => {
                    if(json){
                        if(json.success){
                            alert('Add data complete!!');
                            this.setState({ id: json && json.id ? json.id : '' });
                            if (callback)
                                callback();
                            else
                                this.back();
                        }else{
                            alert(json.Message ? json.Message : 'Add failed!');
                        }
                    }
                    return;                    
                }));                
            }
            else {           
                let id = this.state.id;            
                param = {
                    id,
                    ...param
                }
                
                this.props.dispatch(updateData(moduleName, param, json => {
                    if(json){
                        if(json.success){
                            alert('Update data complete!!');
                            this.setState({ id: json && json.id ? json.id : '' });
                            if (callback)
                                callback();
                            else
                                this.back();
                        }else{
                            alert(json.Message ? json.Message : 'Update failed!');
                        }
                    }
                    return;
                }));
                return;
            }
    
            // if (callback)
            //     callback(param);
            // else
            //     this.back();
        }
    }
    
    back = () => {
        // this.props.dispatch(setChangeFields(this.props.moduleName, {}));
        const {history} = this.props;
        const {param} = this.props.location;
        let backPage = param && param.backPage ? param.backPage : '';
        if (history.action === 'PUSH') return history.goBack();
        if (history.action === 'REPLACE' && backPage !== '') history.replace(backPage);
        
        history.push(this.props.moduleName);        
    }
    
    refForm = (e) => {
        return this.form = e;
    }

    getBatchItems = (id) => {
        let detail = this.schema('detail');
        
        if (detail) {
            Object.keys(detail).map(name => {
                let fk = detail[name](this, 'fk');
                let param = {
                    con: {
                        [fk]: id
                    }
                }

                this.props.dispatch(getDataBatch(name, param));
            });
        }
    }

    clearBatchItems = () => {
        let detail = this.schema('detail');
        
        if (detail) {
            Object.keys(detail).map(name => {
                this.props.dispatch(setInitialData(name));
            });
        }
    }

    dialogShow = () => {
        this.setState({dialogVisible: true});    
    }
    
    dialogHide = () => {
        this.setState({dialogVisible: false});
    }

    snackbarHide = () => {
        this.setState({snackbar: {open: false}});
    }

    UNSAFE_componentWillMount() {
        const {param} = this.props.location;
        if (param) {
            let mode = param.mode ? param.mode : 'add';
            let id = param.id ? param.id : 0;
            let changeFields = {};
            
            if (mode === 'add') {
                const initialState = this.schema('initialState');
                changeFields = initialState ? {...initialState} : {};
            }
            else {
                this.getBatchItems(id);
            }
            
            this.setState({
                mode, 
                id,
                changeFields
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const nextSelectedItems = nextProps.selectedItems;

        const afterFetch = this.schema('afterFetch');        
        this.setState({initialFields: nextSelectedItems[0]});

        this.setState({
            initialFields: nextSelectedItems[0]}, 
            () => {
                if (afterFetch && afterFetch.length > 0) {
                    afterFetch.map(action => typeof action === 'function' ? action() : null);
                }
        });
    }

    componentDidMount() {
        // Actions on loading
        const initialActions = this.schema('initialActions');        

        if (initialActions && initialActions.length > 0) {
            initialActions.map(action => typeof action === 'function' ? action() : null);
        }        
    }

    componentWillUnmount() {
        this.clearBatchItems();
    }

    render() {
        const {loading, error, selectedItems, moduleName, page} = this.props;
        const {initialFields, changeFields, errors} = this.state;
        let item = typeof selectedItems !== 'undefined' ? selectedItems.slice()[0] : {};
        let pageHeader = this.schema('page').title;
        let data = this.schema('data');
        let buttonSchema = this.schema('button');
        
        item = {
            ...item,
            ...this.state.changeFields
        }

        if (error) {
            return <div>Error! {error.message}</div>;
        }

        let detail = this.schema('detail');

        // Language
        const {lang} = this.props;
        const langData = lang && lang.data ? lang.data : {};

        // Dialog
        const dialogSchema = this.schema('dialog');

        // Form default props
        const formDefaultProps = {
            handleChange: this.handleChange,
            setChangeFields: this.setChangeFields,
            ...this.schema('defaultProps')
        }
        
        return (
            <div>
                {
                    loading ? <div>Loading...</div>
                    :                
                    <div>
                    <h2>{langData[`page_${page}_data`] || pageHeader}</h2>
                        <form ref={this.refForm}>
                            <Form schema={data} formData={initialFields} changeFields={changeFields} moduleName={moduleName} errors={errors} defaultProps={formDefaultProps} />
                            <br/>
                            {
                                typeof detail !== 'undefined' 
                                    ? Object.keys(detail).map(name => {
                                        // const initialItems = initialFields && initialFields.hasOwnProperty(name) ? initialFields[name].slice() : [];
                                        return <Detail moduleName={name} schema={detail[name]} masterId={this.state.id} /*initialItems={initialItems}*/ />
                                    })
                                    : ''
                            }
                            <br/>
                            <Form schema={buttonSchema} />
                        </form>
                    </div>
                }
                {
                    dialogSchema
                        ?   <Dialog 
                                open={this.state.dialogVisible}
                                {...dialogSchema}
                            />
                        :   ''
                }
                {
                    this.state.snackbar
                        ?   <SnackBar {...this.state.snackbar} />
                        :   ''
                }
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    let selectedItems = {};
    let changeFields = {};
    let loading = false;
    let error = null;
    let lang = {};
    let user = {};
    
    if (props.moduleName) {
        selectedItems = state[props.moduleName].selectedItems;
        loading = state[props.moduleName].loading;
        error = state[props.moduleName].error;
        changeFields = state[props.moduleName].changeFields;
        lang = state.config.lang;
        user = state.config.user;
    }

    return {
        user,
        lang,
        selectedItems,
        changeFields,
        loading,
        error,
        detailStore: state
    }
}

export default withRouter(connect(mapStateToProps)(PageData));