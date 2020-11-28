import React, { Component } from 'react'
import './index.scss'
import NavHeader from '../../components/NavHeader'
import axios from 'axios'

//圆形覆盖物的样式对象
const labelCircleSetStyle = {
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


//方形覆盖物的样式对象
const labelRectSetStyle = {
    color: 'white',
    width: '100px',
    height: '20px',
    borderColor: '#ccc',
    fontSize: '12px',
    lineHeight: '20px',
    backgroundColor: 'green',
    fontFamily: '微软雅黑',
    display: 'inline-block',
    boxSizing: 'border-box'

}


export default class Map extends Component {
    state = {
        houselist: [],
        randoma: '',
        randomb: ''
    }
    componentDidMount() {
        this.setState({
            randoma: Math.floor(Math.random() * 1000),
            randomb: Math.floor(Math.random() * 1000)
        })

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

        if (10 <= zoom && zoom < 12) {
            nextZoom = 13;
            type = 'circle';
        } else if (12 <= zoom && zoom < 14) {
            nextZoom = 15;
            type = 'circle';
        } else if (14 <= zoom && zoom < 16) {
            type = 'rect';
        }

        return {
            nextZoom,
            type
        };

    }

    //请求房源数据
    async getHouseList(id) {
        const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`);
        // 将数据存储到state当中
        console.log(res.data.body);
        this.setState({
            houselist: res.data.body.list
        });
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
        label.setStyle(labelCircleSetStyle);

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
        label.setStyle(labelRectSetStyle);

        // 添加覆盖物内部html标签
        label.setContent(`
        <span id="address">${name}</span>
        <span id="number">${count}套</span>
        `);


        label.addEventListener('click', () => {
            //被点击了
            // 1. 根据地区id请求房源数据
            this.getHouseList(id);
        });

        this.map.addOverlay(label);
    }
    render() {
        return (
            <div className="map-wrapper">

                {/* 头部nav */}
                <NavHeader >地图找房</NavHeader>

                {/* 地图 */}
                <div id="container"></div>

                {/* 房源详情 */}
                <div className={this.state.houselist.length ? ' show ' : 'houseDetail '}
                >
                    <div className="title">
                        <h2>房源列表</h2>
                        <span className="more">更多房源</span>
                    </div>
                    {this.state.houselist.map((v, i) => (
                        <div className="houselist" key={v.houseCode}>
                            <img src={`http://localhost:8080${v.houseImg}`} alt="" />

                            <div className="Introduction">
                                <h3 className="IntroductionTitle">{v.title}</h3>
                                <div className="IntroductionDesc">{v.desc}</div>
                                <div className="IntroductionTags"><span >{v.tags.join(' ')}</span></div>
                                <div className="price">{v.price}元/月</div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        )
    }
}
