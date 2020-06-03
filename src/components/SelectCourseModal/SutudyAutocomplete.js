import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

class SutudyAutocomplete extends React.Component {
  state = {
    allowNew: false,
    isLoading: false,
    selectHintOnEnter: true,
    selectedCourse: [],
  };

  render() {
    return (
      <div>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={this.props.courses}
          // getOptionLabel={option => option.title}
          onChange={this.props.handleSelectedCourses}
          // defaultValue={[this.props.handleCourses[0]]}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Search for your courses"
              // placeholder="jhvkg"
            />
          )}
        />
      </div>
    );
  }
}

export default SutudyAutocomplete;
