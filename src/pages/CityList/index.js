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

// * 
//   1 将获取到的 cityList 和 cityIndex  添加为组件的状态数据。
//   2 修改 List 组件的 rowCount 为 cityIndex 的长度。
//   3 将 rowRenderer 函数，添加到组件中，以便在函数中获取到状态数据 cityList 和 cityIndex。
//   4 修改 List 组件的 rowRenderer 为组件中的 rowRenderer 方法。
//   5 修改 rowRenderer 方法中渲染的每行结构和样式。
//   6 修改 List 组件的 rowHeight 为函数，动态计算每一行的高度（因为每一行高度都不相同）。

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50

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
        cityList: {},
        curIndex: 0
    }

    componentDidMount() {
        this.fetchCityList()
    }

    // 获取列表每一行的高度
    getRowHeight = ({ index }) => {
        const letter = this.state.cityIndex[index];
        const list = this.state.cityList[letter];

        return TITLE_HEIGHT + NAME_HEIGHT * list.length;

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

    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {
        const letter = this.state.cityIndex[index];
        const list = this.state.cityList[letter];

        let title = '';

        switch (letter) {
            case '#':
                title = '当前城市';
                break;
            case 'hot':
                title = '热门城市';
                break;
            default:
                title = letter.toUpperCase();
                break;
        }



        return (
            <div key={key} style={style} className="city">
                <div className="title">{title}</div>
                {list.map((item, i) => (<div key={i} className="name">{item.label}</div>))}

            </div>
        );
    }

    render() {
        return (
            <div className="city">
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar>

                {/* <WindowScroller> */}
                {/* {({ height, isScrolling, onChildScroll, scrollTop }) => ( */}
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            width={width}
                            height={height}
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.getRowHeight}
                            rowRenderer={this.rowRenderer}
                        />
                    )}
                </AutoSizer>
                {/* </WindowScroller> */}

                <ul className="city-index">

                    {this.state.cityIndex.map((item, i) => (
                        <li key={i} className="city-index-item">
                            <span className={i === this.state.curIndex ? 'index-active' : ''}>
                                {item === 'hot' ? '热' : item.toUpperCase()}
                            </span>
                        </li>

                    ))}

                </ul>
            </div>
        )
    }
}
