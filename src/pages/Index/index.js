import React, { Component } from 'react'
import { Carousel } from 'antd-mobile';
import axios from 'axios'



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
            </div>
        )
    }
}
