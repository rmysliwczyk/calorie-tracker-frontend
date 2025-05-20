import { Box, Card, CircularProgress } from "@mui/material";
import {
  Html5Qrcode,
  Html5QrcodeScannerState,
  type Html5QrcodeCameraScanConfig,
  type Html5QrcodeResult,
  type QrcodeErrorCallback,
  type QrcodeSuccessCallback,
} from "html5-qrcode";
import { useEffect, useRef } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

function createConfig(props?: Html5QrcodeCameraScanConfig) {
  let config: Html5QrcodeCameraScanConfig = {
    fps: 15,
  };
  if (props?.fps) {
    config.fps = props.fps;
  }
  if (props?.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props?.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props?.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
}

export default function BarcodeScanner(props: {
  qrCodeSuccessCallback: QrcodeSuccessCallback;
  qrCodeErrorCallback?: QrcodeErrorCallback;
  config?: Html5QrcodeCameraScanConfig;
}) {
  const isScanningRef = useRef<boolean>(false);

  useEffect(() => {
    // when component mounts
    const config = createConfig(props.config);
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw new Error("qrCodeSuccessCallback is required callback.");
    }

    const html5QrCode = new Html5Qrcode(qrcodeRegionId);

    async function wrappedQrCodeSuccessCallback(decodedText: string, result: Html5QrcodeResult): Promise<void> {
      try {
        await html5QrCode.stop();
        console.log("Scanner stopped successfuly");
      } catch (err) {
        console.error("Error stopping the scanner", err);
      }

      props.qrCodeSuccessCallback(decodedText, result);
    }

    async function startScanner() {
      if (isScanningRef.current == false) {
        await html5QrCode.start({ facingMode: "environment" }, config, wrappedQrCodeSuccessCallback, props.qrCodeErrorCallback);
        isScanningRef.current = true;
      }
    }

    startScanner();
    // cleanup function when component will unmount
    return () => {
      async function stopScanner() {
        const scanState: Html5QrcodeScannerState = html5QrCode.getState();
        if (scanState != Html5QrcodeScannerState.NOT_STARTED && scanState != Html5QrcodeScannerState.PAUSED) {
          try {
            await html5QrCode.stop();
            console.log("Scanner stopped successfuly");
          } catch (err) {
            console.error("Error stopping the scanner", err);
          }
        }
      }

      stopScanner();
    };
  }, []);

  return (
    <Card
      elevation={2}
      sx={{
        position: "relative",
        width: "85%",
        maxWidth: "400px",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
          <CircularProgress />
      </Box>
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1/1"
        }}
        id={qrcodeRegionId}
      />
    </Card>
  );
}
