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
                //添加控件
                map.addControl(new window.BMap.NavigationControl());
                map.addControl(new window.BMap.ScaleControl());

                var opts = {
                    position: point, // 指定文本标注所在的地理位置
                    offset: new window.BMap.Size(30, -30) // 设置文本偏移量
                };
                // 创建文本标注对象
                var label = new window.BMap.Label('你好', opts);
                // 自定义文本标注样式
                label.setStyle({
                    color: 'red',
                    borderRadius: '5px',
                    borderColor: '#ccc',
                    fontSize: '16px',
                    height: '30px',
                    lineHeight: '30px',
                    fontFamily: '微软雅黑',
                    display: 'inline-block',
                    verticalAlign: 'middle'

                });
                map.addOverlay(label);
            }
        }, city.label);

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
