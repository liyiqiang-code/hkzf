import React, { Component } from 'react'
import './index.scss'
import NavHeader from '../../components/NavHeader'

export default class Map extends Component {

    componentDidMount() {
        const city = JSON.parse(localStorage.getItem('hkzf_55_city'))
        var map = new window.BMap.Map("container");
        map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11);
        // 创建地址解析器实例     
        var myGeo = new window.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野    
        myGeo.getPoint(city.label, function (point) {
            if (point) {
                map.centerAndZoom(point, 11);
                map.addOverlay(new window.BMap.Marker(point));
            }
        }, city.label);

        // var map = new window.BMap.Map("container");
        // var point = new window.BMap.Point(116.404, 39.915);
        // map.centerAndZoom(point, 15);
    }
    render() {
        return (
            <div className="map-wrapper">
                <NavHeader >地图找房</NavHeader>
                <div id="container"></div>
            </div>
        )
    }
}
