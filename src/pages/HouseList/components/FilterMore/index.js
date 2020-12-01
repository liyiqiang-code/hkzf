import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue
  }

  onCancel = () => {
    // 清空选中值
    this.setState({
      selectedValues: []
    });
  }

  onSave = () => {
    this.props.onSave('more', this.state.selectedValues);
  }


  handleSelect(id) {

    const { selectedValues } = this.state;

    if (selectedValues.indexOf(id) > -1) {
      //取消选中
      let index = selectedValues.findIndex((i) => i === id);

      selectedValues.splice(index, 1);

    } else {
      // 选中
      selectedValues.push(id);
      // this.setState({
      //   selectedValues: [
      //     ...selectedValues,
      //     id
      //   ]
      // })
    }

    this.setState({
      selectedValues
    });

  }
  // 渲染标签
  renderFilters(list) {
    // 高亮类名： styles.tagActive
    return list.map((item, i) => {
      const { selectedValues } = this.state;
      let isSelected = selectedValues.includes(item.value);

      return (
        <span key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
          onClick={this.handleSelect.bind(this, item.value)}
        >{item.label}</span>
      )
    })
  }

  render() {
    const { roomType, oriented, floor, characteristic } = this.props;
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={this.props.onCancel} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter cancelText="清除" onCancel={this.onCancel}
          onOk={this.onSave}
          className={styles.footer} />
      </div>
    )
  }
}
