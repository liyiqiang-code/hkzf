import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile';
import axios from 'axios'
import './index.scss'

function formatCityList(list) {

    const cityList = {};

    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        let first = item.short.substr(0, 1);

        if (cityList[first]) {
            cityList[first].push(item);
        } else {
            cityList[first] = [item];
        }
    }

    const cityIndex = Object.keys(cityList).sort();

    return {
        cityIndex,
        cityList
    };

}

export default class CityList extends Component {
    componentDidMount() {
        this.fetchCityList()
    }

    async fetchCityList() {
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        const { cityList, cityIndex } = formatCityList(res.data.body)
        //热门城市获取
        const hotRes = await axios.get('http://localhost:8080/area/hot')
        cityList['hot'] = hotRes.data.body
        cityIndex.unshift('hot')
        console.log(cityIndex, cityList);
    }
    render() {
        return (
            <div className="city">
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar>
            </div>
        )
    }
}
