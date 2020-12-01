import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]


export default function FilterTitle({ onClick, titleSelectedStatus }) {
  return (
    <Flex align="center" className={styles.root}>
      {titleList.map((v) => {
        let isSelected = titleSelectedStatus[v.type]
        return (
          <Flex.Item key={v.type} onClick={() => {
            onClick(v.type)
          }}>
            {/* 选中类名： selected */}
            <span className={[styles.dropdown, isSelected ? styles.selected : ''].join(' ')}>
              <span >{v.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        )
      })}
    </Flex>
  )
}
