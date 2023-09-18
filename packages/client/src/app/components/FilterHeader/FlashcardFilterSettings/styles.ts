import { addStylesheet } from "../../../utilities/styles";

export const { classes } = addStylesheet({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    fontWeight: "bold",
  },
  inputRow: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
  },
});
