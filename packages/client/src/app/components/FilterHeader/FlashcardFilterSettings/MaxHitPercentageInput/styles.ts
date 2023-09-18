import { addStylesheet } from "app/utilities/styles";

export const { classes } = addStylesheet({
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: "10px",
  },
  label: {
    width: "64px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textField: {
    width: "40px",
    flex: "0",
    "& input": {
      textAlign: "center",
    },
  },
  sliderWrapper: {
    flex: "1",
  },
});
