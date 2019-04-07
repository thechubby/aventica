import React, { Component } from 'react';
import * as ReactDOM from "react-dom";

class App extends Component {
    constructor(props) {
        super(props);
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'https://yandex.com/time/sync.json?geo=213', false);
        this.input = React.createRef();

        this.state = {
            date: props.date,
            updateTime: new Date(xmlHttp.responseText).time
            /*new Date(JSON.parse(xmlHttp.responseText).time)*/
        }
    }

    onChange(value) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'https://yandex.com/time/sync.json?geo=213', false);
        xmlHttp.send(null);
        if (this.state.date !== value) {
            this.setState({date: value})
        }
        this.setState({
            updateTime: new Date(JSON.parse(xmlHttp.responseText).time)
        });
        this.props.onChange(this.state)
    }



    renderItems(items) {
        return <div>{items.map((value, index) => <div key={index}>{value}</div>)}</div>
    }

    createItems(period) {
        let dates = [];
        for (let i = +period.start; i < +period.end; i += 3600000 * 168)
            dates.push(i);
        let periods = [];
        for (let i = 0; i < dates.length; i++) {
            let date = new Date(dates[i]);
            if (date.getDay() === 1) period = `${date.toLocaleDateString()} - {date.setHours(168).toLocaleDateString()}`;
            else if (date.getDay() === 2) period[i] = `${date.setHours(-24).toLocaleDateString()} - {date.setHours(144).toLocaleDateString()}`;
            else if (date.getDay() === 3) period[i] = `${date.setHours(-48).toLocaleDateString()} - {date.setHours(120).toLocaleDateString()}`;
            else if (date.getDay() === 4) period[i] = `${date.setHours(-48).toLocaleDateString()} - {date.setHours(120).toLocaleDateString()}`;
            else if (date.getDay() === 5) period[i] = `${date.setHours(-72).toLocaleDateString()} - {date.setHours(96).toLocaleDateString()}`;
            else if (date.getDay() === 6) period[i] = `${date.setHours(-96).toLocaleDateString()} - {date.setHours(72).toLocaleDateString()}`;
            else if (date.getDay() === 0) period[i] = `${date.setHours(-120).toLocaleDateString()} - {date.setHours(48).toLocaleDateString()}`;
            let n = periods.length, a = periods.length;
            do {
                var b = false;
                a /= 1.3;
                if (a === 9 || a === 10) a = 11;
                if (a < 1) a = 1;
                for (let i = 0; i < n - a; ++i) {
                    if (periods[i] > periods[i + a]) {
                        b = true;
                        let t = periods[i + a];
                        periods[i + a] = periods[i];
                        periods[i] = t;
                    }
                }
            } while (a > 1 || b);
        }
        return periods;
    }

    createPeriod(date) {
        let newDate = date;
        newDate.year = newDate.year + 1;
        return {
            start: date,
            end: newDate
        }
    }

    componentWillMount() {
        this.refs.input.onFocus = function () {
            this.refs.input.style.backgroundColor = '#900'
        };
        this.refs.input.onBluer = function () {
            this.refs.input.style.backgroundColor = '#fff'
        };
    }

    renderView(props) {
        return <div>
            <div>
                <label>
                    <input type="date" ref={this.input} onChange={function (event) {
                        this.onChange(event.target.value)
                    }}/>
                </label>
            </div>
            <div>{`Последнее изменение: ${props.updateTime.getDate() + '.' + props.updateTime.getMonth() + '0' + props.updateTime.getMonth() + ':' + props.updateTime.getMonth()}`}</div>
            <div>                                                                /*updateTime.getMonth() > 9 ? : +'0'+props.updateTime.*/
                {
                    this.renderItems(this.createItems(props.period))
                }
            </div>
        </div>
    }

    render() {
        React.CreateElement(this.renderView, {
            period: this.createPeriod(this.props.date),
            updateTime: this.props.updateTime,
            onChange: this.onChange.bind(this)
        });
        return this.renderView
    }

}
ReactDOM.render(<App />, document.getElementById('app'));

export default App;
