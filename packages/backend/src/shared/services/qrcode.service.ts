import QRCode from 'qrcode';

export class QRCodeService {
  static async generateBase64(text: string): Promise<string> {
    return QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    });
  }
}
