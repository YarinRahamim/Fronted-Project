// Developers details: Omer Norman 206729873 , Yarin Rahamim 205833668

// In accordance to readability considerations we decided to make 2 seperate UI components that actually
// serving the same cause and act simialr. we prefered the readability above reusability
import React, { Component } from "react";
import Button from "@mui/material/Button";

class ToggleAddCostBtn extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.setIsAddCostBtnPressed();
  };

  render() {
    return (
      <Button variant="outlined" onClick={this.handleClick}>
        {this.props.isAddCostBtnPressed ? "X" : "Add Cost 💲"}
      </Button>
    );
  }
}

export default ToggleAddCostBtn;
