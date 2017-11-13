import React, { Component } from 'react';

class Clock extends Component {
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

    drawCircle(radius) {
        var ctx = this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.restore();
    }

    drawTick() {
        const ctx = this.ctx;
        const totalDeg = Math.PI * 2;

        ctx.save();
        for (var i = 0; i < 60; i++) {
            if(i % 5 === 0){
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = this.color;
                ctx.moveTo(this.radius, 0);
                ctx.lineTo(this.radius * 0.9, 0);
                ctx.stroke();
                ctx.rotate(totalDeg / 60);
            }else{
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = this.color;
                ctx.moveTo(this.radius, 0);
                ctx.lineTo(this.radius * 0.95, 0);
                ctx.stroke();
                ctx.rotate(totalDeg / 60);
            }
        }
        ctx.restore();
    }

    drawCenter() { 
        const ctx = this.ctx;
        ctx.save(); 
        ctx.fillStyle = this.color; 
        ctx.strokeStyle = this.color; 
        ctx.beginPath(); 
        ctx.arc(0, 0, this.radius * 0.06, 0, 2*Math.PI); 
        ctx.closePath(); 
        ctx.fill(); 
        ctx.stroke(); 
 
        ctx.restore(); 
    }; 

    drawHourHand(h, m, s){
        const ctx = this.ctx;
        h = h === 0 ? 24 : h;
        ctx.save();
        ctx.rotate(Math.PI * 2 / (3600 * 12) * ((h - 3) * 3600 + m * 60 + s));
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.radius * 0.5, 0);
        ctx.lineTo(-this.radius * 0.15, 0);
        ctx.stroke();
        ctx.restore(); 
    }

    drawMinHand(m, s){
        const ctx = this.ctx;
        m = m === 0 ? 60 : m;
        ctx.save();
        ctx.rotate(Math.PI * 2 / 3600 * ((m - 15) * 60 + s));
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.radius * 0.7, 0);
        ctx.lineTo(-this.radius * 0.15, 0);
        ctx.stroke();
        ctx.restore(); 
    }

    drawSecHand(s){
        const ctx = this.ctx;
        s = s === 0 ? 60 : s;
        ctx.save();
        ctx.rotate(Math.PI * 2 / 60 * (s - 15));
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.radius * 0.85, 0);
        ctx.lineTo(-this.radius * 0.15, 0);
        ctx.stroke();
        ctx.restore(); 
    }

    drawFrame() {
        const ctx = this.ctx;
        const canvas = this._canvas,
            cWidth = canvas.width,
            cHeight = canvas.height;

        ctx.save();
        ctx.clearRect(0, 0, cWidth, cHeight);
        ctx.translate(cWidth / 2, cHeight / 2);

        this.radius = ((cWidth > cHeight ? cHeight : cWidth) - 5) / 2;

        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        this.drawCircle();
        this.drawTick();
        this.drawCenter();
        this.drawHourHand(h, m, s);
        this.drawMinHand(m, s);
        this.drawSecHand(s);

        ctx.restore();

        window.requestAnimationFrame(this.drawFrame);
    }

    init() {
        const { color } = this.props;
        const canvas = this._canvas;
        this.color = color ? color : '#1790DC';
        this.ctx = canvas.getContext('2d');
        this.drawFrame();
    }

    render() {
        const { width = 250, height = 250 } = this.props;
        return <canvas ref={canvas => (this._canvas = canvas)} height={height} width={width} />;
    }
}

export default Clock;
