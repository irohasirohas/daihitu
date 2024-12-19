import html2canvas from "html2canvas";
import pdfMake from "pdfmake/build/pdfmake";

// 72dpi 時の mm => px 換算比
// 計算式は 1/(25.4mm / 72dpi)
const RATE = 2.83464566929;

// A3 297mm x 419mm
const PAGE_WIDTH = 297 * RATE;
const PAGE_HEIGHT = 419 * RATE;

// TODO: 仮置き。後でページ設計に合わせて修正
const CONTENT_WIDTH = 297 * RATE;
const CONTENT_HEIGHT = 419 * RATE;
const PAGE_MARGINS = [0 * RATE, 0 * RATE];

/* for ts
interface PdfProps {
  dataUrl: string;
  pageSize?: {
    width: number;
    height: number;
  };
  pageOrientation?: string;
  contentSize?: {
    width: number;
    height: number;
  };
  pageMargins?: [number, number];
}
*/

/**
 * HTMLからPDFを生成
 * @param {HTMLElement} element
 */
export async function createPdfFromHtml(element) {
//   const pdfProps = await createPdfProps(element);
  await createPdfProps(element);
//   createPdf(pdfProps);
}

/**
 * PDF出力用のPdfPropsを作成
 * @param {HTMLElement} element
 * @param {boolean} isOnlyQrCode
 * @returns {Promise<PdfProps>}
 */
async function createPdfProps(element) {
    console.log(element,"element")
    console.log(element[0],"element")
  // html2canvas実行
  const options = {
    // HACK: ブラウザ依存でcanvasサイズが変わらないように、scaleは固定値。IEでのぼやけ対策で十分大きめの2にした
    scale: 2
  };

  let dataUrl = [] 
  
  await element.forEach(async(ele) => {
    const canvas = await html2canvas(ele, options);
    const url = canvas.toDataURL();
    dataUrl.push(url)
    
  })

    setTimeout(() => {      
        const pdfProps = {
          dataUrl,
          pageSize: {
              width: PAGE_WIDTH,
              height: PAGE_HEIGHT
            },
            pageOrientation: "PORTRAIT",
            contentSize: {
                width: CONTENT_WIDTH,
                height: CONTENT_HEIGHT
            },
            pageMargins: PAGE_MARGINS
        };

        createPdf(pdfProps);
    },500)
}

/**
 * エンコードされた画像URLを貼り付けたPDFを出力する
 * @param {PdfProps} pdfProps
 */
function createPdf(pdfProps) {
  const { dataUrl, contentSize, pageMargins } = pdfProps;
  // tsエラー回避のため一時的にany
  const pageSize = pdfProps.pageSize;
  const pageOrientation = pdfProps.pageOrientation;
  
  let documentDefinitions = {
      pageSize,
      pageOrientation,
      content: [],
      pageMargins
    };
    
    dataUrl.forEach((data, i) => {
        documentDefinitions.content.push({
            image: data,
            ...contentSize,
            // pageBreak: 'after',
        })
        console.log(i,"aaaaa")
    })
    console.log(documentDefinitions,"documentDefinitions")

  pdfMake.createPdf(documentDefinitions).download();
}
