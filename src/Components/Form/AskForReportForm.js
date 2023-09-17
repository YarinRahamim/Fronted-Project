// Developers details: Omer Norman 206729873 , Yarin Rahamim 205833668

import React from "react";
import classes from "./AskForReportForm.module.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import idb from "../api/idb";
import { Button } from "@mui/material";
import ReportsList from "../Report/ReportsList";

class AskForReportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      askedDateValue: dayjs("2023-09"),
      isLoading: false,
      isSubmited: false,
      filteredData: [],
      totalAmount: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setValue(newValue) {
    this.setState({ askedDateValue: newValue });
  }

  getDatefromDatePickerobject() {
    let month = this.state.askedDateValue.month();
    return `${this.state.askedDateValue.year()}-${String(month + 1).padStart(
      2,
      "0"
    )}`;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true, isSubmited: true });
    let date = this.getDatefromDatePickerobject();
    idb
      .getReport(date)
      .then((filteredData) => {
        this.setState({ isLoading: false, filteredData: filteredData });
      })
      .catch(() => {
        alert("Error while saving data");
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["year", "month"]}
            label="Year and Month"
            maxDate={dayjs("2026-06-01")}
            value={this.state.askedDateValue}
            className={classes["date-picker"]}
            onChange={(newValue) => {
              this.setValue(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
        </LocalizationProvider>
        <div className={classes["report-btn"]}>
          <Button type="submit" variant="contained">
            Sumbit
          </Button>
        </div>
        {this.state.isSubmited && (
          <div>
            {this.state.filteredData.length > 0 ? (
              <div className={classes["total-amount"]}>
                {(() => {
                  this.state.totalAmount = 0; // initialize totalAmount to 0
                  return this.state.filteredData.map((cost) => {
                    this.state.totalAmount += Number(cost.sum);
                  });
                })()}
                Total Amount is: {this.state.totalAmount}₪
                <ReportsList filteredData={this.state.filteredData} />
              </div>
            ) : (
              <p>No data to display</p>
            )}
          </div>
        )}
      </form>
    );
  }
}

export default AskForReportForm;
