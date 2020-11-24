import React, { Component } from 'react'
import { Carousel, Flex } from 'antd-mobile';
import axios from 'axios'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
import './index.scss'



export default class Index extends Component {
    state = {
        swipers: [],
        groups: [],
        news: [],
        imgHeight: 176,
    }
    componentDidMount() {
        this.getSwipers()
        this.getGroups()
        this.getNews()
    }

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

    render() {
        return (
            <div>
                {this.renderSwipers()}
                <Flex justify="around" className="nav">
                    <Flex.Item><img src={nav1} alt="" /> <div>整租</div></Flex.Item>
                    <Flex.Item><img src={nav2} alt="" /> <div>合租</div></Flex.Item>
                    <Flex.Item><img src={nav3} alt="" /><div>地图找房</div> </Flex.Item>
                    <Flex.Item><img src={nav4} alt="" /> <div>去出租</div></Flex.Item>
                </Flex>
                {/* 租房小组 */}
                <div className="class">
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

                <div className="news">
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
            </div>
        )
    }
}
