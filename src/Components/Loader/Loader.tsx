import {  Backdrop, CircularProgress } from "@mui/material";
import React from "react";

type Props = {
    isCall?: boolean;
};

export default function Loader({ isCall }: Props) {
    return (
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isCall || false}
        >
            <CircularProgress />
        </Backdrop>
    );
}
