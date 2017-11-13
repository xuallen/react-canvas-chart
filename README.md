## react-canvas-chart
基于react、canvas的数据可视化组件库

### Install
```bash
npm install react-canvas-chart
```

### 组件列表
| 组件        | 说明           | props  | 
| ------------- |-------------| -----|
| CircleChart      | 环形数据显示，可用于显示百分比等 | options、height、width |
| Clock      | canvas时钟 | color、height、width |


### 默认参数
#### CircleChart
```javascript
options = {
    value: 80,
    maxValue: 100,
    outsideCircleWidth: 3, 
    insideCircleWidth: 28,
    padding: 20,
    tickNumber: 100,
    circleDistance: 5,
    colors: ['#1790DC', '#B78BEE'],
    title: '百分比(%)',
    titleSize: 14,
    valueSize: 70,
    animation: true
}

width=250
height=250
```
### How to use
#### CircleChart

```javascript
import React, { Component } from 'react';
import { CircleChart } from 'react-canvas-chart';

class Page extends Component {
    render() {
        return <CircleChart options={{value: 50, colors: ['#FF003A', '#FFA150']}} />;
    }
}

export default Page;
```