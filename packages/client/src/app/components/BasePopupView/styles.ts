import { addStylesheet } from "../../utilities/styles";

export const { classes } = addStylesheet({
  root: {
    "& .MuiDialog-paper": {
      minWidth: "300px",
      height: "calc(100vh - 32px)",
      margin: "auto auto",
      background: "lightgrey",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      padding: "12px",
    },
  },
  wrapper: {
    minWidth: "300px",
    height: "calc(100vh - 32px)",
    margin: "auto auto",
    background: "lightgrey",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "12px",
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: "0px",
  },
  closeButton: {
    "&&": {
      width: "28px",
      height: "28px",
    },
  },
});
