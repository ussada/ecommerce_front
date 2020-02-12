import React, {Component} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
    TablePagination,
    Checkbox,
    IconButton
} from '@material-ui/core';
import {makeStyles, useTheme, withStyles} from '@material-ui/core/styles';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {dateToString, isDate} from '../../common/util';
import NumberFormat from 'react-number-format';
import TableAction from './tableActions';
import MenuButton from './menuButton';
import moment from 'moment';
import {ROWS_PER_PAGE} from '../../constants';

const useStyles1 = makeStyles(theme => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    }
}));

const styles = theme => ({
    cellCheckbox: {
        width: '5%'
    }
});

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowSelected: [],
            page: 0,
            rowsPerPage: ROWS_PER_PAGE
        }
    }

    getObject(item) {
        let output = item;
        if (typeof item !== 'object' || item === null || Array.isArray(item) || moment.isMoment(item) || isDate(item)) {
            output = {
                value: item
            };
        }

        return output;
    }

    getFieldOptions(opts) {
        return typeof opts === 'string' ? {} : opts || {};
    }

    getFieldElement(obj, opts, name, rowId) {
        let value = obj && (obj.value || obj.value == 0) ? obj.value : '';
        const {store} = this.props;
        let rows = [];
        let result = '';

        // Get value
        if (opts.hasOwnProperty('sourceModule') && opts.hasOwnProperty('fkField'))
            rows = store[opts.sourceModule].items.filter(row => row[opts.fkField] == rowId);
        else
            rows.push({[name]: value});

        // Get display value
        if (opts.hasOwnProperty('refModule')) {
            const {moduleName, labelField} = opts.refModule;
            let refModuleItems = store[moduleName].selectedItems.slice();

            if (refModuleItems.length > 0) {
                rows.map(item => {
                    let refItem = refModuleItems.find(row => row.id == item[name]);
                    result += refItem ? `\n ${refItem[labelField]}` : '';
                });
            }
        }
        else if (opts.hasOwnProperty('displayItems')) {

            rows.map(item => {
                let displayItem = opts.displayItems.find(displayItem => displayItem.id == item[name]);
                let label = displayItem ? displayItem.name : '';
                return result += `\n ${label}`
            });
        }
        else if (opts.hasOwnProperty('component')) {
            if (opts.component === 'date')
                rows.map(item => result += `\n ${dateToString(item[name])}`);
            else if (opts.component === 'number')
                return <>{rows.map(item => <><NumberFormat {...opts} displayType="text" value={item[name]} /><br /></>)}</>;
        }
        else
            rows.map(item => result += (item[name] || item[name] == 0)  ? `\n ${item[name]}` : '');

        return result;
    }

    TablePaginationActions = (props) => {
        const classes = useStyles1();
        const theme = useTheme();
        const { count, page, rowsPerPage, onChangePage } = props;

        const handleFirstPageButtonClick = event => {
          onChangePage(event, 0);
        };

        const handleBackButtonClick = event => {
          onChangePage(event, page - 1);
        };

        const handleNextButtonClick = event => {
          onChangePage(event, page + 1);
        };

        const handleLastPageButtonClick = event => {
          onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
        };

        return (
          <div className={classes.root}>
            <IconButton
              onClick={handleFirstPageButtonClick}
              disabled={page === 0}
              aria-label="first page"
            >
              {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
              onClick={handleNextButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="next page"
            >
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
              onClick={handleLastPageButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="last page"
            >
              {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
          </div>
        );
    }

    handleChangePage = (event, newPage) => {
        this.setState({page: newPage});
    };

    handleChangeRowsPerPage = event => {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        })
    };

    pagination = (rows, rowsPerPage) => {
        const {page} = this.state;

        return (
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: { 'aria-label': 'rows per page' },
                            native: true
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        ActionsComponent={this.TablePaginationActions}
                    />
                </TableRow>
            </TableFooter>
        )
    }

    render() {
        const {title, headers, rows, options, actions} = this.props.data;
        const headersList = Object.keys(headers);
        const {setDisable, baseId, checkbox, selectedRows, menuButton, menuButtonList, pagination, rowPerPage} = options || {};
        const rowCursor = options ? options['cursor'] : '';
        const handleRowToggle = options ? options['onRowToggle'] : undefined;
        var rowClick = options ? options['canClick'] : false;
        const rowOnClick = options? options['onClick'] : undefined; // Row onClick
        if (typeof rowClick === 'undefined') rowClick = false; // Prevent error onclick when not found method
        const rowNumber = options && typeof options['rowNumber'] !== 'undefined' ? options['rowNumber'] : true; // Show row number column (default true)
      
        const langData = this.props.lang.data || {};
        const {page} = this.state;
        const rowsPerPage = rowPerPage && rowPerPage > 0 ? rowPerPage : this.state.rowsPerPage;

        const {classes} = this.props;

        return (
            <div>
                <h3>{title}</h3>
                {
                    actions
                    ?
                        <TableAction props={actions} />
                    :   undefined

                }
                <Table padding={options ? options.padding : ''}>
                    <TableHead>
                        <TableRow>
                            {
                                checkbox
                                    ?   <TableCell className={classes.cellCheckbox}>
                                            <Checkbox
                                                indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                                                id={0}
                                                checked={selectedRows.length > 0 && selectedRows.length === rows.length}
                                                onChange={e => handleRowToggle(e, rows)}
                                            />
                                        </TableCell>
                                    :   undefined
                            }
                            { rowNumber ? <TableCell>{langData['row_number'] || 'No.'}</TableCell> : undefined }
                            {
                                headersList.map((name, idx) => {
                                    const obj = this.getObject(headers[ name ]);
                                    //const opts = {};
                                    return <TableCell key={idx}>
                                        {langData[name] || obj.value}
                                    </TableCell>;
                                })
                            }

                            {/* Add blank header column for menu column (if menu exist) */}
                            {
                                typeof menuButton !== 'undefined' && menuButton && typeof menuButtonList !== 'undefined' && menuButtonList.length > 0
                                ? <TableCell />
                                : undefined
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows)
                                .map((row, idx) => (
                                <TableRow key={idx} style={{cursor: rowCursor}}
                                    onClick={checkbox || !rowClick ? null : () => rowOnClick(row)}
                                    hover
                                >
                                    {
                                        // tableOpts['indeterminate']
                                        checkbox
                                            ?   <TableCell>
                                                    <Checkbox
                                                    id={row.id || row.guid} // use guid for batchItems
                                                    checked={selectedRows.length > 0 && selectedRows.includes(row.id || row.guid)}
                                                    onChange={handleRowToggle}
                                                    disabled={ setDisable ? setDisable(row) : false}
                                                    />
                                                </TableCell>
                                            :   undefined
                                    }

                                    {
                                        // Running number column (No.)
                                        rowNumber
                                            ?   <TableCell key='idx'
                                                            onClick={rowClick && checkbox  ? () => rowOnClick(row) : null}
                                                >
                                                {
                                                    idx+1
                                                }
                                                </TableCell>
                                            :   undefined
                                    }

                                    {/* Data columns */}
                                    {
                                        headersList.map(name => {
                                            let obj = this.getObject(row[name]);
                                            let opts = this.getFieldOptions(headers[name]);
                                            let colCursor = opts['cursor'];
                                            let colClick = opts['canClick'];
                                            let colOnClick = opts['onClick'];
                                            if (typeof colOnClick === 'undefined') colClick = false; // prevent error onclick when not found method
                                            let fieldValue = this.getFieldElement(obj, opts, name, row.id);
                                            let style = {
                                                cursor: colCursor,
                                                'display-linebreak': true
                                            };

                                            return <TableCell
                                                key={name}
                                                onClick={colClick ? () => colOnClick(fieldValue) : rowClick && checkbox ? () => rowOnClick(row) : null}
                                                style={style}
                                                color="yellow"
                                            >
                                                {
                                                    fieldValue
                                                }
                                            </TableCell>;
                                        })
                                    }

                                    {/* Menu column */}
                                    {
                                        typeof menuButton !== 'undefined' && menuButton && typeof menuButtonList !== 'undefined' && menuButtonList.length > 0
                                        ? <TableCell> <MenuButton row={row} menuList={menuButtonList} /> </TableCell>
                                        //? <MenuButton rowId={row.id} menuList={menuButtonList} />
                                        : undefined
                                    }

                                </TableRow>
                            ))
                        }
                    </TableBody>
                    {
                        pagination
                            ?   this.pagination(rows, rowsPerPage)
                            :   undefined
                    }

            </Table>
            </div>
        );
    }
}

Table.propTypes = {
    title: propTypes.string,
    headers: propTypes.objectOf(
        propTypes.oneOfType(
            [
                propTypes.node,
                propTypes.element,
                propTypes.string,
                propTypes.number,
                propTypes.symbol,
                propTypes.shape({
                    value: propTypes.any.isRequired
                })
            ]
        )
    ),
    rows: propTypes.arrayOf(
        propTypes.objectOf(
            propTypes.oneOfType(
                [
                    propTypes.node,
                    propTypes.element,
                    propTypes.string,
                    propTypes.number,
                    propTypes.symbol,
                    propTypes.shape({
                        value: propTypes.any.isRequired
                    })
                ]
            )
        )
    ),
    store: propTypes.object,
    data: propTypes.shape({
        title: propTypes.string,
        headers: propTypes.objectOf(
            propTypes.oneOfType([
                propTypes.string,
                propTypes.object
            ])
        ),
        rows: propTypes.arrayOf(propTypes.object),
        options: propTypes.object,
        lang: propTypes.object,
        classes: propTypes.any
    })
};

const mapStateToProps = state => ({
    store: state,
    lang: state.config.lang
});

export default connect(mapStateToProps)(withStyles(styles)(DataTable));
