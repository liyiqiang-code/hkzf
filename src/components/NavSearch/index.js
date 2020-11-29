import React from 'react'
import './index.scss'
import { withRouter } from 'react-router-dom'

function NavSearch({ cityName, history }) {
    return (
        <div className="search-box">
            <div className="search"><span className="iconGZ" onClick={() => history.push('/citylist')}>{cityName}<span className="iconfont icon-arrow "></span></span>
                <i className="iconfont icon-seach"></i>
        请输入小区或地址
        </div>
            <span className="iconfont icon-map map" onClick={() => history.push('/map')}></span>
        </div>
    )
}

export default withRouter(NavSearch)
