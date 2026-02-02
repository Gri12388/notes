import puppeteer from "puppeteer";

export const getPdf = async (text: string) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(text);
    const pdfBuffer = await page.pdf({
      margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      printBackground: true,
      format: "A4",
    });
    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.log("[error]: ", error);
    return undefined;
  }
};
