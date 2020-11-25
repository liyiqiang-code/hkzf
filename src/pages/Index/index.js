import React, { Component } from 'react'
import { Carousel, Flex } from 'antd-mobile';
import axios from 'axios'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
import './index.scss'

// nav模块的数据
const nav = [
    { img: nav1, title: '整租', path: '/home/houselist' },
    { img: nav2, title: '合租', path: '/home/houselist' },
    { img: nav3, title: '地图找房', path: '/map' },
    { img: nav4, title: '去出租', path: '/login' },
]

export default class Index extends Component {
    state = {
        // 轮播图数据
        swipers: [],
        // 租房小组数据
        groups: [],
        // 最新资讯数据
        news: [],
        cityInfo: '',
        imgHeight: 176,
    }

    componentDidMount() {
        this.getSwipers()
        this.getGroups()
        this.getNews()

        var myCity = new window.BMap.LocalCity();


        myCity.get((result) => {
            var cityName = result.name;
            this.getCityInfo(cityName);
        });
    }
    //定位城市请求
    async getCityInfo(cityName) {
        const res = await axios.get(`http://localhost:8080/area/info?name=${cityName}`)
        this.setState({
            cityInfo: res.data.body.label
        })
    }

    // 请求轮播图数据
    async getSwipers() {
        const res = await axios.get('http://localhost:8080/home/swiper')
        this.setState({
            swipers: res.data.body
        })
    }

    //小组卡片请求
    async getGroups() {
        const res = await axios.get(`http://localhost:8080/home/groups`, {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        this.setState({
            groups: res.data.body
        })
    }

    //最新资讯请求
    async getNews() {
        const res = await axios.get('http://localhost:8080/home/news', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        this.setState({
            news: res.data.body
        })

    }

    // 轮播图模块
    renderSwipers() {
        if (this.state.swipers.length) {
            return <Carousel
                autoplay={true}
                infinite={true}
                autoplayInterval={1000}
            >
                {this.state.swipers.map(val => (
                    <a
                        key={val.id}
                        href="http://www.alipay.com"
                        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                    >
                        <img
                            src={`http://localhost:8080${val.imgSrc}`}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top' }}
                            onLoad={() => {
                                // fire window resize event to change height
                                window.dispatchEvent(new Event('resize'));
                                this.setState({ imgHeight: 'auto' });
                            }}
                        />
                    </a>
                ))}
            </Carousel>
        } else {
            return null
        }
    }

    //nav模块
    renderNav() {
        return <Flex justify="around" className="nav">
            {nav.map((v, i, a) => (
                <Flex.Item key={i} onClick={this.handleJump.bind(this, v)}><img src={v.img} alt="" /> <div>{v.title}</div></Flex.Item>
            ))}
        </Flex>
    }

    //最新资讯模块
    renderNews() {
        return <div className="news">
            <h3>最新资讯</h3>
            {this.state.news.map((v, i, a) => (
                <div className="newsItem" key={i}>
                    <div className="newsItemLeft">
                        <img src={`http://localhost:8080${v.imgSrc}`} alt="" />
                    </div>
                    <div className="newsItemRight">
                        <div>{v.title}</div>
                        <div className="detail">
                            <span>{v.from}</span><span>{v.date}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    }

    //租房小组模块
    renderClass() {
        return <div className="class">
            <div className="classTop"><h3>租房小组</h3><span>更多</span></div>
            <div className="classBottom">
                {this.state.groups.map((v, i, a) => (
                    <div className="classBottomItem" key={i}>
                        <div>
                            <h3>{v.title}</h3>
                            <p>{v.desc}</p>
                        </div>
                        <img src={`http://localhost:8080${v.imgSrc}`} alt="" />
                    </div>
                ))}
            </div>
        </div>
    }

    handleJump(v) {
        this.props.history.push(v.path)
    }

    handleCity = () => {
        this.props.history.push('/citylist')
    }
    render() {
        return (
            <div>
                {/* 轮播图模块 */}
                {this.renderSwipers()}

                {/* 搜索框 */}
                <div className="search-box">
                    <div className="search"><span className="iconGZ" onClick={this.handleCity}>{this.state.cityInfo}<span className="iconfont icon-arrow "></span></span>
                        <i className="iconfont icon-seach"></i>
                    请输入小区或地址
                    </div>
                    <span className="iconfont icon-map map"></span>
                </div>

                {/* nav模块 */}
                {this.renderNav()}

                {/* 租房小组 */}
                {this.renderClass()}

                {/* 最新资讯模块 */}
                {this.renderNews()}

            </div>
        )
    }
}
