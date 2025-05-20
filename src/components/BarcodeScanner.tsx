import {
  Html5QrcodeScanner,
  type Html5QrcodeCameraScanConfig,
  type QrcodeErrorCallback,
  type QrcodeSuccessCallback,
} from "html5-qrcode";
import { useEffect } from "react";

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
  verbose: boolean;
  qrCodeSuccessCallback: QrcodeSuccessCallback;
  qrCodeErrorCallback?: QrcodeErrorCallback;
  config?: Html5QrcodeCameraScanConfig;
}) {
  useEffect(() => {
    // when component mounts
    const config = createConfig(props.config);
    const verbose = props.verbose === true;
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return <div id={qrcodeRegionId} />;
}
