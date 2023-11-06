import { addStylesheet } from "app/utilities/styles";

export const { classes } = addStylesheet({
  root: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "row",
  },
  optionButton: {
    flex: "1",
  },
  textFieldWrapper: {
    flex: "1",
  },
  squareButton: {
    "&&": {
      width: "32px",
      height: "32px",
    },
  },
});
