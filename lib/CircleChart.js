'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_COLORS = ['#1790DC', '#B78BEE'];
var extend = function extend(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
};

// 圆点
var Dot = function Dot() {
    this.x = 0;
    this.y = 0;
    this.colors = DEFAULT_COLORS;
    this.draw = function (c) {
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
};

var CircleChart = function (_Component) {
    _inherits(CircleChart, _Component);

    function CircleChart() {
        _classCallCheck(this, CircleChart);

        var _this = _possibleConstructorReturn(this, (CircleChart.__proto__ || Object.getPrototypeOf(CircleChart)).call(this));

        _this.drawFrame = _this.drawFrame.bind(_this);
        return _this;
    }

    _createClass(CircleChart, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps() {
            this.init();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.init();
        }
    }, {
        key: 'drawOutsideCircle',
        value: function drawOutsideCircle(radius, angle) {
            var ctx = this.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = this.options.outsideCircleWidth;
            ctx.strokeStyle = this.lineGradient;
            ctx.arc(0, 0, radius > 0 ? radius : 0, 0, angle, false);
            ctx.stroke();
            ctx.restore();
        }
    }, {
        key: 'drawInsideCircle',
        value: function drawInsideCircle(radius) {
            var ctx = this.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = this.lineGradient;
            ctx.lineWidth = this.options.insideCircleWidth;
            ctx.arc(0, 0, radius > 0 ? radius : 0, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.restore();
        }
    }, {
        key: 'drawTick',
        value: function drawTick(insideCircleRadius) {
            var ctx = this.ctx;
            var totalDeg = Math.PI * 2 * 3 / 4;
            var _options = this.options,
                maxValue = _options.maxValue,
                insideCircleWidth = _options.insideCircleWidth,
                tickNumber = _options.tickNumber;

            ctx.save();
            for (var i = 0; i <= Math.round(this.currentValue / maxValue * tickNumber); i++) {
                if (i < Math.round(this.currentValue / maxValue * tickNumber)) {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.moveTo(insideCircleRadius - Math.floor(insideCircleWidth / 2) * 0.6, 0);
                    ctx.lineTo(insideCircleRadius + Math.floor(insideCircleWidth / 2) * 0.6, 0);
                    ctx.stroke();
                    ctx.rotate(totalDeg / tickNumber);
                } else {
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
    }, {
        key: 'drawText',
        value: function drawText(insideCircleRadius) {
            var ctx = this.ctx;
            var _options2 = this.options,
                title = _options2.title,
                titleSize = _options2.titleSize,
                valueSize = _options2.valueSize,
                insideCircleWidth = _options2.insideCircleWidth;

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
    }, {
        key: 'drawFrame',
        value: function drawFrame() {
            var ctx = this.ctx;

            var _options3 = this.options,
                value = _options3.value,
                outsideCircleWidth = _options3.outsideCircleWidth,
                insideCircleWidth = _options3.insideCircleWidth,
                padding = _options3.padding,
                circleDistance = _options3.circleDistance;


            var canvas = this._canvas,
                cWidth = canvas.width,
                cHeight = canvas.height,
                radius = (cWidth > cHeight ? cHeight : cWidth) / 2 - padding,
                insideCircleRadius = radius - Math.floor(outsideCircleWidth / 2) - Math.floor(insideCircleWidth / 2) - circleDistance;

            ctx.save();
            ctx.clearRect(0, 0, cWidth, cHeight);
            ctx.translate(cWidth / 2, cHeight / 2);
            ctx.rotate(Math.PI / 180 * 135);
            ctx.strokeStyle = this.lineGradient;
            var angle = Math.PI * 2 * 3 / 4 * (this.currentValue / 100);

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
            this.dot.rotate = Math.PI * 2 * 3 / 4;

            this.dot.draw(ctx);

            ctx.restore();

            if (this.currentValue < value) {
                var step = value - this.currentValue > 1 ? 2 : 1;
                this.currentValue += step;

                window.requestAnimationFrame(this.drawFrame);
            }
        }
    }, {
        key: 'init',
        value: function init() {
            var _this2 = this;

            var defaultOptions = {
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
            };
            var _props$options = this.props.options,
                options = _props$options === undefined ? {} : _props$options;


            extend(defaultOptions, options);

            this.options = defaultOptions;

            var value = defaultOptions.value,
                colors = defaultOptions.colors,
                animation = defaultOptions.animation;


            var canvas = this._canvas,
                ctx = canvas.getContext('2d'),
                cWidth = canvas.width,
                cHeight = canvas.height,
                radius = (cWidth > cHeight ? cHeight : cWidth) / 2;

            this.ctx = ctx;

            this.lineGradient = ctx.createLinearGradient(radius, radius, -radius, -radius);
            for (var i = 0; i < colors.length; i++) {
                if (i === 0) {
                    this.lineGradient.addColorStop(0, colors[0]);
                } else if (i === colors.length - 1) {
                    this.lineGradient.addColorStop(1, colors[i]);
                } else {
                    this.lineGradient.addColorStop(i / (colors.length - 1), colors[i]);
                }
            }

            this.currentValue = animation ? 0 : value;
            this.dot = new Dot();
            this.dot.colors = colors;

            window.requestAnimationFrame(this.drawFrame);
            setTimeout(function () {
                window.requestAnimationFrame(_this2.drawFrame);
            }, 0);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props = this.props,
                _props$width = _props.width,
                width = _props$width === undefined ? 250 : _props$width,
                _props$height = _props.height,
                height = _props$height === undefined ? 250 : _props$height;

            return _react2.default.createElement('canvas', { ref: function ref(canvas) {
                    return _this3._canvas = canvas;
                }, height: height, width: width });
        }
    }]);

    return CircleChart;
}(_react.Component);

exports.default = CircleChart;