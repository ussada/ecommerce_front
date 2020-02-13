import React from "react";
import propTypes from 'prop-types';
import {connect} from "react-redux";
import {getData, deleteData, setSelectedItems} from "../../actions/base";
import Table from '../Table';
import Form from '../Form';
import {getSearchCondition} from '../../common/util';
import Dialog from '../../components/Dialog';
import {handleRowToggle, handleChange, setChangeFields, setChangeFieldsByParam, getListItems, getCurrentValue} from '../../common/actions';
import {CSVLink, CSVDownload} from 'react-csv';

class PageList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      count: 0,
      dialogVisible: false,
      changeFields: {},
      csv: [],
      deleteSuccess: false
    };

    this.schema = this.props.schema.bind(null, this);
    this.handleRowToggle = handleRowToggle.bind(null, this);
    this.handleChange = handleChange.bind(null, this);
    this.setChangeFields = setChangeFields.bind(null, this);
    this.setChangeFieldsByParam = setChangeFieldsByParam.bind(null, this);
    this.getListItems = getListItems.bind(null, this);
    this.getCurrentValue = getCurrentValue.bind(null, this);

    this.state = {
      ...this.state,
      changeFields: {
        ...this.schema('initialState') || {}
      },
    }
  }
  
  search = (e, initialConditions = undefined) => {
    const condition = this.schema('condition');
    const attr = this.schema('attributes') || {};
    const params = initialConditions ? initialConditions : this.state.changeFields ? this.state.changeFields : {};
    const {include, ...con} = getSearchCondition(condition, params);
    const param = {
      attr,
      con,
      include: include || {}
    };
    
    this.props.dispatch(getData(this.props.moduleName, param));
  }

  reset = () => {
    const initialState = this.schema('initialState');
    let changeFields = initialState ? {...initialState} : {};
    this.setState({changeFields})
  }

  delete = () => {
    this.state.selectedRows.length > 0 ? this.dialogShow() : alert('Please select record to delete');
  }

  deleteData = () => {
    this.dialogHide();    
    let param = this.state.selectedRows.slice();
    const {moduleName} = this.props;
    
    if(param){
      this.props.dispatch(deleteData(moduleName, param))
      alert('Delete data complete!!');
      this.setState({selectedRows: [], deleteSuccess: true});
    }    
  }

  add = () => {
    this.props.dispatch(setSelectedItems(this.props.moduleName, []));
    const {history} = this.props;
    return history.push({
      pathname: `./data`,
      param: {
        mode: 'add'
      }
    });
  }

  addDetail = (row, opt) => {
    let initialData = [{
      [opt.masterField]: row.id
    }];
    
    this.props.dispatch(setSelectedItems(opt.moduleName, initialData));
    let path = `/${opt.moduleName}/data`;    
    
    return this.props.history.push({
      pathname: path,
      param: {
        mode: 'add'
      }
    });
  }

  rowClick = (row) => {       
    let id = row.id;
    let param = {
      con: {id}
    }

    // let detailSchema = this.schema('detail') || {};
  
    // let detailList = Object.keys(detailSchema)
    // // console.log(detailList)
    // detailList.map(name => {
    //   param.include = {
    //     ...param.include,
    //     [name]: []
    //   }
    // })
    // console.log(param)
    // this.props.dispatch(getData(this.props.moduleName, param, 'edit'));
    
    return this.props.history.push({
      pathname: `./data/`,
      param: {
        mode: 'edit',
        id
      }
    });
  }

  dialogShow = () => {
    this.setState({dialogVisible: true});    
  }

  dialogHide = () => {
    this.setState({dialogVisible: false});    
  }

  export = () => {
    let headers = [];
    let data = [];
    const {csvParams} = this.state;

    if (csvParams) {
      headers = csvParams.headers;
      data = csvParams.data || this.props.rows;
    }
    else
      data = this.extractTableData();

    const csv = {
      headers: headers.length > 0 ? headers : undefined,
      data
    }
    this.setState({csv}, () => {
      // click the CSVLink component to trigger the CSV download
      this.csvLink.link.click()
    })
  }

  refCSV = ref => {
    return this.csvLink = ref;
  }

  extractTableData = () => {
    let data = [];
    let table = document.querySelector('table');
    let rows = table.querySelectorAll("thead tr, tbody tr");
    
    for (let i = 0; i < rows.length; i++) {
      let row = [], cols = rows[i].querySelectorAll("td, th");

        for (let j = 0; j < cols.length; j++) {
          if (cols[j].childNodes[0].nodeName === '#text')
            row.push(cols[j].innerText.replace('\n', ''));
        }
    
      data.push(row);
    }

    return data;
  }

  copy = row => {
    let id = row.id;
    let param = {
      con: {id}
    }      
    
    this.props.dispatch(getData(this.props.moduleName, param));
    const {history} = this.props;
    return history.push({
      pathname: `./data`,
      param: {
        mode: 'add'
      }
    });
  }

  componentWillReceiveProps() {
    if (this.state.deleteSuccess) {
      this.setState({deleteSuccess: false});
      this.props.dispatch(getData(this.props.moduleName));
    }
  }

  componentDidMount() {
    // Actions on loading
    const initialActions = this.schema('initialActions');

    if (initialActions && initialActions.length > 0) {
      initialActions.map(action => typeof action === 'function' ? action() : null);
    }

    // // Display data from route or props parameters
    let routeParams = this.props.location && this.props.location.params ? this.props.location.params : undefined;

    if (routeParams || this.props.initialCondition) {
      let {changeFields} = this.state;
      changeFields = {
        ...changeFields,
        ...routeParams,
        ...this.props.initialCondition
      }
      
      this.setState({changeFields}, () => this.search());
    }
    else
      this.search();
  }
  
  render() {
    const {error, loading, rows, page} = this.props;
    const {changeFields} = this.state;
    let pageHeader = this.schema('page').title;
    let conditionSchema = this.schema('condition');
    let conditionButtonSchema = this.schema('conditionButton');
    let buttonSchema = this.schema('button');
    const tableSchema = this.schema('table');
    
    if (error) {
      return <div>Error! {error}</div>;
    }
    
    const data = {
      ...tableSchema,
      rows,
    };

    const confirmDialog = {
      title: 'Confirmation',
      description: 'Confirm to delete?',
      open: this.state.dialogVisible,
      actions: [
        {label: 'Cancel', color: 'secondary', onClick: this.dialogHide, icon: 'close'},
        {label: 'Confirm', color: 'primary', onClick: this.deleteData, icon: 'done'}
      ]
    }

    // Language
    const {lang} = this.props;
    const langData = lang && lang.data ? lang.data : {};

    // CSV Export
    const csvHeader = this.state.csv.headers || undefined;
    const csvData = this.state.csv.data || [];

    const csvSchema = {
      data: csvData,
      headers: csvHeader,
      enclosingCharacter: `'`,
      filename: `${page}.csv`,
      className: 'hidden',
      ref: this.refCSV,
      target: '_blank'
    }

    // Form default props
    const formDefaultProps = {
      handleChange: this.handleChange,
      setChangeFields: this.setChangeFields,
      ...this.schema('defaultProps')
    }

    return (
      <div>
        <h2>{langData[`page_${page}_list`] || pageHeader}</h2>
        <form onSubmit={e => e.preventDefault()}>
        {
          conditionSchema ? <Form schema={conditionSchema} changeFields={changeFields} defaultProps={formDefaultProps} /> : undefined
        }
        <br/>
        {
          conditionButtonSchema ? <Form schema={conditionButtonSchema} /> : undefined
        }
        </form>
        
        {
          !loading ? <Table data={data} /> : <div>Loading...</div>
        }
        <br/>
        {
          buttonSchema ? <Form schema={buttonSchema} /> : undefined
        }
        
        <Dialog {...confirmDialog} />

        <div>
          <CSVLink {...csvSchema} />
        </div>
      </div>
    );
  }
}

PageList.propTypes = {
  schema: propTypes.shape({
    page: propTypes.string,
    initialState: propTypes.object,
    initialActions: propTypes.arrayOf(propTypes.func),
    condition: propTypes.objectOf(propTypes.object),
    conditionButton: propTypes.objectOf(propTypes.object),
    button: propTypes.objectOf(propTypes.object),
    table: propTypes.shape({
      headers: propTypes.objectOf(
        propTypes.oneOfType([
          propTypes.string,
          propTypes.object
        ])
      ),
      options: propTypes.object
    })
  }),
  dispatch: propTypes.any,
  moduleName: propTypes.string.isRequired,
  history: propTypes.any,
  rows: propTypes.arrayOf(propTypes.object),
  location: propTypes.any,
  initialCondition: propTypes.object,
  error: propTypes.string,
  loading: propTypes.bool,
  page: propTypes.string,
  lang: propTypes.object,
}

const mapStateToProps = (state, props) => ({
  lang: state.config.lang,
  rows: state[props.moduleName].selectedItems,
  loading: state[props.moduleName].loading,
  error: state[props.moduleName].error,
  user: state.config.user
});

export default connect(mapStateToProps)(PageList);
