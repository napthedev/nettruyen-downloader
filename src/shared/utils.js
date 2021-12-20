export const forceDownload = (url) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.style.display = "none";
  anchor.download = "result.pdf";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};
