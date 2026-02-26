import QRCode from 'qrcode';

const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://dashboard.loco.app';

export class QRCodeService {
  static async generateRedemptionQR(code: string): Promise<string> {
    const url = `${DASHBOARD_URL}/verify?code=${code}`;
    return QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: '#1f2937', light: '#ffffff' },
    });
  }
}
