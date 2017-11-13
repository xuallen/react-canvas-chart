import React, { Component } from 'react';
const DEFAULT_COLORS = ['#1790DC', '#B78BEE'];
const extend = function(destination, source) {
    for(var property in source) {
        destination[property] = source[property]
    }
    return destination
}

// 圆点
const Dot = function() {
    this.x = 0;
    this.y = 0;
    this.colors = DEFAULT_COLORS;
    this.draw = function(c) {
        c.save();
        c.beginPath();
        c.fillStyle = this.colors[0];
        c.strokeStyle = '#FFF';
        c.lineWidth = 4;
        c.shadowBlur = 8;
        c.shadowColor = this.colors[0];
        c.arc(this.x, this.y, 8, 0, Math.PI * 2, false);
        c.fill();
        c.stroke();
        c.restore();
    };
}

class CircleChart extends Component {
    constructor(){
        super();
        this.drawFrame = this.drawFrame.bind(this);
    }

    componentWillReceiveProps() {
        this.init();
    }

    componentDidMount() {
        this.init();
    }

    drawOutsideCircle(radius, angle) {
        var ctx = this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = this.options.outsideCircleWidth;
        ctx.strokeStyle = this.lineGradient;
        ctx.arc(0, 0, radius > 0 ? radius : 0, 0, angle, false);
        ctx.stroke();
        ctx.restore();
    }

    drawInsideCircle(radius) {
        var ctx = this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.lineGradient;
        ctx.lineWidth = this.options.insideCircleWidth;
        ctx.arc(0, 0, radius > 0 ? radius : 0, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.restore();
    }

    drawTick(insideCircleRadius) {
        const ctx = this.ctx;
        const totalDeg = Math.PI * 2 * 3 / 4;
        const {
            maxValue,
            insideCircleWidth,
            tickNumber
        } = this.options;
        ctx.save();
        for (var i = 0; i <= Math.round(this.currentValue / maxValue * tickNumber); i++) {
            if(i < Math.round(this.currentValue / maxValue * tickNumber)){
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.moveTo(insideCircleRadius - Math.floor(insideCircleWidth / 2) * 0.6, 0);
                ctx.lineTo(insideCircleRadius + Math.floor(insideCircleWidth / 2) * 0.6, 0);
                ctx.stroke();
                ctx.rotate(totalDeg / tickNumber);
            }else{
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#FFF';
                ctx.moveTo(insideCircleRadius - Math.floor(insideCircleWidth / 2) * 0.6, 0);
                ctx.lineTo(insideCircleRadius + Math.floor(insideCircleWidth / 2), 0);
                ctx.stroke();
                ctx.rotate(totalDeg / tickNumber);
            }
        }
        ctx.restore();
    }

    drawText(insideCircleRadius) {
        const ctx = this.ctx;
        const {
            title,
            titleSize,
            valueSize,
            insideCircleWidth
        } = this.options;
        ctx.save();
        ctx.rotate(Math.PI / 180 * 225);
        ctx.fillStyle = this.lineGradient;
        ctx.font = 'bold ' + valueSize + 'px Microsoft Yahei';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.currentValue, 0, -valueSize * 0.1, insideCircleRadius * 2 - insideCircleWidth / 2);
        ctx.font = titleSize + 'px Microsoft Yahei';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 0, (titleSize + valueSize) * 0.9 / 2);
        ctx.restore();
    }


    drawFrame() {
        const ctx = this.ctx;

        const {
            value,
            outsideCircleWidth,
            insideCircleWidth,
            padding,
            circleDistance
        } = this.options;

        const canvas = this._canvas,
            cWidth = canvas.width,
            cHeight = canvas.height,
            radius = (cWidth > cHeight ? cHeight : cWidth) / 2 - padding,
            insideCircleRadius = radius - Math.floor(outsideCircleWidth / 2) - Math.floor(insideCircleWidth / 2) - circleDistance;

        ctx.save();
        ctx.clearRect(0, 0, cWidth, cHeight);
        ctx.translate(cWidth / 2, cHeight / 2);
        ctx.rotate(Math.PI / 180 * 135);
        ctx.strokeStyle = this.lineGradient;
        const angle = (Math.PI * 2 * 3 / 4) * (this.currentValue / 100);

        //外部圆弧
        this.drawOutsideCircle(radius, angle);

        //中间刻度层
        this.drawInsideCircle(insideCircleRadius);

        // 细分刻度线
        this.drawTick(insideCircleRadius);

        // 文字
        this.drawText(insideCircleRadius);

        this.dot.x = radius * Math.cos(angle);
        this.dot.y = radius * Math.sin(angle);
        this.dot.rotate = (Math.PI * 2 * 3 / 4);

        this.dot.draw(ctx);

        ctx.restore();

        if(this.currentValue < value){
            const step = (value - this.currentValue > 1) ? 2 : 1
            this.currentValue += step;

            window.requestAnimationFrame(this.drawFrame);
        }
    }

    init() {
        const defaultOptions = {
            value: 80,
            maxValue: 100,
            outsideCircleWidth: 3, 
            insideCircleWidth: 28,
            padding: 20,
            tickNumber: 100,
            circleDistance: 5,
            colors: DEFAULT_COLORS,
            title: '百分比(%)',
            titleSize: 14,
            valueSize: 70,
            animation: true
        }
        const { options = {} } = this.props;

        extend(defaultOptions, options);

        this.options = defaultOptions;

        const {
            value,
            colors,
            animation
        } = defaultOptions;

        const canvas = this._canvas,
            ctx = canvas.getContext('2d'),
            cWidth = canvas.width,
            cHeight = canvas.height,
            radius = (cWidth > cHeight ? cHeight : cWidth) / 2;

        this.ctx = ctx;

        this.lineGradient = ctx.createLinearGradient(radius, radius, -radius, -radius);
        for (let i = 0; i < colors.length; i++) {
            if(i === 0){
                this.lineGradient.addColorStop(0, colors[0]);
            }else if(i === colors.length - 1){
                this.lineGradient.addColorStop(1, colors[i]);
            }else{
                this.lineGradient.addColorStop(i / (colors.length - 1), colors[i]);
            }
        }
        
        this.currentValue = animation ? 0 : value;
        this.dot = new Dot();
        this.dot.colors = colors;

        window.requestAnimationFrame(this.drawFrame);
        setTimeout(() => {
            window.requestAnimationFrame(this.drawFrame);
        }, 0);
    }

    render() {
        const { width = 250, height = 250 } = this.props;
        return <canvas ref={canvas => (this._canvas = canvas)} height={height} width={width} />;
    }
}

export default CircleChart;
