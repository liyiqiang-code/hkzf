import React, { Component } from 'react'
import { Carousel, Flex } from 'antd-mobile';
import axios from 'axios'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
import './index.css'



export default class Index extends Component {
    state = {
        swipers: [],
        imgHeight: 176,
    }
    componentDidMount() {
        this.getSwipers()
    }

    async getSwipers() {
        const res = await axios.get('http://localhost:8080/home/swiper')
        this.setState({
            swipers: res.data.body
        })
    }

    render() {
        return (
            <div>
                {this.state.swipers.length ? <Carousel
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
                </Carousel> : null}
                <Flex justify="around" className="nav">
                    <Flex.Item><img src={nav1} alt="" /> <div>租房</div></Flex.Item>
                    <Flex.Item><img src={nav2} alt="" /> <div>租房</div></Flex.Item>
                    <Flex.Item><img src={nav3} alt="" /><div>租房</div> </Flex.Item>
                    <Flex.Item><img src={nav4} alt="" /> <div>租房</div></Flex.Item>
                </Flex>
            </div>
        )
    }
}
