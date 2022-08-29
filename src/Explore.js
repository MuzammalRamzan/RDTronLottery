import DocViewer from "react-doc-viewer";
import dox from "./assets/FQAs.pdf";
import { PDFRenderer, PNGRenderer, MSDocRenderer } from "react-doc-viewer";
import "./explore.css";

function Explore() {
  const docs = [
    {
      fileType: "application/pdf",
      uri: dox,
    },
  ];
  return (
    <DocViewer
      documents={docs}
      config={{
        header: {
          disableHeader: true,
          disableFileName: true,
          retainURLParams: true,
        },
      }}
      weight={2}
      pluginRenderers={[PDFRenderer, PNGRenderer]}
    />
  );
}
export default Explore;
