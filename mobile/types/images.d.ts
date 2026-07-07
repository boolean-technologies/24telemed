// Allow importing image assets in TS (Metro resolves these to asset ids).
declare module '*.png' {
  const content: number;
  export default content;
}
declare module '*.jpg' {
  const content: number;
  export default content;
}
