import React from "react";

import { InputAdornment, TextField, TextFieldProps } from "@mui/material";

import { Search as SearchIcon } from '@mui/icons-material';

import "./Input.scss";

export default function Input(props: TextFieldProps) {
    return (
        <TextField
            size="small"
            className="customized-search-input"
            variant="standard"
            placeholder="Search"
            inputProps={{
                style: {
                    border: "0px",
                    padding: "2px",
                    fontSize: "14px",
                },
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon className="search-icon" />
                    </InputAdornment>
                ),
                disableUnderline: true,
            }}
            {...props}
        />
    );
}
