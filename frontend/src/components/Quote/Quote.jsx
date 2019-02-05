import React from "react";
import PropTypes from "prop-types";

const Quote = ({ data: { company, underlyingCode, currency, price }, onRemove }) => {
  const renderedCode = `${company} (${underlyingCode})`;
  const renderedCurrency = `currency: ${currency}`;
  const renderedPrice = `price: ${price}`;

  return (
    <div className="quote">
      <div className="header">
        <button onClick={onRemove}>X</button>
        <h4>{renderedCode}</h4>
      </div>
      <div>{renderedCurrency}</div>
      <div>{renderedPrice}</div>
    </div>
  );
};

Quote.propTypes = {
  data: PropTypes.shape({
    company: PropTypes.string.isRequired,
    underlyingCode: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired
  }),
  onRemove: PropTypes.func.isRequired
};

export default Quote;
