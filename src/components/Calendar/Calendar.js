import React from "react";
import FullCalendar from "@fullcalendar/react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { CirclePicker, GithubPicker } from "react-color";

import firebase from "firebase";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  TimePicker,
} from "@material-ui/pickers";
import Dummy from "./Dummy";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import "./Calendar.css";
import { set } from "date-fns";
var uniqid = require("uniqid");

export default class App extends React.Component {
  calendarRef = React.createRef();
  //try dialogs
  constructor(props) {
    super(props);
    this.state = {
      renderId: null,
      renderTitle: null,
      renderStart: null,
      renderEnd: null,
      userid: null,
      dummy: {},
      open: false,
      eventId: null,
      title: {},
      start: null,
      end: null,
      openAddEvent: false,
      openMoreOptions: false,
      addEventText: null,
      addDescText: null,
      selectedStartDate: null,
      selectedEndDate: null,
      storage: firebase.storage(),
      addRecEventText: null,
      selectedStartTimeDate: null,
      selectedEndTimeDate: null,
      selectedStartDayDate: null,
      test: {},
      eventColor: null,
      background: null,
    };
  }
  componentDidMount = () => {
    if (this.props.userID !== null && this.props.userID !== undefined) {
      firebase
        .database()
        .ref("users")
        .child(this.props.userID) //G9cpbq4afHW3vmOYUgBSB4gMsHq2
        .child("calendar")
        // .child("k9klpo0v") //event id alınmıyor
        .once("value")
        .then((data) => {
          let dummyData = data.val();
          var arr = [];
          for (var key in dummyData) {
            if (dummyData.hasOwnProperty(key)) {
              arr.push([key, dummyData[key]]);
            }
          }
          const items = arr.map((item) => {
            return item;
          });
          this.setState({
            dummy: items,
          });
        });
    }
  };
  handleGetEvents = () => {
    var items = this.state.dummy;
    const events = [];

    function parseISOString(s) {
      var b = s.split(/\D+/);
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }

    for (var i = 0; i < items.length; i++) {
      let index = items[i].indexOf(",");
      let tempKey = items[i].slice(0, index);
      if (tempKey[0].charAt(0) == "0") {
        events.push({
          id: tempKey,
          title: items[i][1]["title"],
          start: items[i][1]["start"],
          end: items[i][1]["end"],
          backgroundColor: items[i][1]["color"],
        });
      } else {
        var startTime = items[i][1]["start"];
        var endTime = items[i][1]["end"];
        startTime = startTime.substr(11, 8);
        endTime = endTime.substr(11, 8);
        var recDate = items[i][1]["recDate"];
        var dateObject = parseISOString(recDate);
        var weekday = dateObject.getDay();
        events.push({
          id: tempKey,
          title: items[i][1]["title"],
          startTime: startTime,
          endTime: endTime,
          daysOfWeek: [weekday],
          backgroundColor: items[i][1]["color"],
        });
      }
    }
    return events;
  };

  handleClose = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  handleCloseAddEvent = () => {
    this.setState({
      openAddEvent: !this.state.openAddEvent,
    });
  };

  handleCloseMoreOptions = () => {
    this.setState({
      openMoreOptions: !this.state.openMoreOptions,
    });
  };

  //SEND DATA TO FIREBASE
  handleAddToDb = async () => {
    // var date = new date();
    if (this.props.userID !== null && this.props.userID !== undefined) {
      await firebase
        .database()
        .ref("users")
        .child(this.props.userID)
        .child("calendar")
        .child(this.state.eventId)
        .update({
          title: this.state.addEventText,
          start: this.state.selectedStartDate,
          end: this.state.selectedEndDate,
          color: this.state.background,
          // timestamp: date.getTime(),
        });
      // window.location.reload();
    }
  };

  handleAddRecToDb = async () => {
    // var date = new date();
    if (this.props.userID !== null && this.props.userID !== undefined) {
      await firebase
        .database()
        .ref("users")
        .child(this.props.userID)
        .child("calendar")
        .child(this.state.eventId)
        .update({
          recDate: this.state.selectedStartDayDate,
          title: this.state.addRecEventText,
          start: this.state.selectedStartTimeDate,
          end: this.state.selectedEndTimeDate,
          color: this.state.background,
        });
      // window.location.reload();
    }
  };

  render() {
    const { open } = this.state;
    const { openAddEvent } = this.state;
    const { openMoreOptions } = this.state;

    return (
      <div className="App">
        {/* EVENT CLICK  */}
        <div>
          <Dialog
            open={open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <p>Do you want to delete this event?</p>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p>Title: {this.state.title}</p>
                <p>Starting Time: {this.state.start}</p>
                <p>Ending Time: {this.state.end} </p>
                {/* <p>Id: {this.state.eventId}</p> */}
                {/* <p>Description: {this.state.extendedProps} </p> */}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.removeEvent} color="primary">
                Yes
              </Button>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                No
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/* ADD EVENT */}
        <div>
          <Dialog
            //it has to be open = ....
            open={openAddEvent}
            onClose={this.handleCloseAddEvent}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Add New Event</DialogTitle>
            <DialogContent dividers>
              <div className="new-add-event">
                <TextField
                  autoFocus
                  margin="normal"
                  id="filled-event-text"
                  label="Add Title"
                  onChange={this.handleTextEventName}
                />
                <div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Start Date"
                        value={this.state.selectedStartDate}
                        onChange={this.handleStartDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                      <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label="Start Time"
                        value={this.state.selectedStartDate}
                        onChange={this.handleStartDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change time",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </div>
                <div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="End Date"
                        value={this.state.selectedEndDate}
                        onChange={this.handleEndDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                      <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label="End Time"
                        value={this.state.selectedEndDate}
                        onChange={this.handleEndDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change time",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </div>
                <br></br>
                <div>
                  <CirclePicker onChangeComplete={this.handleChangeComplete} />
                </div>

                <br></br>
                <div>
                  <Button onClick={this.handleMoreOptions} variant="contained">
                    Add Recurring Event
                  </Button>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleAddEventClick} color="primary">
                Yes
              </Button>
              <Button
                onClick={this.handleCloseAddEvent}
                color="primary"
                autoFocus
              >
                No
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/* ADD RECURRING EVENT */}
        <div>
          <Dialog
            //it has to be open = ....
            open={openMoreOptions}
            onClose={this.handleCloseMoreOptions}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <p>Add New Recurring Event</p>
            </DialogTitle>
            <DialogContent dividers>
              <div className="new-add-event">
                <TextField
                  autoFocus
                  margin="normal"
                  id="filled-event-text"
                  label="Add Title"
                  onChange={this.handleTextRecEventName}
                />
              </div>
              <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="left">
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Start Date"
                      value={this.state.selectedStartDayDate}
                      onChange={this.handleStartDayDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </div>

              <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <KeyboardTimePicker
                      margin="normal"
                      id="time-picker"
                      label="Start Time"
                      value={this.state.selectedStartTimeDate}
                      onChange={this.handleStartTimeDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                    />
                    <KeyboardTimePicker
                      margin="normal"
                      id="time-picker"
                      label="End Time"
                      value={this.state.selectedEndTimeDate}
                      onChange={this.handleEndTimeDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </div>
              <div>
                <br></br>
                <div>
                  <CirclePicker onChangeComplete={this.handleChangeComplete} />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleMoreOptions} color="primary">
                Yes
              </Button>
              <Button
                onClick={this.handleCloseMoreOptions}
                color="primary"
                autoFocus
              >
                No
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <FullCalendar
          defaultView="dayGridMonth" //onboard page view
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          // dateClick={this.handleDateClick}
          eventClick={this.eventClick}
          ref={this.calendarRef}
          header={{
            left: "today",
            center:
              "previousYear previousMonth title nextMonth nextYear addEvent  addRecurringEvent",
            right: "dayGridMonth, dayGridWeek, dayGridDay",
          }}
          buttonText={{
            list: "Day",
          }}
          customButtons={{
            previousMonth: {
              click: () => {
                this.handlePreviousMonth();
              },
            },

            nextMonth: {
              click: () => {
                this.handleNextMonth();
              },
            },
            previousYear: {
              click: () => {
                this.handlePreviousYear();
              },
            },
            nextYear: {
              click: () => {
                this.handleNextYear();
              },
            },

            addEvent: {
              text: "Add Event",
              click: () => {
                this.handleAddEventClick();
              },
            },
            // addRecurringEvent: {
            //   text: "Add Recurring Event",
            //   click: () => {},
            // },
          }}
          buttonIcons={{
            previousMonth: "chevron-left",
            nextMonth: "chevron-right",
            previousYear: "chevrons-left",
            nextYear: "chevrons-right",
          }}
          editable
          selectable
          weekends={true}
          fullscreen={false}
          events={this.handleGetEvents()}
          height="parent"
        />
      </div>
    );
  }

  handlePreviousMonth = () => {
    let calendarApi = this.calendarRef.current.getApi();
    calendarApi.prev();
    console.log(calendarApi.getDate().toISOString());
  };

  handleNextMonth = () => {
    let calendarApi = this.calendarRef.current.getApi();
    calendarApi.next();
    console.log(calendarApi.getDate().toISOString());
  };

  handlePreviousYear = () => {
    let calendarApi = this.calendarRef.current.getApi();
    calendarApi.prevYear();
    console.log(calendarApi.getDate().toISOString());
  };

  handleNextYear = () => {
    let calendarApi = this.calendarRef.current.getApi();
    calendarApi.nextYear();
    console.log(calendarApi.getDate().toISOString());
  };

  handleTextEventName = (event) => {
    this.setState({ addEventText: event.target.value });
  };
  handleTextRecEventName = (event) => {
    this.setState({ addRecEventText: event.target.value });
  };

  //Remove an event from calendar.
  removeEvent = () => {
    let calendarApi = this.calendarRef.current.getApi();
    calendarApi.getEventById(this.state.eventId).remove();
    this.handleClose();
    if (this.props.userID !== null && this.props.userID !== undefined) {
      firebase
        .database()
        .ref("users")
        .child(this.props.userID)
        .child("calendar")
        .child(this.state.eventId)
        .remove();
    }
  };

  //ADD EVENT
  handleAddEventClick = (date) => {
    let calendarApi = this.calendarRef.current.getApi();
    //var uniqueId = uniqid();
    var uniqueId = Math.random().toString().substr(2, 5);
    //var uniqueId = Math.floor(Math.random() * 100);npm
    uniqueId = 0 + uniqueId;

    this.setState({
      eventId: uniqueId,
    });

    calendarApi.addEvent({
      title: this.state.addEventText,
      start: this.state.selectedStartDate,
      end: this.state.selectedEndDate,
      //extendedProps: this.state.addDescText,
      allDay: false,
      displayEventTime: true,
      id: uniqueId,
      backgroundColor: this.state.background,
    });

    this.handleAddToDb();
    this.setState({
      //eventId: null,
      addEventText: null,
      selectedStartDate: null,
      selectedEndDate: null,
      addDescText: null,
    });
    this.handleCloseAddEvent();
  };

  //ADD RECURRING EVENT
  handleMoreOptions = (date) => {
    let calendarApi = this.calendarRef.current.getApi();
    var uniqueId = Math.random().toString().substr(2, 5);
    uniqueId = 1 + uniqueId;
    this.setState({
      eventId: uniqueId,
    });

    function getDayOfWeek(date) {
      if (date !== null) {
        const dayOfWeek = new Date(date).getDay();
        return isNaN(dayOfWeek)
          ? null
          : ["0", "1", "2", "3", "4", "5", "6"][dayOfWeek];
      }
    }

    if (
      (this.state.selectedEndTimeDate !== null) &
      (this.state.selectedStartTimeDate !== null)
    ) {
      console.log(this.state.selectedStartTimeDate);
      var datetext = this.state.selectedStartTimeDate.toTimeString();
      datetext = datetext.split(" ")[0];
      var datetext2 = this.state.selectedEndTimeDate.toTimeString();
      datetext2 = datetext2.split(" ")[0];
    }

    calendarApi.addEvent({
      title: this.state.addRecEventText,
      startTime: datetext,
      endTime: datetext2,
      allDay: false,
      displayEventTime: true,
      id: this.state.eventId,
      daysOfWeek: [getDayOfWeek(this.state.selectedStartDayDate)],
      backgroundColor: this.state.background,
    });
    this.handleAddRecToDb();
    this.setState({
      addRecEventText: null,
      selectedStartTimeDate: null,
      selectedEndTimeDate: null,
      selectedStartDayDate: null,
    });

    this.handleCloseMoreOptions();
  };

  eventClick = (info) => {
    this.setState({
      eventId: info.event.id,
      title: info.event.title,
      start: info.event.start.toString(),
      end: info.event.end.toString(),
    });

    this.handleClose();
  };

  handleStartDateChange = (date) => {
    this.setState({ selectedStartDate: date });
  };
  handleEndDateChange = (date) => {
    this.setState({ selectedEndDate: date });
  };
  handleStartTimeDateChange = (date) => {
    this.setState({ selectedStartTimeDate: date });
  };
  handleEndTimeDateChange = (date) => {
    this.setState({ selectedEndTimeDate: date });
  };
  handleStartDayDateChange = (date) => {
    this.setState({ selectedStartDayDate: date });
  };

  handleChangeComplete = (color) => {
    this.setState({ background: color.hex });
  };
}
