import fs from "fs";
import path from "path";

interface MedicalCertificateData {
  patientName: string;
  dateOfBirth: string;
  certificateType: string;
  dateFrom: string;
  dateTo: string;
  condition: string;
  doctorName: string;
  doctorLicense: string;
  issuedDate: string;
}

interface PrescriptionData {
  patientName: string;
  dateOfBirth: string;
  medicationName: string;
  dosage: string;
  quantity: string;
  repeats: number;
  instructions: string;
  doctorName: string;
  doctorLicense: string;
  issuedDate: string;
}

class PDFService {
  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  generateMedicalCertificate(data: MedicalCertificateData): string {
    const outputDir = path.join(process.cwd(), "generated_documents", "certificates");
    this.ensureDirectoryExists(outputDir);

    const fileName = `medical_certificate_${Date.now()}.html`;
    const filePath = path.join(outputDir, fileName);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Medical Certificate</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px; 
            background-color: #fff;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #0d6efd; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .logo { 
            color: #0d6efd; 
            font-size: 32px; 
            font-weight: bold; 
            margin-bottom: 10px; 
        }
        .certificate-title { 
            font-size: 24px; 
            font-weight: bold; 
            margin: 30px 0; 
            text-align: center; 
            text-transform: uppercase; 
            letter-spacing: 2px; 
        }
        .content { 
            line-height: 1.8; 
            font-size: 16px; 
        }
        .patient-details { 
            background-color: #f8f9fa; 
            padding: 20px; 
            border-left: 4px solid #0d6efd; 
            margin: 20px 0; 
        }
        .certificate-details { 
            margin: 30px 0; 
            padding: 20px; 
            border: 1px solid #dee2e6; 
            border-radius: 8px; 
        }
        .doctor-signature { 
            margin-top: 50px; 
            text-align: right; 
        }
        .signature-line { 
            border-top: 1px solid #000; 
            width: 300px; 
            margin-left: auto; 
            margin-top: 40px; 
        }
        .footer { 
            margin-top: 50px; 
            text-align: center; 
            font-size: 12px; 
            color: #6c757d; 
            border-top: 1px solid #dee2e6; 
            padding-top: 20px; 
        }
        @media print {
            body { margin: 0; padding: 20px; }
            .header { border-bottom: 2px solid #000; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🩺 FreeDoc Australia</div>
        <p>Australia's First Truly Free Online Doctor</p>
        <p>Licensed Healthcare Provider - Telehealth Services</p>
    </div>

    <div class="certificate-title">Medical Certificate</div>

    <div class="patient-details">
        <h3>Patient Information</h3>
        <p><strong>Name:</strong> ${data.patientName}</p>
        <p><strong>Date of Birth:</strong> ${data.dateOfBirth}</p>
        <p><strong>Certificate Type:</strong> ${data.certificateType.replace('_', ' ').toUpperCase()}</p>
    </div>

    <div class="content">
        <p>This is to certify that I have conducted a medical consultation with the above-named patient.</p>

        <div class="certificate-details">
            <h3>Medical Assessment</h3>
            <p><strong>Condition/Symptoms:</strong> ${data.condition}</p>
            <p><strong>Period of Incapacity:</strong> From ${data.dateFrom} to ${data.dateTo}</p>
            
            ${data.certificateType === 'sick_leave' ? 
                '<p>The patient is medically unfit for work/study during the specified period due to the above condition.</p>' :
                data.certificateType === 'fitness_to_work' ?
                '<p>The patient is medically fit to return to work/normal activities from the specified date.</p>' :
                '<p>This certificate is issued for the specified medical condition and period.</p>'
            }
        </div>

        <p>This certificate is issued in accordance with medical standards and Australian healthcare regulations.</p>
    </div>

    <div class="doctor-signature">
        <p><strong>Issued by:</strong></p>
        <div class="signature-line"></div>
        <p><strong>${data.doctorName}</strong></p>
        <p>Medical License: ${data.doctorLicense}</p>
        <p>FreeDoc Partner Doctor</p>
        <p><strong>Date Issued:</strong> ${data.issuedDate}</p>
    </div>

    <div class="footer">
        <p>This is a digitally generated medical certificate from FreeDoc Australia.</p>
        <p>For verification, contact FreeDoc at verify@freedoc.com.au with certificate reference.</p>
        <p>© 2025 FreeDoc Australia - All rights reserved</p>
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, htmlContent);
    return filePath;
  }

  generatePrescription(data: PrescriptionData): string {
    const outputDir = path.join(process.cwd(), "generated_documents", "prescriptions");
    this.ensureDirectoryExists(outputDir);

    const fileName = `prescription_${Date.now()}.html`;
    const filePath = path.join(outputDir, fileName);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Medical Prescription</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px; 
            background-color: #fff;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #0d6efd; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .logo { 
            color: #0d6efd; 
            font-size: 32px; 
            font-weight: bold; 
            margin-bottom: 10px; 
        }
        .prescription-title { 
            font-size: 24px; 
            font-weight: bold; 
            margin: 30px 0; 
            text-align: center; 
            text-transform: uppercase; 
            letter-spacing: 2px; 
        }
        .content { 
            line-height: 1.8; 
            font-size: 16px; 
        }
        .patient-details { 
            background-color: #f8f9fa; 
            padding: 20px; 
            border-left: 4px solid #0d6efd; 
            margin: 20px 0; 
        }
        .prescription-details { 
            margin: 30px 0; 
            padding: 30px; 
            border: 2px solid #0d6efd; 
            border-radius: 8px; 
            background-color: #f0f7ff; 
        }
        .medication { 
            font-size: 20px; 
            font-weight: bold; 
            color: #0d6efd; 
            margin-bottom: 15px; 
        }
        .dosage-instructions { 
            background-color: #fff; 
            padding: 15px; 
            border-radius: 4px; 
            margin: 15px 0; 
        }
        .doctor-signature { 
            margin-top: 50px; 
            text-align: right; 
        }
        .signature-line { 
            border-top: 1px solid #000; 
            width: 300px; 
            margin-left: auto; 
            margin-top: 40px; 
        }
        .footer { 
            margin-top: 50px; 
            text-align: center; 
            font-size: 12px; 
            color: #6c757d; 
            border-top: 1px solid #dee2e6; 
            padding-top: 20px; 
        }
        .warning { 
            background-color: #fff3cd; 
            border: 1px solid #ffeaa7; 
            color: #856404; 
            padding: 15px; 
            border-radius: 4px; 
            margin: 20px 0; 
        }
        @media print {
            body { margin: 0; padding: 20px; }
            .header { border-bottom: 2px solid #000; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🩺 FreeDoc Australia</div>
        <p>Australia's First Truly Free Online Doctor</p>
        <p>Licensed Healthcare Provider - Telehealth Services</p>
    </div>

    <div class="prescription-title">Medical Prescription</div>

    <div class="patient-details">
        <h3>Patient Information</h3>
        <p><strong>Name:</strong> ${data.patientName}</p>
        <p><strong>Date of Birth:</strong> ${data.dateOfBirth}</p>
        <p><strong>Prescription Date:</strong> ${data.issuedDate}</p>
    </div>

    <div class="prescription-details">
        <div class="medication">📋 ${data.medicationName}</div>
        
        <div class="dosage-instructions">
            <p><strong>Dosage:</strong> ${data.dosage}</p>
            <p><strong>Quantity:</strong> ${data.quantity}</p>
            <p><strong>Repeats:</strong> ${data.repeats}</p>
            ${data.instructions ? `<p><strong>Instructions:</strong> ${data.instructions}</p>` : ''}
        </div>
    </div>

    <div class="warning">
        <strong>Important:</strong> Take this medication exactly as prescribed. Do not exceed the recommended dosage. 
        Consult your doctor if you experience any adverse effects.
    </div>

    <div class="content">
        <h3>Prescription Notes:</h3>
        <ul>
            <li>This prescription is valid for 12 months from the date of issue (unless otherwise specified)</li>
            <li>Present this prescription to any Australian pharmacy</li>
            <li>If you have any questions about this medication, consult your pharmacist or doctor</li>
            <li>Store medications as directed and keep out of reach of children</li>
        </ul>
    </div>

    <div class="doctor-signature">
        <p><strong>Prescribed by:</strong></p>
        <div class="signature-line"></div>
        <p><strong>${data.doctorName}</strong></p>
        <p>Medical License: ${data.doctorLicense}</p>
        <p>FreeDoc Partner Doctor</p>
        <p><strong>Date Issued:</strong> ${data.issuedDate}</p>
    </div>

    <div class="footer">
        <p>This is a digitally generated prescription from FreeDoc Australia.</p>
        <p>For verification, contact FreeDoc at verify@freedoc.com.au with prescription reference.</p>
        <p>© 2025 FreeDoc Australia - All rights reserved</p>
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, htmlContent);
    return filePath;
  }
}

export const pdfService = new PDFService();
