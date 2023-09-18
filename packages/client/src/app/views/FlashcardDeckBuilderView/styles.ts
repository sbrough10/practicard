import { BP, addStylesheet, viewStyles } from "app/utilities/styles";

export const { classes } = addStylesheet((theme) => ({
  root: {
    ...viewStyles,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterHeaderWrapper: {
    display: "flex",
    flexDirection: "row",
    margin: "12px",
    gap: "8px",
    alignItems: "center",
  },
  filterHeaderCheckbox: {
    "&&": {
      display: "none",
      padding: "0px",
      [theme.breakpoints.down(BP.md)]: {
        display: "inline-flex",
      },
    },
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down(BP.md)]: {
      display: "none",
    },
    "& > div": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
    },
  },
  checkboxColumnSpace: {
    width: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextColumnHeader: {
    flex: "1",
  },
  hitMissColumnHeader: {
    width: "64px",
  },
  body: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    gap: "16px",
    marginBottom: "50px",
  },
  emptyCardList: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "fixed",
    bottom: "0px",
    width: "100%",
  },
}));
