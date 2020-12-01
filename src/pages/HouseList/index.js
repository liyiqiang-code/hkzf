import React, { Component } from 'react'
import NavSearch from '../../components/NavSearch'
import './index.scss'
import Filter from './components/Filter'


import styles from '../../components/FilterFooter/index.module.css'

export default class HouseList extends Component {
    state = {
        cityInfo: ''
    }

    componentDidMount() {
        const cityInfo = JSON.parse(localStorage.getItem('hkzf_55_city'))
        this.setState({
            cityInfo: cityInfo.label
        })
    }
    render() {
        return (
            <div>
                <div className="houseNav">
                    <i className="iconfont icon-back" onClick={() => this.props.history.push('/home')}></i>
                    <NavSearch cityName={this.state.cityInfo} />
                </div>

                <div className={styles.root}>
                    {/* 前三个菜单的遮罩层 */}
                    {/* <div className={styles.mask} /> */}

                    <div className={styles.content}>
                        {/* 标题栏 */}
                        <Filter />

                        {/* 前三个菜单对应的内容： */}
                        {/* <FilterPicker /> */}

                        {/* 最后一个菜单对应的内容： */}
                        {/* <FilterMore /> */}
                    </div>
                </div>
            </div>
        )
    }
}
