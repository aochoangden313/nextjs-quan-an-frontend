import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { getTableLink } from "../lib/utils";

export default function QRCodeTable({
  token,
  tableNumber,
  width = 250,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  // Hiện tại: Thư viện QRCode nó sẽ vẽ lên cái thẻ Canvas
  // Bây giờ: Chúng ta sẽ tạo 1 cái thẻ canvas ảo để thư viện QRCode code nó vẽ QR lên trên đó.
  // Và chúng ta sẽ edit thẻ canvas thật
  // Cuối cùng thì chúng ta sẽ đưa cái thẻ canvas ảo chứa QR Code ở trên vào thẻ Canvas thật
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.height = width + 70;
    canvas.width = width;
    const canvasContext = canvas.getContext("2d")!;
    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "20px Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = "#000";
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.width + 20
    );
    canvasContext.fillText(
      `Quét QR để gọi món`,
      canvas.width / 2,
      canvas.width + 50
    );
    const virtualCanvas = document.createElement("canvas");
    QRCode.toCanvas(
      virtualCanvas,
      getTableLink({ token, tableNumber }),
      function (error) {
        if (error) console.error(error);
        canvasContext.drawImage(virtualCanvas, 0, 0, width, width);
      }
    );
  }, [token, tableNumber]);

  return <canvas ref={canvasRef} />;
}
