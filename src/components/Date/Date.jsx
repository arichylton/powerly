import React, { Component } from 'react';

const Date = () => {
  return (
    <div>
      <DatePicker onChange={this.onChange} value={this.state.date} />
    </div>
  );
};

export default Date;
