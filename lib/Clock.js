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

var Clock = function (_Component) {
    _inherits(Clock, _Component);

    function Clock() {
        _classCallCheck(this, Clock);

        var _this = _possibleConstructorReturn(this, (Clock.__proto__ || Object.getPrototypeOf(Clock)).call(this));

        _this.drawFrame = _this.drawFrame.bind(_this);
        return _this;
    }

    _createClass(Clock, [{
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
        key: 'drawCircle',
        value: function drawCircle(radius) {
            var ctx = this.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.restore();
        }
    }, {
        key: 'drawTick',
        value: function drawTick() {
            var ctx = this.ctx;
            var totalDeg = Math.PI * 2;

            ctx.save();
            for (var i = 0; i < 60; i++) {
                if (i % 5 === 0) {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = this.color;
                    ctx.moveTo(this.radius, 0);
                    ctx.lineTo(this.radius * 0.9, 0);
                    ctx.stroke();
                    ctx.rotate(totalDeg / 60);
                } else {
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
    }, {
        key: 'drawCenter',
        value: function drawCenter() {
            var ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.06, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.restore();
        }
    }, {
        key: 'drawHourHand',
        value: function drawHourHand(h, m, s) {
            var ctx = this.ctx;
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
    }, {
        key: 'drawMinHand',
        value: function drawMinHand(m, s) {
            var ctx = this.ctx;
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
    }, {
        key: 'drawSecHand',
        value: function drawSecHand(s) {
            var ctx = this.ctx;
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
    }, {
        key: 'drawFrame',
        value: function drawFrame() {
            var ctx = this.ctx;
            var canvas = this._canvas,
                cWidth = canvas.width,
                cHeight = canvas.height;

            ctx.save();
            ctx.clearRect(0, 0, cWidth, cHeight);
            ctx.translate(cWidth / 2, cHeight / 2);

            this.radius = ((cWidth > cHeight ? cHeight : cWidth) - 5) / 2;

            var now = new Date();
            var h = now.getHours();
            var m = now.getMinutes();
            var s = now.getSeconds();
            this.drawCircle();
            this.drawTick();
            this.drawCenter();
            this.drawHourHand(h, m, s);
            this.drawMinHand(m, s);
            this.drawSecHand(s);

            ctx.restore();

            window.requestAnimationFrame(this.drawFrame);
        }
    }, {
        key: 'init',
        value: function init() {
            var color = this.props.color;

            var canvas = this._canvas;
            this.color = color ? color : '#1790DC';
            this.ctx = canvas.getContext('2d');
            this.drawFrame();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                _props$width = _props.width,
                width = _props$width === undefined ? 250 : _props$width,
                _props$height = _props.height,
                height = _props$height === undefined ? 250 : _props$height;

            return _react2.default.createElement('canvas', { ref: function ref(canvas) {
                    return _this2._canvas = canvas;
                }, height: height, width: width });
        }
    }]);

    return Clock;
}(_react.Component);

exports.default = Clock;