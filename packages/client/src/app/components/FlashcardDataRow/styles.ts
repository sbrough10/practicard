import { ACTIVE_COLOR, BP, addStylesheet } from "../../utilities/styles";

export const { classes } = addStylesheet((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  recentlyCreated: {
    background: ACTIVE_COLOR,
  },
  normal: {
    background: "white",
    transition: "background 1s",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: "4px",
    [theme.breakpoints.down(BP.md)]: {
      flexDirection: "column",
    },
  },
  checkbox: {
    width: "48px",
    height: "48px",
    "& > svg": {
      width: "24px",
      height: "24px",
    },
  },
  inputSection: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
  },
  cardTextSection: {
    flex: "1",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down(BP.sm)]: {
      flexDirection: "column",
    },
  },
  cardSide: {
    flex: "1",
  },
  hitMissSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  hitMissLabel: {
    [theme.breakpoints.up(BP.md)]: {
      display: "none",
    },
  },
  hitMissInput: {
    width: "64px",
  },
  hitPercentage: {
    width: "64px",
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  hitPercentageIcon: {
    [theme.breakpoints.up(BP.md)]: {
      display: "none",
    },
  },
}));
