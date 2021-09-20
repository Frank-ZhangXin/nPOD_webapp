import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  datePicker: {
    width: "140px",
    height: "25px",
    marginLeft: "4px",
    marginBottom: "5px",
  },
}));

export default function DateBox({ value, setValue, setChanged }) {
  const classes = useStyles();
  const [newDate, setNewDate] = useState(null);
  const handleDateChange = (date) => {
    setValue(date.toLocaleDateString("en-CA").slice(0, 10));
    console.log(
      "writing time is",
      date.toLocaleDateString("en-CA").slice(0, 10)
    );
    setNewDate(date);
    setChanged(true);
  };
  return (
    <div>
      <DatePicker
        selected={
          value && !newDate
            ? new Date(Date.parse(value.slice(0, 10) + " 00:00:00 GMT-0500"))
            : newDate
        }
        onChange={handleDateChange}
        className={classes.datePicker}
      />
    </div>
  );
}