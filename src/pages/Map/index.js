import React, { Component } from 'react'
import './index.scss'
import NavHeader from '../../components/NavHeader'
import axios from 'axios'

//覆盖物的样式对象
const labelSetStyle = {
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
}
export default class Map extends Component {
    componentDidMount() {
        const city = JSON.parse(localStorage.getItem('hkzf_55_city'))

        var map = new window.BMap.Map("container");
        this.map = map
        map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11);


        // 创建地址解析器实例     
        var myGeo = new window.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野   
        myGeo.getPoint(city.label, async (point) => {
            if (point) {
                map.centerAndZoom(point, 11);
                map.addOverlay(new window.BMap.Marker(point));
                //添加控件
                map.addControl(new window.BMap.NavigationControl());
                map.addControl(new window.BMap.ScaleControl());
                //获取房源数据
                const city = JSON.parse(localStorage.getItem('hkzf_55_city'))
                const res = await axios.get(`http://localhost:8080/area/map?id=${city.value}`)

                this.renderOverlays(res)
            }
        }, city.label);
    }
    //请求数据,并渲染覆盖物
    async renderOverlays(res) {
        res.data.body.forEach((v, i) => {
            var opts = {
                position: new window.BMap.Point(v.coord.longitude, v.coord.latitude), // 指定文本标注所在的地理位置在的地理位置
                offset: new window.BMap.Size(30, 30) // 设置文本偏移量
            };
            // 创建文本标注对象
            var label = new window.BMap.Label('', opts);
            // 自定义文本标注样式
            label.setStyle(labelSetStyle);
            label.setContent(`<p>${v.label}</p><p>${v.count}套</p>`)
            this.map.addOverlay(label);
            label.addEventListener('click', () => {
                // 1. 地图发生了移动
                this.map.panTo(new window.BMap.Point(v.coord.longitude, v.coord.latitude));
                // 2. 地图放大了
                this.map.setZoom(13);
                // 3. 原来的覆盖物 被清除了
                setTimeout(() => {
                    this.map.clearOverlays();
                }, 0);
            })
        })
    }

    //创建覆盖物
    createOverlays() { }

    //创建圆形覆盖物
    createCircle() { }

    //创建方形的覆盖物
    createRect() { }
    render() {
        return (
            <div className="map-wrapper">
                <NavHeader >地图找房</NavHeader>
                <div id="container"></div>
            </div>
        )
    }
}
