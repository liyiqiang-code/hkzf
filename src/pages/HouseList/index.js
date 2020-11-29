import React, { Component } from 'react'
import NavSearch from '../../components/NavSearch'
import './index.scss'

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
                找房
            </div>
        )
    }
}
