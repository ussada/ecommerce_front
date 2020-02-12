import React, { Component } from 'react';
import './App.css';
import {Route, Switch} from 'react-router-dom';
import Login from './Pages/Login';
import QueryString from 'query-string';

import Home from './Pages/Home';

class App extends Component {

  render() {
    return (      
      <div className="App">
        <Switch>
          <Route
            path="/login"
            render={props => {
              const query = QueryString.parse(props.location.search);
              return <Login {...props} query={query} />
            }}
          />

          <Route path="/" component={Home} />
        </Switch>
      </div>
    )
  }
}

export default App;
