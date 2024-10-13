export default (
  title: string,
  wrongKeyword: string,
  validKeywords: string[]
) => ({
  title,
  status: 400,
  message: `The keyword "${wrongKeyword}" is not valid.Please use one of the following keywords: "${validKeywords.join(
    ","
  )}"`,
});
