import { Button, Modal, Paper, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './EditModal.scss'

type Props = {
    open: boolean;
    closeAction: () => void;
    selectedUser: any;
    onSubmit: (name: Detail) => void
};

export type Detail = {
    name: string;
    email: string;
    role: string;
}

export default function EditModal({ open, closeAction, selectedUser, onSubmit }: Props) {
    console.log({ selectedUser })
    const [details, setDetails] = useState<Detail | null>(null)

    function closeModal() {
        closeAction()
    }

    useEffect(() => {
        if (selectedUser?.name)
            setDetails(selectedUser)
    }, [selectedUser])

    function handleSubmit(e: any) {
        e.preventDefault();
        if (details) {
            console.log("nmmm", details)
            onSubmit(details)
            closeAction()
        }
    }

    function handleChange(type: string, val: string) {
        setDetails((details: any) => ({ ...details, [type]: val }))
    }

    return (
        <Modal
            open={open}
            onClose={closeModal}
            // sx={{ padding: "20px 21px" }}
            className="edit-modal"
        >
            <Paper className="edit-modal-box">
                <form onSubmit={handleSubmit}>
                    <Typography className="edit-modal-header">
                        Update User
                    </Typography>
                    <Typography className="edit-modal-subtext">
                        Name
                    </Typography>
                    <TextField
                        placeholder="User Name"
                        fullWidth
                        variant="standard"
                        value={details && details.name}
                        onChange={(e: any) => handleChange("name", e.target.value)}
                        inputProps={{ className: "edit-field" }}
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                    <Typography className="edit-modal-subtext">
                        Email
                    </Typography>
                    <TextField
                        placeholder="Email"
                        fullWidth
                        variant="standard"
                        value={details && details.email}
                        onChange={(e: any) => handleChange("email", e.target.value)}
                        inputProps={{ className: "edit-field" }}
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                    <Typography className="edit-modal-subtext">
                        Role
                    </Typography>
                    <TextField
                        placeholder="Role"
                        fullWidth
                        variant="standard"
                        value={details && details.role}
                        onChange={(e: any) => handleChange("role", e.target.value)}
                        inputProps={{ className: "edit-field" }}
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                    <div className="edit-btn-container">
                        <Button
                            variant="outlined"
                            className="edit-btn"
                            onClick={closeModal}
                        >
                            <Typography className="edit-btn-text">Cancel</Typography>
                        </Button>
                        <Button type="submit" className="edit-btn1">
                            <Typography className="edit-btn-text edit-btn-text1">
                                Save
                            </Typography>
                        </Button>
                    </div>
                </form>
            </Paper>
        </Modal>
    )
}
