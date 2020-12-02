import React, { Component } from 'react'
import NavSearch from '../../components/NavSearch'
import './index.scss'
import Filter from './components/Filter'

import { List } from 'react-virtualized';
import HouseItem from '../../components/HouseItem'


import styles from '../../components/FilterFooter/index.module.css'

import API from '../../utils/api'

export default class HouseList extends Component {
    state = {
        cityInfo: '',
        count: 0,
        list: []
    }

    filters = {}

    componentDidMount() {
        const cityInfo = JSON.parse(localStorage.getItem('hkzf_55_city'))
        this.setState({
            cityInfo: cityInfo.label
        })
        this.fetchHouseListData();
    }

    async fetchHouseListData() {
        // 获取城市id
        const cityInfo = JSON.parse(localStorage.getItem('hkzf_55_city'))
        const res = await API.get(`/houses`, {
            params: {
                cityId: cityInfo.value,
                ...this.filters,
                start: 1,
                end: 20
            }
        });


        this.setState({
            count: res.data.body.count,
            list: res.data.body.list
        });
        console.log(res);
    }

    onFilter = (data) => {
        // console.log(data, 'data');

        this.filters = data;

        this.fetchHouseListData();
    }

    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {

        const { list } = this.state;
        const item = list[index];

        return <HouseItem
            key={item.houseCode}
            src={`http://localhost:8080${item.houseImg}`}
            title={item.title}
            desc={item.desc}
            tags={item.tags}
            price={item.price}
            onClick={() => console.log('点击房源！')}
        />;
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
                        <Filter onFilter={this.onFilter} />

                        <div className={styles.houseItems}>
                            <List
                                width={500}
                                height={300}
                                rowCount={this.state.count}
                                rowHeight={120}
                                rowRenderer={this.rowRenderer}
                            // onRowsRendered={this.onRowsRendered}
                            // ref={this.listRef}
                            // scrollToAlignment={'start'}
                            />
                        </div>


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
