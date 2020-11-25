import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile';
import axios from 'axios'
import './index.scss'
import { getCurrentCity } from '../../utils'
//导入list组件
import { List, AutoSizer, WindowScroller } from 'react-virtualized'

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

//
function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
}) {
    return (
        <div key={key} style={style}>
            <h3>一行数据</h3>
        </div>
    );
}

export default class CityList extends Component {

    state = {
        cityIndex: [],
        cityList: {}
    }

    componentDidMount() {
        this.fetchCityList()
    }

    async fetchCityList() {
        //全部城市获取
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        const { cityList, cityIndex } = formatCityList(res.data.body)
        //热门城市获取
        const hotRes = await axios.get('http://localhost:8080/area/hot')
        cityList['hot'] = hotRes.data.body
        cityIndex.unshift('hot')
        const curCityInfo = await getCurrentCity()
        cityIndex.unshift('#')
        cityList['#'] = [curCityInfo]

        this.setState({
            cityIndex,
            cityList
        })
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

                <WindowScroller>
                    {({ height, isScrolling, onChildScroll, scrollTop }) => (
                        <AutoSizer>
                            {({ width }) => (
                                <List
                                    width={width}
                                    height={height}
                                    rowCount={this.state.cityIndex.length}
                                    rowHeight={50}
                                    rowRenderer={rowRenderer}
                                />
                            )}
                        </AutoSizer>
                    )}
                </WindowScroller>
            </div>
        )
    }
}
