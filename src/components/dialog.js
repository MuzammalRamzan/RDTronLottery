import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { CONTRACT_ADDRESS, refDefaultAddress } from "../utils/constants";
import { toast } from "react-toastify";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs(props) {
  const [value, setValue] = useState("");
  const [referal, setReferal] = useState("");
  const [prizeAmount, setPrizeAmount] = useState("");
  useEffect(() => {
    setValue("");
  }, [props?.open]);
  const handleClose = () => {
    props.handleCloseModel();
  };

  const BuyTicket = async () => {
    console.log(" connected");

    console.log("referal", referal);
    let getDirectFromUrl;
    let url = window.location.href;
    console.log("url", url);
    if (url.includes("?ref=")) {
      let getAddress = window.location.href.split("?ref=")[1];
      let final = getAddress.slice(0, 34);
      getDirectFromUrl = final;
    }

    console.log("log1", getDirectFromUrl);
    console.log("log1", refDefaultAddress);
    getDirectFromUrl = getDirectFromUrl ? getDirectFromUrl : refDefaultAddress;
    console.log("log1", getDirectFromUrl);

    if (props?.accountAddress && props?.accountAddress !== "") {
      let contract = await window?.tronWeb?.contract().at(CONTRACT_ADDRESS);
      let prizee = await contract.Get_Ticket_Amount().call();
      let getPrice = await contract.Get_Price().call();

      if (value > 0) {
        console.log("value<=prizee", parseInt(prizee));
        if (value > parseInt(prizee)) {
          toast.error("Only " + prizee + " Tickets available!");
        } else if (value > 50) {
          toast.error("chose tickets amount less than 50");
        } else {
          // console.log(" contract", contract)
          let refer = await contract._chakUpline(getDirectFromUrl).call();
          if (refer) {
            let v = value * getPrice * 10 ** 6;
            contract
              .Buy_Ticket(value, getDirectFromUrl)
              .send({
                shouldPollResponse: true,
                callValue: v,
                feeLimit: 1e9,
              })
              .then((output) => {
                console.log("- Output:", output, "\n");
                toast.success("Transaction complate");
              })
              .catch((e) => {
                toast.error(e.message);

                console.log("===============error", e.message);
              });
          } else {
            toast.error("Referral Address is not Correct");
          }
        }
      } else {
        toast.error("Please select amount of tickets to buy");
      }
    } else {
      toast.error("TronLink is not connected");

      console.log("not connected");
    }
  };
  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props?.open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Buy Tickets
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            value={value}
            style={{ minWidth: "230px" }}
            id="outlined-basic"
            type={"number"}
            label="Tickets"
            variant="outlined"
            onChange={(e) => setValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={BuyTicket} color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
