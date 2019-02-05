import React, { Component } from 'react';
import Axios from "axios";
import Quote from "./components/Quote"
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCompany: null,
      stocks: [],
      quotes: [],
      selectedQuotes: []
    };

    this.eventSource = new EventSource("http://localhost:8080/quotes");
  }


  async componentDidMount() {
    await this.fetchStocks();

    this.eventSource.onmessage = event => {
      const { data } = event;
      const { selectedQuotes } = this.state;

      const parsedData = JSON.parse(data);

      const updatedQuotes = selectedQuotes.map(item => {
        if (item.underlyingCode === parsedData.underlyingCode) return parsedData;
        return item
      });

      this.setState({
        selectedQuotes: updatedQuotes
      })
    }
  }

  componentWillUnmount() {
    this.eventSource.close()
  }

  addQuotationForMonitoring = async () => {
    try {
      await this.fetchQuotes();

      const { selectedCompany, quotes } = this.state;

      if (selectedCompany === '' || selectedCompany === null) return;

      const selectedQuotation = quotes.find(item => item.underlyingCode === selectedCompany);

      if (!selectedQuotation) return;

      this.setState(prevState => ({
        selectedQuotes: [...prevState.selectedQuotes, selectedQuotation]
      }));
    } catch (e) {
      console.log(e)
    }
  };

  handleChangeCompany = e => {
    const { value } = e.target;

    this.setState({
      selectedCompany: value,
    });
  };

  handleRemove = index => {
    const { selectedQuotes } = this.state;

    const updatedStocks = selectedQuotes.filter((item, idx) => index !== idx);

    this.setState({ selectedQuotes: updatedStocks });
  };

  fetchStocks = async () => {
    try {
      const { data } = await Axios.get('/stocks');

      this.setState({ stocks: data });
    } catch (e) {
      console.log(e)
    }
  };

  fetchQuotes = async () => {
    try {
      const { data } = await Axios.get('/quotes');

      this.setState({ quotes: data });
    } catch (e) {
      console.log(e)
    }
  };

  render() {

    const { stocks, selectedQuotes } = this.state;

    return (
      <div>
        <div className="selection">
          <label>Stock:
            <select onChange={this.handleChangeCompany}>
              <option value="">...</option>
              {stocks.map((item, idx) =>
                <option key={idx} value={item.underlyingCode}>{item.company}</option>
              )}
            </select>
          </label>

          <button onClick={this.addQuotationForMonitoring}>Add +</button>

        </div>
        <div id="quotes">
          {selectedQuotes.map((item, idx) =>
            <Quote key={idx} data={item} onRemove={this.handleRemove.bind(this, idx)}/>
          )}
        </div>
      </div>
    );
  }
}

export default App;
