import * as React from 'react';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import {Box, TextField} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import DesktopDateTimePicker from '@mui/lab/DesktopDateTimePicker';

const emails = ['username@gmail.com', 'user02@gmail.com'];

export interface PostponeSaleDialogProps {
  open: boolean;
  oldDate: Date;
  oldEndDate: Date;
  onClose: (newStart?:  Date, newEnd?:  Date) => void;
}

export default function PostponeSaleDialog(props: PostponeSaleDialogProps) {
  const { onClose,  open, oldDate, oldEndDate } = props;

  const [newDate, setNewDate]= React.useState<Date>(oldDate);
  const [newEndDate, setNewEndDate]= React.useState<Date>(oldEndDate);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(newDate, newEndDate);
  };

  

  return (
    <Dialog onClose={handleCancel} open={open}>
      <DialogTitle sx={{ fontWeight: 500, fontSize: '1.4rem' }}>Postpone this sale</DialogTitle>
      <DialogContent>
        <Box
        component="form"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="on"
        >
            <div>
                {/* <Typography>New Sale Start Date</Typography> */}

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                    renderInput={(params) => <TextField label="New Start Date" {...params} variant="outlined" margin="normal" sx={{ ml: 1, width: '48%' }} required helperText={"Start Date"} />}
                    value={newDate}
                    onChange={(newValue) => {
                        setNewDate(newValue);
                    }}
                    />

                    <DateTimePicker
                    renderInput={(params) => <TextField label="New End Date" {...params} variant="outlined" margin="normal" sx={{ ml: 1, width: '48%' }} required helperText={"End Date"} />}
                    value={newEndDate}
                    onChange={(newValue) => {
                        setNewEndDate(newValue);
                    }}
                    />
                </LocalizationProvider>
            </div>
                
        </Box>
      </DialogContent>

        <DialogActions>
            <Button autoFocus onClick={handleCancel}>
            Cancel
            </Button>
            <Button variant="contained" onClick={handleOk} sx={{ marginLeft: '1rem',  marginTop: '1rem'}} color="primary">Postpone</Button>
        </DialogActions>
      
    </Dialog>
  );
}


