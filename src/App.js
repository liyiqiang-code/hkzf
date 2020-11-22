import React, { Component } from 'react'
import { HashRouter, Route, Link, Redirect, Switch } from 'react-router-dom'
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
import Home from './pages/Home'
import CityList from './pages/CityList'
import NotFount from './pages/NotFount'
export default class App extends Component {
  render() {
    return (
      <div>
        <HashRouter>
          <Switch>
            <Route path="/" exact render={() => <Redirect to="/home" />} />
            <Route path="/home" component={Home} />
            <Route path="/citylist" component={CityList} />
            <Route path="*" exact component={NotFount} />
          </Switch>
        </HashRouter>
      </div>
    )
  }
}
