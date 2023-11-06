import { addStylesheet } from "../../utilities/styles";

export const { classes } = addStylesheet({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: "8px",
  },
  addButton: {
    "&&": {
      width: "32px",
      height: "32px",
    },
  },
  chipList: {
    flex: "1",
    minHeight: "34px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "8px",
  },
  leftChipAligned: {
    justifyContent: "flex-start",
  },
  centerChipAligned: {
    justifyContent: "center",
  },
  noTags: {
    fontStyle: "italic",
    color: "#444",
    background: "none",
    border: "none",
    fontSize: "16px",
    height: "100%",
  },
});
