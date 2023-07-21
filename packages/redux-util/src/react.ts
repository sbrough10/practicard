import {
  EqualityFn,
  useDispatch as useRrDispatch,
  useSelector as useRrSelector,
} from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "./types";

export function getUseDispatch<FullState>() {
  return useRrDispatch as () => ThunkDispatch<
    FullState,
    undefined,
    Action<any>
  >;
}

export function getUseSelector<FullState>() {
  return <Result>(
    selector: (state: FullState) => Result,
    equalityFn?: EqualityFn<Result>
  ) => {
    return useRrSelector(selector, equalityFn);
  };
}
