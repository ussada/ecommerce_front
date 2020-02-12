import React from 'react';
import propTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
    let idx = suggestion.name.toLowerCase().indexOf(query.toLowerCase());
    let name = suggestion.name;
    const parts = [
        {text: name.substring(0, idx), highlight: false},
        {text: name.substr(idx, query.length), highlight: true},
        {text: name.substring(idx + query.length), highlight: false}
    ]

    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
            {parts.map(part => (
                <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
                {part.text}
                </span>
            ))}
            </div>
        </MenuItem>
    );
}

function getSuggestions(value, suggestionList = []) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestionList.filter(suggestion => {
            const keep = count < 5 && suggestion.name.toLowerCase().includes(inputValue);

            if (keep) {
                count += 1;
            }

            return keep;
    });
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

const useStyles = makeStyles(theme => ({
  root: {
    height: 250,
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing(2),
  },
}));

const IntegrationAutosuggest = ({suggestionList, className, value, onSelected, valueField, setChangeFields, freeSolo = false, ...props}) => {
    
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [stateSuggestions, setSuggestions] = React.useState([]);

    const handleSuggestionsFetchRequested = ({value}) => {
        setSuggestions(getSuggestions(value, suggestionList));
    };

    const handleSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const handleChange = (event, {newValue}) => {
      handleSetChangeFields('', newValue);
    };

    const handleSetChangeFields = (id, name) => {
      if (setChangeFields) {
        const param = {
          [props.id]: name
        }       
        
        if (valueField)
          param[valueField] = id;

        setChangeFields(param);
      }
    }

    const handleSelect = (event, {suggestion: {id, name}}) => {
      handleSetChangeFields(id, name);
    }

    const handleBlur = (event, {highlightedSuggestion}) => {      
      if (highlightedSuggestion !== null) {
        const {id, name} = highlightedSuggestion;
        handleSetChangeFields(id, name);
      }
      
      let selectedItem = suggestionList.find(item => item.name == value);
      
      if(!selectedItem){
        if (!freeSolo)
          handleSetChangeFields('', '')
      }
    }

    const autosuggestProps = {
        renderInputComponent,
        suggestions: stateSuggestions,
        onSuggestionsFetchRequested: ({value}) => handleSuggestionsFetchRequested({value}),
        onSuggestionsClearRequested: handleSuggestionsClearRequested,
        getSuggestionValue,
        renderSuggestion,
        onSuggestionSelected: handleSelect
    };

    return (
        <div className={className}>
            <Autosuggest
                {...autosuggestProps}
                inputProps={{
                    classes,
                    value: value || '',
                    ...props,
                    onChange: handleChange,
                    onBlur: handleBlur,
                }}
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderSuggestionsContainer={options => (
                    <Paper {...options.containerProps} square>
                        {options.children}
                    </Paper>
                )}
            />
        </div>
    );
}

IntegrationAutosuggest.propTypes = {
  suggestionList: propTypes.arrayOf(
    propTypes.oneOf([
      propTypes.shape({
        id: propTypes.oneOfType([
          propTypes.string,
          propTypes.number
        ])
      }),
      propTypes.shape({
        title: propTypes.string,
        pin: propTypes.bool,
        items: propTypes.shape({
          id: propTypes.oneOfType([
            propTypes.string,
            propTypes.number
          ])
        })
      })
    ])
  ),
  className: propTypes.string,
  value: propTypes.oneOfType([
    propTypes.string,
    propTypes.number
  ]),
  onSelected: propTypes.func,
  valueField: propTypes.string,
  setChangeFields: propTypes.func,
  freeSolo: propTypes.bool,
  id: propTypes.string.isRequired,

}

export default IntegrationAutosuggest;