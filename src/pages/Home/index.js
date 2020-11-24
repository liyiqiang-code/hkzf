import React, { Component } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile';
import './index.css'

//导入子页面组件
import Index from '../Index'
import News from '../News'
import My from '../My'
import HouseList from '../HouseList'

const arr = [
    { path: '/home', title: '首页', icon: 'icon-ind' },
    { path: '/home/news', title: '咨询', icon: 'icon-infom' },
    { path: '/home/my', title: '我的', icon: 'icon-my' },
    { path: '/home/houselist', title: '找房', icon: 'icon-findHouse' },
]

export default class Home extends Component {
    render() {
        return (
            <div className="home">
                <Route path="/home" exact component={Index} />
                <Route path="/home/news" component={News} />
                <Route path="/home/my" component={My} />
                <Route path="/home/houselist" component={HouseList} />

                <TabBar
                    unselectedTintColor="#949494"
                    tintColor="#21b97a"
                    barTintColor="white"
                    className="tabBar"
                >

                    {arr.map((v, i, a) => (
                        <TabBar.Item
                            title={v.title}
                            key={v.path}
                            icon={<i className={`iconfont  ${v.icon}`}></i>}
                            selectedIcon={<i className={`iconfont  ${v.icon}`}></i>}
                            selected={this.props.location.pathname === v.path}
                            // badge={1}
                            onPress={() => {
                                this.props.history.push(v.path)
                            }}
                        />
                    ))}
                </TabBar>
            </div>

        )
    }
}
