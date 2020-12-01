import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

import API from '../../../../utils/api.js'

const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
}

export default class Filter extends Component {

  state = {
    titleSelectedStatus,
    // 打开类型
    openType: '',
    // 获取过滤数据源
    filterData: {}
  }

  componentDidMount() {
    this.getFilterData();
  }
  // 获取过滤数据源
  async getFilterData() {

    const { value } = JSON.parse(localStorage.getItem('hkzf_55_city'))

    const res = await API.get(`http://localhost:8080/houses/condition?id=${value}`);

    this.setState({
      filterData: res.data.body
    });
  }

  onTitleClick = (type) => {
    //  type area   mode   price   more 
    console.log(type);
    this.setState({
      titleSelectedStatus: {
        ...this.state.titleSelectedStatus,
        [type]: true,
      },
      openType: type
    });
  }

  onCancel = () => {
    this.setState({
      openType: ''
    })
  }

  onSave = () => {
    this.setState({
      openType: ''
    })
  }

  render() {

    const { openType } = this.state;

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {  openType === 'area' || openType === 'mode'
          || openType === 'price' ? <div className={styles.mask} onClick={this.onCancel} /> : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle onClick={this.onTitleClick} titleSelectedStatus={this.state.titleSelectedStatus} />


          {/* 前三个菜单对应的内容： */}
          {openType === 'area' || openType === 'mode'
            || openType === 'price' ? <FilterPicker
              onCancel={this.onCancel}
              onSave={this.onSave} /> : null}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
