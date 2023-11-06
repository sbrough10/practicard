export let shouldStopAllRedux = false;

export const runStandardFailure = (error: any) => {
  shouldStopAllRedux = true;

  // alert(error);
};
