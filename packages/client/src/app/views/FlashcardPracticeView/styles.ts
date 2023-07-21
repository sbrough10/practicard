import { BP, addStylesheet, viewStyles } from "app/utilities/styles";

export const { classes } = addStylesheet((theme) => ({
  root: {
    ...viewStyles,
    padding: "16px",
    alignItems: "center",
    gap: "8px",
  },
  buttonBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  addedDetails: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "12px",
    "& > div": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
  },
  cardText: {
    flex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    wordBreak: "break-word",
    textAlign: "center",
    width: "100%",
  },
  hitMissButtonSection: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    [theme.breakpoints.down(BP.xs)]: {
      flexDirection: "column",
      height: "224px",
    },
  },
  hitMissButton: {
    flex: "1",
    height: "112px",
    width: "100%",
    "&.hit-button": {
      background: "green",
    },
    "&.miss-button": {
      background: "red",
    },
  },
}));
