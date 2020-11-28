import React, { Component } from 'react'
import './index.scss'
import NavHeader from '../../components/NavHeader'
import axios from 'axios'

export default class Map extends Component {
    componentDidMount() {
        const city = JSON.parse(localStorage.getItem('hkzf_55_city'))
        var map = new window.BMap.Map("container");
        map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11);


        // 创建地址解析器实例     
        var myGeo = new window.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野   
        myGeo.getPoint(city.label, async function (point) {
            if (point) {
                map.centerAndZoom(point, 11);
                map.addOverlay(new window.BMap.Marker(point));
                //添加控件
                map.addControl(new window.BMap.NavigationControl());
                map.addControl(new window.BMap.ScaleControl());

                //获取房源数据
                const city = JSON.parse(localStorage.getItem('hkzf_55_city'))
                const res = await axios.get(`http://localhost:8080/area/map?id=${city.value}`)
                console.log(res);
                res.data.body.forEach((v, i) => {
                    var opts = {
                        position: new window.BMap.Point(v.coord.longitude, v.coord.latitude), // 指定文本标注所在的地理位置在的地理位置
                        offset: new window.BMap.Size(30, 30) // 设置文本偏移量
                    };
                    // 创建文本标注对象
                    var label = new window.BMap.Label('', opts);
                    // 自定义文本标注样式
                    label.setStyle({
                        color: 'white',
                        borderRadius: '50%',
                        width: '70px',
                        height: '70px',
                        borderColor: '#ccc',
                        fontSize: '12px',
                        lineHeight: '5px',
                        paddingTop: '10px',
                        backgroundColor: 'green',
                        fontFamily: '微软雅黑',
                        display: 'inline-block',
                        textAlign: 'center',
                    });
                    label.setContent(`<p>${v.label}</p><p>${v.count}套</p>`)
                    map.addOverlay(label);
                })
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
