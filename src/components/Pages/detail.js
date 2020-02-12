import React from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography,
    Icon
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import Form from '../Form';
import Table from '../Table';
import Dialog from '../Dialog';
import {PageList} from '../Pages';

import {addDataBatch, updateDataBatch, deleteDataBatch, setChangeRows} from '../../actions/base';
import guid from 'uuid/v1';
import {handleRowToggle, handleChange, setChangeFields, getListItems} from '../../common/actions';
import {getFormData, validate, toNumber} from '../../common/util';

const styles = theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
});

class Detail extends React.Component {
    
    constructor( props ) {
        super( props );
        this.state = {
            changeFields: {},
            selectedRows: [],
            count: 0,
            dialogVisible: false,
            panel_name: '',
            selectedSearch: []
        };
        
        this.schema = this.props.schema.bind(null, this);
        this.handleRowToggle = handleRowToggle.bind(null, this);
        this.handleChange = handleChange.bind(null, this);
        this.setChangeFields = setChangeFields.bind(null, this);
        this.addDataBatch = addDataBatch.bind(this);
        this.deleteDataBatch = deleteDataBatch.bind(this);
        this.updateDataBatch = updateDataBatch.bind(this);
        this.getListItems = getListItems.bind(null, this);
    }

    add = () => {
        this.dialogShow();
    }

    changeRows = (param, flag) => {
        let params = [];

        if (Array.isArray(param))
            params = param.map(item => ({...item, flag}));
        else
            params.push({...param, flag});

        this.props.dispatch(setChangeRows(this.props.moduleName, params));
    }

    save = () => {
        const {changeFields} = this.state;
        const {batchItems, moduleName} = this.props;
        let dataSchema = this.schema('data');

        let item = getFormData(this.form);
        let validateMsg = validate(dataSchema, changeFields, item);

        // Validate required fields
        if (validateMsg.length > 0) {
            let msg = '';
            
            validateMsg.map(value => {
                msg += `${value} \n`;
            });

            alert(msg);
        }
        else {
            if (batchItems.findIndex(item => item.guid === changeFields.guid) > -1) {
                let param = {...changeFields}
                this.props.dispatch(updateDataBatch(moduleName, param, batchItems));
                this.changeRows(param, 'edit');
            }
            else {
                let param = {guid: guid(), ...item, ...changeFields};
                this.props.dispatch(addDataBatch(moduleName, param, batchItems));
                this.changeRows(param, 'add');
            }
            
            this.setState({
                dialogVisible: false,
                changeFields: {}
            });
        }
    }

    autosave = () => {
        const {batchItems, moduleName} = this.props;
        const {changeFields} = this.state;
        
        if (batchItems.length > 0) {
            let param = {...batchItems[0], ...changeFields}
            this.props.dispatch(updateDataBatch(moduleName, param, batchItems));
            this.changeRows(param, 'edit');
        }
        else {
            let param = {guid: guid(), ...changeFields};
            this.props.dispatch(addDataBatch(moduleName, param, []));
            this.changeRows(param, 'add');
        }
    }

    delete = () => {
        const selectedRows = this.state.selectedRows.slice();
        const batchItems = this.props.batchItems.slice();
        let param = [];
        const deletedRows = selectedRows.map(id => {
            let row = batchItems.find(item => item.id === id || item.guid === id);
            if (row.guid)
                param.push(row.guid);
            
            return {guid: row.guid, id: row.id}
        });

        this.props.dispatch(deleteDataBatch(this.props.moduleName, param));
        this.changeRows(deletedRows, 'delete');
        this.setState({selectedRows: []});
    }

    edit = (row) => {
        const {batchItems} = this.props;
        let item = batchItems.find(item => item.guid == row.guid);
        
        this.setState({
            changeFields: item,
            dialogVisible: true
        });
    }

    dialogShow = () => {
        this.setState({dialogVisible: true});    
    }

    dialogHide = () => {
        this.setState({
            dialogVisible: false,
            changeFields: {}
        });
    }

    refForm = (e) => {
        return this.form = e;
    }

    renderDetail = (type, schema, data) => {
        switch(type) {
            case 'table':
                return <Table data={schema} /> 
            
            case 'form':
                return <form ref={this.refForm}><Form schema={schema} formData={data[0]} autosave={this.autosave} /></form>

            case 'list': 
                return <form ref={this.refForm}><Form schema={schema} formData={data} /></form>

            default:
                return undefined;
        }   
    }

    searchSelected = (event, moduleName, rows) => {
        let selectedSearch = this.state.selectedSearch[moduleName] ? this.state.selectedSearch[moduleName].slice() : [];
        let id = toNumber(event.target.id);
        let checked = event.target.checked;
        
        if (checked) {
            if (id == '0')
                selectedSearch = rows.map(row => row.id || row.guid);
            else
                selectedSearch = [
                    ...selectedSearch,
                    id
                ];
        }
        else {
          if (id == '0')
            selectedSearch = [];
          else
            selectedSearch = [
                ...selectedSearch.filter(value => value !== id)
            ];
        }
      
        this.setState({selectedSearch: {[moduleName]: selectedSearch}});
    };

    addBySearch = () => {
        const {selectedSearch} = this.state;
        const {moduleName} = this.props;
        const data = this.schema('data');
        const fk = data(this, 'fk');
        const searchModule = data(this, 'moduleName');
        let changeRows = [];

        selectedSearch[searchModule].map(id => {
            let param = {guid: guid(), [fk]: id};
            this.props.dispatch(addDataBatch(moduleName, param));
            changeRows.push(param);
        })
        
        this.changeRows(changeRows, 'add');
        this.setState({
            dialogVisible: false,
            selectedSearch: {
                facility: []
            }
        });
    }

    clearSearchSelected = (moduleName) => {
        this.setState({
            dialogVisible: false,
            selectedSearch: {
                ...this.state.selectedSearch,
                [moduleName]: []
            }
        });
    }

    UNSAFE_componentWillMount() {
        const {moduleName, initialItems} = this.props;
        
        if (initialItems && initialItems.length > 0)
            initialItems.map(item => this.props.dispatch(addDataBatch(moduleName, {guid: guid(), ...item})));
    }

    componentDidMount() {
        // Actions on loading
        const initialActions = this.schema('initialActions');

        if (initialActions && initialActions.length > 0) {
            initialActions.map(action => typeof action === 'function' ? action() : null);
        }
    }

    render() {
        const {moduleName, batchItems, classes} = this.props;
        const {dialogVisible} = this.state;
        let title = this.schema('title');
        let type = this.schema('type');
        let items = batchItems || [];
        
        if (!type)
            return <div>Incorrect component type</div>;

        let tableSchema = this.schema('table');
        let schema;
        let dialogSchema = this.schema('data');

        if (type === 'table') {
            schema = {
                ...tableSchema,
                rows: items
            };
        }
        else {
            schema = this.schema('data');
        }
        
        let addMode = this.schema('addMode');
        let searchModule = '';
        let initialSearchCondition = {};

        // Dialog actions
        const actions = [];
        
        if (addMode === 'search') {
            searchModule = dialogSchema(this, 'moduleName');
            let fk = dialogSchema(this, 'fk');
            actions.push({label: 'Cancel', color: 'secondary', onClick: () => this.clearSearchSelected(searchModule), icon: 'close'});
            actions.push({label: 'OK', color: 'primary', onClick: this.addBySearch, icon: 'done'});
        
            initialSearchCondition = {
                id: {
                    value: items.map(item => item[fk]),
                    op: 'not_in'
                }
            }
        }
        else {
            actions.push({label: 'Cancel', color: 'secondary', onClick: this.dialogHide, icon: 'close'});
            actions.push({label: 'Save', color: 'primary', onClick: this.save, icon: 'done'});
        }

        // Language
        const {lang} = this.props;
        const langData = lang && lang.data ? lang.data : {};
        
        return (
            <div>
                <ExpansionPanel square>
                    <ExpansionPanelSummary 
                        // aria-controls={moduleName}
                        id={moduleName}
                        expandIcon={<Icon>expand_more</Icon>}
                    >
                        <Typography>{langData[`tab_${moduleName}`] || title}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={classes.content}>
                        {           
                            this.renderDetail(type, schema, items)
                        }    
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <Dialog 
                    title={langData[`tab_${moduleName}`] || title}
                    description={
                        addMode === 'form' //|| Object.keys(rowEdit).length > 0
                            ? <form ref={this.refForm}><Form schema={dialogSchema} changeFields={this.state.changeFields} /></form>
                            : <PageList schema={dialogSchema} moduleName={searchModule} initialCondition={initialSearchCondition} />
                    }
                    open={dialogVisible}
                    actions={actions}
                />
            </div>
        );
    }
}

Detail.propTypes = {
    schema: propTypes.shape({
        title: propTypes.string,
        type: propTypes.string,
        fk: propTypes.string,
        initialActions: propTypes.arrayOf(propTypes.func),
        data: propTypes.objectOf(propTypes.any),
    }),
    dispatch: propTypes.any,
    initialItems: propTypes.arrayOf(propTypes.object),
    batchItems: propTypes.arrayOf(propTypes.object),
    moduleName: propTypes.string.isRequired,
    classes: propTypes.any,
    lang: propTypes.object,
}

const mapStateToProps = (state, props) => ({
    lang: state.config.lang,
    batchItems: state[props.moduleName].batchItems,
    loading: state[props.moduleName].loading,
    error: state[props.moduleName].error,
    changeRows: state[props.moduleName].changeRows
});

export default connect(mapStateToProps)(withStyles(styles)(Detail));