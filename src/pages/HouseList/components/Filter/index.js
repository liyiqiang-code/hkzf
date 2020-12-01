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

// 记忆选中值
const selectedValues = {
  area: ['area', null],
  mode: [null],
  price: [null],
  more: null
}

export default class Filter extends Component {

  state = {
    titleSelectedStatus,
    // 打开类型
    openType: '',
    // 获取过滤数据源
    filterData: {},
    // 记忆选中值
    selectedValues
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

  onSave = (type, value) => {
    const { selectedValues } = this.state;
    this.setState({
      openType: '',
      selectedValues: {
        ...selectedValues,
        [type]: value
      }
    })
  }

  renderFilterPicker() {

    const { openType, filterData: {
      area, subway, rentType, price
    }, selectedValues } = this.state;

    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null;
    }

    let data = [];
    let cols = 3;
    let defaultValue = selectedValues[openType]

    switch (openType) {
      case 'area':
        data = [area, subway];
        break;
      case 'mode':
        data = rentType;
        cols = 1;
        break;
      case 'price':
        data = price;
        cols = 1;
        break;
      default:
        break;
    }
    return <FilterPicker defaultValue={defaultValue} data={data} cols={cols}
      onCancel={this.onCancel} onSave={this.onSave} type={openType} />
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
          {this.renderFilterPicker()}
          {/* {openType === 'area' || openType === 'mode'
            || openType === 'price' ? <FilterPicker
              onCancel={this.onCancel}
              onSave={this.onSave} /> : null} */}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
