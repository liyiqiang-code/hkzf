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
                this.renderOverlays(city.value)
            }
        }, city.label);
    }

    //请求数据,并渲染覆盖物
    async renderOverlays(id) {
        const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)

        // 获取地图的缩放级别
        const zoom = this.map.getZoom();

        const { nextZoom, type } = this.getTypeAndNextZoom();

        res.data.body.forEach((v, i) => {
            // 下一级点击缩放级别  nextZoom
            //覆盖物的类型 type  :  circle  rect
            this.createOverlays(v, nextZoom, type);
        })
    }

    getTypeAndNextZoom() {
        // 获取地图的缩放级别
        const zoom = this.map.getZoom();

        let nextZoom, type;

        // 区 zoom  -> 11     nextZoom 13  type circle  zoom 11   10<zoom < 12
        // 镇 zoom  -> 13     nextZoom 15  type rect zoom 11   12 <zoom < 14
        // 小区 zoom -> 15    14 <zoom < 16

        if (10 < zoom < 12) {
            nextZoom = 13;
            type = 'circle';
        } else if (12 < zoom < 14) {
            nextZoom = 15;
            type = 'rect';
        }

        return {
            nextZoom,
            type
        };

    }

    //创建覆盖物
    createOverlays({ label: name, count, value, coord: {
        longitude, latitude
    } }, nextZoom, type) {
        // new BMap.Point(116.404, 39.915);
        let labelPoint = new window.BMap.Point(longitude, latitude);

        if (type === 'circle') {
            this.createCircle(labelPoint, name, count, value, nextZoom);
        } else {
            // 渲染方形覆盖物
            this.createRect(labelPoint, name, count, value);
        }
    }

    //创建圆形覆盖物
    createCircle(point, name, count, id, nextZoom) {

        let opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new window.BMap.Size(-35, -35) // 设置文本偏移量
        };
        // 创建文本标注对象
        let label = new window.BMap.Label('', opts);
        // 自定义文本标注样式
        label.setStyle(labelSetStyle);

        // 添加覆盖物内部html标签
        label.setContent(`
            <p >${name}</p>
            <p >${count}套</p>
        `);


        label.addEventListener('click', () => {
            // 1. 地图发生了移动
            // map.panTo(labelPoint);
            // 2. 地图放大了
            // map.setZoom(13);
            console.log(2323);

            this.map.centerAndZoom(point, nextZoom);
            // 3. 原来的覆盖物 被清除了
            setTimeout(() => {
                this.map.clearOverlays();
            }, 0);
            // 4. 下一级房源 覆盖物 渲染
            this.renderOverlays(id);
        });

        this.map.addOverlay(label);
    }

    //创建方形的覆盖物
    createRect(point, name, count, id) {
        let opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new window.BMap.Size(-35, -35) // 设置文本偏移量
        };
        // 创建文本标注对象
        let label = new window.BMap.Label('', opts);
        // 自定义文本标注样式
        label.setStyle(labelSetStyle);

        // 添加覆盖物内部html标签
        label.setContent(`
            <p >${name}</p>
            <p >${count}套</p>
        `);


        label.addEventListener('click', () => {
            //被点击了
        });

        this.map.addOverlay(label);
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
