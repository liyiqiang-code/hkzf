import React from 'react'
import { withRouter } from 'react-router-dom'
import { NavBar, Icon } from 'antd-mobile';
import '../NavHeader/index.scss'

function NavHeader(props) {
    return (
        <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => props.history.go(-1)}
        >{props.children}
        </NavBar>
    )
}
export default withRouter(NavHeader)
