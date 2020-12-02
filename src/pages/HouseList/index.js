import React, { Component } from 'react'
import NavSearch from '../../components/NavSearch'
import './index.scss'
// import './index.module.scss'
import Filter from './components/Filter'
import { Flex, Toast } from 'antd-mobile';
import NoHouse from '../../components/Nohouse'


//导入list组件
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import HouseItem from '../../components/HouseItem'


// import styles from '../../components/FilterFooter/index.module.css'

import API from '../../utils/api'

export default class HouseList extends Component {
    state = {
        cityInfo: '',
        count: 0,
        list: [],
        scroll: '',
        position: '',
        left: 100,
        top: 0,
        isLoading: false
    }

    filters = {}

    componentDidMount() {
        const cityInfo = JSON.parse(localStorage.getItem('hkzf_55_city'))
        this.setState({
            cityInfo: cityInfo.label
        })
        this.fetchHouseListData();

        window.addEventListener('scroll', this.bindHandleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.bindHandleScroll);
    }

    bindHandleScroll = (event) => {
        // 滚动的高度
        const scrollTop = event.srcElement.documentElement.scrollTop
            || window.pageYOffset
            || event.srcElement.body.scrollTop;
        console.log(scrollTop);
        this.setState({
            scroll: scrollTop
        })
        if (this.state.scroll >= 46) {
            this.setState({
                position: 'fixed',
                left: 0,
                top: 0
            })
        } else {
            this.setState({
                position: '',
                left: '',
                top: ''
            })
        }
    }

    async fetchHouseListData() {
        // 获取城市id
        const cityInfo = JSON.parse(localStorage.getItem('hkzf_55_city'))
        // 开启loading
        Toast.loading('加载中', 0, null, true);
        this.setState({
            isLoading: true
        });
        const res = await API.get(`/houses`, {
            params: {
                cityId: cityInfo.value,
                ...this.filters,
                start: 1,
                end: 20
            }
        });

        Toast.hide();

        if (res.data.body.count !== 0) {
            Toast.info(`共找到${res.data.body.count}套房源`);
        }



        this.setState({
            count: res.data.body.count,
            list: res.data.body.list,
            isLoading: false
        });
        console.log(res);
    }

    onFilter = (data) => {
        // console.log(data, 'data');

        this.filters = data;

        this.fetchHouseListData();
    }

    renderHouseList() {

        const { isLoading, count } = this.state;

        if (!isLoading && !count) {
            return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
        }


        return <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={this.state.count}
        >
            {({ onRowsRendered, registerChild }) => (
                <WindowScroller>
                    {({ height, isScrolling, scrollTop }) => (
                        <AutoSizer>
                            {({ width }) => (
                                <List
                                    onRowsRendered={onRowsRendered}
                                    autoHeight
                                    ref={registerChild}
                                    width={width}
                                    height={height}
                                    rowCount={this.state.count}
                                    rowHeight={120}
                                    rowRenderer={this.rowRenderer}
                                    scrollTop={scrollTop}
                                    isScrolling={isScrolling}
                                />
                            )}
                        </AutoSizer>
                    )}
                </WindowScroller>
            )}
        </InfiniteLoader>
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

        if (!item) {
            return (
                <div key={key} className={StyleSheet.loading}>
                    <p>加载中...</p>
                </div>
            )
        }

        return <HouseItem
            key={key}
            src={`http://localhost:8080${item.houseImg}`}
            title={item.title}
            desc={item.desc}
            tags={item.tags}
            price={item.price}
            onClick={() => console.log('点击房源！')}
        />;
    }

    // InfiniteLoader 判断数据是否加载的函数
    isRowLoaded = ({ index }) => {
        return !!this.state.list[index];
    }

    // InfiniteLoader 加载更多数据的方法
    loadMoreRows = async ({ startIndex, stopIndex }) => {

        // 获取城市id
        const cityInfo = JSON.parse(localStorage.getItem('hkzf_55_city'))

        return new Promise((resolve) => {

            API.get(`/houses`, {
                params: {
                    cityId: cityInfo.value,
                    ...this.filters,
                    start: startIndex,
                    end: stopIndex
                }
            }).then((res) => {

                this.setState({
                    count: res.data.body.count,
                    list: [...this.state.list, ...res.data.body.list]
                });

                resolve();

            })

        })
    }




    render() {
        return (
            <div>
                <div className="houseNav">
                    <i className="iconfont icon-back" onClick={() => this.props.history.push('/home')}></i>
                    <NavSearch cityName={this.state.cityInfo} />
                </div>

                {/* <div className={styles.root}> */}
                {/* 前三个菜单的遮罩层 */}
                {/* <div className={styles.mask} /> */}

                {/* <div className={styles.content}> */}
                {/* 标题栏 */}
                <div style={{ position: this.state.position, left: this.state.left, top: this.state.top, width: 375, zIndex: 100 }}><Filter onFilter={this.onFilter} /></div>

                <div className="houseItems">
                    {this.renderHouseList()}
                </div>


                {/* 前三个菜单对应的内容： */}
                {/* <FilterPicker /> */}

                {/* 最后一个菜单对应的内容： */}
                {/* <FilterMore /> */}
            </div>
            //     </div>
            // </div>
        )
    }
}
