import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  state = {
    items: [],
    groupedArray: {},
    inputFieldValue: ""
  };

  componentDidMount() {
    this.loadData();
  }

  callApi = async () => {
    const response = await fetch('http://localhost:49758/api/values');
    const body = await response.json();
    if (response.status !== 200)
      throw Error(body.message);
    return body;
  };

  postApi(item) {
    fetch('http://localhost:49758/api/values', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item)
    }).then(response => {
      const body = response.json();
      if (response.status !== 200)
        throw Error(body.message);
      this.loadData();
    });
  }

  loadData() {
    this
      .callApi()
      .then(res => {
        res.reverse();
        const response = res.map((x) => (
          {
            id: x.id,
            name: x.name,
            category: x.category
          }));
        var groupedArray = {};
        response.forEach(element => {
          if (groupedArray[element.category] == null) {
            groupedArray[element.category] = [];
          }
          groupedArray[element.category].unshift(element);
        });
        this.setState({ items: response, groupedArray: groupedArray });
      })
      .catch(err => console.log(err));
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.addItem(event.target.value);
      event.target.value = ""
    }
  }

  addItem(item) {
    this.postApi(item);
  }

  render() {
    return (
      <div className="App">
        <div className="new-item-wrapper">
          <input key="input-field"
            className="new-item-input-field"
            type="text"
            onKeyPress={this.handleKeyPress}
            placeholder="Add a new item" />
        </div>
        <div className="item-wrapper">
          {
            this.state.items.map(x => {
              return (
                <div className="item" key={x.id}>
                  {x.name} ({x.category})
                </div>
              )
            })
          }
        </div>

        <div className="item-wrapper">
          {
            Object.keys(this.state.groupedArray).map(category => {
              const items = this.state.groupedArray[category]
              return (
                <div className="item" key={category}>
                  {category}
                  <ul>
                    {
                      items.map(function (item) {
                        return (
                          <li key={item.id}>
                            {item.name}
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
